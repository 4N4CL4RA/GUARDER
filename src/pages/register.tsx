import RegisterSection from "@/components/RegisterSection";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Shield, MapPin, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const RegisterPage = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 gradient-hero opacity-90 -z-10"></div>
      
      {/* Floating Elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-4 sm:left-10 animate-float">
          <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white/30" />
        </div>
        <div className="absolute top-40 right-8 sm:right-20 animate-float" style={{ animationDelay: '2s' }}>
          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white/30" />
        </div>
        <div className="absolute bottom-40 left-8 sm:left-20 animate-float" style={{ animationDelay: '4s' }}>
          <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white/30" />
        </div>
      </div>

      <Navigation isLoggedIn={isLoggedIn} />
      <RegisterSection />
      <Footer />
    </div>
  );
};

export default RegisterPage;