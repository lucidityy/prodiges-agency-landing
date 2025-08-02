/**
 * Security utilities and configurations for Prodiges Agency
 * Enterprise-grade security implementation
 */

// =============================================================================
// CONTENT SECURITY POLICY CONFIGURATION
// =============================================================================

export const CSP_POLICIES = {
  // Production CSP - Strict security
  production: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Only for critical inline scripts
      "'unsafe-eval'", // Remove in production if possible
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://connect.facebook.net',
      'https://cdn.jsdelivr.net',
      'https://unpkg.com', // Remove if not needed
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for dynamic styles
      'https://fonts.googleapis.com',
      'https://cdn.jsdelivr.net',
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https:',
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
    ],
    'font-src': [
      "'self'",
      'data:',
      'https://fonts.gstatic.com',
      'https://cdn.jsdelivr.net',
    ],
    'connect-src': [
      "'self'",
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
      'https://region1.google-analytics.com',
      'https://api.prodiges.agency',
      'wss:',
    ],
    'media-src': ["'self'", 'blob:', 'data:'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': [],
  },
  
  // Development CSP - More permissive for hot reload
  development: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'localhost:*',
      '127.0.0.1:*',
      'ws:',
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'",
      'https://fonts.googleapis.com',
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https:',
      'localhost:*',
      '127.0.0.1:*',
    ],
    'font-src': [
      "'self'",
      'data:',
      'https://fonts.gstatic.com',
    ],
    'connect-src': [
      "'self'",
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
      'localhost:*',
      '127.0.0.1:*',
      'ws:',
      'wss:',
    ],
    'media-src': ["'self'", 'blob:', 'data:'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
  }
};

export function generateCSPHeader(env: 'production' | 'development' = 'production'): string {
  const policies = CSP_POLICIES[env];
  
  return Object.entries(policies)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive;
      }
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');
}

// =============================================================================
// SECURITY HEADERS CONFIGURATION
// =============================================================================

export const SECURITY_HEADERS = {
  // Prevent XSS attacks
  'X-XSS-Protection': '1; mode=block',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // HSTS - Force HTTPS
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions policy (Feature Policy)
  'Permissions-Policy': [
    'geolocation=*',
    'microphone=()',
    'camera=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()',
    'ambient-light-sensor=()',
    'autoplay=self',
    'encrypted-media=self',
    'fullscreen=self',
    'picture-in-picture=self'
  ].join(', '),
  
  // Cross-Origin policies
  'Cross-Origin-Embedder-Policy': 'credentialless',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

// =============================================================================
// RATE LIMITING CONFIGURATION
// =============================================================================

export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  standardHeaders: boolean;
  legacyHeaders: boolean;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // General API rate limit
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  },
  
  // Contact form rate limit
  contact: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 contact form submissions per hour
    message: 'Too many contact form submissions, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
  },
  
  // Newsletter signup rate limit
  newsletter: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 newsletter signups per hour
    message: 'Too many newsletter signups, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
  },
  
  // Authentication rate limit
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 authentication attempts per windowMs
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
  }
};

// =============================================================================
// INPUT VALIDATION & SANITIZATION
// =============================================================================

export class InputValidator {
  // Email validation
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  // Phone validation (international format)
  static validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  // Name validation (letters, spaces, hyphens, apostrophes)
  static validateName(name: string): boolean {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s\-'\.]{2,50}$/;
    return nameRegex.test(name.trim());
  }

  // Message validation
  static validateMessage(message: string): boolean {
    const trimmed = message.trim();
    return trimmed.length >= 10 && trimmed.length <= 2000;
  }

  // Company name validation
  static validateCompany(company: string): boolean {
    const trimmed = company.trim();
    return trimmed.length >= 2 && trimmed.length <= 100;
  }

  // URL validation
  static validateURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Sanitize HTML input (basic)
  static sanitizeHTML(input: string): string {
    return input
      .replace(/[<>\"']/g, (match) => {
        const entities: Record<string, string> = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;'
        };
        return entities[match];
      });
  }

  // Sanitize for SQL (basic - should use parameterized queries)
  static sanitizeSQL(input: string): string {
    return input.replace(/['";\\]/g, '');
  }

  // Rate limit key generator
  static getRateLimitKey(ip: string, endpoint: string): string {
    return `rate_limit:${endpoint}:${ip}`;
  }
}

// =============================================================================
// CSRF PROTECTION
// =============================================================================

export class CSRFProtection {
  private static readonly SECRET = process.env.CSRF_SECRET || 'default-secret-change-me';
  
  // Generate CSRF token
  static generateToken(sessionId: string): string {
    const timestamp = Date.now().toString();
    const data = `${sessionId}:${timestamp}`;
    
    // In production, use a proper HMAC library
    const token = Buffer.from(data).toString('base64');
    return token;
  }

  // Validate CSRF token
  static validateToken(token: string, sessionId: string): boolean {
    try {
      const decoded = Buffer.from(token, 'base64').toString();
      const [receivedSessionId, timestamp] = decoded.split(':');
      
      // Check if token matches session
      if (receivedSessionId !== sessionId) {
        return false;
      }

      // Check if token is not too old (15 minutes)
      const tokenAge = Date.now() - parseInt(timestamp);
      const maxAge = 15 * 60 * 1000; // 15 minutes
      
      return tokenAge <= maxAge;
    } catch {
      return false;
    }
  }

  // Get CSRF token from headers or body
  static extractToken(request: Request): string | null {
    // Check X-CSRF-Token header
    const headerToken = request.headers.get('X-CSRF-Token');
    if (headerToken) return headerToken;

    // Check form data
    if (request.method === 'POST') {
      // Would need to parse form data here
      // return formData.get('csrf_token');
    }

    return null;
  }
}

// =============================================================================
// SECURITY UTILITIES
// =============================================================================

export class SecurityUtils {
  // Generate secure random string
  static generateSecureId(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  // Hash password (basic - use bcrypt in production)
  static async hashPassword(password: string): Promise<string> {
    // In production, use bcrypt or similar
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Verify password hash
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    const passwordHash = await this.hashPassword(password);
    return passwordHash === hash;
  }

  // Check if IP is suspicious
  static isSuspiciousIP(ip: string): boolean {
    // Basic checks for suspicious IPs
    const suspiciousPatterns = [
      /^10\./, // Private network
      /^192\.168\./, // Private network
      /^172\.(1[6-9]|2[0-9]|3[01])\./, // Private network
      /^127\./, // Localhost
    ];

    // In production, you'd check against threat intelligence feeds
    return false; // suspiciousPatterns.some(pattern => pattern.test(ip));
  }

  // Generate nonce for CSP
  static generateNonce(): string {
    return this.generateSecureId(16);
  }

  // Validate origin header
  static validateOrigin(origin: string, allowedOrigins: string[]): boolean {
    return allowedOrigins.includes(origin);
  }
}

// =============================================================================
// SECURITY MIDDLEWARE TYPES
// =============================================================================

export interface SecurityMiddlewareOptions {
  csp?: boolean;
  rateLimit?: string; // rate limit key
  csrf?: boolean;
  validateOrigin?: boolean;
  allowedOrigins?: string[];
}

export interface SecurityContext {
  ip: string;
  userAgent: string;
  origin?: string;
  sessionId?: string;
  nonce?: string;
}