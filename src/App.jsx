import { MotionConfig } from 'framer-motion';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CategoryCarousel from './components/CategoryCarousel';
import StoreCarousel from './components/StoreCarousel';
import PromoCodesSection from './components/PromoCodesSection';
import BenefitsSection from './components/BenefitsSection';
import Footer from './components/Footer';
import './App.css';
import { useState } from 'react';
import Seo from './Seo';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  return (
    <MotionConfig reducedMotion="always">
    <div className="min-h-screen bg-[#FAFAFC]">
      <Seo title="Промокоды и скидки магазинов — Kupon4UK" description="Проверенные промокоды, скидки и предложения популярных магазинов России." />
      <Header />
      <main>
        <HeroSection />
        <CategoryCarousel onCategorySelect={setSelectedCategory} />
        <StoreCarousel selectedCategory={selectedCategory} />
        <PromoCodesSection />
        <BenefitsSection />
      </main>
      <Footer />
    </div>
    </MotionConfig>
  );
}

export default App;
