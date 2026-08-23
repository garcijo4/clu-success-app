import { notFound } from 'next/navigation';
import { chapters, getChapter } from '@/content';
import ReflectList from './ReflectList';

export function generateStaticParams() {
  return chapters.map((c) => ({ slug: c.slug }));
}

export default async function ReflectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) notFound();
  return <ReflectList chapter={chapter} />;
}
