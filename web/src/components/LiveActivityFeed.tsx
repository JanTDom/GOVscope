'use client';

import { useEffect, useState } from 'react';
import type { GovernmentActivity } from '@/types';

type LiveActivityFeedProps = {
  title?: string;
  description?: string;
  limit?: number;
};

function activityLabel(kind: GovernmentActivity['kind']): string {
  switch (kind) {
    case 'MEDIA_COVERAGE':
      return 'Materiał medialny';
    case 'PRESS_CONFERENCE':
      return 'Konferencja';
    case 'PLANNED_ACTIVITY':
      return 'Planowana aktywność';
    default:
      return 'Komunikat';
  }
}

function activityClass(kind: GovernmentActivity['kind']): string {
  switch (kind) {
    case 'MEDIA_COVERAGE':
      return 'border-violet-800/70 bg-violet-950/20 text-violet-300';
    case 'PRESS_CONFERENCE':
      return 'border-amber-800/70 bg-amber-950/20 text-amber-300';
    case 'PLANNED_ACTIVITY':
      return 'border-sky-800/70 bg-sky-950/20 text-sky-300';
    default:
      return 'border-slate-700 bg-slate-950/70 text-slate-300';
  }
}

export function LiveActivityFeed({
  title = 'Ostatnia aktywność rządu i otoczenia medialnego',
  description = 'Materiały pochodzące z potwierdzonych źródeł publicznych. Każdy wpis prowadzi do źródła pierwotnego lub materiału, który został pobrany przez ingest.',
  limit = 12,
}: LiveActivityFeedProps) {
  const [activities, setActivities] = useState<GovernmentActivity[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/aktywnosci', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Nie udało się pobrać aktywności');
        return response.json() as Promise<{ activities?: GovernmentActivity[] }>;
      })
      .then((payload) => setActivities(Array.isArray(payload.activities) ? payload.activities : []))
      .catch(() => setActivities([]))
      .finally(() => setLoaded(true));
  }, []);

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl" aria-labelledby="live-activity-heading">
      <div className="flex flex-col gap-2 border-b border-slate-800 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-300">Rejestr źródłowy</p>
          <h2 id="live-activity-heading" className="mt-2 text-lg font-semibold text-white">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{description}</p>
        </div>
        <span className="shrink-0 font-mono text-xs text-slate-500">{loaded ? `${activities.length} wpisów` : 'Pobieranie...'}</span>
      </div>

      {!loaded ? (
        <p className="pt-5 text-sm text-slate-500">Odczytuję potwierdzone rekordy.</p>
      ) : activities.length === 0 ? (
        <div className="pt-5">
          <p className="text-sm font-medium text-slate-300">Brak potwierdzonych aktywności w rejestrze.</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">To oznacza brak zapisanego rekordu albo niedostępny cykl ingestu, a nie brak wydarzeń w świecie.</p>
        </div>
      ) : (
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {activities.slice(0, limit).map((activity) => (
            <article key={activity.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className={`rounded border px-1.5 py-0.5 text-[10px] font-bold ${activityClass(activity.kind)}`}>
                  {activityLabel(activity.kind)}
                </span>
                <time className="shrink-0 text-[10px] font-mono text-slate-500" dateTime={activity.publishedAt}>
                  {new Date(activity.publishedAt).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' })}
                </time>
              </div>
              <h3 className="mt-3 text-sm font-semibold leading-snug text-slate-100">{activity.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{activity.summary}</p>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                <span>{activity.sourceName}</span>
                {activity.officialName && <span>• {activity.officialName}</span>}
                {activity.ministryCode && <span>• {activity.ministryCode}</span>}
                <a href={activity.sourceUrl} target="_blank" rel="noreferrer" className="ml-auto text-sky-400 hover:text-sky-300">
                  Otwórz źródło
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
