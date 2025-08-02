"use client";

import { useEffect, useRef, useCallback, useState } from 'react';
import type { PerformanceMetrics, UseIntersectionObserverOptions } from '@/types';

/**
 * Hook for monitoring Web Vitals and performance metrics
 */
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const metricsRef = useRef<PerformanceMetrics>({});

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const metric = entry.name;
        const value = entry.startTime;

        switch (metric) {
          case 'first-contentful-paint':
            metricsRef.current.fcp = value;
            break;
          case 'largest-contentful-paint':
            metricsRef.current.lcp = value;
            break;
          case 'first-input-delay':
            metricsRef.current.fid = value;
            break;
          case 'cumulative-layout-shift':
            metricsRef.current.cls = value;
            break;
        }

        setMetrics({ ...metricsRef.current });
      }
    });

    // Observe paint timings
    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });

    // TTFB measurement
    if ('navigation' in performance) {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        metricsRef.current.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        setMetrics({ ...metricsRef.current });
      }
    }

    return () => observer.disconnect();
  }, []);

  return metrics;
}

/**
 * Optimized Intersection Observer hook with performance considerations
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '50px',
    freezeOnceVisible = true
  } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  const frozen = freezeOnceVisible && isVisible;

  const updateEntry = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      setEntry(entry);
      setIsVisible(entry.isIntersecting);
    },
    []
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element || frozen) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, root, rootMargin, frozen, updateEntry]);

  return { ref: elementRef, entry, isVisible };
}

/**
 * Hook for lazy loading components with performance optimization
 */
export function useLazyLoad<T>(
  loader: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const loadedRef = useRef(false);

  const load = useCallback(async () => {
    if (loadedRef.current || loading) return;

    setLoading(true);
    setError(null);

    try {
      const result = await loader();
      setData(result);
      loadedRef.current = true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, deps);

  return { data, loading, error, load };
}

/**
 * Hook for managing scroll-based animations with performance optimization
 */
export function useScrollAnimation(threshold = 0.1) {
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsInView(true);
          setHasAnimated(true);
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin: '50px 0px',
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, hasAnimated]);

  return { ref: elementRef, isInView, hasAnimated };
}

/**
 * Hook for debouncing values to improve performance
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for throttling function calls
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const throttledRef = useRef(false);
  const lastArgsRef = useRef<Parameters<T>>();

  return useCallback(
    ((...args: Parameters<T>) => {
      lastArgsRef.current = args;

      if (!throttledRef.current) {
        callback(...args);
        throttledRef.current = true;

        setTimeout(() => {
          throttledRef.current = false;
          if (lastArgsRef.current) {
            callback(...lastArgsRef.current);
          }
        }, delay);
      }
    }) as T,
    [callback, delay]
  );
}

/**
 * Hook for managing reduced motion preferences
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook for managing viewport dimensions with performance optimization
 */
export function useViewport() {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const throttledSetViewport = useThrottle(setViewport, 100);

  useEffect(() => {
    const handleResize = () => {
      throttledSetViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [throttledSetViewport]);

  return {
    ...viewport,
    isMobile: viewport.width < 768,
    isTablet: viewport.width >= 768 && viewport.width < 1024,
    isDesktop: viewport.width >= 1024,
  };
}

/**
 * Hook for managing focus management and keyboard navigation
 */
export function useFocusManagement() {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const itemsRef = useRef<HTMLElement[]>([]);

  const registerItem = useCallback((element: HTMLElement, index: number) => {
    itemsRef.current[index] = element;
  }, []);

  const focusItem = useCallback((index: number) => {
    const item = itemsRef.current[index];
    if (item) {
      item.focus();
      setFocusedIndex(index);
    }
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key } = event;
    const items = itemsRef.current.filter(Boolean);
    
    if (items.length === 0) return;

    switch (key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => {
          const nextIndex = prev < items.length - 1 ? prev + 1 : 0;
          focusItem(nextIndex);
          return nextIndex;
        });
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => {
          const nextIndex = prev > 0 ? prev - 1 : items.length - 1;
          focusItem(nextIndex);
          return nextIndex;
        });
        break;
      case 'Home':
        event.preventDefault();
        focusItem(0);
        break;
      case 'End':
        event.preventDefault();
        focusItem(items.length - 1);
        break;
    }
  }, [focusItem]);

  return {
    focusedIndex,
    registerItem,
    focusItem,
    handleKeyDown,
    setFocusedIndex,
  };
}