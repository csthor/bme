import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, ShieldCheck } from 'lucide-react';
import './App.css';

const legalContent = {
  privacy: {
    title: 'Политика конфиденциальности',
    icon: ShieldCheck,
    intro: 'Эта политика объясняет, какие данные обрабатывает Kupon4UK и для чего они нужны.',
    sections: [
      ['1. Общие положения', 'Kupon4UK показывает промокоды и скидки. Мы не принимаем оплату и не оформляем заказы в магазинах-партнёрах.'],
      ['2. Какие данные могут обрабатываться', 'При посещении сайта автоматически могут обрабатываться технические данные: IP-адрес, тип браузера, устройство, время посещения и обезличенная статистика использования.'],
      ['3. Cookies', 'Сайт может использовать технические cookies для авторизации в административной панели и корректной работы интерфейса.'],
      ['4. Передача данных', 'Мы не продаём персональные данные. Данные могут передаваться только поставщикам инфраструктуры, если это необходимо для работы сайта или требуется законом.'],
      ['5. Контакты', 'По вопросам обработки данных обратитесь к владельцу сайта через доступные контактные каналы.'],
    ],
  },
  terms: {
    title: 'Пользовательское соглашение',
    icon: FileText,
    intro: 'Используя Kupon4UK, вы принимаете правила, описанные ниже.',
    sections: [
      ['1. Назначение сервиса', 'Kupon4UK — информационный каталог промокодов, скидок и акций сторонних магазинов.'],
      ['2. Актуальность предложений', 'Мы стараемся проверять предложения, но не гарантируем работу каждого промокода, размер скидки или наличие товара у магазина. Условия определяет соответствующий магазин.'],
      ['3. Сторонние сайты', 'Переход по ссылке может открыть сайт третьей стороны. Его правила, политика конфиденциальности и условия покупки регулируются владельцем этого сайта.'],
      ['4. Использование материалов', 'Запрещено использовать сайт для незаконных действий, автоматизированного нарушения работы сервиса или публикации вредоносного контента.'],
      ['5. Изменение условий', 'Мы можем обновлять это соглашение при изменении функциональности сайта или требований законодательства.'],
    ],
  },
};

export default function LegalPage({ type }) {
  const content = legalContent[type] || legalContent.privacy;
  const Icon = content.icon;

  return (
    <main className="min-h-screen bg-[#FAFAFC] px-4 py-12 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl rounded-3xl border border-[#ECECF3] bg-white p-6 shadow-sm sm:p-10">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#6C4DFF]">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> На главную
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6C4DFF]/10 text-[#6C4DFF]">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-[#111827]">{content.title}</h1>
        </div>
        <p className="mb-8 text-lg leading-relaxed text-[#6B7280]">{content.intro}</p>
        <div className="space-y-7 text-[#374151]">
          {content.sections.map(([heading, text]) => (
            <section key={heading}>
              <h2 className="mb-2 text-lg font-semibold text-[#111827]">{heading}</h2>
              <p className="leading-relaxed">{text}</p>
            </section>
          ))}
        </div>
        <p className="mt-10 border-t border-[#ECECF3] pt-6 text-sm text-[#9CA3AF]">Дата публикации: 20 августа 2026 года</p>
      </article>
    </main>
  );
}
