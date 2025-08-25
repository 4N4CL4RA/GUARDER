import HistorySection from "@/components/HistorySection";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';

const HistoryPage = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div>
      <Navigation isLoggedIn={isLoggedIn} />
      <HistorySection />
      <Footer />
    </div>
  );
};

export default HistoryPage;