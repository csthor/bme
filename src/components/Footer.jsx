import {
  Sparkles
} from 'lucide-react';

const footerLinks = {
  'Категории': ['Электроника', 'Одежда', 'Красота', 'Дом и сад', 'Путешествия', 'Спорт'],
  'Магазины': ['Ozon', 'Wildberries', 'DNS', 'М.Видео', 'Ламод', 'Яндекс Маркет'],
  'Полезное': ['Как работает', 'Блог', 'FAQ', 'Помощь', 'Партнёрам'],
};

const footerTargets = {
  'Категории': '#categories',
  'Магазины': '#stores',
  'Полезное': '#how',
};

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#6C4DFF] to-[#8B5CF6] rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold">
                Kupon<span className="text-[#6C4DFF]">4</span>UK
              </span>
            </div>
            <p className="text-[#9CA3AF] text-sm leading-relaxed mb-6">
              Лучший агрегатор промокодов и скидок в России. Экономьте с каждым разом.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm text-white mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href={footerTargets[title]} className="text-sm text-[#9CA3AF] hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#9CA3AF]">
            © 2026 Kupon4UK. Все права защищены.
          </p>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">
              Политика конфиденциальности
            </a>
            <a href="/terms" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">
              Пользовательское соглашение
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
