import { motion } from 'framer-motion';
import { stores } from '../data/stores';
import { ArrowRight, Star } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } }
};

export default function TopStoresSection() {
  return (
    <section className="py-16 sm:py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
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
              Лучшие магазины
            </h2>
            <p className="text-slate-600 text-base max-w-lg">
              Топовые бренды с проверенными промокодами
            </p>
          </div>
          <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors shadow-md">
            Все магазины
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Stores Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {stores.slice(0, 8).map((store) => (
            <motion.div
              key={store.id}
              variants={item}
              whileHover={{ y: -4 }}
              className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-slate-300 transition-all duration-300 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center gap-4">
                {/* Logo */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-md transition-transform group-hover:scale-110"
                  style={{ background: `${store.color}15`, color: store.color }}
                >
                  {store.name.charAt(0)}
                </div>
                
                {/* Info */}
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">{store.name}</h3>
                  <p className="text-slate-600 text-sm mb-3">{store.description}</p>
                </div>
                
                {/* Stats */}
                <div className="flex items-center gap-2 w-full">
                  <div className="flex-1 px-3 py-2 bg-slate-50 rounded-lg">
                    <div className="text-lg font-bold text-slate-900">{store.promoCount}</div>
                    <div className="text-xs text-slate-500">акций</div>
                  </div>
                  <div className="flex-1 px-3 py-2 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-3.5 h-3.5 fill-yellow-500" />
                      <div className="text-lg font-bold text-slate-900">4.8</div>
                    </div>
                    <div className="text-xs text-slate-500">рейтинг</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Load more / See all */}
        <div className="sm:hidden mt-8 text-center">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">
            Все магазины
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
