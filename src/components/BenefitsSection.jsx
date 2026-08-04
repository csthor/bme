import { motion } from 'framer-motion';
import { ShieldCheck, Search, RefreshCw, Gift } from 'lucide-react';

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Экономьте больше',
    description: 'Находите лучшие скидки и промокоды для экономии до 70% на каждой покупке',
    gradient: 'linear-gradient(135deg, #6C4DFF, #8B5CF6)',
  },
  {
    icon: Search,
    title: 'Проверенные купоны',
    description: 'Каждый промокод проходит проверку перед публикацией. Работает или нет — вы узнаете сразу',
    gradient: 'linear-gradient(135deg, #FF7A00, #FF9500)',
  },
  {
    icon: RefreshCw,
    title: 'Удобный поиск',
    description: 'Умный поиск по магазинам, категориям и скидкам. Находите нужное за секунды',
    gradient: 'linear-gradient(135deg, #10B981, #34D399)',
  },
  {
    icon: Gift,
    title: 'Ежедневные обновления',
    description: 'Новые промокоды и скидки каждый день. Всегда актуальные предложения',
    gradient: 'linear-gradient(135deg, #8B5CF6, #A855F7)',
  }
];

export default function BenefitsSection() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FAFAFC] to-white" aria-label="Преимущества">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111827] mb-4">Почему выбирают нас</h2>
          <p className="text-[#6B7280] text-base sm:text-lg max-w-2xl mx-auto">
            Мы собираем и проверяем промокоды каждый день, чтобы вы экономили время и деньги
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-2xl border border-[#ECECF3] p-8 text-center hover:shadow-2xl hover:shadow-black/5 transition-all duration-500"
              >
                <div
                  className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                  style={{ background: b.gradient }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#111827] mb-3">{b.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{b.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
