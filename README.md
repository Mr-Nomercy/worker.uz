# 🏛️ Worker — Unified GovTech Employment Ecosystem

<p align="center">
  <img src="https://img.shields.io/badge/Monorepo-Architecture-0ea5e9?style=for-the-badge" alt="Monorepo" />
  <img src="https://img.shields.io/badge/Version-1.0.0-10b981?style=for-the-badge" alt="Version" />
  <img src="https://img.shields.io/badge/License-MIT-6366f1?style=for-the-badge" alt="License" />
</p>

---

## 🌐 Vision

**Worker** is a national-scale GovTech employment platform designed to transform how governments connect verified citizens with registered employers. By leveraging **state-verified identity data** (OneID/My.gov.uz style), the platform eliminates hiring bias, reduces nepotism, and ensures that every job opportunity reaches qualified candidates through a transparent, AI-powered matching system.

This repository serves as a **unified monorepo** for the entire Worker ecosystem, currently containing the production-ready frontend with future modules planned for backend services and AI inference.

---

## 🏗️ Architecture

```
worker.uz/
├── 📂 frontend/          # Next.js 14 Web Application
│   ├── src/
│   │   ├── app/         # App Router pages
│   │   ├── components/  # Reusable UI components
│   │   └── lib/         # Utilities & mock data
│   └── package.json
│
├── 📂 backend/           # (Coming Soon) REST/GraphQL API
│   └── src/
│
└── 📂 ai/               # (Coming Soon) ML Inference Service
    └── src/
```

---

## 🎯 Core Principles

| Principle | Description |
|-----------|-------------|
| **Trust by Default** | All user data is government-verified; impersonation is mathematically impossible |
| **Bias Elimination** | AI matching removes human prejudice from initial candidate screening |
| **Transparency** | Full audit trails for every action in the system |
| **Accessibility** | Mobile-first design ensuring equal access for all citizens |

---

## 🚀 Quick Navigation

| Module | Description | Status |
|--------|-------------|--------|
| [Frontend](./frontend) | Next.js 14 web application with 3 role-based dashboards | ✅ Ready |
| [Backend](./backend) | Node.js/Go API with PostgreSQL | 🔜 Coming Soon |
| [AI](./ai) | Python ML service for candidate matching | 🔜 Coming Soon |

---

## 📦 Current Release

### Frontend v1.0.0 — Production Ready

The **Worker Frontend** is a complete, production-grade Next.js 14 application featuring:

- **🔐 OneID-Style Authentication** — Simulated state-issued digital login
- **👤 Candidate Portal** — Official CV, AI job matches, application tracking
- **🏢 Employer Portal** — Vacancy management, candidate search, interviews
- **🛡️ Admin Portal** — System oversight, company verification, audit logs

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Icons | Heroicons |
| State | React Hooks (useState) |

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.17+
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Mr-Nomercy/worker.uz.git

# Navigate to the project
cd worker.uz

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the platform.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>Built for the citizens of tomorrow 🇺🇿</strong>
</p>
