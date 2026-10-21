import React from 'react';
import { NarrativeConflictItem } from '@/types';

interface ConflictCardProps {
  conflict: NarrativeConflictItem;
}

export const ConflictCard: React.FC<ConflictCardProps> = ({ conflict }) => {
  const getSeverityBadge = (sev: NarrativeConflictItem['severity']) => {
    switch (sev) {
      case 'P1_CRITICAL':
        return 'bg-red-950 text-red-400 border border-red-800';
      case 'P2_HIGH':
        return 'bg-amber-950 text-amber-400 border border-amber-800';
      case 'P3_MODERATE':
        return 'bg-blue-950 text-blue-400 border border-blue-800';
    }
  };

  const getPartyBadge = (party: string) => {
    switch (party) {
      case 'KO':
        return 'bg-orange-950 text-orange-400 border border-orange-800';
      case 'PSL':
        return 'bg-emerald-950 text-emerald-400 border border-emerald-800';
      case 'POLSKA_2050':
        return 'bg-yellow-950 text-yellow-400 border border-yellow-800';
      case 'NOWA_LEWICA':
        return 'bg-rose-950 text-rose-400 border border-rose-800';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <span className={`rounded px-2 py-0.5 text-xs font-bold font-mono ${getSeverityBadge(conflict.severity)}`}>
            {conflict.severity.replace('_', ' ')}
          </span>
          <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-300">
            {conflict.conflictType}
          </span>
          <span className="text-xs font-mono text-slate-400">Temat: {conflict.topic}</span>
        </div>
        <div className="text-xs font-mono text-slate-400">
          Wykryto: {new Date(conflict.detectedAt).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-slate-100">{conflict.title}</h3>
        <p className="mt-1 text-sm text-slate-300 leading-relaxed">{conflict.summary}</p>
      </div>

      {conflict.statements && conflict.statements.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Zarejestrowane zderzenie wypowiedzi
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {conflict.statements.map((stmt) => (
              <div key={stmt.id} className="rounded border border-slate-800 bg-slate-950/60 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="font-semibold text-slate-200">
                    {stmt.officialName} ({stmt.ministryCode})
                  </div>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${getPartyBadge(stmt.coalitionParty)}`}>
                    {stmt.coalitionParty}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono">{stmt.roleTitle} | {stmt.source}</div>
                <blockquote className="text-xs italic text-slate-300 border-l-2 border-slate-700 pl-2">
                  &ldquo;{stmt.quote}&rdquo;
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      )}

      {conflict.euImpact && (
        <div className="rounded border border-blue-900/50 bg-blue-950/20 p-3 space-y-1">
          <div className="text-xs font-semibold text-blue-400 font-mono uppercase">
            Kolizja z procedurami unijnymi (Pion ds. UE)
          </div>
          <div className="text-xs text-slate-300">
            <span className="font-medium text-slate-200">Podstawa:</span> {conflict.euImpact.euDirectiveOrArea}
          </div>
          <div className="text-xs text-slate-400">{conflict.euImpact.brusselsContext}</div>
        </div>
      )}

      <div className="rounded bg-slate-950/80 border border-slate-800 p-3">
        <div className="text-xs font-mono uppercase tracking-wider text-red-400">
          Rekomendacja dla KPRM
        </div>
        <div className="mt-1 text-xs text-slate-300 leading-normal">
          {conflict.recommendedAction}
        </div>
      </div>
    </div>
  );
};
