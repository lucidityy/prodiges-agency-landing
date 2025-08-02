"use client";

import { AnalyticsEvent } from '@/types';

// =============================================================================
// GOOGLE ANALYTICS 4 CONFIGURATION
// =============================================================================

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

interface ConversionEvent {
  event_name: 'generate_lead' | 'contact_form_submit' | 'cta_click' | 'phone_click' | 'email_click';
  value?: number;
  currency?: string;
  custom_parameters?: Record<string, any>;
}

class AnalyticsManager {
  private isProduction: boolean;
  private gaId: string | null;
  private isInitialized: boolean = false;
  private eventQueue: AnalyticsEvent[] = [];

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.gaId = process.env.NEXT_PUBLIC_GA_ID || null;
  }

  // Initialize Google Analytics
  public init(): void {
    if (!this.gaId || this.isInitialized) return;

    try {
      // Load Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };

      window.gtag('js', new Date());
      window.gtag('config', this.gaId, {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: true,
        // Enhanced measurement
        enhanced_measurement: {
          scrolls: true,
          outbound_clicks: true,
          site_search: true,
          video_engagement: true,
          file_downloads: true
        },
        // Privacy settings
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false
      });

      this.isInitialized = true;
      
      // Process queued events
      this.processEventQueue();

      console.log('🔍 Analytics initialized successfully');
    } catch (error) {
      console.error('❌ Analytics initialization failed:', error);
    }
  }

  // Track page views
  public trackPageView(url: string, title?: string): void {
    if (!this.isReady()) return;

    window.gtag('config', this.gaId!, {
      page_title: title || document.title,
      page_location: url,
    });

    this.logEvent('page_view', { url, title });
  }

  // Track custom events
  public trackEvent(event: GAEvent): void {
    if (!this.isReady()) {
      this.queueEvent({
        name: event.action,
        category: 'engagement',
        data: event,
        timestamp: new Date()
      });
      return;
    }

    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.custom_parameters
    });

    this.logEvent(event.action, event);
  }

  // Track conversions
  public trackConversion(conversion: ConversionEvent): void {
    if (!this.isReady()) {
      this.queueEvent({
        name: conversion.event_name,
        category: 'conversion',
        data: conversion,
        timestamp: new Date()
      });
      return;
    }

    window.gtag('event', conversion.event_name, {
      value: conversion.value || 1,
      currency: conversion.currency || 'EUR',
      ...conversion.custom_parameters
    });

    this.logEvent(`conversion_${conversion.event_name}`, conversion);
  }

  // Track user interactions
  public trackInteraction(element: string, action: string, details?: Record<string, any>): void {
    this.trackEvent({
      action: 'user_interaction',
      category: 'engagement',
      label: `${element}_${action}`,
      custom_parameters: {
        element,
        action,
        timestamp: Date.now(),
        ...details
      }
    });
  }

  // Track form events
  public trackFormEvent(formName: string, event: 'start' | 'complete' | 'error', details?: Record<string, any>): void {
    const eventName = `form_${event}`;
    
    if (event === 'complete') {
      this.trackConversion({
        event_name: 'generate_lead',
        value: 10, // Assign value to leads
        custom_parameters: {
          form_name: formName,
          ...details
        }
      });
    } else {
      this.trackEvent({
        action: eventName,
        category: 'forms',
        label: formName,
        custom_parameters: details
      });
    }
  }

  // Track scroll depth
  public trackScrollDepth(percentage: number): void {
    const milestone = Math.floor(percentage / 25) * 25; // 0, 25, 50, 75, 100
    
    if (milestone > 0 && milestone <= 100) {
      this.trackEvent({
        action: 'scroll_depth',
        category: 'engagement',
        label: `${milestone}%`,
        value: milestone
      });
    }
  }

  // Track timing
  public trackTiming(category: string, variable: string, value: number, label?: string): void {
    if (!this.isReady()) return;

    window.gtag('event', 'timing_complete', {
      name: variable,
      value: value,
      event_category: category,
      event_label: label
    });
  }

  // Track errors
  public trackError(error: Error, context?: string): void {
    this.trackEvent({
      action: 'javascript_error',
      category: 'errors',
      label: context || 'unknown',
      custom_parameters: {
        error_message: error.message,
        error_stack: error.stack,
        user_agent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now()
      }
    });
  }

  // Enhanced ecommerce tracking (for future features)
  public trackPurchaseIntent(service: string, value: number): void {
    this.trackEvent({
      action: 'add_to_cart',
      category: 'ecommerce',
      label: service,
      value: value,
      custom_parameters: {
        currency: 'EUR',
        service_name: service
      }
    });
  }

  // Privacy methods
  public optOut(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('analytics_opt_out', 'true');
      // Disable GA
      if (this.gaId) {
        window[`ga-disable-${this.gaId}`] = true;
      }
    }
  }

  public optIn(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('analytics_opt_out');
      // Re-enable GA
      if (this.gaId) {
        window[`ga-disable-${this.gaId}`] = false;
      }
      this.init();
    }
  }

  public isOptedOut(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('analytics_opt_out') === 'true';
  }

  // Helper methods
  private isReady(): boolean {
    return this.isInitialized && !this.isOptedOut() && typeof window !== 'undefined' && window.gtag;
  }

  private queueEvent(event: AnalyticsEvent): void {
    this.eventQueue.push(event);
  }

  private processEventQueue(): void {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (event) {
        // Re-process queued events
        if (event.category === 'conversion') {
          this.trackConversion(event.data as ConversionEvent);
        } else {
          this.trackEvent(event.data as GAEvent);
        }
      }
    }
  }

  private logEvent(eventName: string, data?: any): void {
    if (!this.isProduction) {
      console.log(`📊 Analytics Event: ${eventName}`, data);
    }
  }
}

// =============================================================================
// PERFORMANCE MONITORING
// =============================================================================

class PerformanceMonitor {
  private observer: PerformanceObserver | null = null;
  private metrics: Record<string, number> = {};

  public init(): void {
    if (typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    this.setupWebVitalsTracking();
    
    // Monitor custom metrics
    this.setupCustomMetrics();
    
    // Monitor resource loading
    this.setupResourceTracking();

    console.log('⚡ Performance monitoring initialized');
  }

  private setupWebVitalsTracking(): void {
    try {
      // First Contentful Paint (FCP)
      this.observeEntryTypes(['paint'], (entries) => {
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            const value = Math.round(entry.startTime);
            this.metrics.fcp = value;
            analytics.trackTiming('web_vitals', 'first_contentful_paint', value);
          }
        });
      });

      // Largest Contentful Paint (LCP)
      this.observeEntryTypes(['largest-contentful-paint'], (entries) => {
        const entry = entries[entries.length - 1];
        if (entry) {
          const value = Math.round(entry.startTime);
          this.metrics.lcp = value;
          analytics.trackTiming('web_vitals', 'largest_contentful_paint', value);
        }
      });

      // First Input Delay (FID)
      this.observeEntryTypes(['first-input'], (entries) => {
        entries.forEach((entry: any) => {
          const value = Math.round(entry.processingStart - entry.startTime);
          this.metrics.fid = value;
          analytics.trackTiming('web_vitals', 'first_input_delay', value);
        });
      });

      // Cumulative Layout Shift (CLS)
      this.observeEntryTypes(['layout-shift'], (entries) => {
        let clsScore = 0;
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsScore += entry.value;
          }
        });
        this.metrics.cls = Math.round(clsScore * 1000) / 1000;
        analytics.trackTiming('web_vitals', 'cumulative_layout_shift', this.metrics.cls);
      });

    } catch (error) {
      console.warn('Web Vitals tracking not supported', error);
    }
  }

  private setupCustomMetrics(): void {
    // Time to Interactive (TTI) approximation
    document.addEventListener('DOMContentLoaded', () => {
      const tti = performance.now();
      this.metrics.tti = Math.round(tti);
      analytics.trackTiming('performance', 'time_to_interactive', tti);
    });

    // Bundle load time
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.metrics.loadTime = Math.round(loadTime);
      analytics.trackTiming('performance', 'page_load_time', loadTime);
    });
  }

  private setupResourceTracking(): void {
    this.observeEntryTypes(['resource'], (entries) => {
      entries.forEach((entry: any) => {
        const duration = entry.responseEnd - entry.startTime;
        
        // Track slow resources
        if (duration > 1000) {
          analytics.trackEvent({
            action: 'slow_resource',
            category: 'performance',
            label: entry.name,
            value: Math.round(duration)
          });
        }
      });
    });
  }

  private observeEntryTypes(types: string[], callback: (entries: PerformanceEntry[]) => void): void {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      
      observer.observe({ entryTypes: types });
      this.observer = observer;
    } catch (error) {
      console.warn(`Performance Observer not supported for types: ${types.join(', ')}`);
    }
  }

  public getMetrics(): Record<string, number> {
    return { ...this.metrics };
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export const analytics = new AnalyticsManager();
export const performanceMonitor = new PerformanceMonitor();

// Convenience functions
export const trackEvent = analytics.trackEvent.bind(analytics);
export const trackConversion = analytics.trackConversion.bind(analytics);
export const trackPageView = analytics.trackPageView.bind(analytics);
export const trackFormEvent = analytics.trackFormEvent.bind(analytics);
export const trackInteraction = analytics.trackInteraction.bind(analytics);
export const trackError = analytics.trackError.bind(analytics);

// Auto-initialize
if (typeof window !== 'undefined') {
  // Initialize after a short delay to avoid blocking main thread
  setTimeout(() => {
    analytics.init();
    performanceMonitor.init();
  }, 100);
}