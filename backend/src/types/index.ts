export type UserRole = 'CANDIDATE' | 'EMPLOYER' | 'ADMIN';
export type Gender = 'MALE' | 'FEMALE';
export type JobStatus = 'OPEN' | 'CLOSED' | 'DRAFT';
export type ApplicationStatus = 'PENDING' | 'REVIEWING' | 'INTERVIEW' | 'REJECTED' | 'ACCEPTED' | 'WITHDRAWN';
export type InterviewType = 'VIDEO' | 'PHONE' | 'ONSITE';
export type InterviewStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  pinfl: string;
  passportSeries: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  fullName: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  educationHistory: EducationRecord[];
  workHistory: WorkRecord[];
  phoneNumber?: string;
  softSkills: string[];
  portfolioLinks?: PortfolioLink[];
  cvUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EducationRecord {
  institution: string;
  degree: string;
  field: string;
  year: number;
  verified: boolean;
}

export interface WorkRecord {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  verified: boolean;
}

export interface PortfolioLink {
  label: string;
  url: string;
}

export interface Company {
  id: string;
  userId: string;
  name: string;
  taxId: string;
  address: string;
  industry: string;
  website?: string;
  description?: string;
  logoUrl?: string;
  isVerified: boolean;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requirements: string[];
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  location: string;
  jobType: string;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  status: ApplicationStatus;
  matchScore?: number;
  coverLetter?: string;
  appliedAt: Date;
  updatedAt: Date;
}

export interface Interview {
  id: string;
  applicationId: string;
  candidateId: string;
  scheduledAt: Date;
  duration: number;
  type: InterviewType;
  status: InterviewStatus;
  meetingLink?: string;
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

export interface AIConfig {
  id: string;
  matchSensitivity: number;
  minMatchScore: number;
  maxCandidatesPerJob: number;
  automatedVerification: boolean;
  modelVersion: string;
  updatedAt: Date;
}

export interface UserWithRelations extends User {
  profile?: Profile;
  company?: Company;
}

export interface JobWithCompany extends Job {
  company: Company;
}

export interface ApplicationWithDetails extends Application {
  job?: Job;
  candidate?: User;
}

export interface InterviewWithDetails extends Interview {
  application?: Application;
  candidate?: User;
}
