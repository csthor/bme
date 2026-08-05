import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CategoriesSection from './components/CategoriesSection';
import HotDealsSection from './components/HotDealsSection';
import TopStoresSection from './components/TopStoresSection';
import PromoCodesSection from './components/PromoCodesSection';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
        <HotDealsSection id="deals" />
        <TopStoresSection id="stores" />
        <PromoCodesSection id="promo" />
      </main>
      <Footer />
    </div>
  );
}

export default App;
