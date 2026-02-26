import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const getApiBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (process.env.NODE_ENV === 'development') {
    console.warn('NEXT_PUBLIC_API_URL not set, using default localhost');
    return 'http://localhost:3001/api';
  }
  throw new Error('NEXT_PUBLIC_API_URL environment variable is required in production');
};

const API_BASE_URL = getApiBaseUrl();

export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  SERVER_ERROR: 'SERVER_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  UNKNOWN: 'UNKNOWN',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

export interface ApiError {
  message: string;
  code: ErrorCode;
  status: number;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

let isOfflineMode = false;
let offlineCallback: ((isOffline: boolean) => void) | null = null;

export function setOfflineModeCallback(callback: (isOffline: boolean) => void) {
  offlineCallback = callback;
}

const handleOffline = () => {
  if (!isOfflineMode && offlineCallback) {
    isOfflineMode = true;
    offlineCallback(true);
  }
};

const handleOnline = () => {
  if (isOfflineMode && offlineCallback) {
    isOfflineMode = false;
    offlineCallback(false);
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
}

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    handleOnline();
    return response;
  },
  (error: AxiosError<{ error?: string; message?: string }>) => {
    if (!error.response) {
      handleOffline();
      
      if (error.code === 'ECONNABORTED') {
        return Promise.reject({
          message: 'Request timed out. Please check your connection.',
          code: ERROR_CODES.TIMEOUT,
          status: 408,
        } as ApiError);
      }
      
      return Promise.reject({
        message: 'Unable to connect to server. Please check your internet connection.',
        code: ERROR_CODES.NETWORK_ERROR,
        status: 0,
      } as ApiError);
    }

    const status = error.response.status;

    if (status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/register') {
          window.location.href = '/login?reason=session_expired';
        }
      }
      return Promise.reject({
        message: error.response.data?.message || 'Sessiya muddati tugagan. Iltimos, qayta kiring.',
        code: ERROR_CODES.UNAUTHORIZED,
        status: 401,
      } as ApiError);
    }

    if (status === 403) {
      return Promise.reject({
        message: error.response.data?.message || 'You do not have permission to perform this action.',
        code: ERROR_CODES.FORBIDDEN,
        status: 403,
      } as ApiError);
    }

    if (status === 404) {
      return Promise.reject({
        message: error.response.data?.message || 'The requested resource was not found.',
        code: ERROR_CODES.NOT_FOUND,
        status: 404,
      } as ApiError);
    }

    if (status === 500) {
      return Promise.reject({
        message: 'Server error. Please try again later.',
        code: ERROR_CODES.SERVER_ERROR,
        status: 500,
      } as ApiError);
    }

    const errorMessage = error.response.data?.error || error.response.data?.message || 'An error occurred';
    const errorCode = (error.response.data as { errorCode?: string })?.errorCode || ERROR_CODES.UNKNOWN;
    
    return Promise.reject({
      message: errorMessage,
      code: errorCode as ErrorCode,
      status,
    } as ApiError);
  }
);

export const authApi = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  register: (data: { email: string; password: string; pinfl: string; passportSeries: string; fullName: string; birthDate: string }) =>
    api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const jobsApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string; location?: string }) => 
    api.get('/jobs', { params }),
  getById: (id: string) => api.get(`/jobs/${id}`),
  create: (data: { title: string; description: string; requirements: string[]; salaryMin?: number; salaryMax?: number; location: string; jobType?: string }) => 
    api.post('/jobs', data),
  update: (id: string, data: Partial<{ title: string; description: string; requirements: string[]; salaryMin: number; salaryMax: number; location: string; jobType: string; status: string }>) => 
    api.patch(`/jobs/${id}`, data),
  delete: (id: string) => api.delete(`/jobs/${id}`),
};

export const applicationsApi = {
  apply: (jobId: string, coverLetter?: string) => 
    api.post('/applications', { jobId, coverLetter }),
  getMyApplications: (status?: string) => 
    api.get('/applications/my-applications', { params: { status } }),
  getJobApplications: (jobId: string) => 
    api.get(`/applications/job/${jobId}`),
  updateStatus: (id: string, status: string, notes?: string) => 
    api.patch(`/applications/${id}/status`, { status, notes }),
  withdraw: (id: string) => api.delete(`/applications/${id}`),
};

export const matchingApi = {
  getJobMatches: () => api.get('/matching/jobs'),
  getCandidateMatches: (jobId: string) => api.get(`/matching/candidates/${jobId}`),
  getAIAdvice: (jobId: string, lang?: string) => api.get(`/matching/ai-advice/${jobId}`, { params: { lang } }),
  searchCandidates: (params: { 
    skills?: string; 
    location?: string; 
    verifiedOnly?: boolean; 
    page?: number; 
    limit?: number;
  }) => api.get('/matching/search-candidates', { params }),
  requestContact: (candidateId: string, data?: { jobId?: string; message?: string }) => 
    api.post(`/matching/request/${candidateId}`, data || {}),
  acceptContactRequest: (requestId: string) => 
    api.post(`/matching/accept/${requestId}`),
  rejectContactRequest: (requestId: string) => 
    api.post(`/matching/reject/${requestId}`),
  getRequestStatus: (candidateId: string) => 
    api.get(`/matching/request-status/${candidateId}`),
  getCandidateContactByRequest: (candidateId: string) => 
    api.get(`/matching/candidate-contact-by-request/${candidateId}`),
  getNotifications: (params?: { page?: number; limit?: number }) => 
    api.get('/matching/notifications', { params }),
  markNotificationRead: (id: string) => 
    api.patch(`/matching/notifications/${id}/read`),
  markAllNotificationsRead: () => 
    api.patch('/matching/notifications/read-all'),
};

export const profileApi = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data: { 
    phoneNumber?: string; 
    softSkills?: string[];
    portfolioLinks?: { label: string; url: string }[];
  }) => api.patch('/profile', data),
  uploadCV: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/profile/cv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteCV: () => api.delete('/profile/cv'),
};

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getMetrics: () => api.get('/admin/stats'),
  getStats: () => api.get('/admin/stats'),
  getAuditLogs: (params?: { page?: number; limit?: number; action?: string }) => 
    api.get('/admin/audit', { params }),
  getCompanies: (params?: { page?: number; limit?: number; verified?: boolean }) => 
    api.get('/admin/companies', { params }),
  verifyCompany: (companyId: string) => 
    api.patch(`/admin/companies/${companyId}/verify`),
  getAIConfig: () => api.get('/admin/ai-config'),
  updateAIConfig: (data: { 
    matchSensitivity?: number; 
    minMatchScore?: number;
    maxCandidatesPerJob?: number;
    automatedVerification?: boolean;
  }) => api.patch('/admin/ai-config', data),
};

export default api;
