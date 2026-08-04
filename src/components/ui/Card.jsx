export function Card({ children, className = '', onClick, hover = true }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#ECECF3] transition-all duration-300 ${hover ? 'hover:shadow-xl hover:shadow-[#6C4DFF]/5 hover:-translate-y-1' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
