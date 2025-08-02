"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SecurityUtils } from '@/lib/security';

// =============================================================================
// SECURITY CONTEXT
// =============================================================================

interface SecurityContextType {
  csrfToken: string;
  nonce: string;
  sessionId: string;
  isSecure: boolean;
  generateHoneypot: () => HoneypotField;
  validateInput: (input: string, type: 'email' | 'name' | 'message' | 'phone') => boolean;
  sanitizeInput: (input: string) => string;
  reportSecurityEvent: (event: SecurityEvent) => void;
}

interface HoneypotField {
  name: string;
  style: React.CSSProperties;
  'aria-hidden': boolean;
  tabIndex: number;
  autoComplete: string;
}

interface SecurityEvent {
  type: 'csrf_failure' | 'xss_attempt' | 'injection_attempt' | 'bot_detected';
  details: string;
  timestamp: number;
  url: string;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

// =============================================================================
// SECURITY PROVIDER COMPONENT
// =============================================================================

interface SecurityProviderProps {
  children: ReactNode;
}

export default function SecurityProvider({ children }: SecurityProviderProps) {
  const [csrfToken, setCsrfToken] = useState('');
  const [nonce, setNonce] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isSecure, setIsSecure] = useState(false);

  useEffect(() => {
    initializeSecurity();
  }, []);

  const initializeSecurity = () => {
    // Generate session ID if not exists
    let currentSessionId = sessionStorage.getItem('session-id');
    if (!currentSessionId) {
      currentSessionId = SecurityUtils.generateSecureId(32);
      sessionStorage.setItem('session-id', currentSessionId);
    }

    // Generate CSRF token
    const token = SecurityUtils.generateSecureId(32);
    
    // Generate nonce for CSP
    const currentNonce = SecurityUtils.generateNonce();

    // Check if connection is secure
    const secure = window.location.protocol === 'https:' || 
                   window.location.hostname === 'localhost';

    setCsrfToken(token);
    setNonce(currentNonce);
    setSessionId(currentSessionId);
    setIsSecure(secure);

    // Set up security monitoring
    setupSecurityMonitoring();

    console.log('🔐 Security context initialized');
  };

  const generateHoneypot = (): HoneypotField => {
    const honeypotNames = [
      'url', 'website', 'homepage', 'link', 'address', 
      'city', 'zip', 'fax', 'subject', 'title'
    ];
    
    const randomName = honeypotNames[Math.floor(Math.random() * honeypotNames.length)];
    
    return {
      name: randomName,
      style: {
        position: 'absolute',
        left: '-9999px',
        width: '1px',
        height: '1px',
        opacity: 0,
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        clipPath: 'inset(50%)',
        whiteSpace: 'nowrap',
      },
      'aria-hidden': true,
      tabIndex: -1,
      autoComplete: 'off',
    };
  };

  const validateInput = (input: string, type: 'email' | 'name' | 'message' | 'phone'): boolean => {
    // Basic XSS pattern detection
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    ];

    // SQL injection pattern detection
    const sqlPatterns = [
      /union.*select/gi,
      /drop.*table/gi,
      /insert.*into/gi,
      /delete.*from/gi,
      /update.*set/gi,
      /exec\s*\(/gi,
    ];

    const allPatterns = [...xssPatterns, ...sqlPatterns];
    
    for (const pattern of allPatterns) {
      if (pattern.test(input)) {
        reportSecurityEvent({
          type: 'injection_attempt',
          details: `Suspicious pattern detected in ${type} field`,
          timestamp: Date.now(),
          url: window.location.href
        });
        return false;
      }
    }

    // Type-specific validation
    switch (type) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input) && input.length <= 254;
      case 'name':
        return /^[a-zA-ZÀ-ÿ\s\-'\.]{2,50}$/.test(input.trim());
      case 'phone':
        return /^\+?[1-9]\d{1,14}$/.test(input.replace(/[\s\-\(\)]/g, ''));
      case 'message':
        return input.trim().length >= 10 && input.trim().length <= 2000;
      default:
        return true;
    }
  };

  const sanitizeInput = (input: string): string => {
    return input
      .replace(/[<>\"']/g, (match) => {
        const entities: Record<string, string> = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;'
        };
        return entities[match];
      })
      .trim();
  };

  const reportSecurityEvent = (event: SecurityEvent): void => {
    console.warn('🚨 Security event:', event);
    
    // In production, send to security monitoring service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'security_event', {
        event_category: 'security',
        event_label: event.type,
        custom_parameters: {
          details: event.details,
          url: event.url
        }
      });
    }

    // Store in local storage for debugging (dev only)
    if (process.env.NODE_ENV === 'development') {
      const events = JSON.parse(localStorage.getItem('security_events') || '[]');
      events.push(event);
      localStorage.setItem('security_events', JSON.stringify(events.slice(-100))); // Keep last 100
    }
  };

  const setupSecurityMonitoring = () => {
    // Monitor for suspicious console activity
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      // Check for console-based attacks
      const message = args.join(' ');
      if (message.includes('password') || message.includes('token')) {
        reportSecurityEvent({
          type: 'xss_attempt',
          details: 'Suspicious console activity detected',
          timestamp: Date.now(),
          url: window.location.href
        });
      }
      originalConsoleLog.apply(console, args);
    };

    // Monitor for right-click disable attempts
    document.addEventListener('contextmenu', (e) => {
      // Allow right-click but monitor for bot-like behavior
      if (e.isTrusted === false) {
        reportSecurityEvent({
          type: 'bot_detected',
          details: 'Non-trusted context menu event',
          timestamp: Date.now(),
          url: window.location.href
        });
      }
    });

    // Monitor for rapid form submissions (bot detection)
    let formSubmissionCount = 0;
    let lastSubmissionTime = 0;

    document.addEventListener('submit', (e) => {
      const now = Date.now();
      const timeDiff = now - lastSubmissionTime;

      if (timeDiff < 1000) { // Less than 1 second between submissions
        formSubmissionCount++;
        if (formSubmissionCount > 3) {
          reportSecurityEvent({
            type: 'bot_detected',
            details: 'Rapid form submissions detected',
            timestamp: Date.now(),
            url: window.location.href
          });
        }
      } else {
        formSubmissionCount = 0;
      }

      lastSubmissionTime = now;
    });

    // Monitor for copy-paste of large amounts of text (potential attack)
    document.addEventListener('paste', (e) => {
      const clipboardData = e.clipboardData?.getData('text') || '';
      if (clipboardData.length > 1000) {
        reportSecurityEvent({
          type: 'injection_attempt',
          details: 'Large text paste detected',
          timestamp: Date.now(),
          url: window.location.href
        });
      }
    });
  };

  const contextValue: SecurityContextType = {
    csrfToken,
    nonce,
    sessionId,
    isSecure,
    generateHoneypot,
    validateInput,
    sanitizeInput,
    reportSecurityEvent,
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
}

// =============================================================================
// SECURITY HOOKS
// =============================================================================

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}

// =============================================================================
// SECURE FORM COMPONENTS
// =============================================================================

interface SecureFormProps {
  children: ReactNode;
  onSubmit: (data: FormData, securityContext: SecurityContextType) => void;
  className?: string;
  validateOnChange?: boolean;
}

export function SecureForm({ children, onSubmit, className, validateOnChange = true }: SecureFormProps) {
  const security = useSecurity();
  const honeypot = security.generateHoneypot();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    
    // Check honeypot
    const honeypotValue = formData.get(honeypot.name);
    if (honeypotValue && honeypotValue.toString().trim() !== '') {
      security.reportSecurityEvent({
        type: 'bot_detected',
        details: 'Honeypot field filled',
        timestamp: Date.now(),
        url: window.location.href
      });
      return; // Silently fail for bots
    }

    // Add security context to form data
    formData.append('csrf_token', security.csrfToken);
    formData.append('session_id', security.sessionId);
    formData.append('nonce', security.nonce);

    onSubmit(formData, security);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {/* Honeypot field */}
      <input
        type="text"
        name={honeypot.name}
        style={honeypot.style}
        aria-hidden={honeypot['aria-hidden']}
        tabIndex={honeypot.tabIndex}
        autoComplete={honeypot.autoComplete}
      />
      
      {children}
    </form>
  );
}

// =============================================================================
// SECURE INPUT COMPONENT
// =============================================================================

interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  securityType: 'email' | 'name' | 'message' | 'phone';
  onSecurityError?: (error: string) => void;
}

export function SecureInput({ securityType, onSecurityError, onChange, ...props }: SecureInputProps) {
  const security = useSecurity();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!security.validateInput(value, securityType)) {
      onSecurityError?.(`Invalid ${securityType} format or security violation detected`);
      return;
    }

    // Call original onChange with sanitized value
    if (onChange) {
      const sanitizedValue = security.sanitizeInput(value);
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: sanitizedValue
        }
      };
      onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <input
      {...props}
      onChange={handleChange}
      autoComplete={securityType === 'email' ? 'email' : securityType === 'name' ? 'name' : 'off'}
    />
  );
}