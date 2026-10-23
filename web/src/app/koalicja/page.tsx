'use client';
import { VerifiedDataEmptyState } from '@/components/VerifiedDataEmptyState';
import { LiveActivityFeed } from '@/components/LiveActivityFeed';

export default function KoalicjaPage() {
  return <div className="mx-auto max-w-7xl space-y-8 pb-20"><header className="border-b border-slate-800/90 pb-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">KPRM</p><h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Komitet koalicji</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">Widok napięć i głosowań wymaga danych źródłowych. Nie prezentujemy przykładowego bilansu parlamentarnego.</p></header><VerifiedDataEmptyState title="Brak zweryfikowanych danych koalicyjnych" description="Nie ma jeszcze potwierdzonego rejestru głosowań, stanowisk partii ani publicznych polemik, dlatego system nie wylicza większości, poparcia ani ryzyka politycznego." source="official_statements, media_coverage oraz dane Sejmu" /><LiveActivityFeed title="Publiczna aktywność koalicji i rządu" /></div>;
}
