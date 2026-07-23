import { getArticleExperienceNote } from '@/lib/article-experience-notes';

export default function ArticleExperienceNote({ slug }: { slug: string }) {
  const experience = getArticleExperienceNote(slug);
  if (!experience) return null;

  return (
    <aside className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5" aria-label="運営者の実務経験について">
      <p className="text-sm font-semibold text-gray-800 mb-1">運営者の実務経験について</p>
      <p className="text-sm text-gray-700 leading-relaxed">{experience.note}</p>
    </aside>
  );
}
