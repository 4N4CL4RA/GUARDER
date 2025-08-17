import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import DownloadSection from '@/components/DownloadSection';

const DownloadPage = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <DownloadSection />
      <Footer />
    </div>
  );
};

export default DownloadPage;