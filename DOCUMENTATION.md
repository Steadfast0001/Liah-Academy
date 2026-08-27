# LIAH ACADEMY — TECHNICAL SYSTEM DOCUMENTATION & ARCHITECTURE SPECIFICATION
**Version:** 2.0.0 (Production Release)  
**Author:** Liah Academy Engineering & Development Division  
**Repository:** `Steadfast0001/Liah-Academy`  
**Target Environment:** Node.js 18+ / Next.js 14 / MySQL 8.0+ / MariaDB  

---

## TABLE OF CONTENTS
1. [System Overview & Architecture](#1-system-overview--architecture)
2. [Technology Stack](#2-technology-stack)
3. [Project Directory & File Structure](#3-project-directory--file-structure)
4. [Database Design & Data Persistence Layer](#4-database-design--data-persistence-layer)
   - 4.1 [Relational Database Schema (MySQL)](#41-relational-database-schema-mysql)
   - 4.2 [JSON Dual-Layer Fallback Mechanism](#42-json-dual-layer-fallback-mechanism)
5. [Payment Gateway Architecture (Campay Mobile Money)](#5-payment-gateway-architecture-campay-mobile-money)
   - 5.1 [USSD Payment Collection Flow](#51-ussd-payment-collection-flow)
   - 5.2 [Real-Time Polling & Webhook Handling](#52-real-time-polling--webhook-handling)
   - 5.3 [Digital Receipt Generation & Security](#53-digital-receipt-generation--security)
6. [AI Chatbot Engine & Context Architecture](#6-ai-chatbot-engine--context-architecture)
7. [REST API Endpoints Specification](#7-rest-api-endpoints-specification)
   - 7.1 [Admissions & Authentication APIs](#71-admissions--authentication-apis)
   - 7.2 [Payment & Financial APIs](#72-payment--financial-apis)
   - 7.3 [Chat & Intelligence APIs](#73-chat--intelligence-apis)
   - 7.4 [Inquiries & Reviews APIs](#74-inquiries--reviews-apis)
   - 7.5 [Administrative Control APIs](#75-administrative-control-apis)
8. [Security & Access Control](#8-security--access-control)
9. [Environment Variables & Configuration](#9-environment-variables--configuration)
10. [Build, Deployment & Maintenance Procedures](#10-build-deployment--maintenance-procedures)

---

## 1. SYSTEM OVERVIEW & ARCHITECTURE

The **Liah Academy Web Application** is a full-stack educational and admissions platform constructed to serve prospective students, enrolled engineers, corporate partners, and institutional administrators.

```
                                  +-----------------------+
                                  |   Web Browser / App   |
                                  | (Desktop/Tablet/Phone)|
                                  +-----------+-----------+
                                              |
                                              | HTTPS / REST
                                              v
                              +---------------+---------------+
                              |    Next.js 14 App Server      |
                              |   (React 18 + Edge Router)    |
                              +---------------+---------------+
                                              |
                     +------------------------+------------------------+
                     |                        |                        |
                     v                        v                        v
        +------------+-----------+  +---------+----------+  +----------+----------+
        |   Admissions & Auth    |  |  Campay MoMo API   |  |   AI Chat Assistant  |
        |  Application Service   |  |  (MTN / Orange)    |  |    (LiahBot NLP)     |
        +------------+-----------+  +---------+----------+  +----------+----------+
                     |                        |                        |
                     +------------------------+------------------------+
                                              |
                                              v
                              +---------------+---------------+
                              |    Hybrid Persistence Layer   |
                              |  - MySQL 8.0+ / MariaDB       |
                              |  - JSON Atomic Store Fallback |
                              +-------------------------------+
```

### Key Architectural Tenets:
1. **Zero-Downtime Resilience**: Hybrid data persistence allows full operation whether backed by MySQL or atomic file-system stores (`data/liah_academy_store.json`).
2. **Mobile-First Responsive Layout**: Built to render on all viewports from 320px smartphones to ultrawide 4K displays with accessible touch targets (min 44px) and fluid typography (`clamp()`).
3. **Instant Mobile Money Integration**: Direct USSD push integration with Campay for Cameroon MTN MoMo and Orange Money networks.
4. **Context-Aware AI Assistant**: Natural language processing model embedded with complete academy knowledge, financial computation tools, and live student dossier lookups.

---

## 2. TECHNOLOGY STACK

| Layer | Technologies Used |
| :--- | :--- |
| **Framework** | Next.js 14.2.24 (App Router, Server Actions, API Route Handlers) |
| **Language** | TypeScript 5.7.3, JavaScript (ES2023) |
| **Frontend UI** | React 18.3.1, Vanilla CSS3 Variables, CSS Grid / Flexbox, Lucide Icons |
| **Graphics & 3D** | OGL 1.0.11 (WebGL canvas renderers) |
| **Database** | MySQL 8.0+ / MariaDB (`mysql2`), Atomic JSON Store Fallback |
| **Payment Gateway**| Campay API v1 (Mobile Money MTN & Orange Cameroon) |
| **Email Delivery** | Nodemailer 9.0.5 (SMTP with file-based diagnostic logger) |
| **Security** | Session Cookie Auth, PIN Token Verification, SQL Injection Escaping |

---

## 3. PROJECT DIRECTORY & FILE STRUCTURE

```
d:\Liah Academy\
├── app/                                 # Next.js App Router root
│   ├── layout.tsx                       # Global HTML shell, metadata, BackToTop, ChatWidget
│   ├── globals.css                      # Master CSS variables, responsive typography & layouts
│   ├── page.tsx                         # Landing homepage (Hero slider, video showcase, reviews)
│   ├── degree-programs/                 # Degree catalog, filter pills, syllabus & inquiry modals
│   │   └── page.tsx
│   ├── admissions/                      # 3-step application wizard, student portal, tuition schedule
│   │   └── page.tsx
│   ├── about/                           # Institutional leadership, partnerships, news highlights
│   │   └── page.tsx
│   ├── student-experience/              # Video workshops, lab amenities, interactive FAQ
│   │   └── page.tsx
│   ├── contact/                         # Campus contact info, WhatsApp action, inquiry form
│   │   └── page.tsx
│   ├── admin/                           # Protected administrative control dashboard
│   │   └── page.tsx
│   └── api/                             # REST API Route Handlers
│       ├── admissions/                  # /register, /login, /status
│       ├── payments/campay/             # /collect, /status, /webhook
│       ├── chat/                        # /chat (AI NLP assistant & dossier lookups)
│       ├── reviews/                     # /reviews (GET public, POST new review)
│       ├── contact/                     # /contact (Direct inquiry submission)
│       └── admin/                       # /admin/auth, /admin/stats, /admin/applications
├── components/                          # Shared React UI components
│   ├── Header.tsx                       # Site header, mobile slide-over drawer, Ctrl+K hotkey
│   ├── HeaderSearch.tsx                 # Floating transparent search modal with outside click
│   ├── Footer.tsx                       # Multi-column footer, social icons, admin portal link
│   ├── ChatWidget.tsx                   # Floating AI assistant with in-chat MoMo payment & dossier
│   └── BackToTop.tsx                    # Floating smooth-scroll back to top component
├── data/                                # Data stores and logs
│   ├── liah_academy_store.json          # Master atomic JSON datastore
│   ├── email_notifications.log          # Email delivery ledger & diagnostic logs
│   └── backups/                         # Automated timestamped database backups
├── public/                              # Static public assets
│   └── assets/
│       ├── images/                      # High-res logos, team photos, flyer banners
│       └── videos/                      # Campus video showcase, E1/E2 workshop recordings
├── package.json                         # Node dependencies and build scripts
├── tsconfig.json                        # TypeScript compiler configuration
├── next.config.mjs                      # Next.js bundler settings & image optimization rules
└── DOCUMENTATION.md                     # Technical architecture documentation
```

---

## 4. DATABASE DESIGN & DATA PERSISTENCE LAYER

### 4.1 Relational Database Schema (MySQL)

-- 1. Students / Admissions Table
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  degree VARCHAR(100) NOT NULL,
  program VARCHAR(255) NOT NULL,
  format VARCHAR(50) DEFAULT 'oncampus',
  cohort VARCHAR(100) DEFAULT 'Fall 2026 / Spring 2027',
  qualification VARCHAR(100) DEFAULT 'GCE Advanced Level',
  statement TEXT,
  admission_status ENUM('Pending Review', 'Approved', 'Rejected', 'Enrolled') DEFAULT 'Pending Review',
  payment_status ENUM('Pending', 'Pending Verification', 'Paid', 'Failed', 'Rejected') DEFAULT 'Pending',
  payment_amount DECIMAL(12,2) DEFAULT 0.00,
  payment_proof_url TEXT,
  payment_transaction_id VARCHAR(255),
  document_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Contact Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status ENUM('unread', 'read', 'archived') DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Student Reviews & Testimonials Table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  rating INT NOT NULL CHECK(rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  avatar VARCHAR(255) DEFAULT '/assets/images/logo.png',
  approved TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Financial & Mobile Money Transactions Table
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reference VARCHAR(255) NOT NULL UNIQUE,
  student_id INT,
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'XAF',
  phone_number VARCHAR(50) NOT NULL,
  operator VARCHAR(50),
  status ENUM('PENDING', 'PENDING_VERIFICATION', 'APPROVED', 'PAID', 'FAILED', 'REJECTED') DEFAULT 'PENDING',
  description VARCHAR(255),
  proof_url TEXT,
  transaction_id VARCHAR(255),
  verified_by VARCHAR(255),
  verified_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL
);

### 4.2 JSON Dual-Layer Fallback Mechanism
If the MySQL server is temporarily offline or undergoing migration, the system automatically falls back to `data/liah_academy_store.json`. All read/write transactions are locked and written atomically to prevent data corruption.

---

## 5. PAYMENT ARCHITECTURE: DIRECT MOBILE MONEY (670265493) & PROOF VERIFICATION

```
[ Student / Applicant ]              [ Liah Portal ]                   [ Admin Verification Studio ]
      |                                    |                                        |
      | 1. Fill Admission Form             |                                        |
      +----------------------------------->|                                        |
      |                                    |                                        |
      | 2. Follow Dial Directives          |                                        |
      |    • MTN: *126# -> 670265493       |                                        |
      |    • Orange: #150# -> 670265493    |                                        |
      +------------------------------------+                                        |
      |                                    |                                        |
      | 3. Upload Payment Screenshot       |                                        |
      +----------------------------------->| 4. POST /api/payments/upload-proof     |
      |                                    |    Status: 'Pending Verification'      |
      |                                    +--------------------------------------->|
      |                                    |                                        | 5. Review Screenshot Dossier
      |                                    |                                        |    & Validate Bank/MoMo Funds
      |                                    |    6. PUT /api/admin/payments          |
      |                                    |<---------------------------------------+
      |                                    |    Status: 'Paid' & 'Approved'         |
      | 7. Admission Approved & Verified   |                                        |
      |<-----------------------------------+                                        |
```

### 5.1 Step-by-Step Payment & USSD Directives
1. **Target Account**: **`670 265 493`** (Liah Academy Official Account).
2. **MTN MoMo Directive**: Dial `*126#` ➔ Transfer money (1) ➔ To MTN number (1) ➔ Enter `670265493` ➔ Enter Amount ➔ Enter Ref (`LIAH-<StudentID>`) ➔ Authorize with PIN.
3. **Orange Money Directive**: Dial `#150#` ➔ Transfer money (1) ➔ To Orange number (1) ➔ Enter `670265493` ➔ Enter Amount ➔ Authorize with PIN.
4. **Proof Upload**: Student takes a screenshot of the transaction SMS / app screen and submits via `/api/payments/upload-proof`.
5. **Administrative Clearance**: The Admin verifies the proof with 1-click on `/admin`, which updates student records in real time and approves admission.

### 5.2 Real-Time Polling & Webhook Handling
- **Active Polling**: The frontend initiates polling against `GET /api/payments/campay/status?reference={ref}` every 3,000ms.
- **Webhook Endpoint**: `POST /api/payments/campay/webhook` processes server-to-server asynchronous status callbacks signed with `CAMPAY_WEBHOOK_KEY`.
- **Database Reconciliation**: Upon confirmation, the student's record is marked `Paid` or `Deposit Paid`, and the admission status is set to `Approved`.

---

## 6. AI CHATBOT ENGINE & CONTEXT ARCHITECTURE

Located at `app/api/chat/route.ts` and rendered via `components/ChatWidget.tsx`:

### Features:
1. **Deterministic Intent Classifier**:
   - Matches payment intents (`pay`, `fee`, `tuition`, `registration`, `momo`, `orange money`) and yields `actionType: 'payment_form'`.
   - Matches status queries (`status`, `check my application`, email regex, ID `#2011`) and yields `actionType: 'status_card'`.
2. **Context Knowledge Base**:
   - Full catalog of HND, ND, and Certification tracks with exact credit loads and tuition figures.
   - Campus facts: Bakweri Town Buea location, high-speed fiber Wi-Fi, 24/7 security, housing assistance.
   - Direct escalation pathways to human admissions officers on WhatsApp (`+237 652 154 095`).

---

## 7. REST API ENDPOINTS SPECIFICATION

### 7.1 Admissions & Authentication APIs

#### `POST /api/admissions/register`
Submits a prospective student application.
- **Request Body**:
  ```json
  {
    "fullname": "John Doe",
    "email": "johndoe@example.com",
    "phone": "+237652154095",
    "degree": "HND",
    "program": "Software Engineering HND",
    "format": "oncampus",
    "cohort": "Fall 2024",
    "qualification": "GCE Advanced Level",
    "statement": "Passionate about software."
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "studentId": 2011,
    "message": "Registration successful! Your application has been logged."
  }
  ```

#### `POST /api/admissions/login`
Authenticates a student into the Student Portal.
- **Request Body**: `{ "email": "johndoe@example.com", "studentId": "2011" }`
- **Response (200 OK)**: `{ "success": true, "student": { ... } }`

---

### 7.2 Payment & Financial APIs

#### `POST /api/payments/campay/collect`
Initiates a Mobile Money USSD prompt.
- **Request Body**:
  ```json
  {
    "amount": 10000,
    "phoneNumber": "237677123456",
    "description": "Registration Fee - John Doe",
    "studentId": 2011
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "reference": "CAMPAY_REF_892348923",
    "operator": "MTN",
    "message": "USSD prompt dispatched. Please check your phone."
  }
  ```

#### `GET /api/payments/campay/status?reference={reference}`
Retrieves real-time status of a transaction.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "status": "SUCCESSFUL",
    "amount": 10000,
    "reference": "CAMPAY_REF_892348923"
  }
  ```

---

### 7.3 Chat & Intelligence APIs

#### `POST /api/chat`
Handles AI queries and returns formatted conversational replies + action cards.
- **Request Body**: `{ "message": "I want to pay my registration fee", "history": [...] }`
- **Response (200 OK)**:
  ```json
  {
    "reply": "I can help you pay your registration fee (10,000 XAF) via MTN MoMo or Orange Money...",
    "actionType": "payment_form",
    "data": { "defaultAmount": 10000, "reason": "Registration Fee" }
  }
  ```

---

## 8. SECURITY & ACCESS CONTROL

1. **Administrative Access Protection**:
   - Administrative routes (`/admin`, `/api/admin/*`) require valid session verification.
   - Unauthenticated requests are rejected with `HTTP 401 Unauthorized`.
2. **Cross-Site Scripting (XSS) Mitigation**:
   - React JSX automatic encoding prevents script injection.
   - User inputs in chat and inquiry forms are sanitized before rendering.
3. **SQL Injection Prevention**:
   - All database queries use parameterized placeholders (`?`) via the `mysql2` driver.
4. **Payment Integrity**:
   - Webhook payloads are verified against the cryptographic secret `CAMPAY_WEBHOOK_KEY`.
   - Transactions cannot be marked successful without server-side validation against Campay's verification endpoint.

---

## 9. ENVIRONMENT VARIABLES & CONFIGURATION

The system uses `.env.local` and `.env` for production configuration:

```env
# Application Host & Environment
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Institutional Identity
INSTITUTION_NAME="Liah Academy"
INSTITUTION_EMAIL=info@liahacademy.com
INSTITUTION_PHONE="+237 652 154 095"

# Administrator Security
ADMIN_PIN=2024

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=liah_db

# Campay Mobile Money Gateway
CAMPAY_ENV=demo
CAMPAY_APP_ID=your_campay_app_id
CAMPAY_USERNAME=your_campay_username
CAMPAY_PASSWORD=your_campay_password
CAMPAY_PERMANENT_ACCESS_TOKEN=your_campay_token
CAMPAY_WEBHOOK_KEY=your_webhook_key
```

---

## 10. BUILD, DEPLOYMENT & MAINTENANCE PROCEDURES

### Development Mode:
```bash
npm run dev
```

### Production Build:
```bash
npm run build
```

### Launching Production Daemon:
```bash
npm run start
```

### System Health Diagnostic Check:
To run the automated 33-point system diagnostic test suite:
```bash
node scratch/comprehensive_system_check.js
```

---
*Liah Academy Technical Documentation © 2024–2026. Buea, Cameroon.*
