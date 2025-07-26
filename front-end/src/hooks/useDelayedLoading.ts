import { useState, useEffect } from 'react';

export function useDelayedLoading(loading: boolean, delay: number = 300) {
  const [delayedLoading, setDelayedLoading] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (loading) {
      // Only show loading after a delay to prevent flickering
      timeoutId = setTimeout(() => {
        setDelayedLoading(true);
      }, delay);
    } else {
      // Immediately hide loading when not loading
      setDelayedLoading(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [loading, delay]);

  return delayedLoading;
} 