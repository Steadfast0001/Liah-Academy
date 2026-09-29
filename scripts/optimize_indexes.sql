-- ==========================================================
-- LIAH ACADEMY DATABASE INDEXING & PERFORMANCE OPTIMIZATION
-- Engine: MySQL 5.7+ / MySQL 8.0+ / MariaDB (InnoDB Engine)
-- ==========================================================

USE `liah_db`;

-- 1. Optimize Students Table Indexes
ALTER TABLE `students` ENGINE = InnoDB ROW_FORMAT = DYNAMIC;

-- Unique and lookup indexes for fast student authentication and searches
CREATE INDEX IF NOT EXISTS `idx_students_matricule` ON `students` (`matricule`);
CREATE INDEX IF NOT EXISTS `idx_students_admission_status` ON `students` (`admission_status`);
CREATE INDEX IF NOT EXISTS `idx_students_payment_status` ON `students` (`payment_status`);
CREATE INDEX IF NOT EXISTS `idx_students_degree_program` ON `students` (`degree_type`, `program_type`);
CREATE INDEX IF NOT EXISTS `idx_students_created_at` ON `students` (`created_at` DESC);

-- 2. Optimize Payments Table Indexes
ALTER TABLE `payments` ENGINE = InnoDB ROW_FORMAT = DYNAMIC;

CREATE INDEX IF NOT EXISTS `idx_payments_student_id` ON `payments` (`student_id`);
CREATE INDEX IF NOT EXISTS `idx_payments_status` ON `payments` (`status`);
CREATE INDEX IF NOT EXISTS `idx_payments_operator` ON `payments` (`operator`);
CREATE INDEX IF NOT EXISTS `idx_payments_txid` ON `payments` (`transaction_id`);
CREATE INDEX IF NOT EXISTS `idx_payments_created_at` ON `payments` (`created_at` DESC);

-- 3. Optimize Chat Sessions Table Indexes
ALTER TABLE `chat_sessions` ENGINE = InnoDB ROW_FORMAT = DYNAMIC;

CREATE INDEX IF NOT EXISTS `idx_chat_status` ON `chat_sessions` (`status`);
CREATE INDEX IF NOT EXISTS `idx_chat_unread_admin` ON `chat_sessions` (`unread_admin`);
CREATE INDEX IF NOT EXISTS `idx_chat_updated_at` ON `chat_sessions` (`updated_at` DESC);

-- 4. Optimize Inquiries Table Indexes
ALTER TABLE `inquiries` ENGINE = InnoDB ROW_FORMAT = DYNAMIC;

CREATE INDEX IF NOT EXISTS `idx_inquiries_status` ON `inquiries` (`status`);
CREATE INDEX IF NOT EXISTS `idx_inquiries_email` ON `inquiries` (`email`);
CREATE INDEX IF NOT EXISTS `idx_inquiries_created_at` ON `inquiries` (`created_at` DESC);

-- 5. Optimize Email Logs Table Indexes
ALTER TABLE `email_logs` ENGINE = InnoDB ROW_FORMAT = DYNAMIC;

CREATE INDEX IF NOT EXISTS `idx_email_logs_recipient` ON `email_logs` (`recipient`);
CREATE INDEX IF NOT EXISTS `idx_email_logs_status` ON `email_logs` (`status`);
CREATE INDEX IF NOT EXISTS `idx_email_logs_type` ON `email_logs` (`type`);
CREATE INDEX IF NOT EXISTS `idx_email_logs_created_at` ON `email_logs` (`created_at` DESC);

-- 6. Optimize Admins Table Indexes
ALTER TABLE `admins` ENGINE = InnoDB ROW_FORMAT = DYNAMIC;

CREATE INDEX IF NOT EXISTS `idx_admins_role` ON `admins` (`role`);

-- 7. Defragment and Optimize Table Statistics
OPTIMIZE TABLE `students`;
OPTIMIZE TABLE `payments`;
OPTIMIZE TABLE `chat_sessions`;
OPTIMIZE TABLE `inquiries`;
OPTIMIZE TABLE `email_logs`;
OPTIMIZE TABLE `admins`;
OPTIMIZE TABLE `courses`;
OPTIMIZE TABLE `news`;
OPTIMIZE TABLE `media`;
OPTIMIZE TABLE `reviews`;
OPTIMIZE TABLE `settings`;

-- Analyze query execution plans
ANALYZE TABLE `students`, `payments`, `chat_sessions`, `inquiries`, `email_logs`;
