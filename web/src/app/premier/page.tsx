'use client';
import { VerifiedDataEmptyState } from '@/components/VerifiedDataEmptyState';
import { LiveActivityFeed } from '@/components/LiveActivityFeed';

export default function PremierPulpitPage() {
  return <div className="mx-auto max-w-7xl space-y-8 pb-20"><header className="border-b border-slate-800/90 pb-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">Kancelaria Prezesa Rady Ministrów</p><h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Pulpit Prezesa Rady Ministrów</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">Pulpit nie pokazuje fikcyjnych sondaży, większości, pytań dziennikarskich ani gotowych scenariuszy kryzysowych.</p></header><VerifiedDataEmptyState title="Brak zweryfikowanego meldunku dla premiera" description="Nie ma jeszcze potwierdzonych wypowiedzi, alertów, konfliktów ani danych parlamentarnych, z których można bezpiecznie zbudować briefing. Pusty rejestr nie jest zastępowany przykładowym raportem." source="official_statements, narrative_conflicts, alerts, media_coverage oraz dane Sejmu" /><LiveActivityFeed title="Aktywność istotna dla premiera" /></div>;
}
