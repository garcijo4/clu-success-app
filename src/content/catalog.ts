/** Lightweight chapter metadata for client surfaces that do not need book content. */
export const chapterCatalog = [
  { slug: 'exploring-college', title: 'Exploring College' },
  { slug: 'learning-styles', title: 'The Truth About Learning Styles' },
  { slug: 'time-and-priorities', title: 'Managing Your Time and Priorities' },
  { slug: 'academic-pathways', title: 'Planning Your Academic Pathways' },
  { slug: 'reading-and-notetaking', title: 'Reading and Notetaking' },
  { slug: 'studying-memory-tests', title: 'Studying, Memory, and Test Taking' },
  { slug: 'thinking', title: 'Thinking' },
  { slug: 'communicating', title: 'Communicating' },
  { slug: 'civility-cultural-competence', title: 'Understanding Civility and Cultural Competence' },
  { slug: 'financial-literacy', title: 'Understanding Financial Literacy' },
  { slug: 'healthy-lifestyle', title: 'Engaging in a Healthy Lifestyle' },
  { slug: 'planning-your-future', title: 'Planning for Your Future' },
] as const;

export function getChapterTitle(slug: string): string | undefined {
  return chapterCatalog.find((chapter) => chapter.slug === slug)?.title;
}
