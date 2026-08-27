# 🎓 Liah Academy — Higher Institute of Technology & Software Engineering

[![Next.js](https://img.shields.io/badge/Next.js-14.2.24-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue?style=flat-square&logo=react)](https://react.js.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Campay Mobile Money](https://img.shields.io/badge/Payments-Campay%20(MTN%20%26%20Orange)-F5A623?style=flat-square)](https://campay.net/)
[![License](https://img.shields.io/badge/License-Proprietary-081F3E?style=flat-square)]()

> **Liah Academy** is a practical technology institute and enterprise software engineering center based in **Bakweri Town, Buea, Southwest Region, Cameroon**.  
> The web application provides a comprehensive digital admissions portal, interactive tuition & installment calculator, real-time Mobile Money payment clearing (MTN MoMo & Orange Money), AI Academic Assistant, and an administrative management dashboard.

---

## 📚 Complete System Documentation

| Document | Description |
| :--- | :--- |
| 📖 **[User Manual (USER_MANUAL.md)](./USER_MANUAL.md)** | Step-by-step guide for Prospective Students, Applicants, and Administrative Staff covering course browsing, registration wizard, student portal, Mobile Money payments, AI chat, and admin portal. |
| 🛠️ **[System Architecture & Technical Documentation (DOCUMENTATION.md)](./DOCUMENTATION.md)** | Technical specification covering system architecture, Next.js App Router structure, MySQL & JSON persistence, Campay payment gateway APIs, AI bot NLP engine, and security controls. |

---

## ⚡ Quick Start & Development

### Prerequisites
- **Node.js** v18.17+ or v20+
- **npm** or **pnpm**
- **MySQL 8.0+** / **MariaDB** (optional, automatic JSON store fallback included)

### 1. Installation
```bash
git clone https://github.com/Steadfast0001/Liah-Academy.git
cd "Liah Academy"
npm install
```

### 2. Configure Environment Variables
Create `.env.local` or edit `.env`:
```env
PORT=3000
ADMIN_PIN=2024
CAMPAY_ENV=demo
CAMPAY_PERMANENT_ACCESS_TOKEN=your_campay_token
CAMPAY_WEBHOOK_KEY=your_webhook_key
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🌟 Key Platform Features

- **Degree Catalog & Curriculum Explorer**: Real-time course filtering across HND, National Diplomas, and Professional Certifications with instant search.
- **Tuition & Installment Calculator**: Real-time fee breakdowns with format discounts (Online 15% discount, Evening/Part-Time 10% discount).
- **3-Step Online Application Wizard**: Streamlined admissions form with instant Student ID issuance.
- **Verified Student Portal (`/admissions#portal`)**: Check admission status (`Approved`, `Pending Review`) and financial clearance.
- **Campay Mobile Money Checkout**: Instant USSD payment prompts on Cameroon MTN MoMo and Orange Money phones.
- **LiahBot AI Academic Assistant**: In-chat payment forms, instant student dossier lookup, and admissions guidance.
- **Protected Administrator Portal (`/admin`)**: PIN-protected dashboard for admissions review, payment approvals, inquiry management, and testimonial moderation.
- **Responsive Across All Devices**: Optimized from 320px mobile smartphones up to 4K displays with a frosted mobile slide-over navigation drawer.

---

## 📞 Institutional Contacts & Support
- **Campus Address**: Bakweri Town, Buea, Southwest Region, Cameroon
- **Email**: [info@liahacademy.com](mailto:info@liahacademy.com)
- **WhatsApp Admissions**: [+237 652 154 095](https://wa.me/237652154095)
- **Official Website**: [liahacademy.com](https://liahacademy.com)

---
*Liah Academy © 2024–2026. All Rights Reserved.*
