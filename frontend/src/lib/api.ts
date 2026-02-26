import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
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
          code: 'TIMEOUT',
          status: 408,
        } as ApiError);
      }
      
      return Promise.reject({
        message: 'Unable to connect to server. Please check your internet connection.',
        code: 'NETWORK_ERROR',
        status: 0,
      } as ApiError);
    }

    const status = error.response.status;

    if (status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Sizning seansingiz muddati tugadi. Iltimos, qayta kiring.');
        window.location.href = '/login';
      }
      return Promise.reject({
        message: 'Sizning seansingiz muddati tugadi. Iltimos, qayta kiring.',
        code: 'UNAUTHORIZED',
        status: 401,
      } as ApiError);
    }

    if (status === 403) {
      return Promise.reject({
        message: 'You do not have permission to perform this action.',
        code: 'FORBIDDEN',
        status: 403,
      } as ApiError);
    }

    if (status === 404) {
      return Promise.reject({
        message: 'The requested resource was not found.',
        code: 'NOT_FOUND',
        status: 404,
      } as ApiError);
    }

    if (status === 500) {
      return Promise.reject({
        message: 'Server error. Please try again later.',
        code: 'SERVER_ERROR',
        status: 500,
      } as ApiError);
    }

    const errorMessage = error.response.data?.error || error.response.data?.message || 'An error occurred';
    
    return Promise.reject({
      message: errorMessage,
      code: 'UNKNOWN',
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
