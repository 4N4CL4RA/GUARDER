import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AboutSection from '@/components/AboutSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import DownloadSection from '@/components/DownloadSection';

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="space-y-20">
        <AboutSection />
        <HowItWorksSection />
        <DownloadSection />
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;