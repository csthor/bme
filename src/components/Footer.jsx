import { motion } from 'framer-motion';
import {
  Mail, MapPin, Phone,
  Sparkles
} from 'lucide-react';

const footerLinks = {
  'Категории': ['Продукты', 'Электроника', 'Одежда', 'Красота', 'Дом', 'Авто', 'Путешествия', 'Спорт', 'Книги', 'Зоотовары'],
  'Популярные магазины': ['Ozon', 'Wildberries', 'DNS', 'Ламод', 'Лента', 'М.Видео'],
};

const contacts = [
  { icon: Mail, text: 'support@kupon4uk.ru', href: 'mailto:support@kupon4uk.ru' },
  { icon: MapPin, text: 'Москва, Россия', href: '#' },
  { icon: Phone, text: '+7 (800) 555-35-35', href: 'tel:+78005553535' },
];

const socialLinks = [
  { name: 'Telegram', icon: '📱', href: '#' },
  { name: 'VK', icon: '💬', href: '#' },
  { name: 'YouTube', icon: '📺', href: '#' },
  { name: 'Дзен', icon: '📰', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 py-12 sm:py-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#6C4DFF] to-[#8B5CF6] rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🏷️</span>
              </div>
              <span className="text-xl font-bold">
                Kupon<span className="text-[#6C4DFF]">4</span>UK
              </span>
            </div>
            <p className="text-[#9CA3AF] text-sm leading-relaxed mb-6">
              Лучший агрегатор промокодов и скидок в России. Экономьте с каждым разом.
            </p>
            <div className="flex gap-2.5">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.name}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#6C4DFF] flex items-center justify-center transition-all duration-300 text-lg"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm text-white mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contacts */}
          <div>
            <h4 className="font-semibold text-sm text-white mb-4">Контакты</h4>
            <ul className="space-y-3">
              {contacts.map((contact, i) => (
                <li key={i}>
                  <a href={contact.href} className="flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-white transition-colors">
                    <contact.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{contact.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#9CA3AF]">
            © 2026 Kupon4UK. Все права защищены.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">
              Политика конфиденциальности
            </a>
            <a href="#" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">
              Пользовательское соглашение
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
