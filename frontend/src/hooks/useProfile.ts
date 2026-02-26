import { useState, useCallback, useMemo } from 'react';
import { profileApi, ApiError } from '@/lib/api';

export interface Profile {
  id: string;
  userId: string;
  fullName: string;
  birthDate: string;
  gender: string;
  address: string;
  phoneNumber?: string;
  softSkills?: string[];
  portfolioLinks?: { label: string; url: string }[];
  cvUrl?: string;
  educationHistory?: unknown[];
  workHistory?: unknown[];
}

interface UseProfileReturn {
  profile: Profile | null;
  isLoading: boolean;
  error: ApiError | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<Profile>;
  uploadCV: (file: File) => Promise<string>;
  deleteCV: () => Promise<void>;
  clearError: () => void;
}

export interface UpdateProfileData {
  phoneNumber?: string;
  softSkills?: string[];
  portfolioLinks?: { label: string; url: string }[];
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await profileApi.getProfile();
      setProfile(response.data.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: UpdateProfileData): Promise<Profile> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await profileApi.updateProfile(data);
      const updatedProfile = response.data.data;
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadCV = useCallback(async (file: File): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await profileApi.uploadCV(file);
      const cvUrl = response.data.data.cvUrl;
      setProfile(prev => prev ? { ...prev, cvUrl } : null);
      return cvUrl;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteCV = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await profileApi.deleteCV();
      setProfile(prev => prev ? { ...prev, cvUrl: undefined } : null);
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

  const hasCV = useMemo(() => !!profile?.cvUrl, [profile]);

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    uploadCV,
    deleteCV,
    clearError,
    hasCV,
  };
}
