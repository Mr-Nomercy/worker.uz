# 🏛️ Worker — Unified GovTech Employment Ecosystem

<p align="center">
  <img src="https://img.shields.io/badge/Monorepo-Architecture-0ea5e9?style=for-the-badge" alt="Monorepo" />
  <img src="https://img.shields.io/badge/Status-Production_Ready-10b981?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/License-MIT-6366f1?style=for-the-badge" alt="License" />
</p>

---

## 🎯 Vision

**Worker** is a national-scale GovTech employment platform designed to transform how governments connect verified citizens with registered employers. By leveraging **state-verified identity data** (OneID/My.gov.uz style), the platform eliminates hiring bias, reduces nepotism, and ensures that every job opportunity reaches qualified candidates through a transparent, AI-powered matching system.

---

## ✅ Current Project Status

| Component | Status | Technology |
|-----------|--------|-------------|
| **Frontend** | ✅ Production Ready | Next.js 14, Tailwind CSS, TypeScript |
| **Backend** | ✅ Production Ready | Express, Prisma, PostgreSQL |
| **AI Matching** | ✅ Implemented | Skill-based scoring algorithm |
| **Authentication** | ✅ Secure | JWT + Bcrypt |
| **Database** | ✅ Local PostgreSQL | Prisma ORM |

---

## 🏗️ Architecture

```
worker.uz/
├── 📂 frontend/          # Next.js 14 Web Application
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/# Reusable UI components
│   │   └── lib/       # API client, hooks, utilities
│   └── package.json
│
└── 📂 backend/        # Express + Prisma API
    └── src/
        ├── controllers/  # Business logic
        ├── services/    # AI matching
        ├── middleware/  # Auth & errors
        └── routes/      # API endpoints
```

---

## ✨ Core Features

### 🔐 Authentication & Security
- **JWT Bearer Tokens** with 7-day expiration
- **Bcrypt Password Hashing** (12 rounds)
- **Role-Based Access Control**: Candidate, Employer, Admin
- **Global Error Handling** with user-friendly messages

### 👤 Candidate Portal
- OneID-style government verification simulation
- Official CV with locked/verified data fields
- AI-Powered Job Matching with match scores
- Real-time Application Tracking

### 🏢 Employer Portal
- Company Verification System
- Full Vacancy Management (CRUD)
- AI Candidate Search & Filtering
- Interview Scheduling

### 🛡️ Admin Dashboard
- **Live Metrics**: Total candidates, employers, jobs, applications
- **Audit Logs**: Full action traceability
- **Company Verification**: Approve/reject employers
- **AI Configuration**: Adjustable matching parameters

### 🤖 AI Matching Algorithm
- Skill-based compatibility scoring (0-100%)
- Smart matching between job requirements and candidate profiles
- Automatic ranking by relevance

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit **http://localhost:3000**

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials

npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

API runs at **http://localhost:3001**

---

## 📡 API Documentation

| Service | Base URL |
|---------|----------|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001/api |

### Key Endpoints

| Feature | Endpoint |
|---------|----------|
| Login | POST `/api/auth/login` |
| Jobs | GET/POST `/api/jobs` |
| Matching | GET `/api/matching/jobs` |
| Admin Metrics | GET `/api/admin/metrics` |

---

## 🧪 Testing Credentials

| Role | Email | Password |
|------|-------|----------|
| Candidate | aziz.karimov@example.com | password123 |
| Employer | hr@techcorp.uz | password123 |
| Admin | admin@worker.uz | password123 |

---

## 📄 License

MIT License — see the [LICENSE](LICENSE) file.

---

<p align="center">
  <strong>Built for the citizens of tomorrow 🇺🇿</strong>
</p>
