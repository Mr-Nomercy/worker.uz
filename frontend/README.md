# 🖥️ Worker Frontend — Next.js 14 Web Application

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/App_Router-000000?style=for-the-badge&logo=react&logoColor=white" alt="App Router" />
  <img src="https://img.shields.io/badge/Heroicons-000000?style=for-the-badge&logo=heroicons&logoColor=white" alt="Heroicons" />
</p>

---

## 📋 Overview

The **Worker Frontend** is a production-ready Next.js 14 application that delivers a seamless, role-based experience for three distinct user types: Candidates, Employers, and Administrators. Built with the **App Router** architecture, it leverages server components for optimal performance while maintaining full interactivity through client-side hooks.

The design follows a **GovTech aesthetic** — professional, trustworthy, and accessible — using a color palette centered on Trust Blue (#0ea5e9) and Verified Green (#10b981).

---

## ✨ Key Features

### 👤 Candidate Dashboard

| Feature | Description |
|---------|-------------|
| **OneID Login** | Secure authentication simulating state-issued digital identity |
| **Official CV** | Government-verified credentials (education, experience, certifications) — immutable |
| **AI Job Matches** | Intelligent algorithm ranking vacancies by skill relevance |
| **Application Tracker** | Real-time status: Applied → Reviewing → Interview → Offer |
| **Profile Settings** | Edit soft skills and portfolio; official data remains locked |

### 🏢 Employer Dashboard

| Feature | Description |
|---------|-------------|
| **Company Verification** | Only government-registered businesses can operate |
| **Vacancy Management** | Full CRUD for job postings with salary ranges |
| **AI Candidate Search** | Ranked candidate recommendations with match scores |
| **Interview Scheduler** | Schedule, reschedule, and manage interviews |
| **Candidate Notes** | Private evaluation notes during review |

### 🛡️ Admin Dashboard

| Feature | Description |
|---------|-------------|
| **System Overview** | Real-time metrics: users, vacancies, placements |
| **User Audit Logs** | Complete action traceability for accountability |
| **Company Verification** | Manual review/approval of employer registrations |
| **AI Engine Config** | Fine-tune matching thresholds and parameters |
| **Reports & Analytics** | Hiring trends, sector distribution, platform health |

---

## 🏗️ Tech Stack Justification

### Why Next.js 14 App Router?

| Benefit | Impact |
|---------|--------|
| **Server Components** | Reduced JavaScript bundle, faster initial load |
| **File-Based Routing** | Intuitive URL structure, nested layouts |
| **SEO Optimization** | Server-rendered pages for search visibility |
| **API Routes** | Built-in backend functionality without separate server |
| **Static & Dynamic** | Mix of static export and server-side rendering |

### Why TypeScript?

| Benefit | Impact |
|---------|--------|
| **Type Safety** | Compile-time error detection prevents runtime bugs |
| **IDE Support** | IntelliSense, refactoring, and navigation |
| **Self-Documenting** | Interfaces serve as living documentation |
| **Scalability** | Easy to maintain as codebase grows |

---

## 📂 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── login/              # Authentication page
│   │   ├── admin/              # Admin dashboard routes
│   │   │   ├── page.tsx        # Overview
│   │   │   ├── audit/          # User audit logs
│   │   │   ├── companies/      # Company verification
│   │   │   ├── ai-config/      # AI engine settings
│   │   │   └── reports/        # System reports
│   │   ├── candidate/          # Candidate dashboard
│   │   │   ├── page.tsx        # Dashboard
│   │   │   ├── cv/             # Official CV
│   │   │   ├── matches/        # AI job matches
│   │   │   ├── applications/   # My applications
│   │   │   └── settings/       # Profile settings
│   │   ├── employer/           # Employer dashboard
│   │   │   ├── page.tsx        # Dashboard
│   │   │   ├── profile/        # Company profile
│   │   │   ├── vacancies/      # Manage vacancies
│   │   │   ├── matches/        # AI candidates
│   │   │   └── interviews/     # Interview schedule
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Root redirect
│   │   └── globals.css         # Global styles
│   │
│   ├── components/             # Reusable UI components
│   │   ├── AdminSidebar.tsx    # Admin navigation (dark)
│   │   ├── Sidebar.tsx         # Candidate/Employer nav
│   │   ├── Header.tsx          # Top header with notifications
│   │   ├── JobCard.tsx         # Job listing cards
│   │   ├── CandidateCard.tsx   # Candidate profile cards
│   │   ├── MatchScore.tsx      # Circular AI match indicator
│   │   ├── JobDetailsModal.tsx # Job details + apply
│   │   ├── ScheduleInterviewModal.tsx
│   │   ├── RescheduleModal.tsx
│   │   ├── ViewNotesModal.tsx
│   │   ├── VacancyModal.tsx
│   │   ├── Toast.tsx           # Toast notifications
│   │   ├── OfficialCVCard.tsx  # Verified CV display
│   │   ├── SoftSkillsSection.tsx
│   │   ├── CompanyDocsModal.tsx
│   │   ├── AuditDetailsModal.tsx
│   │   ├── WelcomeSection.tsx
│   │   └── MetricsCard.tsx
│   │
│   └── lib/                    # Utilities & data
│       ├── mockData.ts         # Centralized mock data
│       └── utils.ts            # Helper functions (cn())
│
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies
└── next.config.mjs             # Next.js configuration
```

---

## 🚀 Getting Started

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 🎨 Design System

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#0ea5e9` | Trust Blue — CTAs, links, highlights |
| Verified | `#10b981` | Success states, verified badges |
| Slate | `#0f172a` | Dark backgrounds, text |
| Surface | `#ffffff` | Cards, modals |

### Typography

- **Headings**: Inter Bold
- **Body**: Inter Regular/Medium
- **Monospace**: JetBrains Mono (for codes)

---

## 🤝 Contributing

See the root [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT License — see the root [LICENSE](../LICENSE) file.

---

<p align="center">
  <strong>Part of the Worker GovTech Ecosystem</strong>
</p>
