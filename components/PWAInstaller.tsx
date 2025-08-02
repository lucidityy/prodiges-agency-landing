"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Monitor, Wifi, WifiOff } from 'lucide-react';

// =============================================================================
// PWA INSTALLATION COMPONENT
// =============================================================================

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone || isInWebAppiOS);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show install prompt after user has browsed for a while
      setTimeout(() => {
        if (!isInstalled) {
          setShowInstallPrompt(true);
        }
      }, 30000); // Show after 30 seconds
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      
      // Track installation
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'pwa_installed', {
          event_category: 'engagement',
          event_label: 'app_install'
        });
      }
    };

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineBanner(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial online status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isInstalled]);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered successfully:', registration.scope);
          
          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available
                  showUpdateAvailable();
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error);
        });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'CACHE_METRICS') {
          console.log('📊 Cache metrics:', event.data);
        }
      });
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('✅ User accepted the install prompt');
        setShowInstallPrompt(false);
      } else {
        console.log('❌ User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  const showUpdateAvailable = () => {
    // Could show a toast or modal here
    console.log('🔄 App update available');
  };

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false);
    
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  const dismissOfflineBanner = () => {
    setShowOfflineBanner(false);
  };

  // Don't show if already dismissed this session
  const shouldShowInstallPrompt = showInstallPrompt && 
    !sessionStorage.getItem('pwa-install-dismissed') && 
    !isInstalled;

  return (
    <>
      {/* Install Prompt */}
      <AnimatePresence>
        {shouldShowInstallPrompt && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-r from-primary to-secondary rounded-xl">
                  <Download className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">
                    Installer Prodiges App
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Accédez rapidement à nos services et recevez des notifications exclusives.
                  </p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleInstallClick}
                      className="flex-1 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-300"
                    >
                      Installer
                    </button>
                    <button
                      onClick={dismissInstallPrompt}
                      className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Benefits */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-primary" />
                    <span>Accès rapide</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-primary" />
                    <span>Mode hors ligne</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Banner */}
      <AnimatePresence>
        {showOfflineBanner && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white p-3"
          >
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <WifiOff className="w-5 h-5" />
                <span className="text-sm font-medium">
                  Mode hors ligne - Certaines fonctionnalités peuvent être limitées
                </span>
              </div>
              
              <button
                onClick={dismissOfflineBanner}
                className="p-1 hover:bg-orange-600 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Online Status Indicator */}
      <div className="fixed bottom-4 right-4 z-40">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: isOnline ? 0 : 1 }}
          className="bg-red-500 text-white p-2 rounded-full shadow-lg"
        >
          <WifiOff className="w-4 h-4" />
        </motion.div>
      </div>
    </>
  );
}

// =============================================================================
// PWA FEATURES COMPONENT
// =============================================================================

export function PWAFeatures() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // Check notification permission
    if ('Notification' in window) {
      setHasNotificationPermission(Notification.permission === 'granted');
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setHasNotificationPermission(permission === 'granted');
      
      if (permission === 'granted') {
        // Show welcome notification
        new Notification('Prodiges Agency', {
          body: 'Vous recevrez maintenant nos notifications importantes !',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png'
        });
      }
    }
  };

  if (!isStandalone) return null;

  return (
    <div className="fixed top-4 right-4 z-40">
      {!hasNotificationPermission && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={requestNotificationPermission}
          className="bg-white rounded-full p-3 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
          title="Activer les notifications"
        >
          <span className="text-2xl">🔔</span>
        </motion.button>
      )}
    </div>
  );
}

// =============================================================================
// PWA UTILS
// =============================================================================

export const PWAUtils = {
  // Check if running as PWA
  isPWA: () => {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  },

  // Check if installation is available
  canInstall: () => {
    return 'beforeinstallprompt' in window;
  },

  // Check if notifications are supported
  canNotify: () => {
    return 'Notification' in window && 'serviceWorker' in navigator;
  },

  // Send notification
  sendNotification: (title: string, options?: NotificationOptions) => {
    if (PWAUtils.canNotify() && Notification.permission === 'granted') {
      return new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        ...options
      });
    }
    return null;
  },

  // Add to home screen prompt for iOS
  showIOSInstallPrompt: () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    
    if (isIOS && isSafari && !(window.navigator as any).standalone) {
      // Could show custom iOS install instructions
      return true;
    }
    return false;
  }
};