import { Link } from 'react-router-dom';
import { ArrowLeft, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFAFC] px-6 text-center">
      <div className="max-w-md">
        <SearchX className="mx-auto mb-5 h-12 w-12 text-[#6C4DFF]" aria-hidden="true" />
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#6C4DFF]">404</p>
        <h1 className="mb-4 text-3xl font-bold text-[#111827]">Страница не найдена</h1>
        <p className="mb-7 text-[#6B7280]">Похоже, такой страницы больше нет или адрес указан неверно.</p>
        <Link to="/" className="inline-flex items-center gap-2 rounded-xl bg-[#6C4DFF] px-5 py-3 font-semibold text-white">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> На главную
        </Link>
      </div>
    </main>
  );
}
