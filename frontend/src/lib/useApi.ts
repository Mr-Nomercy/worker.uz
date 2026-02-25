"use client";

import { useState, useEffect, useCallback } from 'react';
import { ApiError } from './api';

interface UseApiOptions<T> {
  onError?: (error: ApiError) => void;
  immediate?: boolean;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export function useApi<T>(
  fetchFn: () => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiState<T> & { refetch: () => Promise<void> } {
  const { onError, immediate = true } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<ApiError | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError);
      onError?.(apiError);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, onError]);

  useEffect(() => {
    if (immediate) {
      refetch();
    }
  }, [immediate, refetch]);

  return { data, loading, error, refetch };
}

export function useApiCallback<T>(
  fetchFn: () => Promise<T>,
  options: UseApiOptions<T> = {}
): {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  execute: () => Promise<T | null>;
} {
  const { onError } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(async (): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFn();
      setData(result);
      return result;
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError);
      onError?.(apiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchFn, onError]);

  return { data, loading, error, execute };
}
