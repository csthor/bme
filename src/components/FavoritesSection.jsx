import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Sparkles } from 'lucide-react';

export default function FavoritesSection() {
  return (
    <section id="favorites" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8" aria-label="Избранное">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-[#6C4DFF]/10 rounded-full flex items-center justify-center">
            <Heart className="w-10 h-10 text-[#6C4DFF]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-4">Избранное</h2>
          <p className="text-[#6B7280] text-base sm:text-lg max-w-lg mx-auto mb-8">
            Сохраняйте понравившиеся промокоды и магазины, чтобы вернуться к ним в любое время
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-3 bg-[#6C4DFF] text-white font-semibold rounded-xl hover:bg-[#5B3FE6] shadow-lg shadow-[#6C4DFF]/25 transition-all">
              Войти в аккаунт
            </button>
            <div className="flex items-center gap-4 text-sm text-[#9CA3AF]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FF7A00]" />
                Функция в разработке
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
