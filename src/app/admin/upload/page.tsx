import { requireAuth } from '@/lib/auth';
import UploadForm from './UploadForm';

export default async function UploadPage() {
  await requireAuth();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto w-full max-w-2xl p-8">
        <h1 className="text-4xl font-semibold text-zinc-900 dark:text-zinc-50">
          Upload Story
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Create a new bedtime story with video
        </p>
        <div className="mt-8">
          <UploadForm />
        </div>
      </main>
    </div>
  );
}
