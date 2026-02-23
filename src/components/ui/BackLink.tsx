import Link from 'next/link';

interface BackLinkProps {
  href?: string;
  label?: string;
}

export default function BackLink({ href = '/', label = 'Back to Stories' }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 transition-colors hover:text-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
    >
      ← {label}
    </Link>
  );
}
