import { Search, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';

export default function SearchBar({ placeholder = 'Поиск магазина или промокода', onSearch }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl">
      <div className={`relative transition-all duration-300 ${focused ? 'scale-[1.02]' : ''}`}>
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focused ? 'text-[#6C4DFF]' : 'text-[#9CA3AF]'}`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 bg-white border-2 rounded-2xl text-base text-[#111827] placeholder-[#9CA3AF] outline-none transition-all duration-300 focus:border-[#6C4DFF] focus:shadow-lg focus:shadow-[#6C4DFF]/10"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF] hover:text-[#6C4DFF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#6C4DFF] rounded-xl text-white transition-all duration-300 hover:bg-[#5B3FE6]"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
