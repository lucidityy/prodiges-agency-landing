import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ValueProposition from '@/components/ValueProposition';
import System from '@/components/System';
import Results from '@/components/Results';
import Mission from '@/components/Mission';
import TargetAudience from '@/components/TargetAudience';
import WhyProdiges from '@/components/WhyProdiges';
import Testimonials from '@/components/Testimonials';
import SocialProof from '@/components/SocialProof';
import FAQ from '@/components/FAQ';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ValueProposition />
        <System />
        <Results />
        <Mission />
        <TargetAudience />
        <WhyProdiges />
        <Testimonials />
        <SocialProof />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}