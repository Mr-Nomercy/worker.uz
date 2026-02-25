# 🏛️ Worker Backend — PostgreSQL + Prisma

This directory contains the backend API for the Worker GovTech platform, using **PostgreSQL** as the database and **Prisma ORM** for type-safe database operations.

---

## 📋 Prerequisites

- PostgreSQL 14+ installed
- Node.js 18+ installed

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://postgres:password@localhost:5432/worker_db"
```

### 3. Run Migrations

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# OR create a migration (for production)
npm run db:migrate
```

### 4. Seed Database

```bash
npm run db:seed
```

This populates the database with:
- 3 candidate users
- 3 employer users (with companies)
- 1 admin user
- 4 jobs/vacancies
- 5 applications
- 3 interviews
- Audit logs & notifications

### 5. Start Development Server

```bash
npm run dev
```

---

## 🗄️ Database Schema

### Models

| Model | Description |
|-------|-------------|
| **User** | Authentication, roles (CANDIDATE/EMPLOYER/ADMIN), state ID |
| **Profile** | Government-verified data (locked) + editable fields |
| **Company** | Employer business profile with tax ID |
| **Job** | Vacancy listings |
| **Application** | Candidate → Job applications |
| **Interview** | Scheduled interviews |
| **AuditLog** | Action traceability |
| **Notification** | User notifications |
| **AIConfig** | Matching algorithm settings |

### Relationships

```
User (1:1) → Profile
User (1:1) → Company (if Employer)
User (1:m) → Application
User (1:m) → Interview
Company (1:m) → Job
Job (1:m) → Application
Application (1:m) → Interview
```

---

## 🔐 State Verification

The schema enforces **immutable** verified data:

- `Profile.educationHistory` — Locked (verified via My.gov.uz)
- `Profile.workHistory` — Locked (verified via My.gov.uz)
- `User.pinfl` — Unique state ID
- `User.passportSeries` — Unique passport
- `Company.taxId` — Unique STIR

Editable fields:
- `Profile.phoneNumber`
- `Profile.softSkills`
- `Profile.portfolioLinks`

---

## 🧪 Testing Credentials

After seeding, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Candidate | aziz.karimov@example.com | password123 |
| Employer | hr@techcorp.uz | password123 |
| Admin | admin@worker.uz | password123 |

---

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts         # Seed script
├── src/
│   └── index.ts        # Express server (to be created)
├── .env.example        # Environment template
├── package.json
└── tsconfig.json
```

---

## 🔧 Common Commands

```bash
# Reset database
npx prisma migrate reset

# Open Prisma Studio (GUI)
npm run db:studio

# Generate migration
npx prisma migrate dev --name init
```

---

<p align="center">
  <strong>Part of the Worker GovTech Ecosystem</strong>
</p>
