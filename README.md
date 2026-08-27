# 🎓 Liah Academy — Higher Institute of Technology & Software Engineering Division

<div align="center">

![Liah Academy](public/assets/images/logo.png)

**Bakweri Town, Buea, Southwest Region, Republic of Cameroon**  
*Academic Excellence • Corporate Software Innovation • Practical Laboratory Training*

[![Next.js](https://img.shields.io/badge/Next.js-14.2.24-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://react.js.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Campay Mobile Money](https://img.shields.io/badge/Payments-Campay%20(MTN%20%26%20Orange)-F5A623?style=for-the-badge)](https://campay.net/)

[🌐 Official Website](https://liahacademy.com) • [📖 User Manual](./USER_MANUAL.md) • [🛠️ Technical Documentation](./DOCUMENTATION.md) • [💬 WhatsApp Admissions](https://wa.me/237652154095)

</div>

---

## 📌 About Liah Academy

**Liah Academy** is an accredited higher institute of technology and corporate software engineering division situated in **Bakweri Town, Buea, Cameroon**. 

Combining intensive hands-on lab practicals with corporate software engineering internships, Liah Academy empowers students and professionals to become world-class software engineers, cybersecurity specialists, DevOps architects, and tech entrepreneurs.

---

## ✨ Core Platform Capabilities

### 🎓 1. Academic Pathways & Curriculum Explorer
- **Accredited Higher National Diplomas (HND)**: Software Engineering, Network & Security, Database Systems, Human Resource Management, Accounting & Finance.
- **National Diplomas (ND) & Professional Certifications**: Full-Stack Web Development, Cloud DevOps Engineering, Mobile App Development, Cybersecurity Operations.
- **Flexible Study Formats**: Full-Time On-Campus, 100% Online (**15% discount**), and Evening/Weekend Part-Time (**10% discount**).
- **Interactive Course Search**: Instant search with format filter chips and clear buttons.

### 💰 2. Tuition Fee & Installment Calculator
- Real-time computation of tuition fees, registration costs, and format discounts.
- Transparent payment schedules: **Full Lump-Sum**, **2 Installments**, or **3 Installments**.

### 📝 3. 3-Step Online Application Wizard
- Streamlined digital admissions process capturing personal details, educational qualifications (GCE A/L, Baccalauréat), and career goals.
- Instant issuance of verified **Student IDs (e.g. #2011)** and automated confirmation emails.

### 📱 4. Instant Mobile Money Payment Gateway (Campay)
- Direct USSD push payments on **MTN Cameroon Mobile Money (MoMo)** and **Orange Money (OM)**.
- Settle application fees (10,000 XAF), seat deposits (50,000 XAF), or semester installments with instant on-screen digital receipt generation.
- Automated real-time transaction polling and signed webhook reconciliation.

### 🤖 5. LiahBot AI Academic Assistant
- Intelligent natural language assistant equipped with the complete academy knowledge base.
- **In-Chat Payments**: Initiates Mobile Money transactions directly inside conversation threads.
- **Real-Time Dossier Verification**: Checks admission and payment statuses by email or Student ID.

### 🔒 6. Protected Administrative Portal (`/admin`)
- PIN-secured management console for registrars and academy directors.
- Student application review, admission status toggling (`Pending Review`, `Approved`, `Enrolled`), financial verification, inquiry response center, and testimonial moderation.

### 📱 7. Responsive Mobile-First Design
- Optimized across all viewports (320px smartphones to 4K displays).
- Frosted glass slide-over navigation drawer, floating search capsule (`Ctrl+K` / `⌘K`), and floating back-to-top controls.

---

## 🏗️ Architecture & Technology Stack

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

| Layer | Component |
| :--- | :--- |
| **Framework** | Next.js 14.2.24 (App Router, Server Actions, Route Handlers) |
| **Frontend** | React 18.3.1, TypeScript 5.7.3, Vanilla CSS3 Variables, Lucide Icons |
| **Graphics** | OGL 1.0.11 (Interactive WebGL Canvas) |
| **Database** | MySQL 8.0+ / MariaDB (`mysql2`), Atomic JSON Store Fallback |
| **Payments** | Campay Mobile Money Gateway (MTN Cameroon & Orange Cameroon) |
| **Email** | Nodemailer 9.0.5 (SMTP + file-based diagnostic ledger) |

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js** v18.17+ or v20+
- **npm** or **pnpm**
- **MySQL / MariaDB** (Optional: the system automatically operates with atomic JSON fallback if MySQL is offline)

### 1. Clone the Repository
```bash
git clone https://github.com/Steadfast0001/Liah-Academy.git
cd "Liah Academy"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create `.env.local` or configure `.env`:
```env
PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Institutional Identity
INSTITUTION_NAME="Liah Academy"
INSTITUTION_EMAIL=info@liahacademy.com
INSTITUTION_PHONE="+237 652 154 095"

# Administrator Security PIN
ADMIN_PIN=2024

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=liah_db

# Campay Mobile Money Gateway
CAMPAY_ENV=demo
CAMPAY_APP_ID=your_app_id
CAMPAY_USERNAME=your_username
CAMPAY_PASSWORD=your_password
CAMPAY_PERMANENT_ACCESS_TOKEN=your_token
CAMPAY_WEBHOOK_KEY=your_webhook_key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build & Start
```bash
npm run build
npm run start
```

### 6. Run System Diagnostic Check
```bash
node scratch/comprehensive_system_check.js
```

---

## 📂 Project Structure

```
d:\Liah Academy\
├── app/                                 # Next.js App Router root
│   ├── layout.tsx                       # Global HTML layout, metadata, BackToTop, ChatWidget
│   ├── globals.css                      # Master CSS variables, responsive typography & layouts
│   ├── page.tsx                         # Landing homepage (Hero slider, video showcase, reviews)
│   ├── degree-programs/page.tsx         # Degree catalog, filter pills, syllabus & inquiry modals
│   ├── admissions/page.tsx              # 3-step application wizard, student portal, calculator
│   ├── about/page.tsx                   # Institutional leadership, partnerships, news highlights
│   ├── student-experience/page.tsx      # Video workshops, lab amenities, interactive FAQ
│   ├── contact/page.tsx                 # Campus contact info, WhatsApp action, inquiry form
│   ├── admin/page.tsx                   # Protected administrative control dashboard
│   └── api/                             # REST API Route Handlers
│       ├── admissions/                  # /register, /login, /status
│       ├── payments/campay/             # /collect, /status, /webhook
│       ├── chat/                        # /chat (AI NLP assistant & dossier lookups)
│       ├── reviews/                     # /reviews (GET public, POST new review)
│       ├── contact/                     # /contact (Direct inquiry submission)
│       └── admin/                       # /admin/auth, /admin/stats, /admin/applications
├── components/                          # Reusable React components
│   ├── Header.tsx                       # Site header, mobile slide-over drawer, Ctrl+K hotkey
│   ├── HeaderSearch.tsx                 # Floating transparent search modal with outside click
│   ├── Footer.tsx                       # Multi-column footer, social icons, admin portal link
│   ├── ChatWidget.tsx                   # Floating AI assistant with in-chat MoMo payment & dossier
│   └── BackToTop.tsx                    # Floating smooth-scroll back to top component
├── data/                                # Data persistence and logs
│   ├── liah_academy_store.json          # Master atomic JSON datastore
│   └── email_notifications.log          # Email delivery ledger & diagnostic logs
├── lib/                                 # Shared utilities & database clients
│   ├── db.ts                            # Hybrid MySQL/JSON database abstraction layer
│   ├── campay.ts                        # Campay payment gateway integration helper
│   ├── email.ts                         # Nodemailer SMTP transport & template engine
│   ├── auth.ts                          # Administrator authentication & session tokens
│   └── constants.ts                     # Institutional branding constants
├── public/assets/                       # Static media, images, flyers, and campus videos
├── USER_MANUAL.md                       # Comprehensive User Guide for Students & Staff
├── DOCUMENTATION.md                     # Technical Architecture & REST API Documentation
└── README.md                            # Primary Project Documentation
```

---

## 📖 Documentation Suite

- 📘 **[User Manual (USER_MANUAL.md)](./USER_MANUAL.md)** — Complete step-by-step instructions for prospective students, enrolled candidates, and administrative staff.
- 🛠️ **[System Architecture & API Specification (DOCUMENTATION.md)](./DOCUMENTATION.md)** — Detailed technical specification of database schemas, REST APIs, payment webhooks, and security protocols.

---

## 📞 Institutional Contacts

- **Campus Address**: Bakweri Town, Buea, Southwest Region, Republic of Cameroon
- **Official Email**: [info@liahacademy.com](mailto:info@liahacademy.com)
- **Telephone / WhatsApp**: [+237 652 154 095](https://wa.me/237652154095) / +237 699 526 607
- **Official Website**: [liahacademy.com](https://liahacademy.com)

---

<div align="center">

**Liah Academy © 2024–2026. All Rights Reserved.**  
*Forging Cameroon's Next Generation of Technology Leaders.*

</div>
