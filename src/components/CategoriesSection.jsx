import { useState } from 'react';
import { motion } from 'framer-motion';
import { categories as catData } from '../data/categories';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } }
};

export default function CategoriesSection({ onCategorySelect }) {
  const [selected, setSelected] = useState('all');

  const handleSelect = (id) => {
    setSelected(id);
    onCategorySelect?.(id);
  };

  const topCategories = catData.filter(c => c.id !== 'all').slice(0, 6);
  const moreCategories = catData.filter(c => c.id !== 'all').slice(6);

  return (
    <section id="categories" className="py-16 sm:py-20 px-4 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              Популярные категории
            </h2>
            <p className="text-slate-600 text-base max-w-lg">
              Выберите категорию и найдите лучшие предложения
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-700 rounded-xl text-sm font-semibold">
            {catData.length - 1} категорий
          </div>
        </motion.div>

        {/* Categories Single Line Scrollable */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {catData.filter(c => c.id !== 'all').map((cat) => {
            const isSelected = selected === cat.id;
            return (
              <motion.button
                key={cat.id}
                variants={item}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelect(cat.id)}
                className={`flex-shrink-0 flex flex-col items-center justify-center min-w-[90px] px-4 py-4 rounded-xl transition-all duration-300 border-2 ${
                  isSelected
                    ? 'bg-gradient-to-br from-violet-600 to-purple-600 text-white border-violet-600 shadow-lg shadow-violet-200'
                    : 'bg-white text-slate-900 border-slate-200 hover:border-violet-300 hover:shadow-lg'
                }`}
              >
                <div className="text-2xl mb-2">{cat.icon}</div>
                <div className="font-semibold text-xs mb-0.5 text-center leading-tight">{cat.name}</div>
                <div className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                  {cat.count}
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
