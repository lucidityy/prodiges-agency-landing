"use client";

import { useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { analytics, trackEvent, trackConversion, trackInteraction, trackFormEvent } from '@/lib/analytics';
import { errorMonitor, addBreadcrumb, setContext } from '@/lib/error-monitoring';

// =============================================================================
// ANALYTICS HOOKS
// =============================================================================

/**
 * Hook for tracking page views automatically
 */
export function usePageTracking() {
  const pathname = usePathname();
  const hasTracked = useRef(false);

  useEffect(() => {
    if (pathname && !hasTracked.current) {
      const url = window.location.href;
      const title = document.title;
      
      analytics.trackPageView(url, title);
      
      // Add breadcrumb for navigation
      addBreadcrumb({
        timestamp: Date.now(),
        message: `Navigated to ${pathname}`,
        category: 'navigation',
        level: 'info',
        data: { url, title }
      });

      hasTracked.current = true;
    }

    // Reset tracking flag when pathname changes
    return () => {
      hasTracked.current = false;
    };
  }, [pathname]);
}

/**
 * Hook for tracking scroll depth
 */
export function useScrollTracking(threshold: number = 25) {
  const trackedMilestones = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);

      // Track milestones (25%, 50%, 75%, 100%)
      const milestone = Math.floor(scrollPercentage / threshold) * threshold;
      
      if (milestone > 0 && milestone <= 100 && !trackedMilestones.current.has(milestone)) {
        trackedMilestones.current.add(milestone);
        analytics.trackScrollDepth(milestone);
        
        addBreadcrumb({
          timestamp: Date.now(),
          message: `Scrolled to ${milestone}%`,
          category: 'user',
          level: 'info',
          data: { scrollPercentage: milestone }
        });
      }
    };

    // Throttle scroll events
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      trackedMilestones.current.clear();
    };
  }, [threshold]);
}

/**
 * Hook for tracking user interactions
 */
export function useInteractionTracking() {
  const trackClick = useCallback((element: string, details?: Record<string, any>) => {
    trackInteraction(element, 'click', details);
    
    addBreadcrumb({
      timestamp: Date.now(),
      message: `Clicked on ${element}`,
      category: 'user',
      level: 'info',
      data: details
    });
  }, []);

  const trackHover = useCallback((element: string, details?: Record<string, any>) => {
    trackInteraction(element, 'hover', details);
  }, []);

  const trackFocus = useCallback((element: string, details?: Record<string, any>) => {
    trackInteraction(element, 'focus', details);
  }, []);

  return {
    trackClick,
    trackHover,
    trackFocus
  };
}

/**
 * Hook for tracking form interactions
 */
export function useFormTracking(formName: string) {
  const formStarted = useRef(false);
  const startTime = useRef<number>();

  const trackFormStart = useCallback(() => {
    if (!formStarted.current) {
      startTime.current = Date.now();
      formStarted.current = true;
      trackFormEvent(formName, 'start');
      
      addBreadcrumb({
        timestamp: Date.now(),
        message: `Started form: ${formName}`,
        category: 'user',
        level: 'info',
        data: { formName }
      });
    }
  }, [formName]);

  const trackFormComplete = useCallback((data?: Record<string, any>) => {
    const completionTime = startTime.current ? Date.now() - startTime.current : undefined;
    
    trackFormEvent(formName, 'complete', {
      completionTime,
      ...data
    });

    // Track as conversion
    trackConversion({
      event_name: 'contact_form_submit',
      value: 10,
      custom_parameters: {
        form_name: formName,
        completion_time: completionTime,
        ...data
      }
    });
    
    addBreadcrumb({
      timestamp: Date.now(),
      message: `Completed form: ${formName}`,
      category: 'user',
      level: 'info',
      data: { formName, completionTime }
    });
  }, [formName]);

  const trackFormError = useCallback((error: string, field?: string) => {
    trackFormEvent(formName, 'error', { error, field });
    
    addBreadcrumb({
      timestamp: Date.now(),
      message: `Form error in ${formName}: ${error}`,
      category: 'error',
      level: 'error',
      data: { formName, error, field }
    });
  }, [formName]);

  return {
    trackFormStart,
    trackFormComplete,
    trackFormError
  };
}

/**
 * Hook for tracking CTA clicks and conversions
 */
export function useCTATracking() {
  const trackCTAClick = useCallback((ctaName: string, value?: number, details?: Record<string, any>) => {
    // Track as regular event
    trackEvent({
      action: 'cta_click',
      category: 'conversion',
      label: ctaName,
      value: value || 1,
      custom_parameters: details
    });

    // Track as conversion
    trackConversion({
      event_name: 'cta_click',
      value: value || 5,
      custom_parameters: {
        cta_name: ctaName,
        ...details
      }
    });
    
    addBreadcrumb({
      timestamp: Date.now(),
      message: `Clicked CTA: ${ctaName}`,
      category: 'user',
      level: 'info',
      data: { ctaName, value, ...details }
    });
  }, []);

  const trackPhoneClick = useCallback((phone: string) => {
    trackConversion({
      event_name: 'phone_click',
      value: 15,
      custom_parameters: { phone }
    });
    
    addBreadcrumb({
      timestamp: Date.now(),
      message: `Clicked phone: ${phone}`,
      category: 'user',
      level: 'info',
      data: { phone }
    });
  }, []);

  const trackEmailClick = useCallback((email: string) => {
    trackConversion({
      event_name: 'email_click',
      value: 10,
      custom_parameters: { email }
    });
    
    addBreadcrumb({
      timestamp: Date.now(),
      message: `Clicked email: ${email}`,
      category: 'user',
      level: 'info',
      data: { email }
    });
  }, []);

  return {
    trackCTAClick,
    trackPhoneClick,
    trackEmailClick
  };
}

/**
 * Hook for tracking engagement with specific sections
 */
export function useSectionTracking(sectionName: string) {
  const { isVisible } = useScrollAnimation();
  const hasTracked = useRef(false);

  useEffect(() => {
    if (isVisible && !hasTracked.current) {
      trackEvent({
        action: 'section_viewed',
        category: 'engagement',
        label: sectionName,
        custom_parameters: {
          section: sectionName,
          timestamp: Date.now()
        }
      });

      addBreadcrumb({
        timestamp: Date.now(),
        message: `Viewed section: ${sectionName}`,
        category: 'user',
        level: 'info',
        data: { sectionName }
      });

      hasTracked.current = true;
    }
  }, [isVisible, sectionName]);

  return { isVisible };
}

/**
 * Hook for setting user context
 */
export function useUserContext(userId?: string, userData?: Record<string, any>) {
  useEffect(() => {
    if (userId) {
      setContext('user', { id: userId, ...userData });
      
      addBreadcrumb({
        timestamp: Date.now(),
        message: `User identified: ${userId}`,
        category: 'user',
        level: 'info',
        data: { userId, ...userData }
      });
    }
  }, [userId, userData]);
}

/**
 * Hook for tracking time spent on page
 */
export function useTimeTracking() {
  const startTime = useRef<number>();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    startTime.current = Date.now();

    // Track time milestones
    const milestones = [10, 30, 60, 120, 300]; // seconds
    const trackedMilestones = new Set<number>();

    intervalRef.current = setInterval(() => {
      if (startTime.current) {
        const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
        
        milestones.forEach(milestone => {
          if (timeSpent >= milestone && !trackedMilestones.has(milestone)) {
            trackedMilestones.add(milestone);
            
            trackEvent({
              action: 'time_on_page',
              category: 'engagement',
              label: `${milestone}s`,
              value: milestone,
              custom_parameters: {
                timeSpent: milestone,
                url: window.location.href
              }
            });
          }
        });
      }
    }, 1000);

    // Track when user leaves page
    const handleBeforeUnload = () => {
      if (startTime.current) {
        const totalTime = Math.floor((Date.now() - startTime.current) / 1000);
        
        trackEvent({
          action: 'page_exit',
          category: 'engagement',
          label: 'total_time',
          value: totalTime,
          custom_parameters: {
            totalTime,
            url: window.location.href
          }
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
}

// Import from performance hooks for convenience
import { useScrollAnimation } from './usePerformance';

export { useScrollAnimation };