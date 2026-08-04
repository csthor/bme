export function Badge({ children, variant = 'primary', className = '' }) {
  const styles = {
    primary: 'bg-[#6C4DFF]/10 text-[#6C4DFF]',
    accent: 'bg-[#FF7A00]/10 text-[#FF7A00]',
    success: 'bg-emerald-500/10 text-emerald-600',
    danger: 'bg-red-500/10 text-red-600',
    purple: 'bg-[#8B5CF6]/10 text-[#8B5CF6]',
    ghost: 'bg-white/60 text-[#6B7280]'
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}
