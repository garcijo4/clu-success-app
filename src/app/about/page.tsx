import { chapters } from '@/content';
import type { ReflectionExportChapter } from '@/lib/reflectionsMarkdown';
import AboutPageClient from './AboutPageClient';

export default function AboutPage() {
  // Reflection export needs activity labels and prompts, not 192 flashcards or
  // the chapter summaries. Keep that larger content on the server.
  const exportChapters: ReflectionExportChapter[] = chapters.map((chapter) => ({
    slug: chapter.slug,
    number: chapter.number,
    title: chapter.title,
    assessments: chapter.assessments.map((assessment) => ({
      id: assessment.id,
      title: assessment.title,
      kind: assessment.kind,
      items: assessment.items,
      prompt: assessment.prompt,
      resultBands: assessment.resultBands,
    })),
  }));

  return <AboutPageClient chapters={exportChapters} />;
}
