import { Home } from 'lucide-react';

export default function Breadcrumbs({ current }) {
  return (
    <nav aria-label="Хлебные крошки" className="mb-6">
      <ol className="flex items-center gap-2 text-sm text-[#9CA3AF]">
        <li>
          <a href="/" className="hover:text-[#6C4DFF] transition-colors" aria-label="На главную">
            <Home className="w-4 h-4" />
          </a>
        </li>
        <li className="text-[#ECECF3]">/</li>
        <li className="text-[#111827] font-medium" aria-current="page">{current}</li>
      </ol>
    </nav>
  );
}
