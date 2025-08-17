import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import ResourcesSection from '@/components/ResourcesSection';
import DownloadSection from '@/components/DownloadSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <HowItWorksSection />
      <ResourcesSection />
      <DownloadSection />
      <Footer />
    </div>
  );
};

export default Index;