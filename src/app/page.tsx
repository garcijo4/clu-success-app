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
    sections: chapter.sections,
    flashcards: chapter.flashcards.map(({ id, front }) => ({ id, front })),
    assessments: chapter.assessments.map(({ id }) => ({ id })),
  }));

  return <HomePageClient chapters={catalog} />;
}
