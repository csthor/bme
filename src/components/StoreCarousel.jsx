import { useState } from 'react';
import { stores } from '../data/stores';
import { ExternalLink } from 'lucide-react';

const storeCategories = {
  1: ['electronics', 'home'], 2: ['fashion'], 3: ['electronics', 'groceries'], 4: ['electronics'],
  5: ['groceries'], 6: ['fashion'], 7: ['electronics', 'home'], 8: ['electronics'],
  9: ['transport'], 10: ['home'], 11: ['groceries'], 12: ['beauty'], 13: ['electronics'],
  14: ['home'], 15: ['home'], 16: ['fashion'], 17: ['sport'], 18: ['home'],
  19: ['beauty'], 20: ['home'], 21: ['home']
};

export default function StoreCarousel({ selectedCategory = 'all' }) {
  const [hoveredId, setHoveredId] = useState(null);
  const visibleStores = selectedCategory === 'all'
    ? stores
    : stores.filter((store) => storeCategories[store.id]?.includes(selectedCategory));

  return (
    <section id="stores" className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-3xl font-bold text-[#111827] mb-2">Список магазинов</h2>
            <p className="text-[#6B7280]">Магазины, доступные в каталоге Kupon4UK</p>
          </div>
          <button onClick={() => document.getElementById('stores')?.scrollIntoView({ behavior: 'smooth' })} className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#6C4DFF] hover:bg-[#6C4DFF]/5 rounded-xl transition-colors">
            Все магазины
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {visibleStores.length === 0 ? (
            <p className="col-span-full rounded-2xl border border-dashed border-[#D9D9E5] bg-white p-8 text-center text-[#6B7280]">
              В этой категории пока нет магазинов.
            </p>
          ) : visibleStores.map((store) => (
            <div
              key={store.id}
              onMouseEnter={() => setHoveredId(store.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative bg-white rounded-2xl border border-[#ECECF3] p-5 cursor-pointer transition-all duration-300 hover:border-[#6C4DFF]/50 hover:shadow-xl hover:shadow-[#6C4DFF]/10 group"
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${store.color}15` }}
                >
                  <img src={store.logo} alt={`${store.name} логотип`} className="w-9 h-9 object-contain" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; event.currentTarget.parentElement.dataset.fallback = store.name[0]; }} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#111827] text-sm">{store.name}</h3>
                  <p className="text-xs text-[#6B7280] mt-0.5">{store.promoCount} промокодов</p>
                </div>
                <a
                  href={`/?store=${encodeURIComponent(store.name)}#promo`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center w-full py-1.5 bg-[#6C4DFF]/5 rounded-lg text-xs font-medium text-[#6C4DFF] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onClick={(event) => event.stopPropagation()}
                >
                  Смотреть промокоды →
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <button className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-[#6C4DFF] bg-[#6C4DFF]/5 rounded-xl">
            Все магазины
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
