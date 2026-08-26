import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { stores } from './data/stores';
import { Clock, Copy, Check } from 'lucide-react';
import Seo from './Seo';
import { formatPromoWord, matchesStoreSlug } from './utils/catalog';

function PromoCard({ promo }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [usedCount, setUsedCount] = useState(promo.usedCount || 0);
  const discount = Number(typeof promo.discount === 'object' ? promo.discount?.value : promo.discount) || 0;
  const reveal = async () => { setRevealed(true); try { const response = await fetch(`/api/promos/${promo.id}/use`, { method: 'POST' }); if (response.ok) setUsedCount((await response.json()).usedCount); } catch {} };
  const copy = async () => { await navigator.clipboard.writeText(promo.code); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return <article className="bg-white rounded-2xl border border-[#ECECF3] p-4 flex flex-col min-h-[210px]">
    <div className="flex items-start justify-between gap-3">
      <div><h2 className="font-semibold text-[#111827]">{promo.title || 'Специальное предложение'}</h2><div className="flex items-center gap-1 mt-1 text-xs text-emerald-500"><Clock className="w-3 h-3" />Проверено</div></div>
      {discount > 0 && <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-bold">-{discount}%</span>}
    </div>
      <p className="mt-3 text-sm text-[#6B7280] leading-snug">Условия: {promo.description}</p><p className="mt-2 text-xs text-[#9CA3AF]">{usedCount} раз открывали код</p>
    <div className="mt-auto pt-4 flex gap-2">
      {revealed ? <><code className="flex-1 px-3 py-2 rounded-xl bg-[#6C4DFF]/10 text-[#6C4DFF] font-semibold text-sm truncate">{promo.code}</code><button onClick={copy} className="px-3 rounded-xl bg-[#6C4DFF]/10 text-[#6C4DFF]">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</button></> : <button onClick={reveal} className="w-full px-4 py-2 rounded-xl bg-[#6C4DFF] text-white text-sm font-semibold">Показать код</button>}
    </div>
  </article>;
}

export default function StorePromosPage() {
  const { storeSlug } = useParams();
  const [store, setStore] = useState(null);
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/promos')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Promo API unavailable')))
      .then((data) => {
        const promos = data.promos || [];
        const staticStore = stores.find((item) => matchesStoreSlug(item.name, storeSlug));
        const matchedCodes = promos.filter((item) => matchesStoreSlug(item.store, storeSlug));
        const promoStore = matchedCodes[0];
        setStore(staticStore || (promoStore ? {
          name: promoStore.store,
          logo: promoStore.iconUrl || '',
          color: '#6C4DFF',
          description: 'Проверенные промокоды магазина'
        } : null));
        setCodes(matchedCodes);
      })
      .catch(() => {
        setStore(stores.find((item) => matchesStoreSlug(item.name, storeSlug)) || null);
        setCodes([]);
      })
      .finally(() => setLoading(false));
  }, [storeSlug]);

  if (loading) return <div className="min-h-screen bg-[#FAFAFC] p-10 text-[#6B7280]">Загрузка...</div>;
  if (!store) return <div className="min-h-screen p-10">Магазин не найден</div>;

  return (
    <div className="min-h-screen bg-[#FAFAFC]"><Header />
      <Seo title={`Промокоды ${store.name} — Kupon4UK`} description={`Актуальные промокоды и скидки ${store.name} с условиями и сроками действия.`} path={`/stores/${storeSlug}`} type="website" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <Link to="/#stores" className="text-sm text-[#6C4DFF]">← Вернуться к списку магазинов</Link>
        <div className="mt-8 flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white border border-[#ECECF3] flex items-center justify-center">
            {store.logo ? <img src={store.logo} alt={`${store.name} логотип`} className="w-12 h-12 object-contain" /> : <span className="text-2xl font-bold text-[#6C4DFF]">{store.name[0]}</span>}
          </div>
          <div><h1 className="text-4xl font-bold text-[#111827]">Промокоды {store.name}</h1><p className="mt-2 text-[#6B7280]">{codes.length} {formatPromoWord(codes.length)} в одном месте</p></div>
        </div>
        <section className="mt-10">
          {codes.length ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{codes.map((code) => <PromoCard key={code.id} promo={code} />)}</div> : (
            <div className="bg-white rounded-2xl border border-dashed border-[#D9D9E5] p-10 text-center">
              <h2 className="text-xl font-semibold text-[#111827]">Проверенных промокодов пока нет</h2>
              <p className="mt-2 text-[#6B7280]">Мы добавим сюда код после проверки условий на официальном сайте магазина.</p>
            </div>
          )}
        </section>
      </main><Footer />
    </div>
  );
}
