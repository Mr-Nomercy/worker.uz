"use client";

import { useState, useEffect } from "react";

interface UseMockDataOptions<T> {
  delay?: number;
}

export function useMockData<T>(data: T, options: UseMockDataOptions<T> = {}): {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
} {
  const [state, setState] = useState<{
    data: T | null;
    isLoading: boolean;
    error: Error | null;
  }>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setState({
        data,
        isLoading: false,
        error: null,
      });
    }, options.delay || 800);

    return () => clearTimeout(timer);
  }, [data, options.delay]);

  return state;
}
