import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { promoCodes } from '../data/promoCodes';
import { Copy, Check, Clock, TrendingUp, Tag, Shield } from 'lucide-react';

function formatCount(num) {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } }
};

export default function PromoCodesSection() {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section className="py-16 sm:py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
            <Shield className="w-4 h-4" />
            Проверено сегодня
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Актуальные промокоды
          </h2>
          <p className="text-slate-600 text-base max-w-lg mx-auto">
            Нажмите на промокод, чтобы скопировать. Все коды проверены и работают.
          </p>
        </motion.div>

        {/* Promo Codes Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {promoCodes.map((code) => (
            <motion.div
              key={code.id}
              variants={item}
              whileHover={{ y: -4 }}
              onClick={() => handleCopy(code.code)}
              className="group bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-violet-400 hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold bg-violet-50 text-violet-700">
                    {code.store.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{code.store}</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-xs text-green-700 font-medium">Активен</span>
                    </div>
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-bold">
                  -{code.discount}%
                </div>
              </div>

              <p className="text-slate-600 text-sm mb-4 leading-relaxed">{code.description}</p>

              {/* Promo code box */}
              <div className="flex items-center justify-between mb-4 px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl">
                <code className="text-lg font-mono font-bold text-slate-900 tracking-wider">
                  {code.code}
                </code>
                <Tag className="w-4 h-4 text-slate-400" />
              </div>

              {/* Footer stats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{formatCount(code.usedCount)} использовали</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>до {code.expiresAt}</span>
                  </div>
                </div>
                
                <AnimatePresence mode="wait">
                  {copiedCode === code.code ? (
                    <motion.div
                      key="copied"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 font-semibold text-xs rounded-lg"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Скопировано!
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      className="flex items-center gap-1.5 text-violet-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="w-4 h-4" />
                      Копировать
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-8 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-2">Экономьте с каждым заказом</h3>
          <p className="text-white/80 mb-6">Присоединяйтесь к 2M+ пользователей, которые уже экономят</p>
          <button className="px-8 py-3.5 bg-white text-violet-700 rounded-xl font-bold text-sm hover:bg-white/90 transition-colors shadow-lg">
            Начать экономить
          </button>
        </motion.div>
      </div>
    </section>
  );
}
