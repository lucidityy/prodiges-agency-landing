import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { SectionErrorBoundary } from '@/components/ErrorBoundary';

// Critical above-the-fold components - loaded immediately
import Header from '@/components/Header';
import Hero from '@/components/Hero';

// Above-the-fold components with priority
const ValueProposition = dynamic(() => import('@/components/ValueProposition'), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-3xl" />
});

// Below-the-fold components - lazy loaded
const System = dynamic(() => import('@/components/System'), {
  loading: () => <div className="h-screen animate-pulse bg-gray-50" />
});

const Results = dynamic(() => import('@/components/Results'), {
  loading: () => <div className="h-screen animate-pulse bg-gray-50" />
});

const Mission = dynamic(() => import('@/components/Mission'), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />
});

const TargetAudience = dynamic(() => import('@/components/TargetAudience'), {
  loading: () => <div className="h-screen animate-pulse bg-gray-50" />
});

const WhyProdiges = dynamic(() => import('@/components/WhyProdiges'), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />
});

const Testimonials = dynamic(() => import('@/components/Testimonials'), {
  loading: () => <div className="h-screen animate-pulse bg-gray-50" />
});

const SocialProof = dynamic(() => import('@/components/SocialProof'), {
  loading: () => <div className="h-64 animate-pulse bg-gray-100" />
});

const FAQ = dynamic(() => import('@/components/FAQ'), {
  loading: () => <div className="h-screen animate-pulse bg-gray-50" />
});

const CTA = dynamic(() => import('@/components/CTA'), {
  loading: () => <div className="h-screen animate-pulse bg-gray-100" />
});

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-96 animate-pulse bg-gray-200" />
});

// Loading component for better UX
const SectionLoader = ({ height = "h-96" }: { height?: string }) => (
  <div className={`${height} animate-pulse bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded-3xl mx-auto max-w-7xl`}>
    <div className="flex items-center justify-center h-full">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-gray-300 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-3 h-3 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  </div>
);

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Critical path - immediate load */}
        <Hero />
        
        {/* High priority but can be lazy loaded */}
        <SectionErrorBoundary sectionName="Value Proposition">
          <Suspense fallback={<SectionLoader />}>
            <ValueProposition />
          </Suspense>
        </SectionErrorBoundary>
        
        {/* Below the fold - lazy loaded */}
        <SectionErrorBoundary sectionName="Services">
          <Suspense fallback={<SectionLoader height="h-screen" />}>
            <System />
          </Suspense>
        </SectionErrorBoundary>
        
        <SectionErrorBoundary sectionName="Résultats">
          <Suspense fallback={<SectionLoader height="h-screen" />}>
            <Results />
          </Suspense>
        </SectionErrorBoundary>
        
        <SectionErrorBoundary sectionName="Mission">
          <Suspense fallback={<SectionLoader />}>
            <Mission />
          </Suspense>
        </SectionErrorBoundary>
        
        <SectionErrorBoundary sectionName="Audiences">
          <Suspense fallback={<SectionLoader height="h-screen" />}>
            <TargetAudience />
          </Suspense>
        </SectionErrorBoundary>
        
        <Suspense fallback={<SectionLoader />}>
          <WhyProdiges />
        </Suspense>
        
        <Suspense fallback={<SectionLoader height="h-screen" />}>
          <Testimonials />
        </Suspense>
        
        <Suspense fallback={<SectionLoader height="h-64" />}>
          <SocialProof />
        </Suspense>
        
        <Suspense fallback={<SectionLoader height="h-screen" />}>
          <FAQ />
        </Suspense>
        
        <Suspense fallback={<SectionLoader height="h-screen" />}>
          <CTA />
        </Suspense>
      </main>
      
      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>
    </>
  );
}