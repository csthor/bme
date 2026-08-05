import { useState } from 'react';
import { motion } from 'framer-motion';
import { categories as catData } from '../data/categories';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 22, stiffness: 300 } }
};

export default function CategoryCarousel({ onCategorySelect }) {
  const [selected, setSelected] = useState('all');

  const handleSelect = (id) => {
    setSelected(id);
    onCategorySelect?.(id);
  };

  return (
    <section id="categories" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8" aria-label="Категории">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-3 tracking-tight">
            Категории
          </h2>
          <p className="text-[#475569] dark:text-[#94A3B8] text-[15px] max-w-md mx-auto">
            Найдите скидки для любого случая
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex gap-2.5 flex-wrap justify-center"
        >
          {catData.map((cat) => {
            const isSelected = selected === cat.id;
            return (
              <motion.button
                key={cat.id}
                variants={item}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(cat.id)}
                className={`flex flex-col items-center gap-2 px-5 py-4 rounded-2xl transition-all duration-300 min-w-[90px] sm:min-w-[100px] ${
                  isSelected
                    ? 'bg-[#7C5CFF] text-white shadow-lg shadow-[#7C5CFF]/25'
                    : 'bg-white/70 dark:bg-[#131728]/70 backdrop-blur-sm text-[#0F172A] dark:text-[#F1F5F9] border border-[#E5E7EB] dark:border-[#1E293B] hover:border-[#7C5CFF]/40 hover:shadow-md'
                }`}
                aria-pressed={isSelected}
              >
                <span className="text-2xl sm:text-3xl">{cat.icon}</span>
                <span className="text-[12px] sm:text-[13px] font-semibold whitespace-nowrap">{cat.name}</span>
                <span className={`text-[11px] ${isSelected ? 'text-white/70' : 'text-[#94A3B8]'}`}>
                  {cat.count}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
