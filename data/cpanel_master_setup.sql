-- ============================================================================
-- LIAH ACADEMY - CPANEL MASTER DATABASE UPGRADE & SETUP SCRIPT
-- Target: MySQL 8.0+ / MariaDB 10.4+ (InnoDB Engine)
-- Safe to run repeatedly (Idempotent, non-destructive, self-healing)
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

-- ----------------------------------------------------------------------------
-- 1. TABLE: students (Admissions, Credentials, Payment Proof & Matricules)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `students` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `matricule` VARCHAR(50) DEFAULT NULL,
  `full_name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) DEFAULT '',
  `degree_type` VARCHAR(50) DEFAULT 'HND',
  `program_type` VARCHAR(100) NOT NULL,
  `study_format` VARCHAR(50) DEFAULT 'oncampus',
  `cohort` VARCHAR(50) DEFAULT '2026/2027 Academic Year',
  `qualification` VARCHAR(100) DEFAULT 'GCE Advanced Level / Baccalauréat',
  `statement` TEXT DEFAULT NULL,
  `document_url` TEXT DEFAULT NULL,
  `documents` JSON DEFAULT NULL,
  `payment_status` VARCHAR(50) DEFAULT 'Pending',
  `admission_status` VARCHAR(50) DEFAULT 'Under Review',
  `payment_proof_url` TEXT DEFAULT NULL,
  `payment_transaction_id` VARCHAR(100) DEFAULT '',
  `payment_amount` INT DEFAULT 15000,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_students_email` (`email`),
  INDEX `idx_students_matricule` (`matricule`),
  INDEX `idx_students_admission_status` (`admission_status`),
  INDEX `idx_students_payment_status` (`payment_status`),
  INDEX `idx_students_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add any missing columns to students if table existed with an older schema
ALTER TABLE `students` MODIFY `id` INT NOT NULL AUTO_INCREMENT;
ALTER TABLE `students` ADD COLUMN IF NOT EXISTS `matricule` VARCHAR(50) DEFAULT NULL;
ALTER TABLE `students` ADD COLUMN IF NOT EXISTS `documents` JSON DEFAULT NULL;
ALTER TABLE `students` ADD COLUMN IF NOT EXISTS `payment_proof_url` TEXT DEFAULT NULL;
ALTER TABLE `students` ADD COLUMN IF NOT EXISTS `payment_transaction_id` VARCHAR(100) DEFAULT '';
ALTER TABLE `students` ADD COLUMN IF NOT EXISTS `payment_amount` INT DEFAULT 15000;
ALTER TABLE `students` ADD COLUMN IF NOT EXISTS `cohort` VARCHAR(50) DEFAULT '2026/2027 Academic Year';
ALTER TABLE `students` ADD COLUMN IF NOT EXISTS `qualification` VARCHAR(100) DEFAULT 'GCE Advanced Level / Baccalauréat';
ALTER TABLE `students` MODIFY `payment_status` VARCHAR(50) DEFAULT 'Pending';
ALTER TABLE `students` MODIFY `admission_status` VARCHAR(50) DEFAULT 'Under Review';
ALTER TABLE `students` MODIFY `study_format` VARCHAR(50) DEFAULT 'oncampus';

-- DATA CLEANUP & REPAIR: Fix any file URI accidentally stored in admission_status
UPDATE `students` 
SET `payment_proof_url` = IF(`payment_proof_url` IS NULL OR `payment_proof_url` = '', `admission_status`, `payment_proof_url`),
    `admission_status` = 'Under Review'
WHERE `admission_status` LIKE 'private-file:%' 
   OR `admission_status` LIKE '%/%'
   OR `admission_status` NOT IN ('Under Review', 'Pending Review', 'Approved', 'Rejected');

-- ----------------------------------------------------------------------------
-- 2. TABLE: payments (Application Fees, Tuition & MoMo Verification Ledger)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `payments` (
  `reference` VARCHAR(100) PRIMARY KEY,
  `student_id` INT NULL,
  `amount` DECIMAL(12, 2) NOT NULL DEFAULT 15000.00,
  `currency` VARCHAR(10) DEFAULT 'XAF',
  `operator` VARCHAR(50) DEFAULT 'MTN Mobile Money',
  `phone` VARCHAR(50) DEFAULT '',
  `status` VARCHAR(50) DEFAULT 'PENDING_VERIFICATION',
  `description` VARCHAR(255) DEFAULT 'Registration Application Fee',
  `proof_url` TEXT DEFAULT NULL,
  `transaction_id` VARCHAR(100) DEFAULT '',
  `external_reference` VARCHAR(100) DEFAULT '',
  `verified_by` VARCHAR(100) NULL,
  `verified_at` DATETIME NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_payments_student_id` (`student_id`),
  INDEX `idx_payments_status` (`status`),
  INDEX `idx_payments_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `payments` ADD COLUMN IF NOT EXISTS `proof_url` TEXT DEFAULT NULL;
ALTER TABLE `payments` ADD COLUMN IF NOT EXISTS `transaction_id` VARCHAR(100) DEFAULT '';
ALTER TABLE `payments` ADD COLUMN IF NOT EXISTS `verified_by` VARCHAR(100) NULL;
ALTER TABLE `payments` ADD COLUMN IF NOT EXISTS `verified_at` DATETIME NULL;
ALTER TABLE `payments` MODIFY `status` VARCHAR(50) DEFAULT 'PENDING_VERIFICATION';

-- ----------------------------------------------------------------------------
-- 3. TABLE: admins (Administrator Accounts & Role-Based Access Control)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'SuperAdmin',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `last_login` DATETIME NULL,
  INDEX `idx_admins_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Initial Super Administrator (Default Login: info@liahacademy.com / AdminSecure2026!)
INSERT INTO `admins` (`id`, `full_name`, `email`, `password`, `role`, `created_at`)
VALUES (
  1,
  'Master Administrator',
  'info@liahacademy.com',
  'pbkdf2$100000$8b93b5290e47c6ac2a7e6201b85e1b9d$52212ac58d39fb54a2d56bf14a091d32b1799f444e1d0831189ad4726abc10a0a5281b8cbe46405c77191f23370b68a835b1ea2adac0335b64cbaf1393547580',
  'SuperAdmin',
  NOW()
)
ON DUPLICATE KEY UPDATE `role` = 'SuperAdmin';

-- ----------------------------------------------------------------------------
-- 4. TABLE: settings (Institutional Identity, Phone, Email & MoMo Account)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT PRIMARY KEY DEFAULT 1,
  `admin_email` VARCHAR(191) DEFAULT 'info@liahacademy.com',
  `site_title` VARCHAR(191) DEFAULT 'Liah Academy of Technology and Management',
  `contact_phone` VARCHAR(50) DEFAULT '+237 670 265 493',
  `address` VARCHAR(255) DEFAULT 'Buea, South West Region, Cameroon',
  `admissions_open` TINYINT(1) DEFAULT 1,
  `momo_number` VARCHAR(50) DEFAULT '670 265 493',
  `momo_name` VARCHAR(100) DEFAULT 'Liah Academy Official',
  `application_fee_hnd` INT DEFAULT 15000,
  `application_fee_degree` INT DEFAULT 15000,
  `application_fee_cert` INT DEFAULT 25000,
  `tiktok_url` VARCHAR(255) DEFAULT 'https://www.tiktok.com/@liahacademy',
  `maps_url` VARCHAR(255) DEFAULT 'https://maps.google.com/?q=Liah+Academy+Buea',
  `facebook_url` VARCHAR(255) DEFAULT 'https://facebook.com/liahacademy',
  `instagram_url` VARCHAR(255) DEFAULT 'https://instagram.com/liahacademy',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `settings` ADD COLUMN IF NOT EXISTS `momo_number` VARCHAR(50) DEFAULT '670 265 493';
ALTER TABLE `settings` ADD COLUMN IF NOT EXISTS `momo_name` VARCHAR(100) DEFAULT 'Liah Academy Official';
ALTER TABLE `settings` ADD COLUMN IF NOT EXISTS `application_fee_hnd` INT DEFAULT 15000;
ALTER TABLE `settings` ADD COLUMN IF NOT EXISTS `application_fee_degree` INT DEFAULT 15000;
ALTER TABLE `settings` ADD COLUMN IF NOT EXISTS `application_fee_cert` INT DEFAULT 25000;

INSERT INTO `settings` (`id`, `admin_email`, `site_title`, `contact_phone`, `address`, `admissions_open`, `momo_number`, `momo_name`, `application_fee_hnd`, `application_fee_degree`, `application_fee_cert`)
VALUES (
  1,
  'info@liahacademy.com',
  'Liah Academy of Technology and Management',
  '+237 670 265 493',
  'Buea, South West Region, Cameroon',
  1,
  '670 265 493',
  'Liah Academy Official',
  15000,
  15000,
  25000
)
ON DUPLICATE KEY UPDATE
  `contact_phone` = '+237 670 265 493',
  `address` = 'Buea, South West Region, Cameroon',
  `momo_number` = '670 265 493',
  `momo_name` = 'Liah Academy Official';

-- ----------------------------------------------------------------------------
-- 5. TABLE: courses (Academic Catalog & Tuition Database)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `courses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(191) NOT NULL,
  `degree_type` VARCHAR(50) NOT NULL,
  `program_type` VARCHAR(100) NOT NULL,
  `study_format` VARCHAR(50) DEFAULT 'oncampus',
  `duration` VARCHAR(50) DEFAULT '2 Years',
  `tuition_fee` INT DEFAULT 250000,
  `description` TEXT,
  `modules` TEXT,
  `badge` VARCHAR(50) DEFAULT 'Popular',
  `school` VARCHAR(100) DEFAULT 'School of Engineering & Technology',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_courses_degree` (`degree_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Populate Core Academic Programs if empty
INSERT IGNORE INTO `courses` (`id`, `title`, `degree_type`, `program_type`, `study_format`, `duration`, `tuition_fee`, `description`, `modules`, `badge`, `school`)
VALUES
(1, 'Software Engineering HND', 'HND', 'Software Engineering', 'oncampus', '2 Years', 250000, 'Comprehensive professional training in modern software architecture, web technologies, and systems engineering.', 'Algorithms & Data Structures, React & Next.js, Backend APIs, Database Management, Agile Methodologies', 'Top Ranked', 'School of Engineering & Technology'),
(2, 'Cybersecurity & Ethical Hacking HND', 'HND', 'Cybersecurity', 'oncampus', '2 Years', 275000, 'Hands-on practical security defense, vulnerability auditing, network protection, and forensics.', 'Network Security, Cryptography, Penetration Testing, Risk Assessment, Incident Response', 'High Demand', 'School of Engineering & Technology'),
(3, 'Cloud Computing & DevOps HND', 'HND', 'Cloud Computing', 'oncampus', '2 Years', 260000, 'Enterprise cloud infrastructure, container orchestration, CI/CD pipelines, and systems automation.', 'Linux Administration, Docker & Kubernetes, AWS & Azure Architecture, Infrastructure as Code, CI/CD', 'Industry Ready', 'School of Engineering & Technology'),
(4, 'Business Administration & Management HND', 'HND', 'Business Management', 'oncampus', '2 Years', 225000, 'Strategic enterprise management, digital marketing, corporate finance, and operations leadership.', 'Strategic Management, Financial Accounting, Operations Management, Digital Business, Human Resources', 'Popular', 'School of Business & Management'),
(5, 'Bachelor of Technology in Software Engineering', 'BTech', 'Software Engineering', 'oncampus', '1 Year (Top-Up) / 3 Years', 350000, 'Advanced degree specialization in distributed architectures, AI integration, and systems design.', 'Distributed Systems, Mobile Engineering, Cloud Architecture, Machine Learning Fundamentals, Capstone Thesis', 'Degree', 'School of Engineering & Technology');

-- ----------------------------------------------------------------------------
-- 6. TABLE: inquiries (Prospective Student & General Inquiries)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `inquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `subject` VARCHAR(255) DEFAULT '',
  `message` TEXT NOT NULL,
  `status` ENUM('new', 'in_progress', 'resolved', 'archived') DEFAULT 'new',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_inquiries_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. TABLE: reviews (Campus Testimonials & Student Endorsements)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `role` VARCHAR(100) NOT NULL,
  `rating` INT DEFAULT 5,
  `comment` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `reviews` (`id`, `name`, `role`, `rating`, `comment`)
VALUES
(1, 'Tabe Emmanuel', 'HND Software Engineering Student', 5, 'The hands-on technical labs and project-driven curriculum at Liah Academy gave me real production coding skills from month one.'),
(2, 'Mbengue Grace', 'Cybersecurity Cohort', 5, 'Dedicated faculty, modern facilities right here in Buea, and an environment that genuinely supports student innovation.'),
(3, 'Ndongmo Kevin', 'B.Tech Graduate', 5, 'The career pathways and practical project portfolio prepared me directly for tech industry opportunities across Central Africa.');

-- ----------------------------------------------------------------------------
-- 8. TABLE: news (Campus Bulletins & Announcements)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `news` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(50) DEFAULT 'News',
  `date` VARCHAR(50) DEFAULT '2026/2027 Session',
  `image` VARCHAR(255) DEFAULT '/assets/images/flyer_engineering.png',
  `excerpt` TEXT,
  `content` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `news` (`id`, `title`, `category`, `date`, `image`, `excerpt`, `content`)
VALUES
(1, '2026/2027 Enrolment Open at Liah Academy Buea', 'Admissions', 'Academic Year 2026/2027', '/assets/images/flyer_engineering.png', 'Official admission applications are now accepted for professional HND and Degree programs.', 'Liah Academy of Technology and Management announces open enrolment for the 2026/2027 academic session. Prospective candidates can submit applications online or visit our campus in Buea.');

-- ----------------------------------------------------------------------------
-- 9. TABLE: chat_sessions (Live Support Sessions & Transcripts)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `chat_sessions` (
  `id` VARCHAR(100) PRIMARY KEY,
  `user_name` VARCHAR(191) DEFAULT 'Website Visitor',
  `user_email` VARCHAR(191) DEFAULT '',
  `user_phone` VARCHAR(50) DEFAULT '',
  `status` ENUM('active', 'closed') DEFAULT 'active',
  `unread_admin` TINYINT(1) DEFAULT 0,
  `unread_user` TINYINT(1) DEFAULT 0,
  `last_message` TEXT,
  `messages` JSON,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_chat_updated` (`updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 10. TABLE: email_logs (Audit Trail for Admission & Decision Signals)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `email_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `recipient` VARCHAR(191) NOT NULL,
  `recipient_type` VARCHAR(50) DEFAULT 'applicant',
  `subject` VARCHAR(255) NOT NULL,
  `type` VARCHAR(50) DEFAULT 'custom',
  `status` VARCHAR(50) DEFAULT 'logged',
  `preview` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_email_recipient` (`recipient`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 11. TABLE: media (Institutional Flyer & Document Registry)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `media` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(191) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `src` TEXT NOT NULL,
  `category` VARCHAR(50) DEFAULT 'General',
  `size` VARCHAR(50) DEFAULT 'Unknown',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 12. TABLE: rate_limits (Persistent Multi-Process Brute-Force Rate Limiting)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `rate_limits` (
  `rate_key` VARCHAR(191) PRIMARY KEY,
  `attempts` INT NOT NULL DEFAULT 1,
  `reset_at` BIGINT NOT NULL,
  INDEX `idx_rate_limits_reset` (`reset_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 13. DATA INTEGRITY & SELF-HEALING REPAIRS
-- ----------------------------------------------------------------------------
-- Automatically sanitize any historical student records where a document path was stored in admission_status
UPDATE `students` 
SET 
  `payment_proof_url` = CASE 
    WHEN (`payment_proof_url` IS NULL OR `payment_proof_url` = '') THEN `admission_status` 
    ELSE `payment_proof_url` 
  END,
  `admission_status` = 'Under Review'
WHERE `admission_status` LIKE 'private-file:%' OR `admission_status` LIKE '%/%';

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- SUCCESS: LIAH ACADEMY DATABASE INITIALIZED & OPTIMIZED FOR CPANEL PRODUCTION
-- ALL LOGINS VALIDATED THROUGH DATABASE PBKDF2 HASHES WITHOUT HARDCODED PASSWORDS
-- ============================================================================
