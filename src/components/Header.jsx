import { useState, useEffect } from 'react';
import {
  Search, Menu, X, Store, Sparkles
} from 'lucide-react';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    // Mock search results
    const stores = ['Ozon', 'Wildberries', 'DNS', 'Ламод', 'М.Видео'];
    const filtered = stores.filter(s => s.toLowerCase().includes(query.toLowerCase()));
    setResults(filtered);
  }, [query]);

  return (
    <div className="relative w-full flex-1 min-w-0 max-w-lg">
      <div className={`relative transition-all duration-300 ${focused ? 'scale-[1.01]' : ''}`}>
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
        <input
          type="search"
          name="store-search"
          autoComplete="new-password"
          autoCorrect="off"
          spellCheck="false"
          inputMode="search"
          role="searchbox"
          aria-label="Поиск магазина или промокода"
          data-lpignore="true"
          data-1p-ignore="true"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Поиск магазина или промокода"
          className="w-full pl-12 pr-5 py-3 bg-white border-2 border-[#ECECF3] rounded-xl text-sm text-[#111827] placeholder-[#9CA3AF] outline-none transition-all duration-300 focus:border-[#6C4DFF] focus:shadow-lg focus:shadow-[#6C4DFF]/10"
        />
      </div>
      <>
        {results.length > 0 && focused && (
          <div
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-[#ECECF3] overflow-hidden z-50"
          >
            {results.map((store, i) => (
              <button
                key={i}
                className="w-full px-5 py-3 text-left text-[#111827] hover:bg-[#6C4DFF]/5 transition-colors flex items-center gap-3"
                onClick={() => {
                  onSearch?.(store);
                  setQuery(store);
                  setResults([]);
                }}
              >
                <Store className="w-4 h-4 text-[#6C4DFF]" />
                <span className="font-medium">{store}</span>
              </button>
            ))}
          </div>
        )}
      </>
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Магазины', href: '#stores' },
    { label: 'Категории', href: '#categories' },
    { label: 'Промокоды', href: '#promo' },
    { label: 'Как работает', href: '#how' },
  ];

  return (
    <>
      <header
        className={`site-header fixed top-0 left-0 right-0 z-50 ${
          scrolled
            ? 'backdrop-blur-xl'
            : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-[#6C4DFF] to-[#8B5CF6] rounded-xl flex items-center justify-center shadow-lg shadow-[#6C4DFF]/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#111827] hidden sm:block">
                Kupon<span className="text-[#6C4DFF]">4</span>UK
              </span>
            </a>

            {/* Search */}
            <SearchBar />

            {/* Desktop Nav */}
            <nav className="hidden xl:flex items-center gap-1 flex-shrink-0">
              {navLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="site-nav-link px-3 py-2 text-sm font-medium whitespace-nowrap"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Auth buttons */}
            <div className="hidden xl:flex items-center flex-shrink-0">
              <a href="/login" className="px-5 py-2.5 text-sm font-semibold bg-[#6C4DFF] text-white rounded-xl hover:bg-[#5B3FE6] shadow-lg shadow-[#6C4DFF]/25 hover:shadow-[#6C4DFF]/40 transition-all duration-300 whitespace-nowrap">
                Войти в кабинет
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              className="xl:hidden p-2 rounded-xl hover:bg-black/5 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <>
        {mobileOpen && (
          <div className="site-menu-panel fixed inset-0 z-40 pt-24 px-6 xl:hidden">
            <div className="flex flex-col gap-2">
              {navLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="site-menu-link px-4 py-4 text-lg font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 mt-6">
                <a href="/login" className="w-full py-3 text-base font-semibold border-2 border-[#ECECF3] rounded-xl text-center">
                  Войти
                </a>
              </div>
            </div>
          </div>
        )}
      </>
    </>
  );
}
