import { requireAuth } from '@/lib/auth';
import { getStoryById } from '@/lib/queries/stories';
import { notFound } from 'next/navigation';
import StoryDetail from '@/components/StoryDetail';

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;

  const { story, error } = await getStoryById(id);

  if (error || !story) {
    notFound();
  }

  return <StoryDetail story={story} />;
}
