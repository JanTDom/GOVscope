import React from 'react';
import { INITIAL_CONFLICTS } from '@/lib/store';

export default function EuropaPage() {
  const euConflicts = INITIAL_CONFLICTS.filter(
    (c) =>
      c.conflictType === 'ROZDŹWIĘK_Z_BRUKSELĄ' ||
      c.conflictType === 'RYZYKO_PROCEDURY_NARUSZENIOWEJ' ||
      c.euImpact
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <span className="rounded bg-blue-950 px-2 py-0.5 text-xs font-mono font-bold text-blue-400 border border-blue-800">
            Pion Ministra ds. Unii Europejskiej
          </span>
          <span className="text-xs font-mono text-slate-400">Komitet do Spraw Europejskich (KSE)</span>
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white font-mono">
          Wymiar europejski — radar kolizji i procedur naruszeniowych
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Wczesna identyfikacja wypowiedzi i projektów ustaw sprzecznych z polską linią negocjacyjną w Brukseli, wytycznymi Rady UE i kamieniami milowymi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="text-xs font-mono uppercase text-slate-400">Stan procedur naruszeniowych (Art. 258)</div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">24 aktywne</div>
          <div className="mt-1 text-xs text-emerald-400">Brak nowych postępowań w tym miesiącu</div>
        </div>
        <div className="rounded-lg border border-red-900/60 bg-red-950/20 p-4">
          <div className="text-xs font-mono uppercase text-red-400">Wykryte rozbieżności z Radą UE</div>
          <div className="mt-2 text-2xl font-bold text-red-400 font-mono">1 alert krytyczny</div>
          <div className="mt-1 text-xs text-slate-300">Dyrektywa ETS2 (resort MKiŚ)</div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="text-xs font-mono uppercase text-slate-400">Gotowość przed szczytem Rady Europejskiej</div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">Spójna linia KPRM / MdsUE</div>
          <div className="mt-1 text-xs text-slate-400">Pakt migracyjny i obronność</div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-100 font-mono">
          Aktywne ryzyka kolizji ze stanowiskiem UE
        </h2>

        {euConflicts.map((c) => (
          <div key={c.id} className="rounded-lg border border-blue-900/50 bg-slate-900 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="rounded bg-red-950 px-2 py-0.5 text-xs font-bold font-mono text-red-400 border border-red-800">
                  {c.severity}
                </span>
                <span className="rounded bg-blue-950 px-2 py-0.5 text-xs font-mono text-blue-300 border border-blue-800">
                  {c.conflictType}
                </span>
              </div>
              <div className="text-xs font-mono text-slate-400">
                Wykryto: {new Date(c.detectedAt).toLocaleString('pl-PL')}
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-white">{c.title}</h3>
              <p className="mt-1 text-sm text-slate-300 leading-relaxed">{c.summary}</p>
            </div>

            {c.statements && c.statements.length > 0 && (
              <div className="rounded border border-slate-800 bg-slate-950 p-3 space-y-1">
                <div className="text-xs font-mono text-slate-400">
                  Cytat: {c.statements[0].officialName} ({c.statements[0].roleTitle}, {c.statements[0].ministryCode})
                </div>
                <blockquote className="text-xs italic text-slate-200 border-l-2 border-red-500 pl-2">
                  &ldquo;{c.statements[0].quote}&rdquo;
                </blockquote>
              </div>
            )}

            {c.euImpact && (
              <div className="rounded bg-blue-950/30 border border-blue-900 p-3 space-y-1">
                <div className="text-xs font-mono uppercase text-blue-400 font-bold">
                  Ocena ryzyka prawnego i procedury naruszeniowej
                </div>
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-white">Przedmiot:</span> {c.euImpact.euDirectiveOrArea}
                </div>
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-white">Kontekst negocjacyjny w Brukseli:</span> {c.euImpact.brusselsContext}
                </div>
              </div>
            )}

            <div className="rounded bg-slate-950 border border-slate-800 p-3">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Pilna dyspozycja dla ministra ds. UE i rzecznika rządu
              </div>
              <div className="mt-1 text-xs text-slate-300">
                {c.recommendedAction}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
