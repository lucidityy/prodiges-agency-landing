import { NextRequest, NextResponse } from 'next/server';
import { SecurityUtils, InputValidator, CSRFProtection, RATE_LIMITS } from './lib/security';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// =============================================================================
// SECURITY MIDDLEWARE
// =============================================================================

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname, origin } = request.nextUrl;
  
  // Security context
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer');
  
  // Log security events
  console.log(`🔒 Security check: ${request.method} ${pathname} from ${ip}`);

  // 1. Rate limiting
  if (shouldApplyRateLimit(pathname)) {
    const rateLimitResult = checkRateLimit(ip, pathname);
    if (!rateLimitResult.allowed) {
      console.warn(`🚫 Rate limit exceeded for ${ip} on ${pathname}`);
      return createRateLimitResponse(rateLimitResult);
    }
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());
  }

  // 2. Origin validation for API routes
  if (pathname.startsWith('/api/') && request.method !== 'GET') {
    if (!validateOrigin(request)) {
      console.warn(`🚫 Invalid origin for ${ip}: ${request.headers.get('origin')}`);
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  // 3. CSRF protection for state-changing operations
  if (shouldValidateCSRF(request)) {
    const isValidCSRF = validateCSRF(request);
    if (!isValidCSRF) {
      console.warn(`🚫 CSRF validation failed for ${ip} on ${pathname}`);
      return new NextResponse('CSRF validation failed', { status: 403 });
    }
  }

  // 4. Suspicious activity detection
  if (detectSuspiciousActivity(request, ip)) {
    console.warn(`🚫 Suspicious activity detected for ${ip}`);
    return new NextResponse('Access denied', { status: 403 });
  }

  // 5. Add security headers to response
  addSecurityHeaders(response, request);

  // 6. Content type validation for API routes
  if (pathname.startsWith('/api/') && request.method !== 'GET') {
    if (!validateContentType(request)) {
      return new NextResponse('Invalid content type', { status: 400 });
    }
  }

  return response;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  return request.ip || 'unknown';
}

function shouldApplyRateLimit(pathname: string): boolean {
  return (
    pathname.startsWith('/api/') ||
    pathname.includes('contact') ||
    pathname.includes('newsletter') ||
    pathname.includes('auth')
  );
}

function getRateLimitKey(pathname: string): string {
  if (pathname.includes('contact')) return 'contact';
  if (pathname.includes('newsletter')) return 'newsletter';
  if (pathname.includes('auth')) return 'auth';
  return 'api';
}

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

function checkRateLimit(ip: string, pathname: string): RateLimitResult {
  const key = getRateLimitKey(pathname);
  const config = RATE_LIMITS[key];
  const rateLimitKey = `${key}:${ip}`;
  
  const now = Date.now();
  const windowStart = now - config.windowMs;
  
  let entry = rateLimitStore.get(rateLimitKey);
  
  if (!entry || entry.resetTime <= now) {
    // Create new window
    entry = {
      count: 1,
      resetTime: now + config.windowMs
    };
    rateLimitStore.set(rateLimitKey, entry);
    
    return {
      allowed: true,
      limit: config.max,
      remaining: config.max - 1,
      resetTime: entry.resetTime
    };
  }
  
  // Update existing window
  entry.count++;
  rateLimitStore.set(rateLimitKey, entry);
  
  const remaining = Math.max(0, config.max - entry.count);
  const allowed = entry.count <= config.max;
  
  return {
    allowed,
    limit: config.max,
    remaining,
    resetTime: entry.resetTime,
    retryAfter: allowed ? undefined : Math.ceil((entry.resetTime - now) / 1000)
  };
}

function createRateLimitResponse(result: RateLimitResult): NextResponse {
  const response = new NextResponse('Too Many Requests', { status: 429 });
  
  response.headers.set('X-RateLimit-Limit', result.limit.toString());
  response.headers.set('X-RateLimit-Remaining', '0');
  response.headers.set('X-RateLimit-Reset', result.resetTime.toString());
  
  if (result.retryAfter) {
    response.headers.set('Retry-After', result.retryAfter.toString());
  }
  
  return response;
}

function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  
  if (!origin) return false;
  
  const allowedOrigins = [
    'https://prodiges.agency',
    'https://www.prodiges.agency',
    ...(process.env.NODE_ENV === 'development' ? [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ] : [])
  ];
  
  return allowedOrigins.includes(origin) || origin.includes(host || '');
}

function shouldValidateCSRF(request: NextRequest): boolean {
  const { pathname, searchParams } = request.nextUrl;
  
  // Skip CSRF for safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return false;
  }
  
  // Skip CSRF for public API endpoints
  if (pathname.includes('/api/public/')) {
    return false;
  }
  
  // Apply CSRF protection to form submissions and state-changing operations
  return (
    pathname.startsWith('/api/') ||
    pathname.includes('contact') ||
    pathname.includes('newsletter') ||
    pathname.includes('auth')
  );
}

function validateCSRF(request: NextRequest): boolean {
  const token = CSRFProtection.extractToken(request);
  const sessionId = request.cookies.get('session-id')?.value || 'anonymous';
  
  if (!token) {
    // For now, allow requests without CSRF token (progressive enhancement)
    return true;
  }
  
  return CSRFProtection.validateToken(token, sessionId);
}

function detectSuspiciousActivity(request: NextRequest, ip: string): boolean {
  const userAgent = request.headers.get('user-agent') || '';
  const { pathname } = request.nextUrl;
  
  // Check for bot-like user agents
  const suspiciousUAs = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scanner/i,
    /curl/i,
    /wget/i,
  ];
  
  const isSuspiciousUA = suspiciousUAs.some(pattern => pattern.test(userAgent));
  
  // Check for suspicious request patterns
  const suspiciousPatterns = [
    /\.\.(\/|%2f)/i,  // Path traversal
    /<script/i,       // XSS attempts
    /union.*select/i, // SQL injection
    /javascript:/i,   // JavaScript injection
    /data:text\/html/i, // Data URI XSS
  ];
  
  const hasSuspiciousPattern = suspiciousPatterns.some(pattern => 
    pattern.test(pathname) || pattern.test(request.url)
  );
  
  // Check request frequency (basic bot detection)
  const requestKey = `requests:${ip}`;
  const requestCount = rateLimitStore.get(requestKey)?.count || 0;
  
  if (requestCount > 100) { // More than 100 requests in rate limit window
    return true;
  }
  
  return isSuspiciousUA && hasSuspiciousPattern;
}

function addSecurityHeaders(response: NextResponse, request: NextRequest): void {
  // Add security headers that aren't set by Next.js config
  const nonce = SecurityUtils.generateNonce();
  
  response.headers.set('X-Request-ID', SecurityUtils.generateSecureId(16));
  response.headers.set('X-Content-Security-Policy-Nonce', nonce);
  
  // Add timing headers for monitoring
  response.headers.set('X-Response-Time', Date.now().toString());
  
  // CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    
    if (origin && validateOrigin(request)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
      response.headers.set('Access-Control-Max-Age', '86400');
    }
  }
}

function validateContentType(request: NextRequest): boolean {
  const contentType = request.headers.get('content-type');
  
  if (!contentType) return true; // Allow requests without content-type
  
  const allowedTypes = [
    'application/json',
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'text/plain',
  ];
  
  return allowedTypes.some(type => contentType.includes(type));
}

// =============================================================================
// CONFIGURATION
// =============================================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public|icons|fonts).*)',
  ],
};

// Cleanup old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime <= now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Cleanup every minute