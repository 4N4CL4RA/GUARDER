import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import DownloadSection from '@/components/DownloadSection';
import { useAuth } from '@/hooks/useAuth';

const HomePage = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen">
      <Navigation isLoggedIn={isLoggedIn} />
      <HeroSection />
      <AboutSection />
      <HowItWorksSection />
      <DownloadSection />
      <Footer />
    </div>
  );
};

export default HomePage;