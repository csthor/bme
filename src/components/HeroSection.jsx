import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Shield, Zap, TrendingUp, Star, ChevronDown } from 'lucide-react';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { value: '12,000+', label: 'Промокодов', icon: Zap, color: '#6C4DFF' },
    { value: '500+', label: 'Магазинов', icon: Shield, color: '#10B981' },
    { value: '85%', label: 'Работают', icon: TrendingUp, color: '#F59E0B' },
    { value: '2M+', label: 'Экономии', icon: Star, color: '#EF4444' },
  ];

  return (
    <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-orange-50 opacity-70" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-200 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto">
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold mb-6"
          >
            <Zap className="w-4 h-4" />
            Обновлено сегодня — 156 новых промокодов
          </motion.div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Экономьте до 70% на
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">
              каждой покупке
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Тысячи проверенных промокодов от 500+ магазинов. Работает сегодня — экономит всегда.
          </p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Найдите магазин или промокод..."
                className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-200 rounded-2xl text-base shadow-lg shadow-slate-200/50 focus:border-violet-500 focus:shadow-xl focus:shadow-violet-200/30 transition-all outline-none"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <kbd className="hidden sm:inline-flex items-center px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-lg text-xs text-slate-600">
                  ⌘K
                </kbd>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 hover:shadow-lg hover:border-slate-300 transition-all"
                >
                  <Icon className="w-6 h-6 mb-2" style={{ color: stat.color }} />
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-slate-400"
          >
            <span className="text-sm">Листайте вниз</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
