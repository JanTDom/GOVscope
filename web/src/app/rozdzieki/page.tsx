import React from 'react';
import { INITIAL_CONFLICTS } from '@/lib/store';

export default function RozdziekiPage() {
  const clashConflicts = INITIAL_CONFLICTS.filter(
    (c) => c.statements && c.statements.length >= 2
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
          Detektor rozdźwięków — bezpośrednie zderzenia wypowiedzi
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Zestawienie publicznych wypowiedzi ministrów i wiceministrów wykazujących sprzeczność merytoryczną lub polityczną.
        </p>
      </div>

      <div className="space-y-6">
        {clashConflicts.map((c) => {
          const [stmtA, stmtB] = c.statements;
          return (
            <div key={c.id} className="rounded-lg border border-slate-800 bg-slate-900 p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="rounded bg-red-950 px-2 py-0.5 text-xs font-bold font-mono text-red-400 border border-red-800">
                    {c.severity.replace('_', ' ')}
                  </span>
                  <span className="ml-2 font-mono text-sm font-semibold text-slate-200">
                    Oś sporu: {c.topic}
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-400">
                  Identyfikator: {c.id}
                </div>
              </div>

              {/* Head-to-head quotation confrontation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Side A */}
                <div className="rounded border border-slate-800 bg-slate-950 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <div>
                      <div className="font-bold text-slate-100">{stmtA.officialName}</div>
                      <div className="text-xs text-slate-400 font-mono">{stmtA.roleTitle} ({stmtA.ministryCode})</div>
                    </div>
                    <span className="rounded bg-orange-950 px-2 py-0.5 text-xs font-bold text-orange-400 border border-orange-800">
                      {stmtA.coalitionParty}
                    </span>
                  </div>
                  <blockquote className="text-sm italic text-slate-200 border-l-2 border-amber-500 pl-3 leading-relaxed">
                    &ldquo;{stmtA.quote}&rdquo;
                  </blockquote>
                  <div className="text-[11px] font-mono text-slate-400">
                    Źródło: {stmtA.source} ({new Date(stmtA.publishedAt).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })})
                  </div>
                </div>

                {/* Side B */}
                <div className="rounded border border-slate-800 bg-slate-950 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <div>
                      <div className="font-bold text-slate-100">{stmtB.officialName}</div>
                      <div className="text-xs text-slate-400 font-mono">{stmtB.roleTitle} ({stmtB.ministryCode})</div>
                    </div>
                    <span className="rounded bg-emerald-950 px-2 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-800">
                      {stmtB.coalitionParty}
                    </span>
                  </div>
                  <blockquote className="text-sm italic text-slate-200 border-l-2 border-red-500 pl-3 leading-relaxed">
                    &ldquo;{stmtB.quote}&rdquo;
                  </blockquote>
                  <div className="text-[11px] font-mono text-slate-400">
                    Źródło: {stmtB.source} ({new Date(stmtB.publishedAt).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })})
                  </div>
                </div>
              </div>

              {/* Assessment and recommendation */}
              <div className="rounded bg-slate-950 border border-slate-800 p-4 space-y-2">
                <div className="text-xs font-mono uppercase text-red-400 font-semibold">
                  Sedno sprzeczności i ryzyko polityczne
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {c.summary}
                </p>
                <div className="mt-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span className="text-slate-300 font-semibold">Sugerowane działanie KPRM:</span> {c.recommendedAction}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
