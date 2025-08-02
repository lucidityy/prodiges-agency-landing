/**
 * Global TypeScript definitions for Prodiges Agency
 * Centralized type definitions for better maintainability
 */

// =============================================================================
// CORE TYPES
// =============================================================================

export interface BaseEntity {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// =============================================================================
// COMPONENT PROPS TYPES
// =============================================================================

export interface ComponentWithChildren {
  children: React.ReactNode;
}

export interface ComponentWithClassName {
  className?: string;
}

export interface AnimatedComponentProps extends ComponentWithClassName {
  delay?: number;
  duration?: number;
  disabled?: boolean;
}

// =============================================================================
// BUSINESS DOMAIN TYPES
// =============================================================================

export interface Audience extends BaseEntity {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  benefits: string[];
  color: string;
  category?: 'startup' | 'established' | 'enterprise';
  priority?: number;
}

export interface Testimonial extends BaseEntity {
  name: string;
  role: string;
  company?: string;
  avatar: string;
  content: string;
  rating: number;
  growth?: string;
  verified?: boolean;
  featured?: boolean;
}

export interface Service extends BaseEntity {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  details: string[];
  pricing?: {
    startingAt: number;
    currency: 'EUR' | 'USD';
    billingPeriod: 'month' | 'project' | 'hour';
  };
  category: 'branding' | 'web' | 'marketing' | 'strategy';
  featured?: boolean;
}

export interface CaseStudy extends BaseEntity {
  client: string;
  industry: string;
  metric: string;
  mainResult: string;
  description: string;
  tags: string[];
  color: string;
  duration?: string;
  budget?: string;
  testimonial?: Testimonial;
  images?: string[];
  url?: string;
}

export interface FAQ extends BaseEntity {
  question: string;
  answer: string;
  category: 'general' | 'pricing' | 'process' | 'technical';
  priority?: number;
  relatedQuestions?: string[];
}

// =============================================================================
// ANIMATION TYPES
// =============================================================================

export interface AnimationVariant {
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  exit?: Record<string, any>;
  hover?: Record<string, any>;
  tap?: Record<string, any>;
  focus?: Record<string, any>;
}

export interface TransitionConfig {
  type?: 'spring' | 'tween' | 'keyframes';
  duration?: number;
  delay?: number;
  ease?: string | number[];
  stiffness?: number;
  damping?: number;
  mass?: number;
  velocity?: number;
}

export interface MotionProps {
  variants?: AnimationVariant;
  initial?: string | Record<string, any>;
  animate?: string | Record<string, any>;
  exit?: string | Record<string, any>;
  transition?: TransitionConfig;
  whileHover?: Record<string, any>;
  whileTap?: Record<string, any>;
  whileFocus?: Record<string, any>;
  viewport?: {
    once?: boolean;
    amount?: number;
    margin?: string;
  };
}

// =============================================================================
// FORM TYPES
// =============================================================================

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
  phone?: string;
  budget?: 'under-10k' | '10k-50k' | '50k-100k' | 'over-100k';
  timeline?: 'asap' | '1-3months' | '3-6months' | 'flexible';
  services?: Service['category'][];
  source?: 'google' | 'social' | 'referral' | 'other';
}

export interface NewsletterFormData {
  email: string;
  interests?: Service['category'][];
  frequency?: 'weekly' | 'monthly' | 'important-only';
}

// =============================================================================
// API TYPES
// =============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: Record<string, any>;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, any>;
}

// =============================================================================
// SEO TYPES
// =============================================================================

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  jsonLd?: Record<string, any>;
  noindex?: boolean;
  nofollow?: boolean;
}

// =============================================================================
// PERFORMANCE TYPES
// =============================================================================

export interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

export interface LazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  fallback?: React.ComponentType;
  skeleton?: React.ComponentType;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type WithLoading<T> = T & {
  isLoading?: boolean;
  error?: string | null;
};

export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ComponentVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'outline';

export type ThemeColor = 'primary' | 'secondary' | 'accent' | 'gray' | 'success' | 'warning' | 'error';

// =============================================================================
// EVENT TYPES
// =============================================================================

export interface AnalyticsEvent {
  name: string;
  category: 'engagement' | 'conversion' | 'navigation' | 'error';
  data?: Record<string, any>;
  timestamp?: Date;
  userId?: string;
  sessionId?: string;
}

export interface ScrollEvent {
  direction: 'up' | 'down';
  position: number;
  percentage: number;
  element?: HTMLElement;
}

// =============================================================================
// CONFIGURATION TYPES
// =============================================================================

export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  analytics: {
    enabled: boolean;
    trackingId?: string;
  };
  features: {
    animations: boolean;
    lazyLoading: boolean;
    serviceWorker: boolean;
  };
  seo: {
    defaultTitle: string;
    titleTemplate: string;
    defaultDescription: string;
    siteUrl: string;
  };
}

// =============================================================================
// HOOK TYPES
// =============================================================================

export interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prevValue: T) => T)) => void;
  removeValue: () => void;
}

// =============================================================================
// EXPORTS
// =============================================================================

export * from './animation-config';

// Re-export common React types for convenience
export type { 
  ComponentType, 
  ReactNode, 
  ReactElement, 
  FC, 
  PropsWithChildren,
  CSSProperties,
  HTMLAttributes,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  FormHTMLAttributes
} from 'react';