import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses =
    'rounded-2xl px-6 py-3.5 text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50';

  const variantClasses =
    variant === 'primary'
      ? 'bg-teal-500 text-white hover:bg-teal-400 focus-visible:ring-teal-400'
      : 'border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-400';

  return (
    <button className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}
