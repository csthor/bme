import { motion } from 'framer-motion';
import { stores } from '../data/stores';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 22, stiffness: 300 } }
};

export default function StoreCarousel() {
  return (
    <section id="stores" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8" aria-label="Магазины">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-2 tracking-tight">
            Магазины
          </h2>
          <p className="text-[#475569] dark:text-[#94A3B8] text-[15px]">
            Лучшие предложения от топовых брендов
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
        >
          {stores.map((store) => (
            <motion.div
              key={store.id}
              variants={item}
              whileHover={{ scale: 1.04, y: -4 }}
              className="bg-white/70 dark:bg-[#131728]/70 backdrop-blur-sm border border-[#E5E7EB] dark:border-[#1E293B] rounded-2xl p-5 cursor-pointer hover:border-[#7C5CFF]/40 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-110"
                  style={{ background: `${store.color}15`, color: store.color }}
                >
                  {store.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9] text-[13px]">{store.name}</h3>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">{store.promoCount} промокодов</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
