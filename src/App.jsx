import { MotionConfig } from 'framer-motion';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CategoryCarousel from './components/CategoryCarousel';
import StoreCarousel from './components/StoreCarousel';
import PromoCodesSection from './components/PromoCodesSection';
import BenefitsSection from './components/BenefitsSection';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <MotionConfig reducedMotion="always">
    <div className="min-h-screen bg-[#FAFAFC]">
      <Header />
      <main>
        <HeroSection />
        <CategoryCarousel />
        <StoreCarousel />
        <PromoCodesSection />
        <BenefitsSection />
      </main>
      <Footer />
    </div>
    </MotionConfig>
  );
}

export default App;
