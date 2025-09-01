import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ContactSection from '@/components/ContactSection';
import { useAuth } from '@/hooks/useAuth';

const ContactPage = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen">
      <Navigation isLoggedIn={isLoggedIn} />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default ContactPage;