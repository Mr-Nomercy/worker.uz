# 🧩 Component Architecture

This document outlines the **Modular UI Philosophy** used in the Worker frontend. All components are designed for reusability, accessibility, and seamless integration with the Next.js App Router.

---

## 🎨 Philosophy

### Core Principles

1. **Single Responsibility** — Each component does one thing well
2. **Composition over Configuration** — Build complex UIs from simple parts
3. **Type Safety** — All components are fully typed with TypeScript
4. **Zero External Dependencies** — Pure React + Tailwind CSS (no UI libraries)

---

## 📦 Component Categories

### 🧭 Navigation Components

| Component | Purpose | Location |
|-----------|---------|----------|
| `AdminSidebar.tsx` | Dark-themed sidebar for admin routes | `/admin/*` |
| `Sidebar.tsx` | Light-themed sidebar for candidate/employer | `/candidate/*`, `/employer/*` |
| `Header.tsx` | Top navigation with notification dropdown | All authenticated pages |

### 📊 Dashboard Components

| Component | Purpose |
|-----------|---------|
| `WelcomeSection.tsx` | Personalized greeting with role info |
| `MetricsCard.tsx` | Statistics display card |
| `JobCard.tsx` | Job vacancy listing with details modal |
| `CandidateCard.tsx` | Candidate profile with match score |
| `MatchScore.tsx` | Circular progress ring for AI match % |
| `OfficialCVCard.tsx` | Government-verified CV display |
| `SoftSkillsSection.tsx` | Editable soft skills for candidates |

### 🪟 Modal Components

All modals follow a consistent pattern:
- `"use client"` directive for interactivity
- Fixed positioning with backdrop blur
- Escape key and click-outside to close
- Smooth enter/exit animations

| Component | Purpose |
|-----------|---------|
| `JobDetailsModal.tsx` | View job details & apply |
| `ScheduleInterviewModal.tsx` | Schedule new interview |
| `RescheduleModal.tsx` | Reschedule existing interview |
| `ViewNotesModal.tsx` | View/edit candidate notes |
| `VacancyModal.tsx` | Create/edit vacancy |
| `CompanyDocsModal.tsx` | View company verification docs |
| `AuditDetailsModal.tsx` | View audit log details |

### 🔔 Feedback Components

| Component | Purpose |
|-----------|---------|
| `Toast.tsx` | Success/error/info notifications |

---

## 🔧 Component Patterns

### Modal Pattern

```tsx
"use client";

import { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  // ...other props
}

export function SomeModal({ isOpen, onClose, ...props }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
        {/* ...modal content */}
      </div>
    </div>
  );
}
```

### Card Pattern

```tsx
interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function JobCard({ title, children, className }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}
```

### State Management Pattern

```tsx
// Parent component manages state
const [selectedJob, setSelectedJob] = useState<Job | null>(null);

// Pass to child
<JobCard 
  job={job} 
  onClick={() => setSelectedJob(job)} 
/>

{selectedJob && (
  <JobDetailsModal 
    job={selectedJob} 
    isOpen={!!selectedJob}
    onClose={() => setSelectedJob(null)}
  />
)}
```

---

## 🎯 Usage Examples

### Using JobCard with Modal

```tsx
import { JobCard } from "@/components/JobCard";
import { JobDetailsModal } from "@/components/JobDetailsModal";

export default function JobsPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  return (
    <div className="grid gap-4">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onClick={() => setSelectedJob(job)}
        />
      ))}

      <JobDetailsModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
}
```

### Using Toast Notifications

```tsx
import { Toast } from "@/components/Toast";

export function MyComponent() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleAction = () => {
    setToast({ message: "Operation successful!", type: "success" });
  };

  return (
    <>
      <button onClick={handleAction}>Submit</button>
      <Toast
        message={toast?.message || ""}
        type={toast?.type || "success"}
        isVisible={!!toast}
        onClose={() => setToast(null)}
      />
    </>
  );
}
```

---

## 🎨 Tailwind Patterns

### Color Tokens (tailwind.config.ts)

```ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          // ...
          600: "#0ea5e9", // Primary Blue
          700: "#0284c7",
        },
        verified: {
          green: "#10b981", // Verified/Success
        },
      },
    },
  },
};
```

### Common Classes

| Pattern | Usage |
|---------|-------|
| `bg-white rounded-2xl border border-slate-200` | Card container |
| `px-4 py-2 bg-primary-600 text-white rounded-xl` | Primary button |
| `text-slate-900 font-semibold` | Heading text |
| `text-slate-500 text-sm` | Secondary text |
| `flex items-center gap-3` | Icon + text layout |

---

## ✅ Best Practices

1. **Always use `"use client"`** for components using hooks (`useState`, `useEffect`)
2. **Define TypeScript interfaces** before component definitions
3. **Use `@/components/` alias** for imports
4. **Keep components under 200 lines** — split if necessary
5. **Test interactions** — modals, toasts, form submissions

---

## 📁 Component Index

```
src/components/
├── AdminSidebar.tsx           # Admin navigation
├── Sidebar.tsx               # Candidate/Employer navigation
├── Header.tsx                # Top header
├── JobCard.tsx               # Job listing
├── JobDetailsModal.tsx       # Job details
├── CandidateCard.tsx        # Candidate profile
├── MatchScore.tsx            # AI match ring
├── ScheduleInterviewModal.tsx
├── RescheduleModal.tsx
├── ViewNotesModal.tsx
├── VacancyModal.tsx
├── Toast.tsx
├── OfficialCVCard.tsx
├── SoftSkillsSection.tsx
├── CompanyDocsModal.tsx
├── AuditDetailsModal.tsx
├── WelcomeSection.tsx
└── MetricsCard.tsx
```

---

<p align="center">
  <strong>Built for National Scale — Component by Component</strong>
</p>
