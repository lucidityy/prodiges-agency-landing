/**
 * Security configuration for next.config.js
 * CommonJS module for Node.js compatibility
 */

const CSP_POLICIES = {
  production: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://connect.facebook.net',
      'https://cdn.jsdelivr.net',
      'https://unpkg.com',
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'",
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
    'frame-src': ["'self'", 'https://www.youtube.com'],
    'frame-ancestors': ["'self'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'manifest-src': ["'self'"],
    'worker-src': ["'self'", 'blob:'],
    'child-src': ["'self'", 'blob:'],
  },
  development: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      'http://localhost:*',
      'ws://localhost:*',
    ],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:', 'http:', 'https:'],
    'font-src': ["'self'", 'data:'],
    'connect-src': [
      "'self'",
      'http://localhost:*',
      'ws://localhost:*',
      'wss://localhost:*',
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
    ],
    'media-src': ["'self'", 'blob:', 'data:'],
    'object-src': ["'none'"],
    'frame-src': ["'self'"],
    'frame-ancestors': ["'self'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'manifest-src': ["'self'"],
    'worker-src': ["'self'", 'blob:'],
    'child-src': ["'self'", 'blob:'],
  },
};

const SECURITY_HEADERS = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

function generateCSPHeader(environment = 'production') {
  const policy = CSP_POLICIES[environment] || CSP_POLICIES.production;
  
  return Object.entries(policy)
    .map(([directive, values]) => {
      return `${directive} ${values.join(' ')}`;
    })
    .join('; ');
}

module.exports = {
  CSP_POLICIES,
  SECURITY_HEADERS,
  generateCSPHeader,
};