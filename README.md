# 🏛️ Worker.uz — Unified GovTech Employment Ecosystem

<p align="center">
  <img src="https://img.shields.io/badge/Monorepo-Architecture-0ea5e9?style=for-the-badge" alt="Monorepo" />
  <img src="https://img.shields.io/badge/Status-Production_Ready-10b981?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/License-MIT-6366f1?style=for-the-badge" alt="License" />
</p>

---

## 🎯 Vision

**Worker.uz** is a national-scale GovTech employment platform designed to transform how governments connect verified citizens with registered employers. By leveraging **state-verified identity data** (OneID/My.gov.uz style), the platform eliminates hiring bias, reduces nepotism, and ensures that every job opportunity reaches qualified candidates through a transparent, AI-powered matching system.

---

## ✅ Current Project Status

| Component | Status | Technology |
|-----------|--------|------------|
| **Frontend** | ✅ Production Ready | Next.js 14, Tailwind CSS, TypeScript |
| **Backend** | ✅ Production Ready | Express, Prisma, PostgreSQL |
| **AI Matching** | ✅ Implemented | Gemini 1.5 Flash + Skill-based scoring |
| **Authentication** | ✅ Secure | JWT + Bcrypt |
| **Database** | ✅ PostgreSQL | Prisma ORM |
| **Docker** | ✅ Ready | Docker Compose |

---

## 🤖 AI Matching Formula

The platform uses an intelligent matching algorithm that calculates compatibility between job requirements and candidate profiles:

```
Score = (max(1, Total Requirements) / Skills Match) × 100
```

### Algorithm Details:
- **Total Requirements**: Number of skills/requirements specified in the job posting
- **Skills Match**: Number of matching skills found in the candidate's profile
- **Match Sensitivity**: Configurable threshold (default: 75%)
- **Minimum Score**: Jobs with score below 60% are filtered out
- **AI Enhancement**: Gemini 1.5 Flash provides contextual career advice in Uzbek

---

## 🏗️ Architecture

```
worker.uz/
├── 📂 frontend/          # Next.js 14 Web Application
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/# Reusable UI components (CVUpload, AICounselor, etc.)
│   │   └── lib/       # API client, hooks, utilities
│   ├── Dockerfile
│   └── package.json
│
├── 📂 backend/        # Express + Prisma API
│   ├── src/
│   │   ├── controllers/  # Business logic (auth, jobs, profile, AI)
│   │   ├── services/    # AI matching, Gemini integration
│   │   ├── middleware/  # JWT auth, error handling
│   │   └── routes/      # API endpoints
│   ├── prisma/        # Database schema
│   ├── Dockerfile
│   └── .env
│
├── 📂 docker-compose.yml
└── README.md
```

---

## ✨ Core Features

### 🔐 Authentication & Security
- **JWT Bearer Tokens** with 7-day expiration
- **Bcrypt Password Hashing** (12 rounds)
- **Role-Based Access Control**: Candidate, Employer, Admin
- **Global Error Handling** with user-friendly messages
- **Offline Mode**: Graceful degradation with cached data

### 👤 Candidate Portal
- OneID-style government verification simulation
- Official CV with locked/verified data fields
- **CV Upload** (PDF only, max 10MB)
- AI-Powered Job Matching with match scores
- Real-time Application Tracking

### 🏢 Employer Portal
- Company Verification System (Tax ID / STIR)
- Full Vacancy Management (CRUD)
- AI Candidate Search & Filtering
- Interview Scheduling

### 🛡️ Admin Dashboard
- **Live Metrics**: Total candidates, employers, jobs, applications
- **Audit Logs**: Full action traceability
- **Company Verification**: Approve/reject employers
- **AI Configuration**: Adjustable matching parameters

### 🤖 AI Features
- Gemini 1.5 Flash integration for career counseling
- Uzbek language prompts for local context
- Skill-based compatibility scoring (0-100%)
- Automatic ranking by relevance

---

## 🚀 Installation Guide

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd worker.uz

# Set environment variables
# Edit backend/.env with your Google API key for AI features
GOOGLE_API_KEY="your-gemini-api-key"

# Build and run all services
docker-compose up -d --build

# Check status
docker-compose ps
```

**Services:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 2: Local Development

#### Prerequisites

- Node.js 18+
- PostgreSQL 14+

#### Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # or edit .env directly
# Edit .env with your database credentials and Google API key

npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit **http://localhost:3000**

---

## 📡 API Documentation

### Base URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001/api |

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email/password |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout |

### Jobs Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | List all jobs (with filters) |
| POST | `/api/jobs` | Create new job (Employer) |
| GET | `/api/jobs/:id` | Get job details |
| PATCH | `/api/jobs/:id` | Update job |
| DELETE | `/api/jobs/:id` | Delete job |

### Applications Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications` | Apply for a job |
| GET | `/api/applications/my-applications` | Get my applications |
| PATCH | `/api/applications/:id/status` | Update application status |

### Matching Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/matching/jobs` | Get matched jobs for candidate |
| GET | `/api/matching/candidates/:jobId` | Get matched candidates for job |
| GET | `/api/matching/ai-advice/:jobId` | Get AI career advice |

### Profile Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile/me` | Get my profile |
| PATCH | `/api/profile/update` | Update profile |
| POST | `/api/profile/upload-cv` | Upload CV (PDF only) |
| POST | `/api/profile/upload-logo` | Upload company logo |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/metrics` | Get platform metrics |
| GET | `/api/admin/audit-logs` | Get audit logs |
| GET | `/api/admin/companies` | List companies |
| PATCH | `/api/admin/companies/:id/verify` | Verify company |
| GET | `/api/admin/ai-config` | Get AI configuration |
| PATCH | `/api/admin/ai-config` | Update AI configuration |

---

## 🧪 Testing Credentials

| Role | Email | Password |
|------|-------|----------|
| Candidate | aziz.karimov@example.com | password123 |
| Employer | hr@techcorp.uz | password123 |
| Admin | admin@worker.uz | password123 |

---

## 📁 Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://postgres:0000@localhost:5432/worker_db?schema=public
JWT_SECRET=your-jwt-secret
GOOGLE_API_KEY=your-gemini-api-key
PORT=3001
NODE_ENV=development
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

### Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 📄 License

MIT License — see the [LICENSE](LICENSE) file.

---

<p align="center">
  <strong>Built for the citizens of tomorrow 🇺🇿</strong>
</p>
