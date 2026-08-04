import { useState } from 'react';
import { motion } from 'framer-motion';
import { stores } from '../data/stores';
import { ExternalLink } from 'lucide-react';

export default function StoreCarousel() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section id="stores" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8" aria-label="Популярные магазины">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-2">Популярные магазины</h2>
            <p className="text-[#6B7280]">Лучшие предложения от топовых брендов</p>
          </div>
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#6C4DFF] hover:bg-[#6C4DFF]/5 rounded-xl transition-colors">
            Все магазины
            <ExternalLink className="w-4 h-4" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {stores.map((store, i) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onMouseEnter={() => setHoveredId(store.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative bg-white rounded-2xl border border-[#ECECF3] p-5 cursor-pointer transition-all duration-300 hover:border-[#6C4DFF]/50 hover:shadow-xl hover:shadow-[#6C4DFF]/10 group"
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${store.color}15`, color: store.color }}
                >
                  {store.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-[#111827] text-sm">{store.name}</h3>
                  <p className="text-xs text-[#6B7280] mt-0.5">{store.promoCount} промокодов</p>
                </div>
                <div className="flex items-center justify-center w-full py-1.5 bg-[#6C4DFF]/5 rounded-lg text-xs font-medium text-[#6C4DFF] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Перейти <ExternalLink className="w-3 h-3 ml-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="sm:hidden mt-6 text-center">
          <button className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-[#6C4DFF] bg-[#6C4DFF]/5 rounded-xl">
            Все магазины
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
