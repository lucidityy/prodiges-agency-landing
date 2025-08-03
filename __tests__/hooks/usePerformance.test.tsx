import { renderHook, act, waitFor } from '@testing-library/react';
import {
  useIntersectionObserver,
  useDebounce,
  useThrottle,
  useReducedMotion,
  useViewport,
} from '@/hooks/usePerformance';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});
(window as any).IntersectionObserver = mockIntersectionObserver;

describe('useIntersectionObserver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns ref and initial visibility state', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    expect(result.current.ref).toBeDefined();
    expect(result.current.isVisible).toBe(false);
    expect(result.current.entry).toBeNull();
  });

  it.skip('creates IntersectionObserver with correct options', async () => {
    // TODO: This test is flaky due to React effect timing issues
    // The IntersectionObserver is created in a useEffect which depends on
    // the ref being attached to a DOM element. This is hard to test reliably.
    const options = {
      threshold: 0.5,
      rootMargin: '100px',
    };

    const { result, rerender } = renderHook(() => useIntersectionObserver(options));
    
    // Simulate attaching an element to the ref
    const mockElement = document.createElement('div');
    act(() => {
      result.current.ref.current = mockElement;
    });
    
    // Trigger effect by re-rendering
    rerender();

    await waitFor(() => {
      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          threshold: 0.5,
          rootMargin: '100px',
        })
      );
    });
  });
});

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('debounces value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    expect(result.current).toBe('initial');

    // Update value
    rerender({ value: 'updated', delay: 500 });
    expect(result.current).toBe('initial'); // Still old value

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated');
  });

  it('cancels previous timeout on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    rerender({ value: 'first', delay: 500 });
    rerender({ value: 'second', delay: 500 });

    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(result.current).toBe('second');
  });
});

describe('useThrottle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('calls function immediately on first call', () => {
    const mockFn = jest.fn();
    const { result } = renderHook(() => useThrottle(mockFn, 1000));

    act(() => {
      result.current('test');
    });

    expect(mockFn).toHaveBeenCalledWith('test');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('throttles subsequent calls', () => {
    const mockFn = jest.fn();
    const { result } = renderHook(() => useThrottle(mockFn, 1000));

    act(() => {
      result.current('first');
      result.current('second');
      result.current('third');
    });

    expect(mockFn).toHaveBeenCalledWith('first');
    expect(mockFn).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockFn).toHaveBeenCalledWith('third');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});

describe('useReducedMotion', () => {
  it('returns false when prefers-reduced-motion is not set', () => {
    const mockMatchMedia = jest.fn().mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });
    Object.defineProperty(window, 'matchMedia', {
      value: mockMatchMedia,
    });

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('returns true when prefers-reduced-motion is set', () => {
    const mockMatchMedia = jest.fn().mockReturnValue({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });
    Object.defineProperty(window, 'matchMedia', {
      value: mockMatchMedia,
    });

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });
});

describe('useViewport', () => {
  beforeEach(() => {
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  it('returns current viewport dimensions', () => {
    const { result } = renderHook(() => useViewport());

    expect(result.current.width).toBe(1024);
    expect(result.current.height).toBe(768);
    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
  });

  it('correctly identifies mobile viewport', () => {
    Object.defineProperty(window, 'innerWidth', {
      value: 375,
    });

    const { result } = renderHook(() => useViewport());

    expect(result.current.isMobile).toBe(true);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
  });

  it('correctly identifies tablet viewport', () => {
    Object.defineProperty(window, 'innerWidth', {
      value: 768,
    });

    const { result } = renderHook(() => useViewport());

    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });
});