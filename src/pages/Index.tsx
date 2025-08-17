import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <Footer />
    </div>
  );
};

export default HomePage;