import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CategoryCarousel from './components/CategoryCarousel';
import StoreCarousel from './components/StoreCarousel';
import PromoCodesSection from './components/PromoCodesSection';
import BenefitsSection from './components/BenefitsSection';
import Footer from './components/Footer';
import BlogSection from './components/BlogSection';
import HowWorksSection from './components/HowWorksSection';
import FavoritesSection from './components/FavoritesSection';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-[#FAFAFC]">
      <Header />
      <main>
        <HeroSection />
        <CategoryCarousel />
        <StoreCarousel />
        <PromoCodesSection />
        <BenefitsSection />
        <BlogSection />
        <HowWorksSection />
        <FavoritesSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
