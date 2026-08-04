import { motion } from 'framer-motion';
import { Search, Copy, ShoppingBag, CheckCircle } from 'lucide-react';

const steps = [
  {
    step: 1,
    title: 'Найдите магазин',
    description: 'Используйте поиск или категории, чтобы найти нужный магазин',
    icon: Search,
    color: '#6C4DFF'
  },
  {
    step: 2,
    title: 'Скопируйте промокод',
    description: 'Нажмите на кнопку "Скопировать код" и скопируйте промокод',
    icon: Copy,
    color: '#8B5CF6'
  },
  {
    step: 3,
    title: 'Совершите покупку',
    description: 'Вставьте промокод при оформлении заказа на сайте магазина',
    icon: ShoppingBag,
    color: '#FF7A00'
  },
  {
    step: 4,
    title: 'Экономьте',
    description: 'Скидка применится автоматически — наслаждайтесь покупкой!',
    icon: CheckCircle,
    color: '#10B981'
  }
];

export default function HowWorksSection() {
  return (
    <section id="how" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#FAFAFC]" aria-label="Как это работает">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-4">Как это работает</h2>
          <p className="text-[#6B7280] text-base sm:text-lg max-w-2xl mx-auto">
            Всего 4 простых шага до экономии
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                {/* Connector line (hidden on mobile) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-[#ECECF3]" />
                )}

                <div
                  className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110"
                  style={{ background: `${s.color}15` }}
                >
                  <Icon className="w-8 h-8" style={{ color: s.color }} />
                </div>
                <div
                  className="text-xs font-bold inline-block px-2 py-1 rounded-full mb-3"
                  style={{ background: `${s.color}20`, color: s.color }}
                >
                  Шаг {s.step}
                </div>
                <h3 className="text-lg font-bold text-[#111827] mb-2">{s.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{s.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
