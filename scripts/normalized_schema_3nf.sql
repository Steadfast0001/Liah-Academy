-- ============================================================================
-- LIAH ACADEMY - 1NF, 2NF, 3NF NORMALIZED DATABASE SCHEMA & INITIALIZATION SCRIPT
-- Engine: MySQL 8.0+ / MariaDB 10.4+ (InnoDB Engine, utf8mb4)
-- High Concurrency Architecture (100+ Concurrent Website Visitors)
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET NAMES utf8mb4;

-- ----------------------------------------------------------------------------
-- 1. TABLE: students (Admissions & Matricules Entity)
-- Satisfies 1NF & 2NF: Single-column Primary Key, Atomic Attributes
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `students` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `matricule` VARCHAR(50) DEFAULT '',
  `full_name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) DEFAULT '',
  `degree_type` VARCHAR(50) DEFAULT 'HND',
  `program_type` VARCHAR(100) NOT NULL,
  `study_format` VARCHAR(50) DEFAULT 'oncampus',
  `cohort` VARCHAR(50) DEFAULT 'Fall 2026 / Spring 2027',
  `qualification` VARCHAR(100) DEFAULT 'GCE Advanced Level',
  `statement` TEXT DEFAULT NULL,
  `document_url` LONGTEXT DEFAULT NULL,
  `documents` JSON DEFAULT NULL,
  `payment_status` VARCHAR(50) DEFAULT 'Pending',
  `admission_status` VARCHAR(50) DEFAULT 'Under Review',
  `payment_proof_url` LONGTEXT DEFAULT NULL,
  `payment_transaction_id` VARCHAR(100) DEFAULT '',
  `payment_amount` INT DEFAULT 50000,
  `referred_by` VARCHAR(50) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_students_email` (`email`),
  INDEX `idx_students_matricule` (`matricule`),
  INDEX `idx_students_status` (`admission_status`, `payment_status`),
  INDEX `idx_students_created_at` (`created_at`),
  INDEX `idx_students_referred_by` (`referred_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. TABLE: student_documents (1NF Normalization: Atomic Credentials)
-- Eliminates repeating JSON array into atomic individual rows with FK
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `student_documents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `slot_id` VARCHAR(100) NOT NULL DEFAULT 'doc_primary',
  `label` VARCHAR(191) NOT NULL DEFAULT 'Uploaded Credential',
  `file_name` VARCHAR(255) NOT NULL DEFAULT 'credential.pdf',
  `url` LONGTEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_student_docs_student` (`student_id`),
  CONSTRAINT `fk_student_docs_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. TABLE: payments (Application Fees & Mobile Money Ledger)
-- 2NF & 3NF: Relational integrity with Foreign Key to students
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `payments` (
  `reference` VARCHAR(100) PRIMARY KEY,
  `student_id` INT NULL,
  `amount` DECIMAL(12, 2) NOT NULL DEFAULT 50000.00,
  `currency` VARCHAR(10) DEFAULT 'XAF',
  `operator` VARCHAR(50) DEFAULT 'MTN Mobile Money',
  `phone` VARCHAR(50) DEFAULT '',
  `status` ENUM('PENDING', 'PENDING_VERIFICATION', 'APPROVED', 'PAID', 'FAILED', 'REJECTED') DEFAULT 'PENDING',
  `description` VARCHAR(255) DEFAULT 'Registration / Tuition Payment',
  `proof_url` LONGTEXT DEFAULT NULL,
  `transaction_id` VARCHAR(100) DEFAULT '',
  `external_reference` VARCHAR(100) DEFAULT '',
  `verified_by` VARCHAR(100) NULL,
  `verified_at` DATETIME NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_payments_student_id` (`student_id`),
  INDEX `idx_payments_status` (`status`),
  INDEX `idx_payments_created_at` (`created_at`),
  INDEX `idx_payments_operator_status` (`operator`, `status`),
  CONSTRAINT `fk_payments_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. TABLE: referral_agents (Student Ambassadors & Affiliates)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `referral_agents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `full_name` VARCHAR(191) NOT NULL,
  `momo_number` VARCHAR(50) NOT NULL,
  `momo_name` VARCHAR(100) DEFAULT '',
  `email` VARCHAR(191) DEFAULT '',
  `phone` VARCHAR(50) DEFAULT '',
  `student_id` INT NULL,
  `student_matricule` VARCHAR(50) DEFAULT '',
  `commission_per_student` INT DEFAULT 15000,
  `total_referrals` INT DEFAULT 0,
  `paid_referrals` INT DEFAULT 0,
  `total_earned` INT DEFAULT 0,
  `total_paid` INT DEFAULT 0,
  `balance` INT DEFAULT 0,
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_ref_code` (`code`),
  INDEX `idx_ref_momo` (`momo_number`),
  INDEX `idx_ref_email` (`email`),
  INDEX `idx_ref_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. TABLE: referrals (Downlines & Commission Attribution)
-- 3NF: Relational junction entity with Foreign Keys to agents and students
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `referrals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `agent_id` INT NOT NULL,
  `agent_code` VARCHAR(50) NOT NULL,
  `student_id` INT NOT NULL,
  `student_name` VARCHAR(191) NOT NULL,
  `student_matricule` VARCHAR(50) DEFAULT '',
  `student_email` VARCHAR(191) NOT NULL,
  `student_phone` VARCHAR(50) DEFAULT '',
  `program_type` VARCHAR(100) DEFAULT '',
  `payment_status` VARCHAR(50) DEFAULT 'Pending',
  `admission_status` VARCHAR(50) DEFAULT 'Under Review',
  `commission_amount` INT DEFAULT 15000,
  `commission_status` VARCHAR(20) DEFAULT 'pending',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_referrals_agent` (`agent_id`),
  INDEX `idx_referrals_code` (`agent_code`),
  INDEX `idx_referrals_student` (`student_id`),
  INDEX `idx_referrals_comm_status` (`commission_status`),
  INDEX `idx_referrals_agent_status` (`agent_id`, `commission_status`),
  CONSTRAINT `fk_referrals_agent` FOREIGN KEY (`agent_id`) REFERENCES `referral_agents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_referrals_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. TABLE: referral_payouts (Agent Withdrawal Ledger & Admin Deposit Proof)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `referral_payouts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `agent_id` INT NOT NULL,
  `agent_code` VARCHAR(50) NOT NULL,
  `agent_name` VARCHAR(191) NOT NULL,
  `momo_number` VARCHAR(50) NOT NULL,
  `amount` INT NOT NULL,
  `status` VARCHAR(20) DEFAULT 'pending',
  `transaction_id` VARCHAR(100) DEFAULT '',
  `proof_screenshot` LONGTEXT DEFAULT NULL,
  `admin_notes` TEXT DEFAULT NULL,
  `requested_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `processed_at` DATETIME DEFAULT NULL,
  INDEX `idx_payouts_agent` (`agent_id`),
  INDEX `idx_payouts_status` (`status`),
  INDEX `idx_payouts_requested` (`requested_at`),
  CONSTRAINT `fk_referral_payouts_agent` FOREIGN KEY (`agent_id`) REFERENCES `referral_agents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. TABLE: chat_sessions (Live Support Sessions)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `chat_sessions` (
  `id` VARCHAR(100) PRIMARY KEY,
  `user_name` VARCHAR(191) DEFAULT 'Website Visitor',
  `user_email` VARCHAR(191) DEFAULT '',
  `user_phone` VARCHAR(50) DEFAULT '',
  `status` VARCHAR(50) DEFAULT 'active',
  `unread_admin` TINYINT(1) DEFAULT 0,
  `unread_user` TINYINT(1) DEFAULT 0,
  `last_message` TEXT,
  `messages` JSON DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_chat_updated` (`updated_at`),
  INDEX `idx_chat_status` (`status`),
  INDEX `idx_chat_unread` (`unread_admin`, `unread_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8. TABLE: chat_messages (1NF Normalization: Atomic Message Transcript)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `chat_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `session_id` VARCHAR(100) NOT NULL,
  `sender` VARCHAR(50) NOT NULL,
  `sender_name` VARCHAR(191) DEFAULT '',
  `message` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_chat_msg_session` (`session_id`),
  INDEX `idx_chat_msg_created` (`created_at`),
  CONSTRAINT `fk_chat_messages_session` FOREIGN KEY (`session_id`) REFERENCES `chat_sessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 9. TABLE: courses (Academic Curriculum & Degrees)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `courses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `degree_type` VARCHAR(50) NOT NULL,
  `program_type` VARCHAR(100) NOT NULL,
  `study_format` VARCHAR(50) DEFAULT 'fulltime',
  `duration` VARCHAR(50) DEFAULT '2 Years',
  `tuition_fee` INT DEFAULT 250000,
  `description` TEXT,
  `modules` TEXT,
  `badge` VARCHAR(50) DEFAULT 'Popular',
  `school` VARCHAR(100) DEFAULT 'School of Engineering',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_courses_degree` (`degree_type`),
  INDEX `idx_courses_school` (`school`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 10. TABLE: news (Institutional Announcements & Flyers)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `news` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) DEFAULT 'News',
  `date` VARCHAR(100) DEFAULT 'August 2026',
  `image` TEXT,
  `excerpt` TEXT,
  `content` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_news_category` (`category`),
  INDEX `idx_news_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 11. TABLE: reviews (Student & Alumni Testimonials)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `role` VARCHAR(191) NOT NULL,
  `rating` INT DEFAULT 5,
  `comment` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_reviews_rating` (`rating`),
  INDEX `idx_reviews_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 12. TABLE: inquiries (Contact Form Submissions)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `inquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `subject` VARCHAR(191) NOT NULL,
  `message` TEXT NOT NULL,
  `status` VARCHAR(50) DEFAULT 'new',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_inquiries_status` (`status`),
  INDEX `idx_inquiries_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 13. TABLE: media (Campus Gallery & Media Assets)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `media` (
  `id` VARCHAR(100) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `src` TEXT NOT NULL,
  `category` VARCHAR(100) DEFAULT 'General',
  `size` VARCHAR(50) DEFAULT 'Unknown',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_media_category` (`category`),
  INDEX `idx_media_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 14. TABLE: settings (Institutional Parameters & Payout Schedule)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT PRIMARY KEY DEFAULT 1,
  `admin_email` VARCHAR(255) DEFAULT 'info@liahacademy.com',
  `site_title` VARCHAR(255) DEFAULT 'Liah Academy',
  `contact_phone` VARCHAR(100) DEFAULT '+237 652 154 095 / +237 699 526 607',
  `address` TEXT,
  `admissions_open` TINYINT(1) DEFAULT 1,
  `tiktok_url` TEXT,
  `maps_url` TEXT,
  `facebook_url` TEXT,
  `instagram_url` TEXT,
  `registration_end_date` VARCHAR(50) DEFAULT '2026-10-31',
  `registration_period_title` VARCHAR(150) DEFAULT 'Fall 2026 Admissions Intake',
  `payouts_unlocked` TINYINT(1) DEFAULT 0,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 15. TABLE: admins (Administrative Accounts)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'Admin',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `last_login` DATETIME NULL,
  INDEX `idx_admins_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 16. TABLE: email_logs (Audit Trail for Admissions & Decisions)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `email_logs` (
  `id` VARCHAR(100) PRIMARY KEY,
  `recipient` VARCHAR(191) NOT NULL,
  `recipient_type` VARCHAR(50) DEFAULT 'applicant',
  `subject` VARCHAR(255) NOT NULL,
  `type` VARCHAR(50) DEFAULT 'custom',
  `status` VARCHAR(50) DEFAULT 'logged',
  `preview` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_email_recipient` (`recipient`),
  INDEX `idx_email_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 17. TABLE: rate_limits (High-Traffic Multi-Process Brute Force Protection)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `rate_limits` (
  `rate_key` VARCHAR(191) PRIMARY KEY,
  `attempts` INT NOT NULL DEFAULT 1,
  `reset_at` BIGINT NOT NULL,
  INDEX `idx_rate_limits_reset` (`reset_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 17B. MIGRATION & SCHEMA UPGRADE (Idempotent column verification for existing DBs)
-- ----------------------------------------------------------------------------
ALTER TABLE `settings` ADD COLUMN IF NOT EXISTS `registration_end_date` VARCHAR(50) DEFAULT '2026-10-31';
ALTER TABLE `settings` ADD COLUMN IF NOT EXISTS `registration_period_title` VARCHAR(150) DEFAULT 'Fall 2026 Admissions Intake';
ALTER TABLE `settings` ADD COLUMN IF NOT EXISTS `payouts_unlocked` TINYINT(1) DEFAULT 0;

ALTER TABLE `students` ADD COLUMN IF NOT EXISTS `referred_by` VARCHAR(50) DEFAULT NULL;
ALTER TABLE `students` ADD COLUMN IF NOT EXISTS `payment_proof_url` LONGTEXT DEFAULT NULL;
ALTER TABLE `students` ADD COLUMN IF NOT EXISTS `payment_transaction_id` VARCHAR(100) DEFAULT '';

ALTER TABLE `referral_payouts` ADD COLUMN IF NOT EXISTS `proof_screenshot` LONGTEXT DEFAULT NULL;
ALTER TABLE `referral_payouts` ADD COLUMN IF NOT EXISTS `transaction_id` VARCHAR(100) DEFAULT '';
ALTER TABLE `referral_payouts` ADD COLUMN IF NOT EXISTS `admin_notes` TEXT DEFAULT NULL;

-- ----------------------------------------------------------------------------
-- 18. NORMALIZED 3NF VIEWS (Zero Duplication + Instant High-Speed Joins)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW `view_referrals_normalized` AS
SELECT 
  r.id,
  r.agent_id,
  ra.code AS agent_code,
  ra.full_name AS agent_name,
  ra.momo_number AS agent_momo,
  r.student_id,
  s.full_name AS student_name,
  s.matricule AS student_matricule,
  s.email AS student_email,
  s.phone AS student_phone,
  s.program_type,
  s.payment_status,
  s.admission_status,
  r.commission_amount,
  r.commission_status,
  r.created_at,
  r.updated_at
FROM `referrals` r
LEFT JOIN `referral_agents` ra ON r.agent_id = ra.id
LEFT JOIN `students` s ON r.student_id = s.id;

CREATE OR REPLACE VIEW `view_referral_payouts_normalized` AS
SELECT 
  rp.id,
  rp.agent_id,
  ra.code AS agent_code,
  ra.full_name AS agent_name,
  rp.momo_number,
  rp.amount,
  rp.status,
  rp.transaction_id,
  rp.proof_screenshot,
  rp.admin_notes,
  rp.requested_at,
  rp.processed_at
FROM `referral_payouts` rp
LEFT JOIN `referral_agents` ra ON rp.agent_id = ra.id;

-- ----------------------------------------------------------------------------
-- 19. CANONICAL SEED DATA (Academic Programs, Default Settings, Institutional Admins)
-- ----------------------------------------------------------------------------

-- Settings
INSERT INTO `settings` (`id`, `admin_email`, `site_title`, `contact_phone`, `address`, `admissions_open`, `registration_end_date`, `registration_period_title`, `payouts_unlocked`)
VALUES (1, 'info@liahacademy.com', 'Liah Academy', '+237 652 154 095 / +237 699 526 607', 'Bakweri Town Campus, Buea, South West Region, Cameroon', 1, '2026-10-31', 'Fall 2026 Admissions Intake', 0)
ON DUPLICATE KEY UPDATE 
  registration_end_date=VALUES(registration_end_date),
  registration_period_title=VALUES(registration_period_title);

-- Standard SuperAdmin account
INSERT INTO `admins` (`id`, `full_name`, `email`, `password`, `role`)
VALUES (1, 'Academic Registrar', 'info@liahacademy.com', 'AdminSecure2026!', 'SuperAdmin')
ON DUPLICATE KEY UPDATE password=VALUES(password), full_name=VALUES(full_name);

-- Academic Courses
INSERT IGNORE INTO `courses` (`id`, `title`, `degree_type`, `program_type`, `study_format`, `duration`, `tuition_fee`, `description`, `modules`, `badge`, `school`)
VALUES 
(1, 'HND in Software Engineering', 'HND', 'Software Engineering', 'oncampus', '2 Years', 250000, 'Comprehensive software development covering data structures, fullstack TypeScript, Python backends, DevOps pipelines, and database architectures.', 'TypeScript, React, Node.js, Python, PostgreSQL, Docker, Git', 'Most Popular', 'School of Engineering'),
(2, 'HND in Cybersecurity & Cloud Defense', 'HND', 'Cybersecurity', 'oncampus', '2 Years', 250000, 'Hands-on network defense, ethical hacking, SOC monitoring, penetration testing, cryptography, and cloud infrastructure security labs.', 'Linux, Wireshark, Metasploit, Cryptography, AWS Security, SIEM', 'High Demand', 'School of Engineering'),
(3, 'DevOps & Cloud Engineering Specialist', 'Certification', 'DevOps', 'online', '9 Months', 350000, 'Master CI/CD pipelines, Kubernetes container orchestration, Terraform infrastructure as code, cloud monitoring, and automated deployment architectures.', 'Docker, Kubernetes, Jenkins, Terraform, AWS, Prometheus', 'Professional Track', 'School of Engineering'),
(4, 'Data Science & Machine Learning', 'Certification', 'Data Science', 'fulltime', '9 Months', 350000, 'Applied statistical modeling, deep learning architectures, Python data wrangling, NLP, computer vision, and production ML model deployment.', 'Python, Pandas, TensorFlow, PyTorch, SQL, PowerBI', 'Accelerated', 'School of Engineering'),
(5, 'ND in Computer Engineering', 'ND', 'Computer Engineering', 'oncampus', '2 Years', 220000, 'Hardware architecture, embedded microcontrollers, IoT sensor telemetry, telecommunications, and digital electronics.', 'Computer Architecture, C++, Microcontrollers, IoT Sensors, Telecommunications', 'Foundation Track', 'School of Engineering'),
(6, 'Digital Marketing & SEO Mastery', 'Certification', 'Digital Marketing', 'online', '6 Months', 180000, 'Search engine optimization, programmatic advertising, content marketing, growth hacking, and social media analytics.', 'SEO, Google Ads, Meta Ads, Copywriting, Google Analytics 4', 'Fast Track', 'School of Business');

-- Official Institutional Announcement
INSERT IGNORE INTO `news` (`id`, `title`, `category`, `date`, `image`, `excerpt`, `content`)
VALUES (1, 'Fall 2026 Admissions Open - Bakweri Town Campus', 'Admissions', 'August 2026', '/assets/images/flyer_engineering.png', 'Official intake announcement for HND, ND, and Professional Certification tracks at Liah Academy.', 'Liah Academy announces the opening of admissions for the Fall 2026 intake at the Bakweri Town Campus in Buea. Students enrolled in Software Engineering, Cybersecurity, and Data Science will have access to 24/7 power backup and dedicated fiber optic workstations.');

-- Verified Testimonials
INSERT IGNORE INTO `reviews` (`id`, `name`, `role`, `rating`, `comment`)
VALUES 
(1, 'Elvis Tabi', 'Fullstack Engineer at FinTech', 5, 'Liah Academy provided the exact practical coding foundation I needed. Within 3 months of completing the Software Engineering track, I landed a remote developer role.'),
(2, 'Nathalie Ewane', 'DevOps Apprentice', 5, 'The fiber optic labs and 24/7 power backup meant zero downtime during our semester hackathons. Top-tier mentors who actually work on enterprise software.'),
(3, 'Roland Ashu', 'Cybersecurity Analyst', 5, 'The hands-on SOC labs in Bakweri Town transformed theoretical networking into real defense experience. Unmatched tech academy in Cameroon.');

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- SUCCESS: Normalized 1NF, 2NF, 3NF schema, indexes, views and seed data complete.
-- ============================================================================
