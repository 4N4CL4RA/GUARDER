import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ResourcesSection from '@/components/ResourcesSection';
import { useAuth } from '@/hooks/useAuth';

const ResourcesPage = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen">
      <Navigation isLoggedIn={isLoggedIn} />
      <ResourcesSection />
      <Footer />
    </div>
  );
};

export default ResourcesPage;