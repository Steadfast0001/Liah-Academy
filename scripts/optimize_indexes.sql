-- ==========================================================
-- LIAH ACADEMY DATABASE INDEXING & PERFORMANCE OPTIMIZATION
-- Safe for phpMyAdmin & MySQL / MariaDB (Zero Duplicate Errors)
-- ==========================================================

-- 1. Optimize Row Storage Engine
ALTER TABLE `students` ENGINE = InnoDB ROW_FORMAT = DYNAMIC;
ALTER TABLE `payments` ENGINE = InnoDB ROW_FORMAT = DYNAMIC;
ALTER TABLE `chat_sessions` ENGINE = InnoDB ROW_FORMAT = DYNAMIC;
ALTER TABLE `inquiries` ENGINE = InnoDB ROW_FORMAT = DYNAMIC;
ALTER TABLE `email_logs` ENGINE = InnoDB ROW_FORMAT = DYNAMIC;
ALTER TABLE `admins` ENGINE = InnoDB ROW_FORMAT = DYNAMIC;

-- 2. Create Temporary Safe Index Helper Procedure
DROP PROCEDURE IF EXISTS AddIndexIfNotExist;

DELIMITER //
CREATE PROCEDURE AddIndexIfNotExist(
    IN tableName VARCHAR(64),
    IN indexName VARCHAR(64),
    IN indexColumns VARCHAR(255)
)
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.statistics 
        WHERE table_schema = DATABASE() 
        AND table_name = tableName 
        AND index_name = indexName
    ) THEN
        SET @sql = CONCAT('ALTER TABLE `', tableName, '` ADD INDEX `', indexName, '` (', indexColumns, ')');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END //
DELIMITER ;

-- 3. Safely Apply All High-Performance B-Tree Indexes
CALL AddIndexIfNotExist('students', 'idx_students_matricule', '`matricule`');
CALL AddIndexIfNotExist('students', 'idx_students_admission_status', '`admission_status`');
CALL AddIndexIfNotExist('students', 'idx_students_payment_status', '`payment_status`');
CALL AddIndexIfNotExist('students', 'idx_students_degree_program', '`degree_type`, `program_type`');
CALL AddIndexIfNotExist('students', 'idx_students_created_at', '`created_at` DESC');

CALL AddIndexIfNotExist('payments', 'idx_payments_student_id', '`student_id`');
CALL AddIndexIfNotExist('payments', 'idx_payments_status', '`status`');
CALL AddIndexIfNotExist('payments', 'idx_payments_operator', '`operator`');
CALL AddIndexIfNotExist('payments', 'idx_payments_created_at', '`created_at` DESC');

CALL AddIndexIfNotExist('chat_sessions', 'idx_chat_status', '`status`');
CALL AddIndexIfNotExist('chat_sessions', 'idx_chat_unread_admin', '`unread_admin`');
CALL AddIndexIfNotExist('chat_sessions', 'idx_chat_updated_at', '`updated_at` DESC');

CALL AddIndexIfNotExist('inquiries', 'idx_inquiries_status', '`status`');
CALL AddIndexIfNotExist('inquiries', 'idx_inquiries_created_at', '`created_at` DESC');

CALL AddIndexIfNotExist('email_logs', 'idx_email_logs_recipient', '`recipient`');
CALL AddIndexIfNotExist('email_logs', 'idx_email_logs_status', '`status`');
CALL AddIndexIfNotExist('admins', 'idx_admins_role', '`role`');

-- Clean up helper procedure
DROP PROCEDURE IF EXISTS AddIndexIfNotExist;

-- 4. Defragment and Optimize Table Storage
OPTIMIZE TABLE `students`, `payments`, `chat_sessions`, `inquiries`, `email_logs`, `admins`, `courses`, `news`, `media`, `reviews`, `settings`;

-- 5. Refresh Query Optimizer Statistics
ANALYZE TABLE `students`, `payments`, `chat_sessions`, `inquiries`, `email_logs`;
