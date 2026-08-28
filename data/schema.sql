-- ============================================================================
-- LIAH ACADEMY - MASTER MYSQL DATABASE SCHEMA
-- Target Database: liah_db (InnoDB / MySQL 8.0+)
-- Auto-generated and maintained by Liah Academy Core Engine
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `liah_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `liah_db`;

-- ----------------------------------------------------------------------------
-- Table 1: students (Student Admissions, Dossiers, and Password Hashes)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `students` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) DEFAULT '',
  `degree_type` VARCHAR(50) DEFAULT 'HND',
  `program_type` VARCHAR(100) NOT NULL,
  `study_format` ENUM('oncampus', 'online', 'hybrid') DEFAULT 'oncampus',
  `cohort` VARCHAR(50) DEFAULT 'Fall 2026 / Spring 2027',
  `qualification` VARCHAR(100) DEFAULT 'GCE Advanced Level',
  `statement` TEXT,
  `document_url` TEXT,
  `documents` JSON,
  `payment_status` ENUM('Pending', 'Pending Verification', 'Deposit Paid', 'Paid') DEFAULT 'Pending',
  `admission_status` ENUM('Under Review', 'Pending Review', 'Approved', 'Rejected') DEFAULT 'Under Review',
  `payment_proof_url` TEXT,
  `payment_transaction_id` VARCHAR(100) DEFAULT '',
  `payment_amount` INT DEFAULT 50000,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_students_email` (`email`),
  INDEX `idx_students_admission_status` (`admission_status`),
  INDEX `idx_students_payment_status` (`payment_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 2: payments (Mobile Money & Tuition Transaction Ledger)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `payments` (
  `reference` VARCHAR(100) PRIMARY KEY,
  `student_id` INT NULL,
  `amount` DECIMAL(12, 2) NOT NULL DEFAULT 50000.00,
  `currency` VARCHAR(10) DEFAULT 'XAF',
  `operator` VARCHAR(50) DEFAULT 'MTN / Orange',
  `phone` VARCHAR(50) DEFAULT '',
  `status` ENUM('PENDING', 'SUCCESSFUL', 'FAILED', 'VERIFIED', 'REJECTED') DEFAULT 'PENDING',
  `description` VARCHAR(255) DEFAULT 'Registration / Tuition Payment',
  `proof_url` TEXT,
  `transaction_id` VARCHAR(100) DEFAULT '',
  `external_reference` VARCHAR(100) DEFAULT '',
  `verified_by` VARCHAR(100) NULL,
  `verified_at` DATETIME NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_payments_student_id` (`student_id`),
  INDEX `idx_payments_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 3: courses (Official Degree & Certification Offerings)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `courses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(191) NOT NULL,
  `degree_type` VARCHAR(50) NOT NULL,
  `program_type` VARCHAR(100) NOT NULL,
  `study_format` VARCHAR(50) DEFAULT 'fulltime',
  `duration` VARCHAR(50) DEFAULT '2 Years',
  `tuition_fee` INT DEFAULT 250000,
  `description` TEXT,
  `modules` TEXT,
  `badge` VARCHAR(50) DEFAULT 'Popular',
  `school` VARCHAR(100) DEFAULT 'School of Engineering',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 4: news (Campus Announcements & Cohort Highlights)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `news` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(50) DEFAULT 'News',
  `date` VARCHAR(50) DEFAULT 'August 2026',
  `image` VARCHAR(255) DEFAULT '/assets/images/flyer_engineering.png',
  `excerpt` TEXT,
  `content` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 5: media (Asset Registry & Document Management)
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
-- Table 6: inquiries (Public Contact Form Messages)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `inquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `subject` VARCHAR(255) DEFAULT '',
  `message` TEXT NOT NULL,
  `status` ENUM('new', 'in_progress', 'resolved', 'archived') DEFAULT 'new',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 7: reviews (Verified Student Testimonials)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `role` VARCHAR(100) NOT NULL,
  `rating` INT DEFAULT 5,
  `comment` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 8: settings (Institutional Global Configuration)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT PRIMARY KEY DEFAULT 1,
  `admin_email` VARCHAR(191) DEFAULT 'info@liahacademy.com',
  `site_title` VARCHAR(191) DEFAULT 'Liah Academy of Technology and Management',
  `contact_phone` VARCHAR(50) DEFAULT '+237 670 265 493',
  `address` VARCHAR(255) DEFAULT 'Buea, South West Region, Cameroon',
  `admissions_open` TINYINT(1) DEFAULT 1,
  `tiktok_url` VARCHAR(255) DEFAULT 'https://www.tiktok.com/@liahacademy',
  `maps_url` VARCHAR(255) DEFAULT 'https://maps.google.com/?q=Liah+Academy+Buea',
  `facebook_url` VARCHAR(255) DEFAULT 'https://facebook.com/liahacademy',
  `instagram_url` VARCHAR(255) DEFAULT 'https://instagram.com/liahacademy',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 9: email_logs (Audit Trail for Dispatched Admission Notifications)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `email_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `recipient` VARCHAR(191) NOT NULL,
  `recipient_type` VARCHAR(50) DEFAULT 'applicant',
  `subject` VARCHAR(255) NOT NULL,
  `type` VARCHAR(50) DEFAULT 'custom',
  `status` VARCHAR(50) DEFAULT 'logged',
  `preview` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
