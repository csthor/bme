import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle, Clock, Star, ArrowRight, Gift, ShoppingCart } from 'lucide-react';

const features = [
  { icon: CheckCircle, text: 'Официальные источники', color: '#6C4DFF' },
  { icon: Star, text: 'Каталог магазинов', color: '#FF7A00' },
  { icon: Clock, text: 'Проверка перед публикацией', color: '#8B5CF6' },
];

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#6C4DFF]/10 text-[#6C4DFF] rounded-full text-sm font-semibold mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span>Промокоды только из подтверждённых источников</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#111827] leading-[1.1] mb-6"
            >
              Промокоды,
              {' '}<span className="bg-gradient-to-r from-[#6C4DFF] to-[#FF7A00] bg-clip-text text-transparent">скидки</span>
              <br />
              и купоны
              <br />
              для вашего
              <br />
              шопинга
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-[#6B7280] mb-10 max-w-lg leading-relaxed"
            >
              Мы проверяем предложения по официальным страницам магазинов и не публикуем неподтверждённые коды.
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-xl border border-[#ECECF3] shadow-sm">
                    <Icon className="w-5 h-5" style={{ color: f.color }} />
                    <span className="text-sm font-medium text-[#111827]">{f.text}</span>
                  </div>
                );
              })}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <a href="#stores" className="group px-8 py-4 bg-[#6C4DFF] text-white font-semibold rounded-2xl hover:bg-[#5B3FE6] shadow-xl shadow-[#6C4DFF]/30 hover:shadow-[#6C4DFF]/50 transition-all duration-300 flex items-center gap-2">
                Перейти к магазинам
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#how" className="px-8 py-4 bg-white text-[#111827] font-semibold rounded-2xl border-2 border-[#ECECF3] hover:border-[#6C4DFF] hover:text-[#6C4DFF] transition-all duration-300">
                Как это работает
              </a>
            </motion.div>
          </motion.div>

          {/* Right - 3D Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#6C4DFF]/20 to-[#FF7A00]/20 rounded-full blur-3xl" />
              
              {/* Main floating card */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 bg-white rounded-3xl shadow-2xl shadow-[#6C4DFF]/20 border border-[#ECECF3] p-6 flex flex-col justify-between"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#6C4DFF] to-[#8B5CF6] rounded-xl" />
                  <div>
                    <div className="h-3 w-24 bg-[#ECECF3] rounded-full" />
                    <div className="h-2 w-16 bg-[#ECECF3]/60 rounded-full mt-2" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-[#ECECF3] rounded-full" />
                  <div className="h-4 w-3/4 bg-[#ECECF3]/60 rounded-full" />
                  <div className="h-4 w-1/2 bg-[#ECECF3]/40 rounded-full" />
                </div>
                <div className="pt-4 border-t border-[#ECECF3]">
                  <div className="h-8 w-full bg-[#6C4DFF]/10 rounded-xl" />
                </div>
              </motion.div>

              {/* Floating promo badge */}
              <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, 3, -3, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-8 right-8 bg-white rounded-2xl shadow-xl shadow-black/10 p-4 border border-[#ECECF3]"
              >
                <div className="text-2xl font-bold text-[#FF7A00]">-70%</div>
                <div className="text-xs text-[#6B7280] mt-1">Скидка дня</div>
              </motion.div>

              {/* Floating gift box */}
              <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute bottom-16 left-4 bg-white rounded-2xl shadow-xl shadow-black/10 p-4 border border-[#ECECF3]"
              >
                <Gift className="w-8 h-8 mb-1 text-[#6C4DFF]" aria-hidden="true" />
                <div className="text-xs font-medium text-[#111827]">Подарки</div>
              </motion.div>

              {/* Floating cart */}
              <motion.div
                animate={{ y: [0, -12, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute bottom-8 right-16 bg-white rounded-2xl shadow-xl shadow-black/10 p-4 border border-[#ECECF3]"
              >
                <ShoppingCart className="w-8 h-8 mb-1 text-[#6C4DFF]" aria-hidden="true" />
                <div className="text-xs font-medium text-[#111827]">В корзину</div>
              </motion.div>

              {/* Floating percentage */}
              <motion.div
                animate={{ y: [0, -8, 0], x: [0, 5, -5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                className="absolute top-1/3 left-0 bg-gradient-to-br from-[#6C4DFF] to-[#8B5CF6] rounded-2xl shadow-xl shadow-[#6C4DFF]/30 p-4"
              >
                <div className="text-2xl font-bold text-white">-50%</div>
              </motion.div>

              {/* Sparkles */}
              {[
                { top: 22, left: 14 }, { top: 34, left: 72 }, { top: 48, left: 28 },
                { top: 61, left: 82 }, { top: 74, left: 46 }, { top: 29, left: 55 }
              ].map(({ top, left }, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                  className="absolute text-lg"
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                  }}
                >
                  <Sparkles className="w-4 h-4 text-[#6C4DFF]" aria-hidden="true" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
