/**
 * Animation configuration optimized for performance
 * Centralizes all animation variants and transitions
 */

// Performance-optimized transition presets
export const transitions = {
  // Fast transitions for micro-interactions
  fast: {
    type: "tween" as const,
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1], // Material Design easing
  },
  
  // Standard transitions for most UI elements
  standard: {
    type: "tween" as const,
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  },
  
  // Smooth transitions for larger movements
  smooth: {
    type: "spring" as const,
    damping: 25,
    stiffness: 300,
    mass: 0.8,
  },
  
  // Bouncy transitions for emphasis
  bouncy: {
    type: "spring" as const,
    damping: 20,
    stiffness: 400,
    mass: 1,
  },
  
  // Gentle transitions for entrance animations
  gentle: {
    type: "spring" as const,
    damping: 30,
    stiffness: 200,
    mass: 1.2,
  }
} as const;

// Optimized animation variants
export const variants = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  
  // Slide animations (GPU-accelerated)
  slideUp: {
    initial: { y: 30, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -30, opacity: 0 }
  },
  
  slideDown: {
    initial: { y: -30, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 30, opacity: 0 }
  },
  
  slideLeft: {
    initial: { x: 30, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -30, opacity: 0 }
  },
  
  slideRight: {
    initial: { x: -30, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 30, opacity: 0 }
  },
  
  // Scale animations
  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 }
  },
  
  // Combined animations for cards
  cardHover: {
    rest: { 
      scale: 1, 
      y: 0,
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      transition: transitions.fast
    },
    hover: { 
      scale: 1.02, 
      y: -8,
      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      transition: transitions.standard
    }
  },
  
  // Button animations
  buttonHover: {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  },
  
  // Icon animations
  iconHover: {
    rest: { rotate: 0, scale: 1 },
    hover: { rotate: 5, scale: 1.1 }
  },
  
  // Stagger container for child animations
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }
} as const;

// Intersection Observer options for performance
export const observerOptions = {
  threshold: 0.1,
  rootMargin: "50px",
} as const;

// Reduced motion configuration
export const reducedMotionConfig = {
  duration: 0.01,
  ease: "linear" as const
} as const;

// Performance monitoring utilities
export const isReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Optimized viewport configuration
export const viewportConfig = {
  once: true,
  amount: 0.2,
  margin: "0px 0px -100px 0px"
} as const;

// Animation performance best practices
export const animationBestPractices = {
  // Use will-change sparingly and remove after animation
  willChange: (property: string) => ({
    willChange: property,
    onAnimationComplete: () => {
      // Remove will-change after animation
      if (typeof document !== "undefined") {
        const element = document.querySelector('[data-animating]');
        if (element) {
          (element as HTMLElement).style.willChange = 'auto';
        }
      }
    }
  }),
  
  // Prefer transform and opacity for GPU acceleration
  gpuAccelerated: {
    backfaceVisibility: "hidden" as const,
    perspective: 1000,
    transformStyle: "preserve-3d" as const,
  },
  
  // Layer promotion for complex animations
  promoteLayer: {
    transform: "translateZ(0)",
    backfaceVisibility: "hidden" as const,
  }
} as const;

export type TransitionKey = keyof typeof transitions;
export type VariantKey = keyof typeof variants;