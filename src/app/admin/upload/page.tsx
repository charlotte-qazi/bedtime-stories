import { requireAuth } from '@/lib/auth';
import BackLink from '@/components/ui/BackLink';
import ContentCard from '@/components/ui/ContentCard';
import PageHeader from '@/components/ui/PageHeader';
import UploadForm from './UploadForm';

export default async function UploadPage() {
  await requireAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto w-full max-w-2xl px-5 py-8 sm:px-8 sm:py-12">
        <BackLink />

        <ContentCard className="mt-8">
          <PageHeader
            title="Upload Story"
            subtitle="Share a new bedtime story with your family"
          />
          <UploadForm />
        </ContentCard>
      </main>
    </div>
  );
}
