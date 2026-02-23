import type { ReactNode } from 'react';

interface ContentCardProps {
  children: ReactNode;
  className?: string;
}

export default function ContentCard({ children, className = '' }: ContentCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm sm:p-10 ${className}`}>
      <div
        className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-teal-400 via-teal-500 to-blue-500"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
