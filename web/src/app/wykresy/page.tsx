'use client';
import { VerifiedDataEmptyState } from '@/components/VerifiedDataEmptyState';
import { LiveActivityFeed } from '@/components/LiveActivityFeed';

export default function WykresyPage() {
  return <div className="mx-auto max-w-7xl space-y-8 pb-20"><header className="border-b border-slate-800/90 pb-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">Centrum analityki i metryk KPRM</p><h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Wykresy i metryki</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">Wartości demonstracyjne zostały usunięte. Wykresy pojawią się dopiero po zasileniu rejestrów potwierdzonymi rekordami.</p></header><VerifiedDataEmptyState title="Brak zweryfikowanej serii danych do narysowania" description="Nie pokazujemy wykresów, procentów ani rankingów, dopóki nie ma zasilonych rejestrów wypowiedzi, konfliktów, alertów, prac legislacyjnych i sprostowań. Sam brak rekordów nie jest wynikiem analizy." source="official_statements, narrative_conflicts, alerts, legislative_initiatives i media_coverage" /><LiveActivityFeed title="Aktywność wykorzystana do analityki" /></div>;
}
