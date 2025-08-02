"use client";

import { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  resetOnPropsChange?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Report to error monitoring service
    if (typeof window !== 'undefined' && (window as any).__ERROR_MONITOR__) {
      (window as any).__ERROR_MONITOR__.reportReactError(
        error, 
        errorInfo, 
        this.constructor.name
      );
    }

    // Log error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { resetOnPropsChange } = this.props;
    const { hasError } = this.state;
    
    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <AlertTriangle className="w-8 h-8 text-white" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Oups ! Une erreur s'est produite
            </h2>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              Nous nous excusons pour la gêne occasionnée. Notre équipe a été notifiée et travaille à résoudre le problème.
            </p>
            
            <motion.button
              onClick={this.handleReset}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-2xl hover:shadow-lg transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4" />
              Réessayer
            </motion.button>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  Détails de l'erreur (dev only)
                </summary>
                <pre className="mt-4 p-4 bg-gray-100 rounded-xl text-xs text-gray-700 overflow-auto max-h-48">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lightweight error boundary for sections
export const SectionErrorBoundary = ({ 
  children, 
  sectionName 
}: { 
  children: ReactNode; 
  sectionName: string;
}) => (
  <ErrorBoundary
    fallback={
      <div className="py-20 text-center">
        <div className="max-w-md mx-auto p-8 bg-gray-50 rounded-2xl">
          <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">
            Erreur lors du chargement de la section {sectionName}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors"
          >
            Recharger la page
          </button>
        </div>
      </div>
    }
    resetOnPropsChange
  >
    {children}
  </ErrorBoundary>
);