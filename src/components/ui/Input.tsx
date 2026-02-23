import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({ label, id, className = '', ...props }: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`mt-2 block w-full rounded-2xl border-2 border-slate-200 px-4 py-3.5 text-base text-slate-900 placeholder-slate-400 transition-colors focus:border-teal-500 focus:outline-none focus:ring-0 disabled:opacity-50 ${className}`}
        {...props}
      />
    </div>
  );
}
