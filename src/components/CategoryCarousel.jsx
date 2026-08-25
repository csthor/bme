import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { categories as catData } from '../data/categories';
import { categoryIcons } from '../data/categories';
import * as Icons from 'lucide-react';

export default function CategoryCarousel({ onCategorySelect }) {
  const [selected, setSelected] = useState('all');
  const [categoryCounts, setCategoryCounts] = useState({ all: 0 });

  useEffect(() => {
    let cancelled = false;
    fetch('/api/promos')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => {
        if (cancelled) return;
        const storesByCategory = {};
        const allStores = new Set();
        (data.promos || []).forEach((promo) => {
          if (!promo.store || !promo.category) return;
          allStores.add(promo.store);
          storesByCategory[promo.category] ||= new Set();
          storesByCategory[promo.category].add(promo.store);
        });
        const counts = { all: allStores.size };
        Object.entries(storesByCategory).forEach(([category, stores]) => { counts[category] = stores.size; });
        setCategoryCounts(counts);
      })
      .catch(() => setCategoryCounts({ all: 0 }));
    return () => { cancelled = true; };
  }, []);

  const visibleCategories = useMemo(() => catData
    .map((cat) => ({ ...cat, count: categoryCounts[cat.id] || 0 }))
    .filter((cat) => cat.count > 0), [categoryCounts]);

  useEffect(() => {
    if (selected !== 'all' && !visibleCategories.some((cat) => cat.id === selected)) {
      setSelected('all');
      onCategorySelect?.('all');
    }
  }, [selected, visibleCategories, onCategorySelect]);

  const handleSelect = (id) => {
    setSelected(id);
    onCategorySelect?.(id);
  };

  return (
    <section id="categories" className="py-12 px-4 sm:px-6 lg:px-8" aria-labelledby="categories-title">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 id="categories-title" className="text-3xl font-bold text-[#111827] mb-2">Категории магазинов</h2>
          <p className="text-[#6B7280]">Выберите направление — список магазинов отфильтруется ниже</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="overflow-x-auto pb-4 scrollbar-hide"
        >
          <div className="flex gap-3 min-w-max px-1">
            {visibleCategories.map((cat, i) => {
              const Icon = Icons[categoryIcons[cat.icon]] || Icons.Tag;
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
                  className={`flex flex-col items-center gap-3 px-6 py-5 rounded-2xl transition-all duration-300 min-w-[110px] ${
                    isSelected
                      ? 'bg-[#6C4DFF] text-white shadow-xl shadow-[#6C4DFF]/30'
                      : 'bg-white text-[#111827] border border-[#ECECF3] hover:border-[#6C4DFF]/50 hover:shadow-lg'
                  }`}
                >
                  <Icon className="w-7 h-7" strokeWidth={1.8} aria-hidden="true" />
                  <span className="text-sm font-semibold whitespace-nowrap">{cat.name}</span>
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
