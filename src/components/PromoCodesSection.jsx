import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { promoCodes, hotDeals, expiringToday } from '../data/promoCodes';
import { Copy, Check, Clock, Flame, Zap, TrendingUp, Loader2 } from 'lucide-react';

function formatCount(num) {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function PromoCodeCard({ code }) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const colors = {
    'Ozon': '#005BFF', 'DNS': '#F57C00', 'Ламод': '#111111',
    'М.Видео': '#0066CC', 'Золотое Яблоко': '#FF1493',
    'Ситимобил': '#FFC20E', 'Wildberries': '#7B2D8E', 'Яндекс Маркет': '#FC3F1D'
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    setLoading(true);
    setTimeout(() => {
      navigator.clipboard.writeText(code.code);
      setCopied(true);
      setLoading(false);
      setTimeout(() => setCopied(false), 2000);
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -2 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#ECECF3] p-5 hover:shadow-xl hover:shadow-[#6C4DFF]/5 hover:border-[#6C4DFF]/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
            style={{ background: `${colors[code.store] || '#6C4DFF'}15`, color: colors[code.store] || '#6C4DFF' }}
          >
            {code.store.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-[#111827] text-sm">{code.store}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3 h-3 text-[#10B981]" />
              <span className="text-xs text-[#10B981] font-medium">Работает сегодня</span>
            </div>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-[#10B981]/10 text-[#10B981] rounded-lg text-xs font-bold">
          -{code.discount}%
        </span>
      </div>

      <p className="text-sm text-[#6B7280] mb-4 leading-relaxed">{code.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{formatCount(code.usedCount)} использовали</span>
        </div>
        <div className="flex items-center gap-2">
          {copied ? (
            <div className="px-4 py-2 bg-[#10B981]/10 text-[#10B981] font-mono font-bold text-sm rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4" />
              {code.code}
            </div>
          ) : (
            <button
              onClick={handleCopy}
              disabled={loading}
              className="px-4 py-2 bg-[#6C4DFF] text-white text-sm font-semibold rounded-xl hover:bg-[#5B3FE6] transition-all duration-300 flex items-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
              {loading ? 'Копирование...' : 'Скопировать код'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#ECECF3] p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#ECECF3] rounded-xl" />
        <div className="flex-1">
          <div className="h-4 bg-[#ECECF3] rounded w-24 mb-2" />
          <div className="h-3 bg-[#ECECF3]/60 rounded w-20" />
        </div>
      </div>
      <div className="h-4 bg-[#ECECF3] rounded w-full mb-3" />
      <div className="h-4 bg-[#ECECF3]/60 rounded w-3/4 mb-4" />
      <div className="flex justify-between">
        <div className="h-3 bg-[#ECECF3]/60 rounded w-20" />
        <div className="h-8 bg-[#ECECF3] rounded-xl w-28" />
      </div>
    </div>
  );
}

function HotDealCard({ deal }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      className="relative rounded-2xl overflow-hidden cursor-pointer group h-full min-h-[180px]"
    >
      <div className="absolute inset-0" style={{ background: deal.color }} />
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
      <div className="relative p-5 h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-white/80" />
            <span className="text-sm font-semibold text-white/90">{deal.store}</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{deal.title}</h3>
          <p className="text-sm text-white/80">{deal.description}</p>
        </div>
        <div className="flex items-center justify-between">
          {deal.discount > 0 && (
            <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-lg text-sm font-bold">
              До -{deal.discount}%
            </span>
          )}
          <button className="px-4 py-2 bg-white text-[#111827] text-sm font-semibold rounded-xl hover:bg-white/90 transition-colors">
            Подробнее
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ExpiringCard({ item }) {
  const [timeLeft, setTimeLeft] = useState(item.timeLeft);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      className="bg-white/80 backdrop-blur-sm border border-red-200/50 rounded-2xl p-5 hover:shadow-lg hover:shadow-red-100 transition-all duration-300"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500 text-white rounded-lg text-xs font-bold animate-pulse">
          <Zap className="w-3 h-3" />
          Заканчивается
        </span>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold bg-red-100 text-red-600">
          {item.store.charAt(0)}
        </div>
        <div>
          <h4 className="font-semibold text-[#111827] text-sm">{item.store}</h4>
          <p className="text-xs text-[#6B7280]">{item.description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-red-600 text-sm font-bold">
          <Clock className="w-4 h-4" />
          {timeLeft}
        </div>
        <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
          <TrendingUp className="w-3.5 h-3.5" />
          {formatCount(item.usedCount)}
        </div>
      </div>
      <div className="pt-3 border-t border-red-200/50">
        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2 bg-red-50 text-red-700 font-mono font-bold text-sm rounded-lg select-all">
            {item.code}
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(item.code);
            }}
            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function PromoCodesSection() {
  const [loading, setLoading] = useState(true);

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8" aria-label="Промокоды и предложения">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-2">Актуальные предложения</h2>
          <p className="text-[#6B7280]">Скидки, которые работают прямо сейчас</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left - Best promo codes */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-[#6C4DFF]" />
              <h3 className="text-lg font-bold text-[#111827]">Лучшие промокоды</h3>
            </div>
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              promoCodes.slice(0, 5).map((code) => (
                <PromoCodeCard key={code.id} code={code} />
              ))
            )}
          </div>

          {/* Center - Hot deals */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-[#FF7A00]" />
              <h3 className="text-lg font-bold text-[#111827]">Горячие</h3>
            </div>
            {loading ? (
              <>
                <div className="h-44 bg-[#ECECF3] rounded-2xl animate-pulse" />
                <div className="h-44 bg-[#ECECF3] rounded-2xl animate-pulse" />
                <div className="h-44 bg-[#ECECF3] rounded-2xl animate-pulse" />
              </>
            ) : (
              hotDeals.slice(0, 3).map((deal) => (
                <HotDealCard key={deal.id} deal={deal} />
              ))
            )}
          </div>

          {/* Right - Expiring today */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-bold text-[#111827]">Заканчиваются</h3>
            </div>
            {loading ? (
              <>
                <div className="h-40 bg-[#ECECF3] rounded-2xl animate-pulse" />
                <div className="h-40 bg-[#ECECF3] rounded-2xl animate-pulse" />
              </>
            ) : (
              expiringToday.map((item) => (
                <ExpiringCard key={item.id} item={item} />
              ))
            )}
          </div>
        </div>

        {/* Simulate loading */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="invisible"
        />
        {loading && (
          <div className="absolute inset-0 pointer-events-none">
            {/* This is just a visual trick - real loading handled above */}
          </div>
        )}
      </div>

      {/* Handle loading state */}
      <ScriptLoader onLoad={() => setTimeout(() => setLoading(false), 1200)} />
    </section>
  );
}

// Simple script loader for loading state
function ScriptLoader({ onLoad }) {
  setTimeout(onLoad, 800);
  return null;
}
