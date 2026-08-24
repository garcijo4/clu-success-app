import { chapters } from '@/content';
import HomePageClient, { type HomeChapter } from './HomePageClient';

export default function HomePage() {
  // Keep full card backs and activity copy on the server. Home search only needs
  // chapter metadata and card fronts, which materially reduces its client bundle.
  const catalog: HomeChapter[] = chapters.map((chapter) => ({
    slug: chapter.slug,
    number: chapter.number,
    title: chapter.title,
    studentSubtitle: chapter.studentSubtitle,
    themeColor: chapter.themeColor,
    themeColorDark: chapter.themeColorDark,
    keyIdeas: chapter.keyIdeas,
    // Headings plus bodies, flattened once on the server so search can match
    // summary content without shipping the structured blocks to the client.
    summaryText: chapter.summary
      .map((section) => `${section.heading} ${section.body}`)
      .join(' ')
      .toLowerCase(),
    sections: chapter.sections,
    flashcards: chapter.flashcards.map(({ id, front }) => ({ id, front })),
    assessments: chapter.assessments.map(({ id, kind, items }) => ({
      id,
      kind,
      items: items.map(({ id: itemId }) => ({ id: itemId })),
    })),
  }));

  return <HomePageClient chapters={catalog} />;
}
