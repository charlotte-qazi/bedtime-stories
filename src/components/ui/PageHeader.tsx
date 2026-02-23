import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function PageHeader({ title, subtitle, className = '' }: PageHeaderProps) {
  return (
    <div className={`mb-10 mt-2 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-widest text-teal-500">
        Across the Seas
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-blue-950 text-pretty sm:text-4xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-base leading-relaxed text-slate-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}
