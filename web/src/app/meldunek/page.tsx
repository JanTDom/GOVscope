'use client';
import { VerifiedDataEmptyState } from '@/components/VerifiedDataEmptyState';

export default function MeldunekPage() {
  return <div className="mx-auto max-w-7xl space-y-8 pb-20"><header className="border-b border-slate-800/90 pb-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">Kancelaria Prezesa Rady Ministrów</p><h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Meldunek dobowy</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">Raport nie zostanie wygenerowany z przykładowych liczb ani ręcznie wpisanych komunikatów.</p></header><VerifiedDataEmptyState title="Brak danych do sporządzenia meldunku" description="W systemie nie ma jeszcze zweryfikowanych wypowiedzi, alertów ani konfliktów z bieżącego okresu. Po zasileniu rejestrów raport będzie tworzony z podaniem źródeł i czasu pobrania." source="official_statements, narrative_conflicts i alerts" /></div>;
}
