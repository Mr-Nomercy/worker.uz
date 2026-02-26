import { useState, useCallback } from 'react';
import { adminApi, ApiError } from '@/lib/api';

export interface AdminMetrics {
  totalCandidates: number;
  totalEmployers: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  successfulMatches: number;
  verifiedCompanies: number;
  pendingCompanies: number;
  matchRate: number;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  isVerified: boolean;
  user: {
    email: string;
  };
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, unknown>;
  createdAt: string;
  user?: {
    email: string;
    role: string;
  };
}

export interface AIConfig {
  matchSensitivity: number;
  minMatchScore: number;
  maxCandidatesPerJob: number;
  automatedVerification: boolean;
}

interface UseAdminReturn {
  metrics: AdminMetrics | null;
  companies: Company[];
  auditLogs: AuditLog[];
  aiConfig: AIConfig | null;
  isLoading: boolean;
  error: ApiError | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  fetchMetrics: () => Promise<void>;
  fetchCompanies: (params?: CompanySearchParams) => Promise<void>;
  fetchAuditLogs: (params?: AuditLogSearchParams) => Promise<void>;
  verifyCompany: (companyId: string) => Promise<void>;
  fetchAIConfig: () => Promise<void>;
  updateAIConfig: (data: Partial<AIConfig>) => Promise<void>;
  clearError: void;
}

interface CompanySearchParams {
  page?: number;
  limit?: number;
  verified?: boolean;
}

interface AuditLogSearchParams {
  page?: number;
  limit?: number;
  action?: string;
  userId?: string;
}

export function useAdmin() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [aiConfig, setAiConfig] = useState<AIConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [pagination, setPagination] = useState<UseAdminReturn['pagination']>(null);

  const fetchMetrics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminApi.getMetrics();
      setMetrics(response.data.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCompanies = useCallback(async (params?: CompanySearchParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminApi.getCompanies(params);
      const { data, pagination: paginationData } = response.data;
      setCompanies(data);
      setPagination(paginationData);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAuditLogs = useCallback(async (params?: AuditLogSearchParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminApi.getAuditLogs(params);
      const { data, pagination: paginationData } = response.data;
      setAuditLogs(data);
      setPagination(paginationData);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyCompany = useCallback(async (companyId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await adminApi.verifyCompany(companyId);
      setCompanies(prev =>
        prev.map(company =>
          company.id === companyId ? { ...company, isVerified: true } : company
        )
      );
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAIConfig = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminApi.getAIConfig();
      setAiConfig(response.data.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAIConfig = useCallback(async (data: Partial<AIConfig>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminApi.updateAIConfig(data);
      setAiConfig(response.data.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    metrics,
    companies,
    auditLogs,
    aiConfig,
    isLoading,
    error,
    pagination,
    fetchMetrics,
    fetchCompanies,
    fetchAuditLogs,
    verifyCompany,
    fetchAIConfig,
    updateAIConfig,
    clearError,
  };
}
