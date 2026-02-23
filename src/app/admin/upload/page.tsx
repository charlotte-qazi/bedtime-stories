import { requireAuth } from '@/lib/auth';
import UploadForm from './UploadForm';

export default async function UploadPage() {
  await requireAuth();

  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-2xl p-8">
        <h1 className="text-4xl font-semibold text-blue-950">
          Upload Story
        </h1>
        <p className="mt-2 text-slate-600">
          Create a new bedtime story with video
        </p>
        <div className="mt-8">
          <UploadForm />
        </div>
      </main>
    </div>
  );
}
