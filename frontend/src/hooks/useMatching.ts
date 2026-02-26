import { useState, useCallback, useMemo } from 'react';
import { matchingApi, ApiError } from '@/lib/api';

export interface Candidate {
  id: string;
  profile: {
    fullName: string;
    phoneNumber?: string;
    address?: string;
    skills?: string[];
    experience?: number;
    expectedSalary?: number;
    educationHistory?: unknown[];
    workHistory?: unknown[];
    cvUrl?: string;
  };
  matchScore?: number;
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
}

export interface ContactRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  jobId?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  message?: string;
  createdAt: string;
}

interface UseMatchingReturn {
  jobs: Job[];
  candidates: Candidate[];
  notifications: Notification[];
  contactRequests: ContactRequest[];
  isLoading: boolean;
  error: ApiError | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  fetchJobMatches: () => Promise<void>;
  fetchCandidateMatches: (jobId: string) => Promise<void>;
  searchCandidates: (params: CandidateSearchParams) => Promise<void>;
  requestContact: (candidateId: string, data?: { jobId?: string; message?: string }) => Promise<void>;
  acceptContactRequest: (requestId: string) => Promise<void>;
  rejectContactRequest: (requestId: string) => Promise<void>;
  getAIAdvice: (jobId: string, lang?: string) => Promise<string>;
  fetchNotifications: (params?: { page?: number; limit?: number }) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  clearError: () => void;
  unreadCount: number;
}

interface Job {
  id: string;
  title: string;
  company: {
    name: string;
  };
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  matchScore?: number;
}

interface CandidateSearchParams {
  skills?: string;
  location?: string;
  verifiedOnly?: boolean;
  page?: number;
  limit?: number;
}

export function useMatching() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [pagination, setPagination] = useState<UseMatchingReturn['pagination']>(null);

  const fetchJobMatches = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await matchingApi.getJobMatches();
      setJobs(response.data.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCandidateMatches = useCallback(async (jobId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await matchingApi.getCandidateMatches(jobId);
      setCandidates(response.data.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchCandidates = useCallback(async (params: CandidateSearchParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await matchingApi.searchCandidates(params);
      const { data, pagination: paginationData } = response.data;
      setCandidates(data);
      setPagination(paginationData);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestContact = useCallback(async (candidateId: string, data?: { jobId?: string; message?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      await matchingApi.requestContact(candidateId, data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const acceptContactRequest = useCallback(async (requestId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await matchingApi.acceptContactRequest(requestId);
      setContactRequests(prev =>
        prev.map(req => req.id === requestId ? { ...req, status: 'ACCEPTED' as const } : req)
      );
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const rejectContactRequest = useCallback(async (requestId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await matchingApi.rejectContactRequest(requestId);
      setContactRequests(prev =>
        prev.map(req => req.id === requestId ? { ...req, status: 'REJECTED' as const } : req)
      );
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAIAdvice = useCallback(async (jobId: string, lang?: string): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await matchingApi.getAIAdvice(jobId, lang);
      return response.data.data.advice;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchNotifications = useCallback(async (params?: { page?: number; limit?: number }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await matchingApi.getNotifications(params);
      const { data, pagination: paginationData } = response.data;
      setNotifications(data);
      setPagination(paginationData);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markNotificationRead = useCallback(async (id: string) => {
    try {
      await matchingApi.markNotificationRead(id);
      setNotifications(prev =>
        prev.map(notif => notif.id === id ? { ...notif, isRead: true } : notif)
      );
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
    }
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    try {
      await matchingApi.markAllNotificationsRead();
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.isRead).length,
    [notifications]
  );

  return {
    jobs,
    candidates,
    notifications,
    contactRequests,
    isLoading,
    error,
    pagination,
    fetchJobMatches,
    fetchCandidateMatches,
    searchCandidates,
    requestContact,
    acceptContactRequest,
    rejectContactRequest,
    getAIAdvice,
    fetchNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearError,
    unreadCount,
  };
}
