import Link from 'next/link';

type VerifiedDataEmptyStateProps = {
  title: string;
  description: string;
  source: string;
};

export function VerifiedDataEmptyState({ title, description, source }: VerifiedDataEmptyStateProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
      <div className="flex items-start gap-4">
        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-slate-500" aria-hidden="true" />
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Brak zweryfikowanych danych</p>
          <h2 className="mt-2 text-xl font-semibold text-white">{title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
          <p className="mt-4 border-t border-slate-800 pt-4 text-xs font-mono text-slate-500">Oczekiwane źródło: <span className="text-slate-300">{source}</span></p>
          <Link href="/" className="mt-5 inline-flex rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-300 hover:border-slate-500 hover:text-white">Wróć do radaru</Link>
        </div>
      </div>
    </section>
  );
}
