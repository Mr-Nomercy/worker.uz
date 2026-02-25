import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
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
};

export const adminApi = {
  getMetrics: () => api.get('/admin/metrics'),
  getAuditLogs: (params?: { page?: number; limit?: number; action?: string; entityType?: string }) => 
    api.get('/admin/audit-logs', { params }),
  getCompanies: (params?: { verified?: boolean; page?: number; limit?: number }) => 
    api.get('/admin/companies', { params }),
  verifyCompany: (id: string, verified: boolean) => 
    api.patch(`/admin/companies/${id}/verify`, { verified }),
  getAIConfig: () => api.get('/admin/ai-config'),
  updateAIConfig: (data: { matchSensitivity?: number; minMatchScore?: number; maxCandidatesPerJob?: number; automatedVerification?: boolean }) => 
    api.patch('/admin/ai-config', data),
};

export default api;
