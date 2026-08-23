import { notFound } from 'next/navigation';
import { chapters, getChapter } from '@/content';
import ChapterHub from './ChapterHub';

export function generateStaticParams() {
  return chapters.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  return {
    title: chapter ? `${chapter.title} · College Success` : 'College Success',
  };
}

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) notFound();
  return <ChapterHub chapter={chapter} />;
}
