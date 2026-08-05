import { motion } from 'framer-motion';
import { Heart, Mail, Shield, Zap, TrendingUp, Star } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* CTA Banner */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="border-b border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Готовы экономить?
            </h2>
            <p className="text-slate-400 text-base mb-8 max-w-lg mx-auto">
              Присоединяйтесь к нашему сообществу и получайте лучшие предложения первыми
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Ваш email"
                className="w-full sm:flex-1 px-5 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none transition-colors"
              />
              <button className="w-full sm:w-auto px-8 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors whitespace-nowrap">
                Подписаться
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-xl">🏷️</span>
              </div>
              <span className="text-xl font-bold">
                Kupon<span className="text-violet-400">4</span>UK
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Сервис актуальных промокодов и скидок. Экономьте с каждым заказом.
            </p>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-violet-600 transition-colors">
                <Mail className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-violet-600 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Навигация</h4>
            <ul className="space-y-2.5">
              {['Категории', 'Горячие', 'Магазины', 'Промокоды'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Информация</h4>
            <ul className="space-y-2.5">
              {['О нас', 'Как работает', 'FAQ', 'Контакты'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Правовая информация</h4>
            <ul className="space-y-2.5">
              {['Пользовательское соглашение', 'Политика конфиденциальности', 'Cookie-политика'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Features bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 p-6 bg-slate-800 rounded-2xl">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="text-sm text-slate-300">Проверенные коды</span>
          </div>
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <span className="text-sm text-slate-300">Обновляется ежедневно</span>
          </div>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <span className="text-sm text-slate-300">2M+ экономии</span>
          </div>
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-orange-400 flex-shrink-0" />
            <span className="text-sm text-slate-300">4.8 рейтинг</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2026 Kupon4UK. Все права защищены.
          </p>
          <p className="text-slate-600 text-xs">
            Сделано с ❤️ для экономных
          </p>
        </div>
      </div>
    </footer>
  );
}
