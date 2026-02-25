export interface User {
  id: string;
  name: string;
  initials: string;
  role: string;
  email: string;
}

export interface Company {
  id: string;
  name: string;
  initials: string;
  industry: string;
  email: string;
  verified: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  period: string;
  gpa: string;
}

export interface WorkHistory {
  id: string;
  title: string;
  company: string;
  period: string;
  location: string;
}

export interface SoftSkill {
  id: string;
  name: string;
}

export interface PortfolioLink {
  id: string;
  label: string;
  url: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyId: string;
  salary: string;
  location: string;
  description: string;
  requirements: string[];
  matchScore: number;
  skills: string[];
  postedDate: string;
  status: "Active" | "Paused" | "Closed";
  applicants: number;
}

export interface Candidate {
  id: string;
  name: string;
  initials: string;
  role: string;
  location: string;
  skills: string[];
  matchScore: number;
  education: Education;
  workHistory: WorkHistory[];
  color: "primary" | "purple" | "amber";
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
}

export interface Vacancy {
  id: string;
  title: string;
  postedDate: string;
  status: "Active" | "Paused" | "Closed";
  applicants: number;
  salary: string;
  description: string;
}

export const currentUser: User = {
  id: "user-1",
  name: "Aziz",
  initials: "AK",
  role: "Senior Developer",
  email: "aziz.karimov@example.com",
};

export const userProfile = {
  fullName: "Aziz Karimov",
  passport: "AA 1234567",
  pin: "12345678901234",
  education: {
    id: "edu-1",
    institution: "Tashkent University of Information Technologies",
    degree: "Bachelor of Computer Science",
    period: "2015 - 2019",
    gpa: "92%",
  },
  workHistory: [
    {
      id: "work-1",
      title: "Senior Software Developer",
      company: "Uzbektelecom JSC",
      period: "2021 - Present",
      location: "Tashkent",
    },
    {
      id: "work-2",
      title: "Junior Developer",
      company: "Ministry of Digital Technologies",
      period: "2019 - 2021",
      location: "Tashkent",
    },
  ],
  softSkills: [
    { id: "skill-1", name: "Team Leadership" },
    { id: "skill-2", name: "Problem Solving" },
    { id: "skill-3", name: "Communication" },
  ],
  portfolioLinks: [
    { id: "link-1", label: "GitHub", url: "github.com/azizkarimov" },
    { id: "link-2", label: "LinkedIn", url: "linkedin.com/in/azizkarimov" },
  ],
};

export const currentCompany: Company = {
  id: "company-1",
  name: "TechCorp Uzbekistan",
  initials: "TC",
  industry: "IT & Software Development",
  email: "hr@techcorp.uz",
  verified: true,
};

export const jobs: Job[] = [
  {
    id: "job-1",
    title: "Full Stack Developer",
    company: "TechCorp Uzbekistan",
    companyId: "company-1",
    salary: "$2,500",
    location: "Tashkent",
    description: "We are looking for an experienced Full Stack Developer to join our team.",
    requirements: ["3+ years experience", "React", "Node.js", "TypeScript"],
    matchScore: 98,
    skills: ["React", "Node.js", "TypeScript"],
    postedDate: "2 days ago",
    status: "Active",
    applicants: 12,
  },
  {
    id: "job-2",
    title: "Senior Backend Engineer",
    company: "Payme Solutions",
    companyId: "company-2",
    salary: "$3,000",
    location: "Tashkent",
    description: "Join our backend team to build scalable payment solutions.",
    requirements: ["4+ years experience", "Python", "PostgreSQL", "AWS"],
    matchScore: 94,
    skills: ["Python", "PostgreSQL", "AWS"],
    postedDate: "5 days ago",
    status: "Active",
    applicants: 8,
  },
  {
    id: "job-3",
    title: "DevOps Engineer",
    company: "Beeline Uzbekistan",
    companyId: "company-3",
    salary: "$2,800",
    location: "Tashkent",
    description: "Help us build and maintain our cloud infrastructure.",
    requirements: ["3+ years experience", "Kubernetes", "Docker", "CI/CD"],
    matchScore: 89,
    skills: ["Kubernetes", "Docker", "CI/CD"],
    postedDate: "1 week ago",
    status: "Active",
    applicants: 5,
  },
  {
    id: "job-4",
    title: "UI/UX Designer",
    company: "TechCorp Uzbekistan",
    companyId: "company-1",
    salary: "$2,200",
    location: "Tashkent",
    description: "Design beautiful and intuitive user interfaces.",
    requirements: ["2+ years experience", "Figma", "UI Design"],
    matchScore: 75,
    skills: ["Figma", "UI Design", "Prototyping"],
    postedDate: "1 week ago",
    status: "Paused",
    applicants: 15,
  },
];

export const aiCandidates: Candidate[] = [
  {
    id: "candidate-1",
    name: "Aziz Karimov",
    initials: "AK",
    role: "Senior Developer",
    location: "Tashkent",
    skills: ["React", "Node.js", "TypeScript"],
    matchScore: 98,
    color: "primary",
    education: userProfile.education,
    workHistory: userProfile.workHistory,
  },
  {
    id: "candidate-2",
    name: "Sardor Davlatov",
    initials: "SD",
    role: "Backend Engineer",
    location: "Tashkent",
    skills: ["Python", "Django", "PostgreSQL"],
    matchScore: 94,
    color: "purple",
    education: {
      id: "edu-2",
      institution: "Tashkent State Technical University",
      degree: "Bachelor of Software Engineering",
      period: "2014 - 2018",
      gpa: "88%",
    },
    workHistory: [
      {
        id: "work-3",
        title: "Backend Developer",
        company: "Ucell JSC",
        period: "2020 - Present",
        location: "Tashkent",
      },
      {
        id: "work-4",
        title: "Junior Developer",
        company: "Spark JSC",
        period: "2018 - 2020",
        location: "Tashkent",
      },
    ],
  },
  {
    id: "candidate-3",
    name: "Nodir Rakhimov",
    initials: "NR",
    role: "DevOps Engineer",
    location: "Samarkand",
    skills: ["Kubernetes", "Docker", "AWS"],
    matchScore: 89,
    color: "amber",
    education: {
      id: "edu-3",
      institution: "Samarkand State University",
      degree: "Bachelor of Computer Engineering",
      period: "2016 - 2020",
      gpa: "85%",
    },
    workHistory: [
      {
        id: "work-5",
        title: "DevOps Engineer",
        company: "Uztelecom JSC",
        period: "2021 - Present",
        location: "Samarkand",
      },
      {
        id: "work-6",
        title: "System Administrator",
        company: "Samarkand Digital Hub",
        period: "2019 - 2021",
        location: "Samarkand",
      },
    ],
  },
];

export const companyVacancies: Vacancy[] = [
  {
    id: "vacancy-1",
    title: "Full Stack Developer",
    postedDate: "2 days ago",
    status: "Active",
    applicants: 12,
    salary: "$2,500",
    description: "We are looking for an experienced Full Stack Developer.",
  },
  {
    id: "vacancy-2",
    title: "Senior Backend Engineer",
    postedDate: "5 days ago",
    status: "Active",
    applicants: 8,
    salary: "$3,000",
    description: "Join our backend team to build scalable solutions.",
  },
  {
    id: "vacancy-3",
    title: "DevOps Engineer",
    postedDate: "1 week ago",
    status: "Active",
    applicants: 5,
    salary: "$2,800",
    description: "Help us build and maintain cloud infrastructure.",
  },
  {
    id: "vacancy-4",
    title: "UI/UX Designer",
    postedDate: "1 week ago",
    status: "Paused",
    applicants: 15,
    salary: "$2,200",
    description: "Design beautiful user interfaces.",
  },
];

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: "pending" | "interview" | "rejected" | "accepted";
}

export const applications: Application[] = [
  {
    id: "app-1",
    jobId: "job-1",
    jobTitle: "Full Stack Developer",
    company: "TechCorp Uzbekistan",
    appliedAt: "2024-01-15",
    status: "interview",
  },
  {
    id: "app-2",
    jobId: "job-2",
    jobTitle: "Senior Backend Engineer",
    company: "Payme Solutions",
    appliedAt: "2024-01-18",
    status: "pending",
  },
  {
    id: "app-3",
    jobId: "job-3",
    jobTitle: "DevOps Engineer",
    company: "Beeline Uzbekistan",
    appliedAt: "2024-01-10",
    status: "rejected",
  },
  {
    id: "app-4",
    jobId: "job-5",
    jobTitle: "Mobile Developer",
    company: "MyTaxi Uzbekistan",
    appliedAt: "2024-01-20",
    status: "pending",
  },
];

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateInitials: string;
  candidateRole: string;
  jobTitle: string;
  matchScore: number;
  dateTime: string;
  status: "scheduled" | "completed" | "cancelled";
  type: "video" | "phone" | "onsite";
}

export const interviews: Interview[] = [
  {
    id: "interview-1",
    candidateId: "candidate-1",
    candidateName: "Aziz Karimov",
    candidateInitials: "AK",
    candidateRole: "Senior Developer",
    jobTitle: "Full Stack Developer",
    matchScore: 98,
    dateTime: "2024-01-25T10:00:00",
    status: "scheduled",
    type: "video",
  },
  {
    id: "interview-2",
    candidateId: "candidate-2",
    candidateName: "Sardor Davlatov",
    candidateInitials: "SD",
    candidateRole: "Backend Engineer",
    jobTitle: "Senior Backend Engineer",
    matchScore: 94,
    dateTime: "2024-01-26T14:00:00",
    status: "scheduled",
    type: "video",
  },
  {
    id: "interview-3",
    candidateId: "candidate-3",
    candidateName: "Nodir Rakhimov",
    candidateInitials: "NR",
    candidateRole: "DevOps Engineer",
    jobTitle: "DevOps Engineer",
    matchScore: 89,
    dateTime: "2024-01-24T11:00:00",
    status: "completed",
    type: "phone",
  },
  {
    id: "interview-4",
    candidateId: "candidate-4",
    candidateName: "Dilshod Usmonov",
    candidateInitials: "DU",
    candidateRole: "Mobile Developer",
    jobTitle: "Mobile Developer",
    matchScore: 85,
    dateTime: "2024-01-28T09:00:00",
    status: "scheduled",
    type: "onsite",
  },
];

export interface CompanyProfile {
  registrationNumber: string;
  taxId: string;
  legalName: string;
  about: string;
  website: string;
  linkedIn: string;
  facebook: string;
  email: string;
  phone: string;
  address: string;
}

export const companyProfile: CompanyProfile = {
  registrationNumber: "1234567",
  taxId: "IRN-123456789",
  legalName: "TechCorp Uzbekistan LLC",
  about: "TechCorp Uzbekistan is a leading IT company specializing in software development, cloud solutions, and digital transformation services. Founded in 2015, we have helped numerous businesses modernize their operations with cutting-edge technology.",
  website: "https://techcorp.uz",
  linkedIn: "https://linkedin.com/company/techcorp-uzbekistan",
  facebook: "https://facebook.com/techcorpuz",
  email: "hr@techcorp.uz",
  phone: "+998 90 123-45-67",
  address: " Amir Temur Avenue, Tashkent, Uzbekistan",
};

export interface UserSettings {
  email: string;
  phone: string;
  emailAlerts: boolean;
  smsNotifications: boolean;
  jobAlerts: boolean;
  interviewReminders: boolean;
}

export const userSettings: UserSettings = {
  email: "aziz.karimov@example.com",
  phone: "+998 90 987-65-43",
  emailAlerts: true,
  smsNotifications: false,
  jobAlerts: true,
  interviewReminders: true,
};

export interface AdminMetrics {
  totalCandidates: number;
  totalCompanies: number;
  activeVacancies: number;
  successfulMatches: number;
}

export const adminMetrics: AdminMetrics = {
  totalCandidates: 12458,
  totalCompanies: 892,
  activeVacancies: 3421,
  successfulMatches: 7856,
};

export interface SystemHealth {
  name: string;
  status: "active" | "inactive" | "warning";
  lastChecked: string;
}

export const systemHealth: SystemHealth[] = [
  { name: "My.Gov.uz API", status: "active", lastChecked: "Just now" },
  { name: "AI Engine", status: "active", lastChecked: "Just now" },
  { name: "Email Service", status: "active", lastChecked: "2 min ago" },
  { name: "Database", status: "active", lastChecked: "Just now" },
];

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityType: "candidate" | "company" | "vacancy";
  timestamp: string;
  status: "verified" | "pending" | "rejected";
}

export const auditLogs: AuditLog[] = [
  { id: "1", action: "Verified", entity: "TechCorp Uzbekistan", entityType: "company", timestamp: "2 minutes ago", status: "verified" },
  { id: "2", action: "Registered", entity: "Aziz Karimov", entityType: "candidate", timestamp: "5 minutes ago", status: "verified" },
  { id: "3", action: "Posted", entity: "Full Stack Developer", entityType: "vacancy", timestamp: "15 minutes ago", status: "verified" },
  { id: "4", action: "Verified", entity: "Payme Solutions", entityType: "company", timestamp: "1 hour ago", status: "verified" },
  { id: "5", action: "Registered", entity: "Sardor Davlatov", entityType: "candidate", timestamp: "2 hours ago", status: "pending" },
  { id: "6", action: "Rejected", entity: "Fake Company LLC", entityType: "company", timestamp: "3 hours ago", status: "rejected" },
];

export interface UserAuditLog {
  id: string;
  userId: string;
  action: string;
  ipAddress: string;
  timestamp: string;
  details: string;
}

export const userAuditLogs: UserAuditLog[] = [
  { id: "1", userId: "USR-123456", action: "Login", ipAddress: "192.168.1.101", timestamp: "2024-01-25 10:30:45", details: "Successful login via OneID" },
  { id: "2", userId: "USR-123457", action: "Applied for Job", ipAddress: "192.168.1.102", timestamp: "2024-01-25 10:25:30", details: "Applied to Full Stack Developer at TechCorp" },
  { id: "3", userId: "USR-123458", action: "Profile Updated", ipAddress: "192.168.1.103", timestamp: "2024-01-25 10:20:15", details: "Updated soft skills" },
  { id: "4", userId: "USR-123459", action: "Login Failed", ipAddress: "192.168.1.104", timestamp: "2024-01-25 10:15:00", details: "Invalid credentials" },
  { id: "5", userId: "USR-123460", action: "Viewed Job", ipAddress: "192.168.1.105", timestamp: "2024-01-25 10:10:22", details: "Viewed Senior Backend Engineer listing" },
  { id: "6", userId: "USR-123456", action: "Logout", ipAddress: "192.168.1.101", timestamp: "2024-01-25 10:05:00", details: "User logged out" },
  { id: "7", userId: "USR-123461", action: "Registered", ipAddress: "192.168.1.106", timestamp: "2024-01-25 09:55:30", details: "New account created via OneID" },
  { id: "8", userId: "USR-123462", action: "Downloaded CV", ipAddress: "192.168.1.107", timestamp: "2024-01-25 09:45:15", details: "Downloaded official CV PDF" },
];

export interface CompanyVerification {
  id: string;
  name: string;
  registrationDate: string;
  taxId: string;
  status: "pending" | "approved" | "rejected";
  documents: string[];
}

export const companyVerifications: CompanyVerification[] = [
  { id: "1", name: "Naview Uzbekistan", registrationDate: "2024-01-20", taxId: "IRN-987654321", status: "pending", documents: ["Registration Certificate", "Tax Certificate", "Company Charter"] },
  { id: "2", name: "Click Digital Agency", registrationDate: "2024-01-18", taxId: "IRN-456789123", status: "pending", documents: ["Registration Certificate", "Tax Certificate"] },
  { id: "3", name: "Uzbektelecom", registrationDate: "2024-01-15", taxId: "IRN-123456789", status: "approved", documents: ["Registration Certificate", "Tax Certificate", "Company Charter", "License"] },
  { id: "4", name: "Universal Systems", registrationDate: "2024-01-10", taxId: "IRN-789123456", status: "pending", documents: ["Registration Certificate", "Tax Certificate"] },
  { id: "5", name: "Samarkand Digital", registrationDate: "2024-01-08", taxId: "IRN-321654987", status: "rejected", documents: ["Registration Certificate"] },
];

export interface AIConfig {
  matchSensitivity: number;
  automatedVerification: boolean;
  modelVersion: string;
  maxCandidatesPerJob: number;
  minMatchScore: number;
}

export const defaultAIConfig: AIConfig = {
  matchSensitivity: 75,
  automatedVerification: true,
  modelVersion: "v2.4.1",
  maxCandidatesPerJob: 50,
  minMatchScore: 60,
};

export interface ReportData {
  month: string;
  hires: number;
  users: number;
}

export const reportData: ReportData[] = [
  { month: "Aug", hires: 120, users: 850 },
  { month: "Sep", hires: 145, users: 920 },
  { month: "Oct", hires: 168, users: 1050 },
  { month: "Nov", hires: 190, users: 1180 },
  { month: "Dec", hires: 210, users: 1320 },
  { month: "Jan", hires: 245, users: 1450 },
];
