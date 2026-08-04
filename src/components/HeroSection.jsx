import { motion } from 'framer-motion';
import { Sparkles, CheckCircle, Clock, ArrowRight } from 'lucide-react';

const features = [
  { icon: CheckCircle, text: 'Проверенные купоны', color: '#6C4DFF' },
  { icon: Sparkles, text: 'Более 10000 предложений', color: '#FF7A00' },
  { icon: Clock, text: 'Обновления каждый день', color: '#8B5CF6' },
  { icon: ArrowRight, text: 'Экономия денег', color: '#10B981' },
];

export default function HeroSection() {
  return (
    <section className="pt-8 sm:pt-16 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden" aria-label="Главный баннер">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#111827] leading-[1.1] mb-6"
            >
              Промокоды,
              <br />
              <span className="bg-gradient-to-r from-[#6C4DFF] to-[#8B5CF6] bg-clip-text text-transparent">скидки</span>
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
              className="text-base sm:text-lg text-[#6B7280] mb-8 sm:mb-10 max-w-lg leading-relaxed"
            >
              Тысячи актуальных промокодов от популярных магазинов.
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10"
            >
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 px-4 py-3 bg-white rounded-2xl border border-[#ECECF3] shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" style={{ color: f.color }} />
                    <span className="text-sm font-medium text-[#111827]">{f.text}</span>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right - 3D Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
            className="relative hidden lg:block"
            aria-hidden="true"
          >
            <div className="relative w-full aspect-square max-w-xl mx-auto">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#6C4DFF]/10 via-[#8B5CF6]/10 to-[#FF7A00]/10 rounded-full blur-3xl" />

              {/* Main floating card - Gift box */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-64 sm:h-64 bg-gradient-to-br from-[#6C4DFF] to-[#8B5CF6] rounded-3xl shadow-2xl shadow-[#6C4DFF]/30 flex items-center justify-center"
              >
                <span className="text-7xl sm:text-8xl">🎁</span>
                <div className="absolute -top-2 -right-2 w-20 h-20 bg-[#FF7A00] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FF7A00]/30">
                  <span className="text-white text-xl font-bold">-50%</span>
                </div>
              </motion.div>

              {/* Floating packages */}
              <motion.div
                animate={{ y: [0, 12, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                className="absolute top-6 right-12 bg-white rounded-2xl shadow-xl shadow-black/10 p-4 border border-[#ECECF3]"
              >
                <span className="text-4xl">📦</span>
                <div className="text-xs text-[#6B7280] mt-1 text-center">Доставка</div>
              </motion.div>

              {/* Shopping cart */}
              <motion.div
                animate={{ y: [0, -18, 0], rotate: [0, -8, 8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                className="absolute bottom-20 -left-4 bg-white rounded-2xl shadow-xl shadow-black/10 p-4 border border-[#ECECF3]"
              >
                <span className="text-4xl">🛒</span>
                <div className="text-xs text-[#6B7280] mt-1 text-center">В корзину</div>
              </motion.div>

              {/* Percentage badges */}
              <motion.div
                animate={{ y: [0, -10, 0], x: [0, 8, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute top-1/4 -left-8 bg-white rounded-2xl shadow-xl shadow-black/10 px-4 py-3 border border-[#ECECF3]"
              >
                <div className="text-2xl font-bold text-[#FF7A00]">-70%</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                className="absolute bottom-8 right-8 bg-gradient-to-br from-[#6C4DFF] to-[#8B5CF6] rounded-2xl shadow-xl shadow-[#6C4DFF]/30 px-4 py-3"
              >
                <div className="text-xl font-bold text-white">-30%</div>
              </motion.div>

              {/* Discount tags */}
              <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, -10, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                className="absolute top-12 left-8 bg-white rounded-2xl shadow-xl shadow-black/10 px-4 py-3 border border-[#ECECF3]"
              >
                <span className="text-3xl">🏷️</span>
              </motion.div>

              {/* Sparkles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  className="absolute text-sm"
                  style={{
                    top: `${15 + Math.random() * 70}%`,
                    left: `${5 + Math.random() * 90}%`,
                  }}
                >
                  ✨
                </motion.div>
              ))}

              {/* Gradient orbs */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#FF7A00] to-[#F59E0B] rounded-full opacity-20 blur-xl"
              />
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute top-1/4 left-1/4 w-16 h-16 bg-gradient-to-br from-[#6C4DFF] to-[#8B5CF6] rounded-full opacity-20 blur-xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
