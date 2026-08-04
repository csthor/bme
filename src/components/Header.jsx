import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Heart, Menu, X
} from 'lucide-react';

// Ripple effect component
function Ripple({ x, y }) {
  return (
    <motion.span
      initial={{ scale: 0, opacity: 0.5 }}
      animate={{ scale: 4, opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute rounded-full bg-white/30 pointer-events-none"
      style={{ left: x - 10, top: y - 10, width: 20, height: 20 }}
    />
  );
}

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const allStores = ['Ozon', 'Wildberries', 'DNS', 'Ламод', 'Лента', 'М.Видео', 'Яндекс Маркет', 'Ситимобил', 'СберМаркет', 'Золотое Яблоко'];
    const filtered = allStores.filter(s => s.toLowerCase().includes(query.toLowerCase()));
    setResults(filtered);
  }, [query]);

  return (
    <div className="relative w-full max-w-2xl mx-4 hidden sm:block">
      <div className={`relative transition-all duration-300 ${focused ? 'scale-[1.01]' : ''}`}>
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF] pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Поиск магазина или промокода"
          aria-label="Поиск магазина или промокода"
          className="w-full pl-14 pr-5 py-3.5 sm:py-4 bg-white border-2 border-[#ECECF3] rounded-2xl text-[15px] sm:text-base text-[#111827] placeholder-[#9CA3AF] outline-none transition-all duration-300 focus:border-[#6C4DFF] focus:shadow-xl focus:shadow-[#6C4DFF]/10"
        />
      </div>
      <AnimatePresence>
        {results.length > 0 && focused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-[#ECECF3] overflow-hidden z-50"
            role="listbox"
          >
            {results.map((store, i) => (
              <button
                key={i}
                className="w-full px-5 py-3 text-left text-[#111827] hover:bg-[#6C4DFF]/5 transition-colors flex items-center gap-3 text-sm font-medium"
                onClick={() => {
                  onSearch?.(store);
                  setQuery(store);
                  setResults([]);
                }}
                role="option"
                aria-selected="false"
              >
                <Search className="w-4 h-4 text-[#6C4DFF] flex-shrink-0" />
                <span>{store}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Магазины', href: '#stores' },
    { label: 'Категории', href: '#categories' },
    { label: 'Блог', href: '#blog' },
    { label: 'Как работает', href: '#how' },
    { label: 'Избранное', href: '#favorites' },
  ];

  const handleNavClick = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-[#ECECF3]/50'
            : 'bg-transparent'
        }`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
            {/* Logo - Discount Symbol */}
            <a href="/" className="flex items-center gap-3 flex-shrink-0" aria-label="Kupon4UK - Главная">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#6C4DFF] to-[#8B5CF6] rounded-xl flex items-center justify-center shadow-lg shadow-[#6C4DFF]/30">
                <span className="text-white text-lg sm:text-xl">🏷️</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-[#111827] hidden sm:block">
                Kupon<span className="text-[#6C4DFF]">4</span>UK
              </span>
            </a>

            {/* Search */}
            <SearchBar />

            {/* Desktop Nav */}
            <nav className="hidden xl:flex items-center gap-1" aria-label="Основная навигация">
              {navLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className="px-3 py-2 text-sm font-medium text-[#6B7280] hover:text-[#111827] rounded-xl hover:bg-[#6C4DFF]/5 transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Auth buttons */}
            <div className="hidden xl:flex items-center gap-2">
              <button
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors"
                aria-label="Войти в аккаунт"
              >
                <Heart className="w-4 h-4" />
                <span>Войти</span>
              </button>
              <button
                className="px-5 py-2.5 text-sm font-semibold bg-[#6C4DFF] text-white rounded-xl hover:bg-[#5B3FE6] shadow-lg shadow-[#6C4DFF]/25 hover:shadow-[#6C4DFF]/40 transition-all duration-300"
              >
                Регистрация
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="xl:hidden p-2 rounded-xl hover:bg-black/5 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Spacer for fixed header */}
      <div className="h-16 sm:h-20" />

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl pt-24 px-6 xl:hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map(link => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="w-full text-left px-4 py-4 text-lg font-medium text-[#111827] border-b border-[#ECECF3] hover:bg-[#6C4DFF]/5 rounded-xl transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="flex flex-col gap-3 mt-6">
                <button className="w-full py-3 text-base font-semibold border-2 border-[#ECECF3] text-[#111827] rounded-xl hover:border-[#6C4DFF] transition-colors">
                  Войти
                </button>
                <button className="w-full py-3 text-base font-semibold bg-[#6C4DFF] text-white rounded-xl hover:bg-[#5B3FE6] transition-colors">
                  Регистрация
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
