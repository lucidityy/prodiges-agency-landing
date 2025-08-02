"use client";

import { analytics } from './analytics';

// =============================================================================
// ERROR MONITORING SYSTEM
// =============================================================================

interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  lineNumber?: number;
  columnNumber?: number;
  timestamp: number;
  userAgent: string;
  userId?: string;
  sessionId: string;
  component?: string;
  props?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'javascript' | 'react' | 'network' | 'performance' | 'security';
  tags?: string[];
  breadcrumbs?: Breadcrumb[];
  context?: Record<string, any>;
}

interface Breadcrumb {
  timestamp: number;
  message: string;
  category: 'navigation' | 'user' | 'console' | 'network' | 'error';
  level: 'info' | 'warning' | 'error';
  data?: Record<string, any>;
}

interface NetworkError {
  url: string;
  method: string;
  status: number;
  statusText: string;
  response?: any;
  timestamp: number;
  duration: number;
}

class ErrorMonitoringService {
  private sessionId: string;
  private breadcrumbs: Breadcrumb[] = [];
  private maxBreadcrumbs: number = 50;
  private isProduction: boolean;
  private errorQueue: ErrorReport[] = [];
  private rateLimitCount: number = 0;
  private rateLimitWindow: number = 60000; // 1 minute
  private maxErrorsPerWindow: number = 10;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isProduction = process.env.NODE_ENV === 'production';
    this.init();
  }

  private init(): void {
    if (typeof window === 'undefined') return;

    // Global error handler
    this.setupGlobalErrorHandler();
    
    // Unhandled promise rejection handler
    this.setupUnhandledRejectionHandler();
    
    // React error boundary integration
    this.setupReactErrorHandler();
    
    // Network error monitoring
    this.setupNetworkMonitoring();
    
    // Performance error monitoring
    this.setupPerformanceMonitoring();

    // Console error capturing
    this.setupConsoleMonitoring();

    console.log('🛡️ Error monitoring initialized');
  }

  private setupGlobalErrorHandler(): void {
    window.addEventListener('error', (event) => {
      const error: ErrorReport = {
        message: event.message,
        stack: event.error?.stack,
        url: event.filename || window.location.href,
        lineNumber: event.lineno,
        columnNumber: event.colno,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        sessionId: this.sessionId,
        severity: this.classifyErrorSeverity(event.error),
        category: 'javascript',
        breadcrumbs: [...this.breadcrumbs],
        context: this.gatherContext()
      };

      this.reportError(error);
    });
  }

  private setupUnhandledRejectionHandler(): void {
    window.addEventListener('unhandledrejection', (event) => {
      const error: ErrorReport = {
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        sessionId: this.sessionId,
        severity: 'high',
        category: 'javascript',
        breadcrumbs: [...this.breadcrumbs],
        context: this.gatherContext()
      };

      this.reportError(error);
    });
  }

  private setupReactErrorHandler(): void {
    // This will be used by our ErrorBoundary component
    (window as any).__ERROR_MONITOR__ = {
      reportReactError: (error: Error, errorInfo: any, component: string) => {
        const errorReport: ErrorReport = {
          message: `React Error in ${component}: ${error.message}`,
          stack: error.stack,
          url: window.location.href,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          sessionId: this.sessionId,
          component,
          severity: 'high',
          category: 'react',
          breadcrumbs: [...this.breadcrumbs],
          context: {
            componentStack: errorInfo.componentStack,
            ...this.gatherContext()
          }
        };

        this.reportError(errorReport);
      }
    };
  }

  private setupNetworkMonitoring(): void {
    // Monitor fetch errors
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = args[0]?.toString() || 'unknown';
      const method = args[1]?.method || 'GET';

      try {
        const response = await originalFetch(...args);
        
        if (!response.ok) {
          const duration = performance.now() - startTime;
          this.reportNetworkError({
            url,
            method,
            status: response.status,
            statusText: response.statusText,
            timestamp: Date.now(),
            duration
          });
        }

        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        this.reportNetworkError({
          url,
          method,
          status: 0,
          statusText: 'Network Error',
          response: error,
          timestamp: Date.now(),
          duration
        });
        throw error;
      }
    };
  }

  private setupPerformanceMonitoring(): void {
    // Monitor memory usage
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        
        if (memoryUsage > 0.9) { // 90% memory usage
          this.reportError({
            message: `High memory usage detected: ${Math.round(memoryUsage * 100)}%`,
            url: window.location.href,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            sessionId: this.sessionId,
            severity: 'medium',
            category: 'performance',
            breadcrumbs: [...this.breadcrumbs],
            context: {
              memoryUsage: memoryUsage,
              usedJSHeapSize: memory.usedJSHeapSize,
              jsHeapSizeLimit: memory.jsHeapSizeLimit
            }
          });
        }
      }, 30000); // Check every 30 seconds
    }

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) { // Tasks longer than 50ms
              this.addBreadcrumb({
                timestamp: Date.now(),
                message: `Long task detected: ${Math.round(entry.duration)}ms`,
                category: 'console',
                level: 'warning',
                data: {
                  duration: entry.duration,
                  startTime: entry.startTime
                }
              });
            }
          }
        });
        
        observer.observe({ entryTypes: ['longtask'] });
      } catch (error) {
        // Long task API not supported
      }
    }
  }

  private setupConsoleMonitoring(): void {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      originalConsoleError(...args);
      
      this.reportError({
        message: `Console Error: ${args.join(' ')}`,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        sessionId: this.sessionId,
        severity: 'medium',
        category: 'javascript',
        breadcrumbs: [...this.breadcrumbs],
        context: this.gatherContext()
      });
    };
  }

  public reportError(error: ErrorReport): void {
    // Rate limiting
    if (!this.shouldReportError()) {
      return;
    }

    // Add to queue
    this.errorQueue.push(error);

    // Log to console in development
    if (!this.isProduction) {
      console.error('🚨 Error reported:', error);
    }

    // Send to analytics
    analytics.trackError(new Error(error.message), error.component);

    // Send to external service (implement your preferred service)
    this.sendToErrorService(error);

    // Add error as breadcrumb for future errors
    this.addBreadcrumb({
      timestamp: error.timestamp,
      message: error.message,
      category: 'error',
      level: 'error',
      data: {
        severity: error.severity,
        category: error.category
      }
    });
  }

  private reportNetworkError(networkError: NetworkError): void {
    this.reportError({
      message: `Network Error: ${networkError.method} ${networkError.url} - ${networkError.status} ${networkError.statusText}`,
      url: window.location.href,
      timestamp: networkError.timestamp,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
      severity: networkError.status >= 500 ? 'high' : 'medium',
      category: 'network',
      breadcrumbs: [...this.breadcrumbs],
      context: {
        networkError,
        ...this.gatherContext()
      }
    });
  }

  public addBreadcrumb(breadcrumb: Breadcrumb): void {
    this.breadcrumbs.push(breadcrumb);
    
    // Keep only the last N breadcrumbs
    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs.shift();
    }
  }

  public setContext(key: string, value: any): void {
    if (typeof window !== 'undefined') {
      window.__ERROR_CONTEXT__ = window.__ERROR_CONTEXT__ || {};
      window.__ERROR_CONTEXT__[key] = value;
    }
  }

  public setUser(userId: string, userData?: Record<string, any>): void {
    this.setContext('user', { id: userId, ...userData });
  }

  private classifyErrorSeverity(error: Error): 'low' | 'medium' | 'high' | 'critical' {
    if (!error) return 'low';

    const message = error.message?.toLowerCase() || '';
    const stack = error.stack?.toLowerCase() || '';

    // Critical errors
    if (message.includes('network error') || 
        message.includes('failed to fetch') ||
        stack.includes('out of memory')) {
      return 'critical';
    }

    // High severity errors
    if (message.includes('typeerror') ||
        message.includes('referenceerror') ||
        message.includes('syntaxerror') ||
        stack.includes('react') ||
        stack.includes('next')) {
      return 'high';
    }

    // Medium severity errors
    if (message.includes('warning') ||
        message.includes('deprecated')) {
      return 'medium';
    }

    return 'low';
  }

  private gatherContext(): Record<string, any> {
    const context: Record<string, any> = {
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      viewportSize: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      screenSize: {
        width: screen.width,
        height: screen.height
      },
      connectionType: (navigator as any).connection?.effectiveType || 'unknown'
    };

    // Add custom context
    if (typeof window !== 'undefined' && window.__ERROR_CONTEXT__) {
      Object.assign(context, window.__ERROR_CONTEXT__);
    }

    return context;
  }

  private shouldReportError(): boolean {
    const now = Date.now();
    
    // Reset rate limit counter if window has passed
    if (this.rateLimitCount > 0) {
      const oldestError = this.errorQueue[Math.max(0, this.errorQueue.length - this.rateLimitCount)];
      if (oldestError && now - oldestError.timestamp > this.rateLimitWindow) {
        this.rateLimitCount = 0;
      }
    }

    if (this.rateLimitCount >= this.maxErrorsPerWindow) {
      return false;
    }

    this.rateLimitCount++;
    return true;
  }

  private sendToErrorService(error: ErrorReport): void {
    // Here you would integrate with your preferred error monitoring service
    // Examples: Sentry, LogRocket, Bugsnag, Rollbar, etc.
    
    if (this.isProduction) {
      // Example implementation for a custom endpoint
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(error),
      }).catch(() => {
        // Silently fail if error reporting fails
      });
    }
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  public getErrorQueue(): ErrorReport[] {
    return [...this.errorQueue];
  }

  public clearErrorQueue(): void {
    this.errorQueue = [];
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export const errorMonitor = new ErrorMonitoringService();

// Convenience functions
export const reportError = errorMonitor.reportError.bind(errorMonitor);
export const addBreadcrumb = errorMonitor.addBreadcrumb.bind(errorMonitor);
export const setContext = errorMonitor.setContext.bind(errorMonitor);
export const setUser = errorMonitor.setUser.bind(errorMonitor);

// Types export
export type { ErrorReport, Breadcrumb, NetworkError };