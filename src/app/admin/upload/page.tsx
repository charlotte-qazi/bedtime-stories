import { requireAuth } from '@/lib/auth';
import Link from 'next/link';
import UploadForm from './UploadForm';

export default async function UploadPage() {
  await requireAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto w-full max-w-2xl px-5 py-8 sm:px-8 sm:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 transition-colors hover:text-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
        >
          ← Back to Stories
        </Link>

        <div className="relative mt-8 overflow-hidden rounded-3xl bg-white p-6 shadow-sm sm:p-10">
          <div
            className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-teal-400 via-teal-500 to-blue-500"
            aria-hidden="true"
          />

          <div className="mb-10 mt-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-500">
              Across the Seas
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-blue-950 sm:text-4xl">
              Upload Story
            </h1>
            <p className="mt-3 text-base leading-relaxed text-slate-500">
              Share a new bedtime story with your family
            </p>
          </div>

          <UploadForm />
        </div>
      </main>
    </div>
  );
}
