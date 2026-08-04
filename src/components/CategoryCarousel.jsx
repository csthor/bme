import { useState } from 'react';
import { motion } from 'framer-motion';
import { categories as catData } from '../data/categories';

export default function CategoryCarousel({ onCategorySelect }) {
  const [selected, setSelected] = useState('all');

  const handleSelect = (id) => {
    setSelected(id);
    onCategorySelect?.(id);
  };

  return (
    <section id="categories" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8" aria-label="Категории">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-2">Категории</h2>
          <p className="text-[#6B7280]">Найдите скидки для любого случая</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="overflow-x-auto pb-4 scrollbar-hide"
        >
          <div className="flex gap-3 min-w-max px-1 justify-center flex-wrap">
            {catData.map((cat, i) => {
              const isSelected = selected === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelect(cat.id)}
                  className={`flex flex-col items-center gap-2.5 px-5 py-4 rounded-2xl transition-all duration-300 min-w-[100px] sm:min-w-[110px] ${
                    isSelected
                      ? 'bg-[#6C4DFF] text-white shadow-xl shadow-[#6C4DFF]/30'
                      : 'bg-white text-[#111827] border border-[#ECECF3] hover:border-[#6C4DFF]/50 hover:shadow-lg hover:shadow-[#6C4DFF]/5'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className="text-2xl sm:text-3xl">{cat.icon}</span>
                  <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">{cat.name}</span>
                  <span className={`text-xs ${isSelected ? 'text-white/70' : 'text-[#9CA3AF]'}`}>
                    {cat.count}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
