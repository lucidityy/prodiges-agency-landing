"use client";

import { useEffect, useState, createContext, useContext } from 'react';
import { usePageTracking, useScrollTracking, useTimeTracking } from '@/hooks/useAnalytics';
import { setContext } from '@/lib/error-monitoring';

// =============================================================================
// ANALYTICS CONTEXT
// =============================================================================

interface AnalyticsContextType {
  isInitialized: boolean;
  hasConsent: boolean;
  grantConsent: () => void;
  revokeConsent: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

// =============================================================================
// CONSENT MANAGEMENT
// =============================================================================

interface ConsentBannerProps {
  onAccept: () => void;
  onDecline: () => void;
}

function ConsentBanner({ onAccept, onDecline }: ConsentBannerProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg p-4 md:p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">
            Respect de votre vie privée
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience, 
            analyser le trafic et personnaliser le contenu. Vous pouvez choisir d'accepter ou de refuser.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onDecline}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Refuser
          </button>
          <button
            onClick={onAccept}
            className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// ANALYTICS PROVIDER COMPONENT
// =============================================================================

interface AnalyticsProviderProps {
  children: React.ReactNode;
  enableAutoTracking?: boolean;
  consentRequired?: boolean;
}

export default function AnalyticsProvider({ 
  children, 
  enableAutoTracking = true,
  consentRequired = true 
}: AnalyticsProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [showConsentBanner, setShowConsentBanner] = useState(false);

  // Auto-tracking hooks
  usePageTracking();
  // TODO: Fix conditional hooks issue
  // useScrollTracking();
  // useTimeTracking();

  // Check for existing consent on mount
  useEffect(() => {
    const existingConsent = localStorage.getItem('analytics_consent');
    
    if (existingConsent === 'granted') {
      setHasConsent(true);
      setIsInitialized(true);
    } else if (existingConsent === 'denied') {
      setHasConsent(false);
      setIsInitialized(true);
    } else if (consentRequired) {
      // Show consent banner if no previous decision
      setShowConsentBanner(true);
    } else {
      // Auto-grant consent if not required
      setHasConsent(true);
      setIsInitialized(true);
    }
  }, [consentRequired]);

  // Initialize analytics when consent is granted
  useEffect(() => {
    if (hasConsent && !isInitialized) {
      initializeAnalytics();
      setIsInitialized(true);
    }
  }, [hasConsent, isInitialized]);

  const initializeAnalytics = () => {
    // Set initial context
    setContext('app', {
      name: 'Prodiges Agency',
      version: '1.0.0',
      environment: process.env.NODE_ENV
    });

    // Set device context
    setContext('device', {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      touchSupport: 'ontouchstart' in window,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth
    });

    // Set session context
    setContext('session', {
      startTime: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      referrer: document.referrer,
      entryPoint: window.location.href
    });

    console.log('🚀 Analytics fully initialized with consent');
  };

  const grantConsent = () => {
    localStorage.setItem('analytics_consent', 'granted');
    setHasConsent(true);
    setShowConsentBanner(false);
    
    // Initialize analytics after consent
    initializeAnalytics();
    setIsInitialized(true);
  };

  const revokeConsent = () => {
    localStorage.setItem('analytics_consent', 'denied');
    setHasConsent(false);
    setShowConsentBanner(false);
    setIsInitialized(true);
    
    // Opt out of analytics
    if (typeof window !== 'undefined') {
      const analytics = require('@/lib/analytics').analytics;
      analytics.optOut();
    }
  };

  const contextValue: AnalyticsContextType = {
    isInitialized,
    hasConsent,
    grantConsent,
    revokeConsent
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
      
      {/* Consent Banner */}
      {showConsentBanner && (
        <ConsentBanner 
          onAccept={grantConsent} 
          onDecline={revokeConsent} 
        />
      )}
      
      {/* Privacy Settings (always available) */}
      <PrivacySettings />
    </AnalyticsContext.Provider>
  );
}

// =============================================================================
// PRIVACY SETTINGS COMPONENT
// =============================================================================

function PrivacySettings() {
  const [showSettings, setShowSettings] = useState(false);
  const analytics = useAnalytics();

  if (!analytics) return null;

  return (
    <>
      {/* Privacy Settings Button */}
      <button
        onClick={() => setShowSettings(true)}
        className="fixed bottom-4 left-4 z-40 p-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors text-xs"
        title="Paramètres de confidentialité"
      >
        🍪
      </button>

      {/* Privacy Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Paramètres de confidentialité</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Analytics et mesure d'audience</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Nous permet d'analyser l'utilisation du site et d'améliorer votre expérience.
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    Statut: {analytics.hasConsent ? 'Activé' : 'Désactivé'}
                  </span>
                  
                  {analytics.hasConsent ? (
                    <button
                      onClick={() => {
                        analytics.revokeConsent();
                        setShowSettings(false);
                      }}
                      className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Désactiver
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        analytics.grantConsent();
                        setShowSettings(false);
                      }}
                      className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Activer
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// =============================================================================
// HOOK FOR USING ANALYTICS CONTEXT
// =============================================================================

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  return context;
}

// =============================================================================
// HOC FOR COMPONENTS THAT NEED ANALYTICS
// =============================================================================

export function withAnalytics<P extends object>(
  Component: React.ComponentType<P>,
  trackingConfig?: {
    componentName?: string;
    trackMount?: boolean;
    trackUnmount?: boolean;
  }
) {
  const WrappedComponent = (props: P) => {
    const analytics = useAnalytics();
    
    useEffect(() => {
      const componentName = trackingConfig?.componentName || Component.displayName || Component.name;
      
      if (analytics?.hasConsent && trackingConfig?.trackMount) {
        const { trackEvent } = require('@/lib/analytics');
        trackEvent({
          action: 'component_mounted',
          category: 'component_lifecycle',
          label: componentName
        });
      }

      return () => {
        if (analytics?.hasConsent && trackingConfig?.trackUnmount) {
          const { trackEvent } = require('@/lib/analytics');
          trackEvent({
            action: 'component_unmounted',
            category: 'component_lifecycle',
            label: componentName
          });
        }
      };
    }, [analytics?.hasConsent]);

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withAnalytics(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}