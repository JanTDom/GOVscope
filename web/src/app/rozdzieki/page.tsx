'use client';

import React, { useState } from 'react';
import { INITIAL_CONFLICTS } from '@/lib/store';
import { ConflictType } from '@/types';
import { LiveActivityFeed } from '@/components/LiveActivityFeed';

export default function RozdziekiPage() {
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const clashConflicts = INITIAL_CONFLICTS.filter(
    (c) => c.statements && c.statements.length >= 2
  ).filter((c) => (selectedType === 'ALL' ? true : c.conflictType === selectedType));

  const getPartyClass = (party: string) => {
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

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'P1_CRITICAL':
        return 'bg-red-950 text-red-400 border-red-800';
      case 'P2_HIGH':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
          Detektor rozdźwięków — oś czasu i analiza zderzeń wypowiedzi
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Chronologiczne zestawienie publicznych deklaracji członków rządu wykazujących sprzeczność merytoryczną, naruszenie ustaleń koalicyjnych lub kolizję z KPRM.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-xs font-mono">
        <button
          onClick={() => setSelectedType('ALL')}
          className={`px-3 py-1.5 rounded transition-colors ${
            selectedType === 'ALL'
              ? 'bg-slate-200 text-slate-950 font-bold'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Wszystkie zderzenia ({INITIAL_CONFLICTS.filter((c) => c.statements.length >= 2).length})
        </button>
        {['NAPIĘCIE_KOALICYJNE', 'KAKOFONIA_RESORTOWA', 'ROZDŹWIĘK_Z_BRUKSELĄ', 'BALON_PRÓBNY'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1.5 rounded transition-colors ${
              selectedType === type
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {type.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Clash cards with chronological timeline */}
      <div className="space-y-6">
        {clashConflicts.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/50 p-8 text-sm text-slate-400">
            Brak zweryfikowanych zderzeń wypowiedzi. Widok nie używa danych przykładowych; pojawią się tu wyłącznie konflikty wykryte na podstawie zapisanych źródeł.
          </div>
        )}
        {clashConflicts.map((c) => {
          const [stmtA, stmtB] = c.statements;
          const dateA = new Date(stmtA.publishedAt);
          const dateB = new Date(stmtB.publishedAt);
          const diffMinutes = Math.abs(Math.round((dateB.getTime() - dateA.getTime()) / (1000 * 60)));
          const diffHours = (diffMinutes / 60).toFixed(1);

          return (
            <div key={c.id} className="rounded-lg border border-slate-800 bg-slate-900 p-6 space-y-6">
              {/* Conflict metadata header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-bold font-mono border ${getSeverityBadge(
                      c.severity
                    )}`}
                  >
                    {c.severity.replace('_', ' ')}
                  </span>
                  <span className="font-mono text-sm font-semibold text-slate-200">
                    Oś sporu: {c.topic}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-xs font-mono text-slate-400">
                  <span>Interwał czasowy: <strong className="text-slate-200">{diffHours} godz.</strong> ({diffMinutes} min)</span>
                  <span>ID: {c.id}</span>
                </div>
              </div>

              {/* Chronological Timeline Container */}
              <div className="relative pl-6 border-l-2 border-slate-700 space-y-8">
                {/* Event 1: Initial Statement */}
                <div className="relative group">
                  <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full bg-amber-500 border-2 border-slate-950" />
                  <div className="text-xs font-mono text-amber-400 mb-1">
                    Wypowiedź pierwotna &bull; {dateA.toLocaleDateString('pl-PL')} godz. {dateA.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="rounded border border-slate-800 bg-slate-950 p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div>
                        <span className="font-bold text-slate-100 text-sm">{stmtA.officialName}</span>
                        <span className="text-xs text-slate-400 font-mono ml-2">
                          {stmtA.roleTitle} ({stmtA.ministryCode})
                        </span>
                      </div>
                      <span className={`rounded px-2 py-0.5 text-xs font-bold ${getPartyClass(stmtA.coalitionParty)}`}>
                        {stmtA.coalitionParty}
                      </span>
                    </div>
                    <blockquote className="text-sm italic text-slate-200 border-l-2 border-amber-500 pl-3 leading-relaxed">
                      &ldquo;{stmtA.quote}&rdquo;
                    </blockquote>
                    <div className="text-[11px] font-mono text-slate-400">
                      Kanał emisji: <span className="text-slate-300">{stmtA.source}</span>
                    </div>
                  </div>
                </div>

                {/* Event 2: Counter / Conflicting Statement */}
                <div className="relative group">
                  <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full bg-red-500 border-2 border-slate-950" />
                  <div className="text-xs font-mono text-red-400 mb-1">
                    Publiczna riposta / stanowisko odmienne &bull; +{diffHours}h później ({dateB.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })})
                  </div>
                  <div className="rounded border border-slate-800 bg-slate-950 p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div>
                        <span className="font-bold text-slate-100 text-sm">{stmtB.officialName}</span>
                        <span className="text-xs text-slate-400 font-mono ml-2">
                          {stmtB.roleTitle} ({stmtB.ministryCode})
                        </span>
                      </div>
                      <span className={`rounded px-2 py-0.5 text-xs font-bold ${getPartyClass(stmtB.coalitionParty)}`}>
                        {stmtB.coalitionParty}
                      </span>
                    </div>
                    <blockquote className="text-sm italic text-slate-200 border-l-2 border-red-500 pl-3 leading-relaxed">
                      &ldquo;{stmtB.quote}&rdquo;
                    </blockquote>
                    <div className="text-[11px] font-mono text-slate-400">
                      Kanał emisji: <span className="text-slate-300">{stmtB.source}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rigorous Cohesion & Narrative Impact Analysis */}
              <div className="rounded bg-slate-950 border border-slate-800 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-semibold">
                    Analiza logiczna sprzeczności i ryzyko koalicyjne
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Kategoria: {c.conflictType}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {c.summary}
                </p>

                <div className="pt-2 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div className="text-slate-300 flex-1">
                    <strong className="text-amber-400 font-mono">Rekomendowane działanie KPRM:</strong>{' '}
                    {c.recommendedAction}
                  </div>
                  <div className="flex items-center space-x-3">
                    <a
                      href="/audytor"
                      className="px-2.5 py-1 rounded bg-blue-950/80 hover:bg-blue-900 border border-blue-800 text-[11px] font-mono text-blue-300 transition-colors"
                    >
                      Audyt Gemini AI &rarr;
                    </a>
                    <span className="font-mono text-[11px] text-slate-500">
                      Status: {c.resolutionStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <LiveActivityFeed title="Materiały oczekujące na analizę rozdźwięku" />
    </div>
  );
}
