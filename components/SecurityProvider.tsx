"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Temporary simplified security provider to get the app running
// TODO: Fix security imports later

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
  value: string;
  style: React.CSSProperties;
}

interface SecurityEvent {
  type: 'suspicious_input' | 'validation_failure' | 'honeypot_triggered' | 'rate_limit' | 'csrf_failure';
  details: string;
  timestamp: number;
  userAgent?: string;
  ip?: string;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

// Simple ID generator
function generateId(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function SecurityProvider({ children }: { children: ReactNode }) {
  const [csrfToken, setCsrfToken] = useState('');
  const [nonce, setNonce] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isSecure, setIsSecure] = useState(false);

  useEffect(() => {
    initializeSecurity();
  }, []);

  const initializeSecurity = () => {
    // Generate session ID if not exists
    let currentSessionId = '';
    if (typeof window !== 'undefined') {
      currentSessionId = sessionStorage.getItem('session-id') || '';
      if (!currentSessionId) {
        currentSessionId = generateId(32);
        sessionStorage.setItem('session-id', currentSessionId);
      }
    }

    // Generate CSRF token
    const token = generateId(32);
    
    // Generate nonce for CSP
    const currentNonce = generateId(16);

    // Check if connection is secure
    const secure = typeof window !== 'undefined' && window.location.protocol === 'https:';

    setSessionId(currentSessionId);
    setCsrfToken(token);
    setNonce(currentNonce);
    setIsSecure(secure);
  };

  const generateHoneypot = (): HoneypotField => {
    const names = ['username', 'email_confirm', 'website', 'url', 'company'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    
    return {
      name: `hp_${randomName}_${Date.now()}`,
      value: '',
      style: {
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        opacity: 0,
        height: 0,
        width: 0,
        tabIndex: -1,
        pointerEvents: 'none'
      } as React.CSSProperties
    };
  };

  const validateInput = (input: string, type: 'email' | 'name' | 'message' | 'phone'): boolean => {
    if (!input || typeof input !== 'string') return false;

    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input) && input.length <= 254;
      
      case 'name':
        const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']{2,50}$/;
        return nameRegex.test(input);
      
      case 'phone':
        const phoneRegex = /^[\d\s\-\+\(\)]{10,20}$/;
        return phoneRegex.test(input);
      
      case 'message':
        return input.length >= 10 && input.length <= 1000;
      
      default:
        return false;
    }
  };

  const sanitizeInput = (input: string): string => {
    if (!input || typeof input !== 'string') return '';
    
    // Basic HTML entity encoding
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .trim();
  };

  const reportSecurityEvent = (event: SecurityEvent) => {
    console.warn('Security Event:', event);
    // In production, send to monitoring service
  };

  const value: SecurityContextType = {
    csrfToken,
    nonce,
    sessionId,
    isSecure,
    generateHoneypot,
    validateInput,
    sanitizeInput,
    reportSecurityEvent
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}