# 🎓 Liah Academy — Higher Institute of Technology & Software Engineering Division

<div align="center">

![Liah Academy](public/assets/images/logo.png)

**Bakweri Town, Buea, Southwest Region, Republic of Cameroon**  
*Academic Excellence • Corporate Software Innovation • Practical Laboratory Training*

[![Next.js](https://img.shields.io/badge/Next.js-14.2.24-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://react.js.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![MTN MoMo](https://img.shields.io/badge/Payments-MTN%20Mobile%20Money-FFCC00?style=for-the-badge&logoColor=black)](https://www.mtn.cm/)

[🌐 Official Website](https://liahacademy.com) • [📖 User Manual](./USER_MANUAL.md) • [🛠️ Technical Documentation](./DOCUMENTATION.md) • [💬 WhatsApp Admissions](https://wa.me/237652154095)

</div>

---

## 📌 About Liah Academy

**Liah Academy** is an accredited higher institute of technology and corporate software engineering division situated in **Bakweri Town, Buea, Cameroon**. 

Combining intensive hands-on lab practicals with corporate software engineering internships, Liah Academy empowers students and professionals to become world-class software engineers, cybersecurity specialists, DevOps architects, and tech entrepreneurs.

---

## ✨ Core Platform Capabilities

### 🎓 1. Academic Pathways & Curriculum Explorer
- **Accredited Higher National Diplomas (HND)**: Software Engineering, Cybersecurity & Cloud Defense, Network and Maintenance, Web & Graphics Design, Digital Marketing & E-Commerce.
- **National Diplomas (ND) & Professional Certifications**: Full-Stack Web Development, Cloud DevOps Engineering, Mobile App Development, Cybersecurity Operations.
- **Interactive Course Search**: Instant search with department filter tabs and quick clear controls.

### 💰 2. Transparent Institutional Tuition Schedule
- Fixed, transparent pricing across all diploma and professional certification tracks.
- Direct Mobile Money checkout with zero hidden fees.

### 📝 3. 3-Step Online Application Wizard
- Streamlined digital admissions process capturing personal details, educational qualifications (GCE A/L, Baccalauréat), and career goals.
- Instant issuance of verified **Student IDs (e.g. #2011)** and automated confirmation emails.

### 📱 4. MTN Mobile Money Instant Short Code (`*126*14*670265493*Amount#`)
- Direct USSD execution on **MTN Cameroon Mobile Money (MoMo)** via `*126*14*670265493*Amount#`.
- Seamless 1-click **OK** trigger that launches the short code on the student's phone, prompting for their **Secret PIN** to validate and conclude the payment.
- Settle application fees (10,000 XAF) or tuition with instant screenshot upload and admin audit.

### 🤖 5. LiahBot AI Academic Assistant
- Intelligent natural language assistant equipped with the complete academy knowledge base.
- **In-Chat Short Code Execution**: Generates live `*126*14*670265493*Amount#` payment cards directly inside chat threads.
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
        |   Admissions & Auth    |  | MTN MoMo Receipts  |  |   AI Chat Assistant  |
        |  Application Service   |  |  (Proof / Upload)  |  |    (LiahBot NLP)     |
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
| **Payments** | MTN Mobile Money (MoMo Directives & Proof Verification) |
| **Email** | Nodemailer 9.0.5 (SMTP + file-based diagnostic ledger) |

---

## 🚀 Quick Start & Installation Guide

Anyone cloning the repository can get the application fully running in less than 2 minutes:

### Prerequisites
- **Node.js** v18.17+ or v20+
- **npm**, **yarn**, or **pnpm**
- **MySQL 8.0+ / MariaDB** (Optional: the system automatically operates with zero-config atomic storage if MySQL is offline)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/Steadfast0001/Liah-Academy.git
cd Liah-Academy
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run Automated Environment & Database Setup
```bash
npm run setup
```
> *This automatically generates your `.env.local` configuration from `.env.example` and initializes the local data store with default courses, news, media, and demo accounts.*

### Step 4: (Optional) MySQL Database Setup
If using MySQL / phpMyAdmin:
1. Create database: `liah_db`
2. Import the schema: [`data/schema.sql`](./data/schema.sql)
3. Ensure `MYSQL_HOST`, `MYSQL_USER`, and `MYSQL_PASSWORD` are set in `.env.local`.

### Step 5: Launch the Application

**Development Server**:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

**Production Build**:
```bash
npm run build
npm run start
```

---

## 🔑 Default Platform Credentials

| Portal | Access URL | Default Identifier | Default Password | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **🛡️ Master Admin Portal** | [`/admin`](http://localhost:3000/admin) | `info@liahacademy.com` | `LiahAdmin2026!#` | SuperAdmin (Dossiers, Bulk Deletes, Payment Proof Review, Settings) |
| **🎓 Student Portal** | [`/admissions`](http://localhost:3000/admissions) | `student@liahacademy.com` | `Student2026!#` | Student Dashboard (Status, MoMo Payment Directives, Receipt Upload) |
| **🗄️ MySQL Database** | `localhost:3306` | `root` | *(None / Blank)* | Full Database Access (`liah_db`) |

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
│       ├── payments/upload-proof/       # /upload-proof (MTN MoMo receipt verification)
│       ├── chat/                        # /chat (AI NLP assistant & dossier lookups)
│       ├── reviews/                     # /reviews (GET public, POST new review)
│       ├── contact/                     # /contact (Direct inquiry submission)
│       └── admin/                       # /admin/auth, /admin/stats, /admin/applications
├── components/                          # Reusable React components
│   ├── Header.tsx                       # Site header, mobile slide-over drawer, Ctrl+K hotkey
│   ├── HeaderSearch.tsx                 # Floating transparent search modal with outside click
│   ├── Footer.tsx                       # Multi-column footer, social icons, admin portal link
│   ├── ChatWidget.tsx                   # Floating AI assistant with MTN MoMo payment directives
│   └── BackToTop.tsx                    # Floating smooth-scroll back to top component
├── data/                                # Data persistence and logs
│   ├── liah_academy_store.json          # Master atomic JSON datastore
│   └── email_notifications.log          # Email delivery ledger & diagnostic logs
├── lib/                                 # Shared utilities & database clients
│   ├── db.ts                            # Hybrid MySQL/JSON database abstraction layer
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
