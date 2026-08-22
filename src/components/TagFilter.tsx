import { useMemo, useState } from 'react';

type Article = { id: string; title: string; description: string; date: string; tags: string[] };

export default function TagFilter({ articles }: { articles: Article[] }) {
  const [selected, setSelected] = useState('All');
  const tags = useMemo(() => ['All', ...new Set(articles.flatMap((article) => article.tags))], [articles]);
  const visible = selected === 'All' ? articles : articles.filter((article) => article.tags.includes(selected));

  return <div className="tag-filter" aria-label="Filter blog articles by tag">
    <div className="filter-controls" role="group" aria-label="Article tags">
      {tags.map((tag) => <button key={tag} className={selected === tag ? 'filter-chip is-active' : 'filter-chip'} type="button" aria-pressed={selected === tag} onClick={() => setSelected(tag)}>{tag}</button>)}
    </div>
    <div className="mt-8 divide-y divide-[var(--line)] border-y border-[var(--line)]">
      {visible.map((article) => <a key={article.id} className="article-row" href={`/blog/${article.id}/`}><time dateTime={article.date}>{new Date(article.date).toLocaleDateString('en-GB')}</time><div><h2 className="text-2xl font-semibold">{article.title}</h2><p>{article.description}</p></div><span aria-hidden="true">↗</span></a>)}
    </div>
    {visible.length === 0 && <p className="py-8 text-[var(--muted)]">No dispatches in this channel yet.</p>}
  </div>;
}
