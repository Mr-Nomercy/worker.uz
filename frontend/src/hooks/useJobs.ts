import { useState, useCallback, useMemo } from 'react';
import { jobsApi, ApiError } from '@/lib/api';

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  salaryMin?: number;
  salaryMax?: number;
  location: string;
  jobType: string;
  status: string;
  company?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface JobsResponse {
  data: Job[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UseJobsReturn {
  jobs: Job[];
  isLoading: boolean;
  error: ApiError | null;
  pagination: JobsResponse['pagination'] | null;
  fetchJobs: (params?: JobSearchParams) => Promise<void>;
  createJob: (data: CreateJobData) => Promise<Job>;
  updateJob: (id: string, data: Partial<CreateJobData>) => Promise<Job>;
  deleteJob: (id: string) => Promise<void>;
  getJobById: (id: string) => Promise<Job>;
  clearError: () => void;
}

export interface JobSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  jobType?: string;
}

export interface CreateJobData {
  title: string;
  description: string;
  requirements: string[];
  salaryMin?: number;
  salaryMax?: number;
  location: string;
  jobType?: string;
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [pagination, setPagination] = useState<JobsResponse['pagination'] | null>(null);

  const fetchJobs = useCallback(async (params?: JobSearchParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await jobsApi.getAll(params);
      const { data, pagination: paginationData } = response.data;
      setJobs(data);
      setPagination(paginationData);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createJob = useCallback(async (data: CreateJobData): Promise<Job> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await jobsApi.create(data);
      const newJob = response.data.data;
      setJobs(prev => [newJob, ...prev]);
      return newJob;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateJob = useCallback(async (id: string, data: Partial<CreateJobData>): Promise<Job> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await jobsApi.update(id, data);
      const updatedJob = response.data.data;
      setJobs(prev => prev.map(job => job.id === id ? updatedJob : job));
      return updatedJob;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteJob = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await jobsApi.delete(id);
      setJobs(prev => prev.filter(job => job.id !== id));
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getJobById = useCallback(async (id: string): Promise<Job> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await jobsApi.getById(id);
      return response.data.data;
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

  const hasMore = useMemo(() => {
    if (!pagination) return false;
    return pagination.page < pagination.totalPages;
  }, [pagination]);

  return {
    jobs,
    isLoading,
    error,
    pagination,
    fetchJobs,
    createJob,
    updateJob,
    deleteJob,
    getJobById,
    clearError,
    hasMore,
  };
}
