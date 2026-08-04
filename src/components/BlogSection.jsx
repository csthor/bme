import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, Sparkles } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'Как экономить до 70% на покупках в 2026 году',
    excerpt: 'Пошаговое руководство по использованию промокодов и кэшбэк-сервисов',
    date: '28 июля 2026',
    icon: TrendingUp,
    color: 'linear-gradient(135deg, #6C4DFF, #8B5CF6)'
  },
  {
    id: 2,
    title: 'Топ-10 скрытых способов получить бесплатную доставку',
    excerpt: 'Маленькие хитрости, которые помогут экономить на доставке каждый день',
    date: '25 июля 2026',
    icon: Sparkles,
    color: 'linear-gradient(135deg, #FF7A00, #FF9500)'
  },
  {
    id: 3,
    title: 'Сравнение маркетплейсов: где дешевле?',
    excerpt: 'Анализируем цены на популярные товары на Ozon, Wildberries и Яндекс Маркет',
    date: '20 июля 2026',
    icon: BookOpen,
    color: 'linear-gradient(135deg, #10B981, #34D399)'
  }
];

export default function BlogSection() {
  return (
    <section id="blog" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8" aria-label="Блог">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-4">Блог</h2>
          <p className="text-[#6B7280] text-base sm:text-lg max-w-2xl mx-auto">
            Полезные советы и актуальные новости о скидках
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, i) => {
            const Icon = post.icon;
            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group bg-white rounded-2xl border border-[#ECECF3] overflow-hidden hover:shadow-xl hover:shadow-black/5 transition-all duration-500"
              >
                <div className="h-2" style={{ background: post.color }} />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: post.color }}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs text-[#9CA3AF]">{post.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#111827] mb-2 group-hover:text-[#6C4DFF] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{post.excerpt}</p>
                  <button className="mt-4 text-sm font-medium text-[#6C4DFF] hover:text-[#5B3FE6] transition-colors flex items-center gap-1">
                    Читать далее
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
