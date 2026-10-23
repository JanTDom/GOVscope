'use client';
import { VerifiedDataEmptyState } from '@/components/VerifiedDataEmptyState';
import { LiveActivityFeed } from '@/components/LiveActivityFeed';

export default function RzecznikPage() {
  return <div className="mx-auto max-w-7xl space-y-8 pb-20"><header className="border-b border-slate-800/90 pb-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">Centrum Informacyjne Rządu</p><h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Rzecznik i komunikacja rządu</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">Dyspozycje i statystyki nie mogą być generowane na podstawie scenariuszy demonstracyjnych.</p></header><VerifiedDataEmptyState title="Brak zweryfikowanego rejestru komunikacji" description="Nie ma jeszcze potwierdzonych depesz, sprostowań ani dyspozycji CIR. Moduł nie pokazuje więc fikcyjnych liczników, gotowych ripost ani symulowanych komunikatów." source="media_coverage, official_statements oraz rejestr komunikatów CIR" /><LiveActivityFeed title="Bieżące materiały dla CIR" defaultFilter="GOVERNMENT" /></div>;
}
