import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { promoCodes, hotDeals, expiringToday } from '../data/promoCodes';
import { Copy, Check, Clock, Flame, Zap, TrendingUp } from 'lucide-react';

function formatCount(num) {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function PromoCodeCard({ code }) {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const colors = {
    'Ozon': '#005BFF', 'DNS': '#F57C00', 'Ламод': '#111111',
    'М.Видео': '#0066CC', 'Золотое Яблоко': '#FF1493',
    'Ситимобил': '#FFC20E', 'Wildberries': '#7B2D8E', 'Яндекс Маркет': '#FC3F1D'
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl border border-[#ECECF3] p-4 flex flex-col hover:shadow-xl hover:shadow-[#6C4DFF]/5 hover:border-[#6C4DFF]/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-2.5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
            style={{ background: `${colors[code.store] || '#6C4DFF'}15` }}
          >
            {code.storeLogo ? (
                  <img src={code.storeLogo} alt={`${code.store} логотип`} className="w-7 h-7 object-contain" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; event.currentTarget.parentElement.dataset.fallback = code.store.charAt(0); }} />
            ) : code.store.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-[#111827] text-sm">{code.store}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <Clock className="w-3 h-3 text-[#10B981]" />
              <span className="text-xs text-[#10B981] font-medium">Работает сегодня</span>
            </div>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-xs font-bold">
          -{code.discount}%
        </span>
      </div>

      <p className="text-sm text-[#6B7280] mb-2.5 leading-snug">{code.description}</p>

      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{formatCount(code.usedCount)} использовали</span>
        </div>
        <div className="flex items-center gap-2">
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="px-4 py-2 bg-[#6C4DFF] text-white text-sm font-semibold rounded-xl hover:bg-[#5B3FE6] transition-colors"
            >
              Показать код
            </button>
          ) : (
            <>
              <div className="px-4 py-2 bg-[#6C4DFF]/10 text-[#6C4DFF] font-mono font-bold text-sm rounded-xl select-all">
                {code.code}
              </div>
              <button
                onClick={handleCopy}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  copied
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[#6C4DFF]/10 text-[#6C4DFF] hover:bg-[#6C4DFF]/20'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function HotDealCard({ deal }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      className="relative rounded-2xl overflow-hidden cursor-pointer group h-48"
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      className="bg-red-50/50 border border-red-200 rounded-2xl p-5 hover:shadow-lg hover:shadow-red-100 transition-all duration-300"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500 text-white rounded-lg text-xs font-bold animate-pulse">
          <Zap className="w-3 h-3" />
          Заканчивается сегодня
        </span>
      </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold bg-red-100 text-red-600">
          {item.storeLogo ? (
            <img src={item.storeLogo} alt={`${item.store} логотип`} className="w-6 h-6 object-contain" loading="lazy" />
          ) : item.store.charAt(0)}
        </div>
        <div>
          <h4 className="font-semibold text-[#111827] text-sm">{item.store}</h4>
          <p className="text-xs text-[#6B7280]">{item.description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-red-600 text-sm font-bold">
          <Clock className="w-4 h-4" />
          {item.timeLeft}
        </div>
        <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
          <TrendingUp className="w-3.5 h-3.5" />
          {formatCount(item.usedCount)}
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-red-200/50">
        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2 bg-red-100 text-red-700 font-mono font-bold text-sm rounded-lg select-all">
            {item.code}
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(item.code)}
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
  const [livePromoCodes, setLivePromoCodes] = useState(promoCodes);
  const bestCodes = livePromoCodes.slice(0, 5);
  const hotCodes = livePromoCodes.slice(5, 10);
  const expiringCodes = livePromoCodes.slice(10, 15);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetch('/api/seo'), fetch('/api/promos')])
      .then(async ([seoResponse, promosResponse]) => {
        if (!seoResponse.ok || !promosResponse.ok) throw new Error('Promo API unavailable');
        return [await seoResponse.json(), await promosResponse.json()];
      })
      .then(([data, catalog]) => {
        if (cancelled) return;
        const catalogCodes = (catalog.promos || []).map((item) => ({
          id: item.id,
          store: item.store,
          storeLogo: item.iconUrl || undefined,
          code: item.code,
          discount: Number(item.discount?.value || item.discount || 0),
          description: item.description || item.title,
          usedCount: Number(item.usedCount || 0),
          expiresAt: item.validUntil,
          type: 'promo'
        }));
        const managedCodes = [
          data.promoCode && {
            id: 'main-promo',
            store: 'Kupon4UK',
            code: data.promoCode,
            discount: Number(data.promoDiscount) || 0,
            description: data.promoDescription || 'Актуальное предложение Kupon4UK',
            usedCount: 0,
            expiresAt: data.promoExpiry,
            type: 'promo'
          },
          ...(data.additionalPromoCodes || []).map((item, index) => ({
            id: `managed-${index}`,
            store: item.store || 'Kupon4UK',
            code: item.code,
            discount: Number(item.discount) || 0,
            description: item.desc || 'Актуальное предложение',
            usedCount: Number(item.usedCount) || 0,
            expiresAt: item.expires,
            type: 'promo'
          }))
        ].filter(item => item && item.code && (!item.expiresAt || new Date(item.expiresAt) >= new Date()));

        if (catalogCodes.length > 0) {
          const byStore = new Map();
          catalogCodes.forEach((code) => { if (!byStore.has(code.store)) byStore.set(code.store, code); });
          const popularCodes = [...byStore.values()].sort((a, b) => b.usedCount - a.usedCount);
          setLivePromoCodes([...popularCodes, ...managedCodes]);
        }
      })
      .catch(() => {})
      .finally(() => { cancelled = true; });

    return () => { cancelled = true; };
  }, []);

  return (
    <section id="promo" className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-[#111827] mb-2">Актуальные предложения</h2>
          <p className="text-[#6B7280]">Скидки, которые работают прямо сейчас</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left - Best promo codes */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-[#6C4DFF]" />
              <h3 className="text-lg font-bold text-[#111827]">Лучшие промокоды</h3>
            </div>
            {bestCodes.map((code) => (
              <PromoCodeCard key={code.id} code={code} />
            ))}
          </div>

          {/* Center - Hot deals */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-[#FF7A00]" />
              <h3 className="text-lg font-bold text-[#111827]">Горячие</h3>
            </div>
            {hotCodes.map((code) => (
              <PromoCodeCard key={code.id} code={code} />
            ))}
          </div>

          {/* Right - Expiring today */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-bold text-[#111827]">Заканчиваются</h3>
            </div>
            {expiringCodes.map((code) => (
              <PromoCodeCard key={code.id} code={code} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
