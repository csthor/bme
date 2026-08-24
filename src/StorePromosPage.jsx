import { Link, useParams } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { stores } from './data/stores';
import { promoCodes } from './data/promoCodes';

const slugify = (value) => value.toLowerCase().replace(/[^a-zа-я0-9]+/gi, '-').replace(/^-|-$/g, '');

export default function StorePromosPage() {
  const { storeSlug } = useParams();
  const store = stores.find((item) => slugify(item.name) === storeSlug);
  const codes = store ? promoCodes.filter((item) => item.store === store.name) : [];

  if (!store) return <div className="min-h-screen p-10">Магазин не найден</div>;

  return (
    <div className="min-h-screen bg-[#FAFAFC]"><Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <Link to="/#stores" className="text-sm text-[#6C4DFF]">← Вернуться к списку магазинов</Link>
        <div className="mt-8 flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white border border-[#ECECF3] flex items-center justify-center">
            <img src={store.logo} alt={`${store.name} логотип`} className="w-12 h-12 object-contain" />
          </div>
          <div><h1 className="text-4xl font-bold text-[#111827]">Промокоды {store.name}</h1><p className="mt-2 text-[#6B7280]">Все предложения магазина в одном месте</p></div>
        </div>
        <section className="mt-10">
          {codes.length ? codes.map((code) => <article key={code.id} className="bg-white rounded-2xl border border-[#ECECF3] p-6 mb-4"><b>{code.code}</b><p className="mt-2 text-[#6B7280]">{code.description}</p></article>) : (
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
