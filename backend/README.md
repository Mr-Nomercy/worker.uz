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

Worker Backend is a **production-ready** RESTful API built with **Node.js**, **Express**, and **Prisma ORM**. It powers the **Worker.uz** GovTech employment platform with secure authentication, job management, AI-powered matching, and comprehensive admin analytics.

---

## 🏗️ Architecture

```
backend/
├── prisma/
│   ├── schema.prisma    # Database schema & models
│   └── seed.ts         # Development seed data
├── src/
│   ├── controllers/    # Request handlers
│   │   ├── auth.controller.ts       # Login, register, logout
│   │   ├── job.controller.ts        # Job CRUD
│   │   ├── application.controller.ts# Application flow
│   │   └── admin.controller.ts      # Metrics & management
│   ├── services/
│   │   └── matching.service.ts     # AI matching algorithm
│   ├── middleware/
│   │   ├── auth.middleware.ts     # JWT verification
│   │   └── errorHandler.ts       # Global errors
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── job.routes.ts
│   │   ├── application.routes.ts
│   │   ├── admin.routes.ts
│   │   └── matching.routes.ts
│   └── utils/
│       ├── prisma.ts             # Singleton client
│       └── apiResponse.ts        # Response helpers
├── index.ts                 # Express entry
├── test-api.sh              # Verification script
└── package.json
```

---

## 🔌 Prisma Singleton Pattern

We use a **singleton pattern** to prevent database connection exhaustion during development:

```typescript
// src/utils/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma ?? 
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
```

**Benefits:**
- Prevents multiple PrismaClient instances in dev
- Reduces database connections
- Improves performance

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
cd backend
npm install
cp .env.example .env
```

### Configuration

Edit `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/worker_db?schema=public"
JWT_SECRET=your-secret-key
PORT=3001
```

### Database Setup

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### Start Server

```bash
npm run dev
```

API: **http://localhost:3001**

---

## 🗄️ Database Schema

### Models & Relationships

| Model | Description | Relationships |
|-------|-------------|--------------|
| **User** | Auth & roles | 1:1 Profile, 1:1 Company |
| **Profile** | Verified candidate data | Locked fields (education, work) |
| **Company** | Employer profile | 1:m Jobs |
| **Job** | Vacancies | m:1 Company, 1:m Applications |
| **Application** | Job applications | m:1 Job, m:1 User |
| **Interview** | Scheduled interviews | 1:m Application |
| **AuditLog** | Action traceability | User actions |
| **AIConfig** | Matching settings | Singleton |

---

## 🔐 Security Implementation

### JWT Authentication

- **Algorithm**: HS256
- **Expiration**: 7 days
- **Storage**: Client localStorage

```typescript
// Token generation
const token = jwt.sign(
  { userId: user.id, role: user.role },
  JWT_SECRET,
  { expiresIn: '7d' }
);

// Token verification (middleware)
const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
```

### Password Hashing

- **Library**: bcryptjs
- **Rounds**: 12

### Role-Based Access

| Role | Access |
|------|--------|
| **CANDIDATE** | View jobs, apply, my applications |
| **EMPLOYER** | Post jobs, view candidates, interviews |
| **ADMIN** | Metrics, verification, audit logs |

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | User login | ❌ |
| POST | `/api/auth/register` | New candidate | ❌ |
| GET | `/api/auth/me` | Current user | ✅ |

### Jobs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/jobs` | List jobs | ✅ |
| GET | `/api/jobs/:id` | Job details | ✅ |
| POST | `/api/jobs` | Create job | ✅ Employer |
| PATCH | `/api/jobs/:id` | Update job | ✅ Owner |
| DELETE | `/api/jobs/:id` | Delete job | ✅ Owner |

### Applications

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/applications` | Apply for job | ✅ Candidate |
| GET | `/api/applications/my-applications` | My apps | ✅ Candidate |
| GET | `/api/applications/job/:jobId` | Job applicants | ✅ Employer |
| PATCH | `/api/applications/:id/status` | Update status | ✅ Employer |
| DELETE | `/api/applications/:id` | Withdraw | ✅ Candidate |

### AI Matching

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/matching/jobs` | Matched jobs for candidate | ✅ Candidate |
| GET | `/api/matching/candidates/:jobId` | Matched candidates | ✅ Employer |

### Admin

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/metrics` | System metrics | ✅ Admin |
| GET | `/api/admin/audit-logs` | Action logs | ✅ Admin |
| GET | `/api/admin/companies` | Company list | ✅ Admin |
| PATCH | `/api/admin/companies/:id/verify` | Verify company | ✅ Admin |
| GET | `/api/admin/ai-config` | AI settings | ✅ Admin |
| PATCH | `/api/admin/ai-config` | Update AI | ✅ Admin |

---

## 🤖 AI Matching Algorithm

### Skill-Based Scoring Formula

The algorithm calculates **compatibility score (0-100%)** based on skill overlap:

$$
\text{Match Score} = \left( \frac{|\text{Matched Skills}|}{|\text{Job Requirements}|} \right) \times 100
$$

### Implementation

```typescript
// matching.service.ts
async calculateMatchScore(jobId: string, candidateId: string) {
  const job = await prisma.job.findUnique({ 
    where: { id: jobId },
    select: { requirements: true }
  });
  
  const candidate = await prisma.user.findUnique({
    where: { id: candidateId },
    include: { profile: true }
  });

  const candidateSkills = candidate.profile.softSkills || [];
  const jobRequirements = job.requirements || [];

  const matchedSkills = jobRequirements.filter(req =>
    candidateSkills.some(skill =>
      skill.toLowerCase().includes(req.toLowerCase()) ||
      req.toLowerCase().includes(skill.toLowerCase())
    )
  );

  const score = jobRequirements.length > 0
    ? Math.round((matchedSkills.length / jobRequirements.length) * 100)
    : 0;

  return {
    candidateId,
    jobId,
    score: Math.min(score, 100),
    matchedSkills,
    missingSkills: jobRequirements.filter(r => !matchedSkills.includes(r))
  };
}
```

### Example Response

```json
{
  "candidateId": "usr_abc123",
  "jobId": "job_xyz789",
  "score": 85,
  "matchedSkills": ["React", "TypeScript", "Node.js"],
  "missingSkills": ["Python"]
}
```

---

## 🧪 Testing

### Run Test Script

```bash
chmod +x test-api.sh
./test-api.sh
```

### Manual Testing

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@worker.uz","password":"password123"}'

# Get metrics
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/admin/metrics
```

---

## 📦 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Candidate | aziz.karimov@example.com | password123 |
| Employer | hr@techcorp.uz | password123 |
| Admin | admin@worker.uz | password123 |

---

## 🛡️ Error Handling

All errors return consistent JSON:

```json
{
  "success": false,
  "error": "Human-readable message",
  "code": "ERROR_CODE"
}
```

### Common Codes

| Code | Status | Description |
|------|--------|--------------|
| `DUPLICATE_ENTRY` | 400 | Unique constraint |
| `RECORD_NOT_FOUND` | 404 | Not found |
| `UNAUTHORIZED` | 401 | Auth required |
| `FORBIDDEN` | 403 | No permission |

---

## 📄 License

MIT License — see the [root LICENSE](../LICENSE) file.

---

<p align="center">
  <strong>Part of the Worker GovTech Employment Ecosystem</strong>
</p>
