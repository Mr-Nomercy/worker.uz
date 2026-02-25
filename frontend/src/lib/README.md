# 📚 Data Layer — Mock Data Strategy

This document explains the **Mock Data Architecture** in Worker, how it simulates real State API responses, and the TypeScript interfaces that ensure type safety throughout the application.

---

## 🏗️ Overview

The Worker frontend uses a centralized **mock data layer** to simulate responses from government APIs (OneID/My.gov.uz style). This approach enables:

1. **Frontend-First Development** — Build UI without waiting for backend
2. **API Contract Definition** — TypeScript interfaces define the data shape
3. **Easy Migration** — Swap mock functions for real API calls later

---

## 📁 File Structure

```
src/lib/
├── mockData.ts    # All mock data & TypeScript interfaces
└── utils.ts       # Helper utilities (cn() class merger)
```

---

## 🔐 Simulating State APIs

### OneID Authentication

```typescript
// Mock user authentication
export const mockUsers = [
  {
    id: "usr_001",
    role: "candidate",
    name: "Aziz Karimov",
    email: "aziz.karimov@email.uz",
    oneId: "AA1234567", // Government-issued ID
    verified: true,
    // ...
  },
];
```

### My.gov.uz Data Verification

```typescript
// Government-verified CV data (immutable)
export const mockCVs = [
  {
    id: "cv_001",
    userId: "usr_001",
    // These fields are LOCKED from editing
    fullName: "Aziz Karimov",
    passport: "AB1234567",
    inn: "12345678901234", // Tax ID
    education: [
      {
        institution: "Tashkent State Technical University",
        degree: "Bachelor",
        field: "Computer Science",
        year: 2020,
        verified: true, // Verified via My.gov.uz
      },
    ],
    workExperience: [
      {
        company: "UzbekTech Solutions",
        position: "Software Engineer",
        startDate: "2020-06",
        endDate: "2023-03",
        verified: true,
      },
    ],
    // These fields CAN be edited
    softSkills: ["Leadership", "Communication"],
    portfolio: "https://github.com/azizkarimov",
  },
];
```

---

## 📋 TypeScript Interfaces

### Core Entities

```typescript
// User Roles
type UserRole = "candidate" | "employer" | "admin";

// Base User
interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  oneId: string;
  verified: boolean;
  avatar?: string;
}

// Candidate-specific
interface Candidate extends User {
  role: "candidate";
  cv?: CV;
  matches: JobMatch[];
  applications: Application[];
}

// Employer-specific
interface Employer extends User {
  role: "employer";
  company: Company;
  vacancies: Vacancy[];
}

// Government-verified CV
interface CV {
  id: string;
  userId: string;
  fullName: string;
  passport: string;
  inn: string;
  phone: string;
  address: string;
  education: Education[];
  workExperience: WorkExperience[];
  certifications: Certification[];
  softSkills: string[];
  portfolio?: string;
  createdAt: string;
  updatedAt: string;
}

// Verified Company
interface Company {
  id: string;
  name: string;
  registrationNumber: string;
  verified: boolean;
  industry: string;
  size: string;
  description: string;
  website: string;
  logo?: string;
  documents: CompanyDocument[];
}

// Job Vacancy
interface Vacancy {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requirements: string[];
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  location: string;
  type: "full-time" | "part-time" | "contract";
  status: "open" | "closed" | "draft";
  applicants: number;
  createdAt: string;
}

// AI Match Result
interface JobMatch {
  jobId: string;
  candidateId: string;
  score: number; // 0-100
  matchedSkills: string[];
  missingSkills: string[];
}

// Application Status
type ApplicationStatus = 
  | "applied" 
  | "reviewing" 
  | "interview" 
  | "offer" 
  | "rejected" 
  | "withdrawn";

interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  notes?: string;
}

// Interview
interface Interview {
  id: string;
  applicationId: string;
  scheduledAt: string;
  duration: number; // minutes
  type: "video" | "phone" | "onsite";
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  notes?: string;
}
```

---

## 📊 Mock Data Collections

### Current Data Sets

| Collection | Records | Description |
|------------|---------|-------------|
| `mockUsers` | 8 | Users across all roles |
| `mockCandidates` | 5 | Candidate profiles |
| `mockEmployers` | 3 | Employer/company profiles |
| `mockCVs` | 5 | Government-verified CVs |
| `mockVacancies` | 12 | Job postings |
| `mockApplications` | 15 | Application records |
| `mockInterviews` | 8 | Scheduled interviews |
| `mockAuditLogs` | 20 | Admin audit trail |
| `mockCompanies` | 5 | Company profiles |
| `mockNotifications` | 6 | User notifications |

---

## 🔄 Migration Strategy

### Phase 1: Current (Mock)

```typescript
// src/lib/api.ts
import { mockVacancies } from "./mockData";

export async function getVacancies(): Promise<Vacancy[]> {
  return mockVacancies;
}
```

### Phase 2: Real API

```typescript
// src/lib/api.ts
export async function getVacancies(): Promise<Vacancy[]> {
  const res = await fetch("/api/vacancies");
  return res.json();
}
```

### Benefits

| Aspect | Mock | Real |
|--------|------|------|
| Development Speed | ✅ Instant | ❌ Waiting |
| API Contract | ✅ Defined | ✅ Defined |
| Data Accuracy | ⚠️ Static | ✅ Live |
| Testing | ✅ Predictable | ⚠️ Variable |

---

## 🛠️ Utility Functions

### Class Name Merger (cn)

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage
<div className={cn(
  "base-class",
  isActive && "active-class",
  variant === "primary" && "bg-primary-600"
)} />
```

---

## ✅ Best Practices

1. **Centralize all data** in `mockData.ts`
2. **Define interfaces** before mock data
3. **Use strict typing** — avoid `any`
4. **Match API response structure** — prepare for easy migration
5. **Include verification flags** — simulate state verification

---

## 📈 Future Integration

When backend is ready:

1. Create `src/lib/api.ts` with real fetch calls
2. Replace mock imports with API functions
3. Add loading/error states in components
4. Implement React Query or SWR for caching

---

<p align="center">
  <strong>Type-Safe Data — From Mock to Production</strong>
</p>
