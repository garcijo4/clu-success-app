import { notFound } from 'next/navigation';
import { chapters, getChapter } from '@/content';
import ChapterDeck from './ChapterDeck';

export function generateStaticParams() {
  return chapters.map((c) => ({ slug: c.slug }));
}

export default async function FlashcardsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) notFound();
  return <ChapterDeck chapter={chapter} />;
}
