export function Button({ children, variant = 'primary', size = 'md', onClick, className = '', icon: Icon }) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 active:scale-95';
  const variants = {
    primary: 'bg-[#6C4DFF] hover:bg-[#5B3FE6] text-white shadow-lg shadow-[#6C4DFF]/25 hover:shadow-[#6C4DFF]/40',
    accent: 'bg-[#FF7A00] hover:bg-[#E66A00] text-white shadow-lg shadow-[#FF7A00]/25 hover:shadow-[#FF7A00]/40',
    outline: 'border-2 border-[#ECECF3] hover:border-[#6C4DFF] hover:text-[#6C4DFF] bg-transparent',
    ghost: 'bg-transparent hover:bg-[#6C4DFF]/5 text-[#6B7280] hover:text-[#6C4DFF]',
    white: 'bg-white text-[#111827] shadow-lg hover:shadow-xl border border-[#ECECF3]'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-4 text-base',
    xl: 'px-10 py-5 text-lg'
  };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick}>
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
}
