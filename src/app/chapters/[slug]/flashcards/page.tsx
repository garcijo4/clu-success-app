import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { chapters, getChapter } from '@/content';
import ChapterDeck from './ChapterDeck';

export function generateStaticParams() {
  return chapters.map((c) => ({ slug: c.slug }));
}

export default async function FlashcardsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) notFound();
  return (
    <Suspense fallback={<div className="h-72 animate-pulse rounded-2xl border border-line bg-surface" />}>
      <ChapterDeck chapter={chapter} />
    </Suspense>
  );
}
