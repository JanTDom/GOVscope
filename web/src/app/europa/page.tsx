'use client';

import React, { useEffect, useState } from 'react';
import type { NarrativeConflictItem } from '@/types';
import { LiveActivityFeed } from '@/components/LiveActivityFeed';

interface InfringementItem { id: string; title: string; directiveRef: string; stage: string; riskLevel: string; deadline: string; impact: string; responsibleMinistry: string; }
interface KpoMilestone { id: string; code: string; title: string; status: string; quarter: string; ministry: string; }
interface CouncilItem { date: string; name: string; city: string; leadOfficial: string; mainAgenda: string; }

export default function EuropaPage() {
  const [activeTab, setActiveTab] = useState<'RADAR' | 'INFRINGEMENTS' | 'KPO' | 'COUNCILS'>('RADAR');
  const [euConflicts, setEuConflicts] = useState<NarrativeConflictItem[]>([]);
  const [infringements, setInfringements] = useState<InfringementItem[]>([]);
  const [kpoMilestones, setKpoMilestones] = useState<KpoMilestone[]>([]);
  const [upcomingCouncils, setUpcomingCouncils] = useState<CouncilItem[]>([]);

  useEffect(() => {
    fetch('/api/europa', { cache: 'no-store' })
      .then((response) => response.json() as Promise<{ conflicts?: NarrativeConflictItem[]; euSignals?: { infringements?: InfringementItem[]; kpoMilestones?: KpoMilestone[]; upcomingCouncils?: CouncilItem[] } }>)
      .then((payload) => {
        setEuConflicts(Array.isArray(payload.conflicts) ? payload.conflicts : []);
        setInfringements(Array.isArray(payload.euSignals?.infringements) ? payload.euSignals.infringements : []);
        setKpoMilestones(Array.isArray(payload.euSignals?.kpoMilestones) ? payload.euSignals.kpoMilestones : []);
        setUpcomingCouncils(Array.isArray(payload.euSignals?.upcomingCouncils) ? payload.euSignals.upcomingCouncils : []);
      })
      .catch(() => {
        setEuConflicts([]); setInfringements([]); setKpoMilestones([]); setUpcomingCouncils([]);
      });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <span className="rounded bg-blue-950 px-2.5 py-0.5 text-xs font-mono font-bold text-blue-400 border border-blue-800">
            Pion Ministra do spraw Unii Europejskiej
          </span>
          <span className="text-xs font-mono text-slate-400">Komitet do Spraw Europejskich (KSE)</span>
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white font-mono">
          Wymiar europejski — radar kolizji i postępowań naruszeniowych
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Wczesna identyfikacja wypowiedzi i projektów ustaw sprzecznych z polską linią negocjacyjną w Brukseli, procedurami Komisji Europejskiej oraz kamieniami milowymi KPO.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="text-xs font-mono uppercase text-slate-400">Aktywne procedury naruszeniowe (Art. 258)</div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">{infringements.length}</div>
          <div className="mt-1 text-xs text-slate-400 font-mono">Wyłącznie zweryfikowane dane źródłowe</div>
        </div>
        <div className="rounded-lg border border-red-900/60 bg-red-950/20 p-4">
          <div className="text-xs font-mono uppercase text-red-400">Wykryte rozbieżności z linią negocjacyjną</div>
          <div className="mt-2 text-2xl font-bold text-red-400 font-mono">{euConflicts.filter((conflict) => conflict.severity === 'P1_CRITICAL').length}</div>
          <div className="mt-1 text-xs text-slate-300 font-mono">Zweryfikowane rozbieżności</div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="text-xs font-mono uppercase text-slate-400">Stan kamieni milowych KPO</div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">{kpoMilestones.length}</div>
          <div className="mt-1 text-xs text-slate-400 font-mono">Zweryfikowane kamienie milowe</div>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-xs font-mono">
        <button
          onClick={() => setActiveTab('RADAR')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'RADAR'
              ? 'bg-blue-600 text-white font-bold'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Kolizje z polityką UE ({euConflicts.length})
        </button>
        <button
          onClick={() => setActiveTab('INFRINGEMENTS')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'INFRINGEMENTS'
              ? 'bg-blue-600 text-white font-bold'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Procedury naruszeniowe ({infringements.length})
        </button>
        <button
          onClick={() => setActiveTab('KPO')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'KPO'
              ? 'bg-blue-600 text-white font-bold'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Kamienie milowe KPO ({kpoMilestones.length})
        </button>
        <button
          onClick={() => setActiveTab('COUNCILS')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'COUNCILS'
              ? 'bg-blue-600 text-white font-bold'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Kalendarz posiedzeń Rady UE ({upcomingCouncils.length})
        </button>
      </div>

      {/* Tab: Radar kolizji */}
      {activeTab === 'RADAR' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-100 font-mono">
            Wykryte rozbieżności z mandatem negocjacyjnym w Radzie UE
          </h2>

          {euConflicts.map((c) => (
            <div key={c.id} className="rounded-lg border border-blue-900/60 bg-slate-900 p-5 space-y-4">
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
                <p className="mt-1 text-sm text-slate-300 leading-relaxed font-sans">{c.summary}</p>
              </div>

              {c.statements && c.statements.length > 0 && (
                <div className="rounded border border-slate-800 bg-slate-950 p-3 space-y-1">
                  <div className="text-xs font-mono text-slate-400">
                    Cytat wypowiedzi: {c.statements[0].officialName} ({c.statements[0].roleTitle}, {c.statements[0].ministryCode})
                  </div>
                  <blockquote className="text-xs italic text-slate-200 border-l-2 border-red-500 pl-2">
                    &ldquo;{c.statements[0].quote}&rdquo;
                  </blockquote>
                </div>
              )}

              {c.euImpact && (
                <div className="rounded bg-blue-950/40 border border-blue-800/80 p-3 space-y-1">
                  <div className="text-xs font-mono uppercase text-blue-300 font-bold">
                    Konsekwencje unijne i ryzyko prawne
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
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Pilna dyspozycja dla ministra ds. UE i rzecznika rządu
                </div>
                <p className="mt-1 text-xs text-amber-300 font-mono">
                  {c.recommendedAction}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Infringements */}
      {activeTab === 'INFRINGEMENTS' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-100 font-mono">
            Kluczowe procedury naruszeniowe Komisji Europejskiej wobec Polski
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {infringements.map((inf) => (
              <div key={inf.id} className="rounded-lg border border-slate-800 bg-slate-900 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-red-400">{inf.riskLevel}</span>
                  <span className="text-xs font-mono text-slate-400">Termin odpowiedzi: {inf.deadline}</span>
                </div>
                <h3 className="font-semibold text-white text-sm">{inf.title}</h3>
                <div className="text-xs text-slate-400 font-mono">Podstawa: {inf.directiveRef} &bull; Etap: {inf.stage} &bull; Resort: {inf.responsibleMinistry}</div>
                <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800/80">{inf.impact}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: KPO */}
      {activeTab === 'KPO' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-100 font-mono">
            Status kluczowych kamieni milowych KPO
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {kpoMilestones.map((kpo) => (
              <div key={kpo.id} className="rounded-lg border border-slate-800 bg-slate-900 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400">{kpo.code}</span>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${kpo.status.includes('ZGODNA') ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-red-950 text-red-400 border-red-800'}`}>
                    {kpo.status}
                  </span>
                </div>
                <h3 className="font-semibold text-white text-sm">{kpo.title}</h3>
                <div className="text-xs text-slate-400 font-mono">Termin: {kpo.quarter} &bull; Resort odpowiedzialny: {kpo.ministry}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Councils */}
      {activeTab === 'COUNCILS' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-100 font-mono">
            Nadchodzące posiedzenia Rady Unii Europejskiej
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {upcomingCouncils.map((c, idx) => (
              <div key={idx} className="rounded-lg border border-slate-800 bg-slate-900 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-400">{c.date} ({c.city})</span>
                  <span className="text-xs font-mono text-slate-300">Prowadzi: {c.leadOfficial}</span>
                </div>
                <h3 className="font-semibold text-white text-sm">{c.name}</h3>
                <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800/80">{c.mainAgenda}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <LiveActivityFeed title="Aktywność rządu związana z wymiarem europejskim" />
    </div>
  );
}
