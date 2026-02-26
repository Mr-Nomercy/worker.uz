import { useState, useCallback, useMemo } from 'react';
import { applicationsApi, ApiError } from '@/lib/api';

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  status: string;
  coverLetter?: string;
  notes?: string;
  createdAt: string;
  job?: {
    id: string;
    title: string;
    company: {
      name: string;
    };
  };
}

interface UseApplicationsReturn {
  applications: Application[];
  isLoading: boolean;
  error: ApiError | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  fetchMyApplications: (status?: string) => Promise<void>;
  fetchJobApplications: (jobId: string) => Promise<void>;
  applyToJob: (jobId: string, coverLetter?: string) => Promise<Application>;
  updateApplicationStatus: (id: string, status: string, notes?: string) => Promise<void>;
  withdrawApplication: (id: string) => Promise<void>;
  clearError: () => void;
}

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [pagination, setPagination] = useState<UseApplicationsReturn['pagination']>(null);

  const fetchMyApplications = useCallback(async (status?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await applicationsApi.getMyApplications(status);
      const { data, pagination: paginationData } = response.data;
      setApplications(data);
      setPagination(paginationData);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchJobApplications = useCallback(async (jobId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await applicationsApi.getJobApplications(jobId);
      setApplications(response.data.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const applyToJob = useCallback(async (jobId: string, coverLetter?: string): Promise<Application> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await applicationsApi.apply(jobId, coverLetter);
      const newApplication = response.data.data;
      setApplications(prev => [newApplication, ...prev]);
      return newApplication;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateApplicationStatus = useCallback(async (id: string, status: string, notes?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await applicationsApi.updateStatus(id, status, notes);
      setApplications(prev => 
        prev.map(app => app.id === id ? { ...app, status, notes } : app)
      );
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const withdrawApplication = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await applicationsApi.withdraw(id);
      setApplications(prev => prev.filter(app => app.id !== id));
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

  const pendingCount = useMemo(() => 
    applications.filter(app => app.status === 'PENDING').length,
    [applications]
  );

  return {
    applications,
    isLoading,
    error,
    pagination,
    fetchMyApplications,
    fetchJobApplications,
    applyToJob,
    updateApplicationStatus,
    withdrawApplication,
    clearError,
    pendingCount,
  };
}
