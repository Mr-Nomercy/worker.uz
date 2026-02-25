# 🖥️ Worker Frontend — Next.js 14 Web Application

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/App_Router-000000?style=for-the-badge&logo=react&logoColor=white" alt="App Router" />
</p>

---

## 📋 Overview

The **Worker Frontend** is a production-ready Next.js 14 application featuring **resilient data fetching**, **graceful degradation**, and a **GovTech-optimized design system**. Built with the App Router architecture, it delivers optimal performance while maintaining full interactivity through client-side hooks.

---

## ✨ Key Features

### 🛡️ Resilience Layer

#### Offline Fallback (Graceful Degradation)
When the backend API is unavailable, the application automatically switches to **mock data** without throwing unhandled exceptions:

```typescript
// In api.ts interceptor
if (!error.response) {
  handleOffline(); // Triggers offline mode
  return Promise.reject({ code: 'NETWORK_ERROR', ... });
}
```

**Components:**
- `DataPlaceholder.tsx` — Skeleton loading animations
- `ErrorState.tsx` — User-friendly error messages with retry
- `OfflineProvider.tsx` — Global offline state management

#### Skeleton UI Components

```typescript
import { DataPlaceholder } from '@/components/DataPlaceholder';

// Table skeleton
<DataPlaceholder type="table" rows={5} />

// Card skeleton  
<DataPlaceholder type="card" rows={4} />
```

### 🎣 Custom API Hook

The `useApi` hook provides centralized error handling and loading states:

```typescript
import { useApi } from '@/lib/useApi';

const { data, loading, error, refetch } = useApi(
  () => matchingApi.getJobMatches(),
  { 
    onError: (err) => toast.error(err.message),
    immediate: true 
  }
);
```

**Features:**
- Automatic loading state management
- Global error interception
- Retry functionality
- Type-safe responses

### 🔐 Authentication Flow

- JWT token storage in localStorage
- Automatic Authorization header injection
- 401 redirect to login on token expiry
- Role-based route protection

---

## 🏗️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | App Router, Server Components |
| **TypeScript** | Type safety, IDE support |
| **Tailwind CSS** | Utility-first styling |
| **Axios** | HTTP client with interceptors |
| **React Hooks** | State management |

---

## 📂 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── login/              # Authentication
│   │   ├── admin/             # Admin dashboard
│   │   ├── candidate/          # Candidate portal
│   │   ├── employer/           # Employer portal
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Redirect
│   │   └── providers.tsx      # Context providers
│   │
│   ├── components/             # Reusable UI
│   │   ├── AdminSidebar.tsx   # Admin navigation
│   │   ├── Sidebar.tsx       # User navigation
│   │   ├── Header.tsx         # Top header
│   │   ├── JobCard.tsx        # Job listings
│   │   ├── CandidateCard.tsx  # Candidate profiles
│   │   ├── MatchScore.tsx     # AI match indicator
│   │   ├── DataPlaceholder.tsx # Skeleton loading
│   │   ├── ErrorState.tsx     # Error display
│   │   ├── Toast.tsx          # Notifications
│   │   └── ...                # Modals, forms
│   │
│   └── lib/                   # Utilities
│       ├── api.ts             # Axios client + interceptors
│       ├── useApi.ts         # Custom data fetching hook
│       ├── mockData.ts       # Offline fallback data
│       └── utils.ts          # Helper functions
│
├── tailwind.config.ts          # Design system
├── .env.example               # Environment template
└── package.json
```

---

## 🚀 Getting Started

### Installation

```bash
cd frontend
npm install
```

### Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit NEXT_PUBLIC_API_URL if backend runs on different port
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Development

```bash
npm run dev
```

Open **http://localhost:3000**

---

## 🔌 API Integration

### Base Configuration

```typescript
// src/lib/api.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
});
```

### Token Interceptor

```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 🎨 Design System

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#0ea5e9` | Trust Blue — CTAs, links |
| Verified | `#10b981` | Success states, badges |
| Slate | `#0f172a` | Dark backgrounds, text |

### Typography

- **Headings**: Inter Bold
- **Body**: Inter Regular/Medium
- **Code**: JetBrains Mono

---

## 🧪 Testing Credentials

| Role | Email | Password |
|------|-------|----------|
| Candidate | aziz.karimov@example.com | password123 |
| Employer | hr@techcorp.uz | password123 |
| Admin | admin@worker.uz | password123 |

---

## 📄 License

MIT License — see the [root LICENSE](../LICENSE) file.

---

<p align="center">
  <strong>Part of the Worker GovTech Ecosystem</strong>
</p>
