import { motion } from 'framer-motion';
import { Flame, ExternalLink } from 'lucide-react';
import { hotDeals } from '../data/promoCodes';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 25, stiffness: 300 } }
};

export default function HotDealsSection() {
  return (
    <section className="py-16 sm:py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-bold">
                <Flame className="w-3.5 h-3.5" />
                ГОРЯЧЕЕ
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              Горячие предложения
            </h2>
            <p className="text-slate-600 text-base">
              Ограниченные по времени скидки, которые нужно использовать сейчас
            </p>
          </div>
        </motion.div>

        {/* Deals Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {hotDeals.map((deal, i) => (
            <motion.div
              key={deal.id}
              variants={item}
              whileHover={{ y: -4 }}
              className="relative rounded-xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all duration-300"
              style={{ minHeight: '140px' }}
            >
              {/* Background */}
              <div className="absolute inset-0" style={{ background: deal.color }} />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              
              {/* Content */}
              <div className="relative p-4 h-full flex flex-col justify-between text-white">
                <div>
                  <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                    <div className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md text-[10px] font-bold">
                      {deal.store}
                    </div>
                    {deal.discount > 0 && (
                      <div className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md text-[10px] font-bold">
                        До -{deal.discount}%
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold mb-1 line-clamp-2">{deal.title}</h3>
                </div>
                
                <button className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-900 rounded-lg font-semibold text-xs hover:bg-white/90 transition-colors w-fit">
                  Подробнее
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
