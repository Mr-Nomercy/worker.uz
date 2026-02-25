# 🏛️ Worker Backend — Express + Prisma API

<p align="center">
  <img src="https://img.shields.io/badge/Node.js_20-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white" alt="JWT" />
</p>

---

## 📋 Overview

Worker Backend is a production-ready RESTful API built with **Node.js**, **Express**, and **Prisma ORM**. It powers the **Worker.uz** GovTech employment platform, providing secure authentication, job management, AI-powered candidate matching, and comprehensive admin analytics.

---

## 🏗️ Architecture

```
backend/
├── prisma/
│   ├── schema.prisma    # Database schema & models
│   └── seed.ts         # Seed data for development
├── src/
│   ├── controllers/    # Request handlers (business logic)
│   │   ├── auth.controller.ts       # Login, register, logout
│   │   ├── job.controller.ts        # Job CRUD operations
│   │   ├── application.controller.ts # Application flow
│   │   └── admin.controller.ts      # Metrics & management
│   ├── services/       # Core business logic
│   │   └── matching.service.ts      # AI matching algorithm
│   ├── middleware/    # Express middleware
│   │   ├── auth.middleware.ts      # JWT verification
│   │   └── errorHandler.ts        # Global error handling
│   ├── routes/       # API route definitions
│   │   ├── auth.routes.ts
│   │   ├── job.routes.ts
│   │   ├── application.routes.ts
│   │   ├── admin.routes.ts
│   │   └── matching.routes.ts
│   └── utils/        # Helper utilities
│       ├── prisma.ts              # Database client (singleton)
│       └── apiResponse.ts         # Response helpers
├── index.ts           # Express server entry point
├── test-api.sh       # API verification script
└── package.json
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
# Clone the repository
git clone https://github.com/Mr-Nomercy/worker.uz.git
cd worker.uz/backend

# Install dependencies
npm install

# Copy environment example
cp .env.example .env
```

### Configuration

Edit `.env` with your database credentials:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/worker_db?schema=public"

# JWT
JWT_SECRET=your-super-secret-key-change-in-production

# Server
PORT=3001
```

### Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with test data
npm run db:seed
```

### Start Development Server

```bash
npm run dev
```

Server runs at: **http://localhost:3001**

---

## 🗄️ Database Schema

### Models & Relationships

| Model | Description | Relationships |
|-------|-------------|--------------|
| **User** | Authentication & roles | 1:1 Profile, 1:1 Company (if Employer) |
| **Profile** | Government-verified candidate data | Locked fields: education, work history |
| **Company** | Employer business profile | 1:m Jobs |
| **Job** | Vacancy listings | m:1 Company, 1:m Applications |
| **Application** | Candidate → Job applications | m:1 Job, m:1 User |
| **Interview** | Scheduled interviews | 1:m Application |
| **AuditLog** | Action traceability | User actions |
| **AIConfig** | Matching algorithm settings | Singleton |

---

## 🔐 Security Implementation

### JWT Authentication

- **Token Type**: Bearer Token
- **Algorithm**: HS256
- **Expiration**: 7 days
- **Storage**: Client localStorage

```typescript
// Token generation on login
const token = jwt.sign(
  { userId: user.id, role: user.role },
  JWT_SECRET,
  { expiresIn: '7d' }
);
```

### Password Hashing

- **Algorithm**: bcryptjs
- **Rounds**: 12

```typescript
// Password hashing
const hash = await bcrypt.hash(password, 12);

// Password verification
const isValid = await bcrypt.compare(password, hash);
```

### Role-Based Access Control

| Role | Access Level |
|------|-------------|
| **CANDIDATE** | View jobs, apply, manage applications |
| **EMPLOYER** | Post jobs, view candidates, manage interviews |
| **ADMIN** | System metrics, user verification, audit logs |

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|---------|------------|--------------|
| POST | `/api/auth/login` | User login | ❌ |
| POST | `/api/auth/register` | New candidate registration | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |

### Jobs

| Method | Endpoint | Description | Auth Required |
|--------|---------|------------|--------------|
| GET | `/api/jobs` | List all jobs (with filters) | ✅ |
| GET | `/api/jobs/:id` | Get job details | ✅ |
| POST | `/api/jobs` | Create new job | ✅ (Employer) |
| PATCH | `/api/jobs/:id` | Update job | ✅ (Owner) |
| DELETE | `/api/jobs/:id` | Delete job | ✅ (Owner) |

### Applications

| Method | Endpoint | Description | Auth Required |
|--------|---------|------------|--------------|
| POST | `/api/applications` | Apply for job | ✅ (Candidate) |
| GET | `/api/applications/my-applications` | My applications | ✅ (Candidate) |
| GET | `/api/applications/job/:jobId` | Applications for job | ✅ (Employer) |
| PATCH | `/api/applications/:id/status` | Update status | ✅ (Employer) |
| DELETE | `/api/applications/:id` | Withdraw application | ✅ (Candidate) |

### AI Matching

| Method | Endpoint | Description | Auth Required |
|--------|---------|------------|--------------|
| GET | `/api/matching/jobs` | Get matched jobs for candidate | ✅ (Candidate) |
| GET | `/api/matching/candidates/:jobId` | Get matched candidates for job | ✅ (Employer) |

### Admin

| Method | Endpoint | Description | Auth Required |
|--------|---------|------------|--------------|
| GET | `/api/admin/metrics` | System-wide metrics | ✅ (Admin) |
| GET | `/api/admin/audit-logs` | Action audit trail | ✅ (Admin) |
| GET | `/api/admin/companies` | List companies | ✅ (Admin) |
| PATCH | `/api/admin/companies/:id/verify` | Verify/reject company | ✅ (Admin) |
| GET | `/api/admin/ai-config` | Get AI settings | ✅ (Admin) |
| PATCH | `/api/admin/ai-config` | Update AI settings | ✅ (Admin) |

---

## 🤖 AI Matching Algorithm

### Skill-Based Scoring Formula

The matching algorithm calculates a **compatibility score (0-100%)** based on skill overlap between job requirements and candidate profile.

$$
\text{Match Score} = \left( \frac{|\text{Matched Skills}|}{|\text{Job Requirements}|} \right) \times 100
$$

### Implementation

```typescript
const matchedSkills = jobRequirements.filter(req =>
  candidateSkills.some(skill =>
    skill.toLowerCase().includes(req.toLowerCase()) ||
    req.toLowerCase().includes(skill.toLowerCase())
  )
);

const score = jobRequirements.length > 0
  ? Math.round((matchedSkills.length / jobRequirements.length) * 100)
  : 0;
```

### Response Format

```json
{
  "candidateId": "usr_123",
  "jobId": "job_456",
  "score": 85,
  "matchedSkills": ["React", "TypeScript", "Node.js"],
  "missingSkills": ["Python"]
}
```

---

## 🧪 Testing

### Run API Tests

```bash
# Make test script executable
chmod +x test-api.sh

# Run all tests
./test-api.sh
```

### Manual Testing with curl

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@worker.uz","password":"password123"}'

# Get metrics (with token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/admin/metrics
```

---

## 📦 Test Credentials

After running `npm run db:seed`:

| Role | Email | Password |
|------|-------|----------|
| Candidate | aziz.karimov@example.com | password123 |
| Employer | hr@techcorp.uz | password123 |
| Admin | admin@worker.uz | password123 |

---

## 🛡️ Error Handling

All errors return consistent JSON format:

```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `DUPLICATE_ENTRY` | 400 | Unique constraint violation |
| `FOREIGN_KEY_ERROR` | 400 | Invalid reference |
| `RECORD_NOT_FOUND` | 404 | Resource not found |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |

---

## 📝 License

MIT License — see the [root LICENSE](../LICENSE) file.

---

<p align="center">
  <strong>Part of the Worker GovTech Employment Ecosystem</strong>
</p>
