import { useEffect, useState } from 'react';
import { stores } from '../data/stores';
import { ExternalLink } from 'lucide-react';

export default function StoreCarousel({ selectedCategory = 'all' }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [storeCatalog, setStoreCatalog] = useState([]);
  useEffect(() => {
    fetch('/api/promos').then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => {
        const byStore = new Map();
        (data.promos || []).forEach((promo) => {
          if (!promo.store) return;
          const staticStore = stores.find((store) => store.name === promo.store);
          const current = byStore.get(promo.store) || {
            id: staticStore?.id || promo.store,
            name: promo.store,
            logo: promo.iconUrl || staticStore?.logo || '',
            color: staticStore?.color || '#6C4DFF',
            categories: new Set(),
            promoCount: 0
          };
          if (promo.category) current.categories.add(promo.category);
          if (!current.logo && promo.iconUrl) current.logo = promo.iconUrl;
          current.promoCount += 1;
          byStore.set(promo.store, current);
        });
        setStoreCatalog([...byStore.values()].map((store) => ({ ...store, categories: [...store.categories] })));
      })
      .catch(() => {});
  }, []);
  const visibleStores = (selectedCategory === 'all'
    ? [...storeCatalog]
    : storeCatalog.filter((store) => store.categories.includes(selectedCategory)))
    .sort((a, b) => b.promoCount - a.promoCount || a.name.localeCompare(b.name, 'ru'));

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
              onClick={() => { window.location.href = `/stores/${store.name.toLowerCase().replace(/[^a-zа-я0-9]+/gi, '-').replace(/^-|-$/g, '')}`; }}
              role="link"
              tabIndex={0}
              onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') event.currentTarget.click(); }}
              className="relative bg-white rounded-2xl border border-[#ECECF3] p-5 cursor-pointer transition-all duration-300 hover:border-[#6C4DFF]/50 hover:shadow-xl hover:shadow-[#6C4DFF]/10 group"
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${store.color}15` }}
                >
                  {store.logo ? <img src={store.logo} alt={`${store.name} логотип`} className="w-9 h-9 object-contain" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; event.currentTarget.parentElement.dataset.fallback = store.name[0]; }} /> : store.name[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-[#111827] text-sm">{store.name}</h3>
                  <p className="text-xs text-[#6B7280] mt-0.5">{store.promoCount} промокодов</p>
                </div>
                <a
                  href={`/stores/${store.name.toLowerCase().replace(/[^a-zа-я0-9]+/gi, '-').replace(/^-|-$/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="flex items-center justify-center w-full py-1.5 bg-[#6C4DFF]/5 rounded-lg text-xs font-medium text-[#6C4DFF] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
