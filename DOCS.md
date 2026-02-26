# 📚 Worker.uz Technical Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [Audit Logging System](#audit-logging-system)
5. [Real-time Notifications](#real-time-notifications)
6. [Authentication Flow](#authentication-flow)

---

## Architecture Overview

### Frontend (Next.js 14)
- **App Router** - Modern routing with layouts
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Context API** - State management

### Backend (Express)
- **REST API** - Standard HTTP endpoints
- **Prisma ORM** - Database access layer
- **Socket.io** - Real-time communication
- **JWT** - Authentication

---

## Database Schema

### Core Models

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  role          UserRole  @default(CANDIDATE)
  pinfl         String?   @unique  // Government ID
  isVerified    Boolean   @default(false)
  profile       Profile?
  company       Company?
  createdAt     DateTime  @default(now())
}

model Profile {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  fullName        String
  phoneNumber     String?
  softSkills     String[]
  educationHistory Json?
  workHistory    Json?
  cvUrl          String?
  isVerified     Boolean  @default(false)
}

model ContactRequest {
  id          String              @id @default(cuid())
  employerId   String
  candidateId  String
  status      ContactRequestStatus @default(PENDING)
  createdAt   DateTime            @default(now())
}

model AuditLog {
  id          String   @id @default(cuid())
  userId      String?
  action      String
  entityType  String
  entityId    String
  details     Json?
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())
}
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|--------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user |

### Jobs
| Method | Endpoint | Description |
|--------|----------|--------------|
| GET | `/api/jobs` | List jobs (with filters) |
| POST | `/api/jobs` | Create job (Employer) |
| GET | `/api/jobs/:id` | Job details |

### Matching
| Method | Endpoint | Description |
|--------|----------|--------------|
| GET | `/api/matching/search-candidates` | Search candidates (masked) |
| GET | `/api/matching/candidate-contact-by-request/:id` | Get contact (requires approval) |
| POST | `/api/matching/request/:candidateId` | Request contact access |
| POST | `/api/matching/accept/:requestId` | Accept contact request |

### Admin
| Method | Endpoint | Description |
|--------|----------|--------------|
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET | `/api/admin/audit-logs` | Security audit logs |
| PATCH | `/api/admin/companies/:id/verify` | Verify company |

---

## Audit Logging System

### Purpose
Tracks all security-sensitive actions for compliance and debugging.

### Tracked Actions
```typescript
const AuditActions = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  REVEAL_PHONE: 'REVEAL_PHONE',
  SEARCH_CANDIDATES: 'SEARCH_CANDIDATES',
  CONTACT_REQUEST: 'CONTACT_REQUEST',
  CONTACT_REQUEST_ACCEPT: 'CONTACT_REQUEST_ACCEPT',
  VERIFY_COMPANY: 'VERIFY_COMPANY',
  // ... more
};
```

### Usage in Routes

```typescript
import { createAuditLogFromRequest, AuditActions } from '../utils/auditLog';

// In any route handler:
await createAuditLogFromRequest(
  req,
  AuditActions.REVEAL_PHONE,
  'CANDIDATE',
  candidateId,
  { candidateName: 'John Doe' }
);
```

### Viewing Logs
Admin can view audit logs at `/admin/audit` with:
- Action type filtering
- Date range filtering
- User filtering
- Pagination

---

## Real-time Notifications

### Socket.io Setup

**Server (backend/src/socket/socket.ts):**
```typescript
io.on('connection', (socket) => {
  const userId = socket.data.userId;
  socket.join(userId); // Join personal room
  
  socket.on('disconnect', () => {
    // Handle disconnect
  });
});

// Send notification to specific user
io.to(userId).emit('new_notification', notification);
```

**Client (frontend/src/lib/useSocket.ts):**
```typescript
const { notifications } = useSocket();

// Listen for notifications
useEffect(() => {
  if (notifications.length > 0) {
    showToast(notifications[0].message);
  }
}, [notifications]);
```

### Events
- `new_notification` - When user receives a notification

---

## Authentication Flow

### Login
1. User submits email/password
2. Server validates credentials
3. Server generates JWT token
4. Client stores token in localStorage
5. Subsequent requests include `Authorization: Bearer <token>`

### Protected Routes
```typescript
// Backend middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  // Verify token...
  req.user = decoded;
  next();
};

// Frontend ProtectedRoute
<ProtectedRoute allowedRoles={['ADMIN']}>
  <AdminPanel />
</ProtectedRoute>
```

---

## i18n (Internationalization)

### Supported Languages
- 🇺🇿 Uzbek (uz)
- 🇷🇺 Russian (ru)

### Translation Files
- `frontend/messages/uz.json`
- `frontend/messages/ru.json`

### Usage
```typescript
import { useTranslation } from "@/lib/useTranslation";

const { t } = useTranslation();
return <h1>{t("nav.dashboard")}</h1>;
```

---

## Security Best Practices

1. **Passwords** - Never store plain text, use bcrypt
2. **Tokens** - Short-lived access tokens
3. **Validation** - Zod schemas for all inputs
4. **Audit** - Log all sensitive actions
5. **CORS** - Whitelist allowed origins
6. **Rate Limiting** - Prevent API abuse

---

## Deployment

### Docker
```bash
docker-compose up -d
```

### Manual
```bash
# Backend
cd backend
npm install
npm run build
npm start

# Frontend
cd frontend
npm install
npm run build
npm start
```

---

*Last Updated: February 2026*
