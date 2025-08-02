"use client";

import { motion } from 'framer-motion';
import { useCTATracking, useInteractionTracking, useFormTracking } from '@/hooks/useAnalytics';
import { forwardRef, ButtonHTMLAttributes, AnchorHTMLAttributes, FormHTMLAttributes } from 'react';

// =============================================================================
// TRACKED BUTTON COMPONENT
// =============================================================================

interface TrackedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  trackingName: string;
  trackingValue?: number;
  trackingCategory?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  motionProps?: any;
}

export const TrackedButton = forwardRef<HTMLButtonElement, TrackedButtonProps>(
  ({ 
    trackingName, 
    trackingValue, 
    trackingCategory = 'button',
    variant = 'primary',
    size = 'md',
    children, 
    onClick,
    motionProps,
    className = '',
    ...props 
  }, ref) => {
    const { trackCTAClick } = useCTATracking();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      // Track the interaction
      trackCTAClick(trackingName, trackingValue, {
        category: trackingCategory,
        variant,
        size,
        text: typeof children === 'string' ? children : trackingName
      });

      // Call original onClick
      if (onClick) {
        onClick(event);
      }
    };

    const baseClasses = 'font-medium rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2';
    
    const variantClasses = {
      primary: 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-105',
      secondary: 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white',
      ghost: 'text-primary hover:bg-primary/10'
    };

    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg'
    };

    const combinedClassName = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    if (motionProps) {
      return (
        <motion.button
          ref={ref}
          onClick={handleClick}
          className={combinedClassName}
          {...motionProps}
          {...props}
        >
          {children}
        </motion.button>
      );
    }

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={combinedClassName}
        {...props}
      >
        {children}
      </button>
    );
  }
);

TrackedButton.displayName = 'TrackedButton';

// =============================================================================
// TRACKED LINK COMPONENT
// =============================================================================

interface TrackedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  trackingName: string;
  trackingValue?: number;
  trackingCategory?: string;
  children: React.ReactNode;
  motionProps?: any;
}

export const TrackedLink = forwardRef<HTMLAnchorElement, TrackedLinkProps>(
  ({ 
    trackingName, 
    trackingValue, 
    trackingCategory = 'link',
    children, 
    onClick,
    href,
    motionProps,
    className = '',
    ...props 
  }, ref) => {
    const { trackCTAClick, trackEmailClick, trackPhoneClick } = useCTATracking();

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      // Detect special link types
      if (href?.startsWith('mailto:')) {
        trackEmailClick(href.replace('mailto:', ''));
      } else if (href?.startsWith('tel:')) {
        trackPhoneClick(href.replace('tel:', ''));
      } else {
        trackCTAClick(trackingName, trackingValue, {
          category: trackingCategory,
          href,
          text: typeof children === 'string' ? children : trackingName,
          external: href?.startsWith('http') && !href.includes(window.location.hostname)
        });
      }

      // Call original onClick
      if (onClick) {
        onClick(event);
      }
    };

    if (motionProps) {
      return (
        <motion.a
          ref={ref}
          href={href}
          onClick={handleClick}
          className={className}
          {...motionProps}
          {...props}
        >
          {children}
        </motion.a>
      );
    }

    return (
      <a
        ref={ref}
        href={href}
        onClick={handleClick}
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  }
);

TrackedLink.displayName = 'TrackedLink';

// =============================================================================
// TRACKED FORM COMPONENT
// =============================================================================

interface TrackedFormProps extends FormHTMLAttributes<HTMLFormElement> {
  formName: string;
  children: React.ReactNode;
  onSubmitSuccess?: (data: any) => void;
  onSubmitError?: (error: string) => void;
}

export const TrackedForm = forwardRef<HTMLFormElement, TrackedFormProps>(
  ({ 
    formName,
    children, 
    onSubmit,
    onSubmitSuccess,
    onSubmitError,
    className = '',
    ...props 
  }, ref) => {
    const { trackFormStart, trackFormComplete, trackFormError } = useFormTracking(formName);

    const handleFocus = () => {
      trackFormStart();
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      
      try {
        // Get form data
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

        // Track form completion
        trackFormComplete({
          fields: Object.keys(data),
          fieldCount: Object.keys(data).length
        });

        // Call original onSubmit
        if (onSubmit) {
          await onSubmit(event);
        }

        // Call success callback
        if (onSubmitSuccess) {
          onSubmitSuccess(data);
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        // Track form error
        trackFormError(errorMessage);

        // Call error callback
        if (onSubmitError) {
          onSubmitError(errorMessage);
        }
      }
    };

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        onFocus={handleFocus}
        className={className}
        {...props}
      >
        {children}
      </form>
    );
  }
);

TrackedForm.displayName = 'TrackedForm';

// =============================================================================
// TRACKED SECTION COMPONENT
// =============================================================================

interface TrackedSectionProps {
  sectionName: string;
  children: React.ReactNode;
  className?: string;
  trackingThreshold?: number;
  motionProps?: any;
}

export function TrackedSection({ 
  sectionName, 
  children, 
  className = '',
  trackingThreshold = 0.3,
  motionProps 
}: TrackedSectionProps) {
  // This will automatically track when the section comes into view
  // The tracking is handled by the useSectionTracking hook
  
  if (motionProps) {
    return (
      <motion.section
        className={className}
        {...motionProps}
      >
        {children}
      </motion.section>
    );
  }

  return (
    <section className={className}>
      {children}
    </section>
  );
}

// =============================================================================
// INTERACTION TRACKING WRAPPER
// =============================================================================

interface TrackingWrapperProps {
  trackingName: string;
  trackingCategory?: string;
  trackingEvent?: 'click' | 'hover' | 'focus';
  children: React.ReactNode;
  className?: string;
  motionProps?: any;
}

export function TrackingWrapper({ 
  trackingName,
  trackingCategory = 'interaction',
  trackingEvent = 'click',
  children,
  className = '',
  motionProps
}: TrackingWrapperProps) {
  const { trackClick, trackHover, trackFocus } = useInteractionTracking();

  const handleInteraction = () => {
    switch (trackingEvent) {
      case 'click':
        trackClick(trackingName, { category: trackingCategory });
        break;
      case 'hover':
        trackHover(trackingName, { category: trackingCategory });
        break;
      case 'focus':
        trackFocus(trackingName, { category: trackingCategory });
        break;
    }
  };

  const eventProp = `on${trackingEvent.charAt(0).toUpperCase() + trackingEvent.slice(1)}`;

  if (motionProps) {
    return (
      <motion.div
        className={className}
        {...{ [eventProp]: handleInteraction }}
        {...motionProps}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={className}
      {...{ [eventProp]: handleInteraction }}
    >
      {children}
    </div>
  );
}

// =============================================================================
// CONTACT TRACKING COMPONENTS
// =============================================================================

interface ContactButtonProps {
  type: 'email' | 'phone' | 'calendar';
  value: string;
  children: React.ReactNode;
  className?: string;
  motionProps?: any;
}

export function ContactButton({ type, value, children, className = '', motionProps }: ContactButtonProps) {
  const { trackEmailClick, trackPhoneClick, trackCTAClick } = useCTATracking();

  const handleClick = () => {
    switch (type) {
      case 'email':
        trackEmailClick(value);
        break;
      case 'phone':
        trackPhoneClick(value);
        break;
      case 'calendar':
        trackCTAClick('calendar_booking', 20, { contact_method: 'calendar', value });
        break;
    }
  };

  const href = type === 'email' ? `mailto:${value}` : 
               type === 'phone' ? `tel:${value}` : 
               value;

  if (motionProps) {
    return (
      <motion.a
        href={href}
        onClick={handleClick}
        className={className}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}