-- ==========================================================
-- LIAH ACADEMY DATABASE INDEXING & PERFORMANCE OPTIMIZATION
-- For MySQL 8.0.16+ or MariaDB with enforced CHECK constraints.
-- Back up first; run scripts/sanitize-db-files.js before this SQL on the app server.
-- The app database user needs CREATE ROUTINE and ALTER privileges.
-- ==========================================================

-- Select the correct cPanel database in phpMyAdmin before running this script.
-- Existing unique indexes on students.email and admins.email already support login.
SELECT DATABASE() AS selected_database;

-- 2. Create Temporary Safe Index Helper Procedure
DROP PROCEDURE IF EXISTS AddIndexIfNotExist;
DROP PROCEDURE IF EXISTS AddFileReferenceCheckIfNotExist;

DELIMITER //
CREATE PROCEDURE AddIndexIfNotExist(
    IN p_table_name VARCHAR(64),
    IN p_index_name VARCHAR(64),
    IN p_index_columns VARCHAR(255)
)
BEGIN
    DECLARE table_exists INT DEFAULT 0;
    DECLARE index_exists INT DEFAULT 0;

    SELECT COUNT(*) INTO table_exists
    FROM information_schema.tables
    WHERE table_schema = DATABASE() AND table_name = p_table_name;

        SELECT COUNT(*) INTO index_exists
        FROM information_schema.statistics
        WHERE table_schema = DATABASE()
            AND table_name = p_table_name
            AND index_name = p_index_name;

        IF table_exists > 0 AND index_exists = 0 THEN
        SET @sql = CONCAT('ALTER TABLE `', p_table_name, '` ADD INDEX `', p_index_name, '` (', p_index_columns, ')');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END //

CREATE PROCEDURE AddFileReferenceCheckIfNotExist(
    IN p_table_name VARCHAR(64),
    IN p_constraint_name VARCHAR(64),
    IN p_column_name VARCHAR(64)
)
BEGIN
    DECLARE table_exists INT DEFAULT 0;
    DECLARE constraint_exists INT DEFAULT 0;
    DECLARE check_expression VARCHAR(512);

    SELECT COUNT(*) INTO table_exists
    FROM information_schema.tables
    WHERE table_schema = DATABASE() AND table_name = p_table_name;

    SELECT COUNT(*) INTO constraint_exists
    FROM information_schema.table_constraints
    WHERE constraint_schema = DATABASE()
      AND table_name = p_table_name
      AND constraint_name = p_constraint_name;

    IF table_exists > 0 AND constraint_exists = 0 THEN
        IF p_column_name = 'documents' THEN
            SET check_expression = '(`documents` IS NULL OR JSON_SEARCH(`documents`, ''one'', ''data:%'') IS NULL)';
            SET @legacy_check_sql = CONCAT(
                'SELECT COUNT(*) INTO @legacy_file_rows FROM `', p_table_name,
                '` WHERE `documents` IS NOT NULL AND JSON_SEARCH(`documents`, ''one'', ''data:%'') IS NOT NULL'
            );
        ELSE
            SET check_expression = CONCAT(
                '(`', p_column_name, '` IS NULL OR LOWER(`', p_column_name, '`) NOT LIKE ''data:%'')'
            );
            SET @legacy_check_sql = CONCAT(
                'SELECT COUNT(*) INTO @legacy_file_rows FROM `', p_table_name,
                '` WHERE `', p_column_name, '` IS NOT NULL AND LOWER(`', p_column_name, '`) LIKE ''data:%'''
            );
        END IF;

        PREPARE stmt FROM @legacy_check_sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;

        IF COALESCE(@legacy_file_rows, 0) = 0 THEN
            SET @sql = CONCAT(
                'ALTER TABLE `', p_table_name,
                '` ADD CONSTRAINT `', p_constraint_name,
                '` CHECK ', check_expression
            );
            PREPARE stmt FROM @sql;
            EXECUTE stmt;
            DEALLOCATE PREPARE stmt;
        ELSE
            SELECT CONCAT(
                'Skipped ', p_constraint_name, ': ', @legacy_file_rows,
                ' existing row(s) still contain Base64 data. Extract files, then rerun this script.'
            ) AS migration_warning;
        END IF;
    END IF;
END //
DELIMITER ;

-- 3. Safely Apply All High-Performance B-Tree Indexes
CALL AddIndexIfNotExist('students', 'idx_students_matricule', '`matricule`');
CALL AddIndexIfNotExist('students', 'idx_students_admission_created', '`admission_status`, `created_at`');
CALL AddIndexIfNotExist('students', 'idx_students_payment_created', '`payment_status`, `created_at`');
CALL AddIndexIfNotExist('students', 'idx_students_degree_program', '`degree_type`, `program_type`');

CALL AddIndexIfNotExist('payments', 'idx_payments_student_created', '`student_id`, `created_at`');
CALL AddIndexIfNotExist('payments', 'idx_payments_status_created', '`status`, `created_at`');
CALL AddIndexIfNotExist('payments', 'idx_payments_transaction_id', '`transaction_id`');

CALL AddIndexIfNotExist('chat_sessions', 'idx_chat_status_updated', '`status`, `updated_at`');
CALL AddIndexIfNotExist('chat_sessions', 'idx_chat_unread_updated', '`unread_admin`, `updated_at`');

CALL AddIndexIfNotExist('inquiries', 'idx_inquiries_status_created', '`status`, `created_at`');
CALL AddIndexIfNotExist('email_logs', 'idx_email_logs_recipient_created', '`recipient`, `created_at`');
CALL AddIndexIfNotExist('email_logs', 'idx_email_logs_status_created', '`status`, `created_at`');
CALL AddIndexIfNotExist('courses', 'idx_courses_degree_school', '`degree_type`, `school`');
CALL AddIndexIfNotExist('news', 'idx_news_category_created', '`category`, `created_at`');
CALL AddIndexIfNotExist('media', 'idx_media_category', '`category`');
CALL AddIndexIfNotExist('reviews', 'idx_reviews_created', '`created_at`');

-- Refuse Base64 file payloads in URL/reference columns. Run file extraction first.
-- These results list row IDs only; they never return file contents.
SELECT id, email, 'documents' AS field_name
FROM students
WHERE documents IS NOT NULL AND JSON_SEARCH(documents, 'one', 'data:%') IS NOT NULL
LIMIT 100;

SELECT id, email, 'document_url' AS field_name FROM students WHERE LOWER(document_url) LIKE 'data:%' LIMIT 100;
SELECT id, email, 'payment_proof_url' AS field_name FROM students WHERE LOWER(payment_proof_url) LIKE 'data:%' LIMIT 100;
SELECT reference AS id, 'proof_url' AS field_name FROM payments WHERE LOWER(proof_url) LIKE 'data:%' LIMIT 100;
SELECT id, 'src' AS field_name FROM media WHERE LOWER(src) LIKE 'data:%' LIMIT 100;

CALL AddFileReferenceCheckIfNotExist('students', 'chk_students_document_file_url', 'document_url');
CALL AddFileReferenceCheckIfNotExist('students', 'chk_students_payment_file_url', 'payment_proof_url');
CALL AddFileReferenceCheckIfNotExist('students', 'chk_students_documents_no_data_uri', 'documents');
CALL AddFileReferenceCheckIfNotExist('payments', 'chk_payments_file_url', 'proof_url');
CALL AddFileReferenceCheckIfNotExist('media', 'chk_media_file_url', 'src');

DROP PROCEDURE IF EXISTS AddIndexIfNotExist;
DROP PROCEDURE IF EXISTS AddFileReferenceCheckIfNotExist;

-- Refresh optimizer statistics without rebuilding/locking every table.
ANALYZE TABLE `students`, `payments`, `chat_sessions`, `inquiries`, `email_logs`, `admins`, `courses`, `news`, `media`, `reviews`;
