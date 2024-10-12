
import Hero from './components/Hero';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import TestimonialsSection from './components/TestimonialsSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div>
      <main>
      <Hero />
      <FeaturesSection /> 
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
      </main>
    </div>
  );
}