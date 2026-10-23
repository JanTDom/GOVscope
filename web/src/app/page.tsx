'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { INITIAL_METRICS, INITIAL_CONFLICTS } from '@/lib/store';
import type { NarrativeConflictItem, SystemMetricSummary } from '@/types';
import { MetricCard } from '@/components/MetricCard';
import { ConflictCard } from '@/components/ConflictCard';

export default function RadarKPRMPage() {
  const [metrics, setMetrics] = useState<SystemMetricSummary>(INITIAL_METRICS);
  const [conflicts, setConflicts] = useState<NarrativeConflictItem[]>(INITIAL_CONFLICTS);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'P1' | 'P2' | 'P3' | 'KOALICJA'>('ALL');

  useEffect(() => {
    fetch('/api/radar', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Nie udało się pobrać danych radaru');
        return response.json() as Promise<{ metrics: SystemMetricSummary; conflicts: NarrativeConflictItem[] }>;
      })
      .then((payload) => {
        setMetrics(payload.metrics);
        setConflicts(payload.conflicts);
      })
      .catch(() => {
        setMetrics(INITIAL_METRICS);
        setConflicts([]);
      });
  }, []);

  // Breakdown by risk categories
  const categoryCounts: Record<string, number> = {
    'Napięcie koalicyjne': conflicts.filter((c) => c.conflictType === 'NAPIĘCIE_KOALICYJNE').length,
    'Rozdźwięk z Brukselą': conflicts.filter((c) => c.conflictType === 'ROZDŹWIĘK_Z_BRUKSELĄ').length,
    'Balon próbny': conflicts.filter((c) => c.conflictType === 'BALON_PRÓBNY').length,
    'Kakofonia resortowa': conflicts.filter((c) => c.conflictType === 'KAKOFONIA_RESORTOWA').length,
    'Sprzeczność z linią premiera': conflicts.filter((c) => c.conflictType === 'SPRZECZNOŚĆ_Z_EXPOSE').length,
  };

  const p1Conflicts = conflicts.filter((c) => c.severity === 'P1_CRITICAL');

  const filteredConflicts = conflicts.filter((c) => {
    if (selectedFilter === 'P1') return c.severity === 'P1_CRITICAL';
    if (selectedFilter === 'P2') return c.severity === 'P2_HIGH';
    if (selectedFilter === 'P3') return c.severity === 'P3_MODERATE';
    if (selectedFilter === 'KOALICJA') return c.conflictType === 'NAPIĘCIE_KOALICYJNE';
    return true;
  });

  return (
    <div className="space-y-7">
      {/* Top Banner & Fast Actions */}
      <div className="flex flex-col gap-7 rounded-3xl border border-slate-800/90 bg-gradient-to-br from-slate-900/90 to-slate-950/60 p-6 shadow-xl shadow-slate-950/20 lg:flex-row lg:items-end lg:justify-between lg:p-8">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Kancelaria Prezesa Rady Ministrów • Stanowisko Dowodzenia</span>
          </div>
          <h1 className="max-w-4xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Radar KPRM — centrum wczesnego ostrzegania i spójności rządu
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
            Ciągły monitoring wypowiedzi ministrów, inicjatyw legislacyjnych RCL oraz wykrywanie kolizji z linią Prezesa Rady Ministrów.
          </p>
        </div>

        {/* Executive Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/audytor"
            className="flex items-center space-x-2 rounded-xl border border-blue-400/30 bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500"
          >
            <span>Audytor AI Gemini</span>
          </Link>
          <Link
            href="/meldunek"
            className="rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-300"
          >
            <span>Meldunek dla premiera</span>
          </Link>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <MetricCard
          label="Indeks spójności rządu"
          value={metrics.overallCohesionIndex === null ? 'Brak danych' : `${metrics.overallCohesionIndex}%`}
          subtext={metrics.overallCohesionIndex === null ? 'Brak zweryfikowanej podstawy' : 'Wyliczone z danych źródłowych'}
          trend="neutral"
        />
        <MetricCard
          label="Alerty krytyczne P1"
          value={metrics.activeP1Alerts}
          subtext="Wymaga reakcji KPRM"
          trend="critical"
        />
        <MetricCard
          label="Alerty ostrzegawcze P2"
          value={metrics.activeP2Alerts}
          subtext="Do weryfikacji na SKRM"
          trend="neutral"
        />
        <MetricCard
          label="Wypowiedzi dzisiaj"
          value={metrics.totalMonitoredStatementsToday}
          subtext="Zanalizowane przez silnik"
          trend="neutral"
        />
        <MetricCard
          label="Monitorowane resorty"
          value={metrics.monitoredMinistriesCount}
          subtext="Aktywne jednostki w rejestrze"
          trend="positive"
        />
        <MetricCard
          label="Kierownictwo rządu"
          value={metrics.monitoredOfficialsCount}
          subtext="Ministrowie i wiceministrowie"
          trend="neutral"
        />
      </div>

      {/* Risk Categories Distribution Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-200 font-mono">
            Struktura zidentyfikowanych zagrożeń komunikacyjnych ({conflicts.length} aktywne incydenty)
          </h2>
          <span className="text-xs font-mono text-slate-400">
            Klasyfikacja według matrycy ryzyka KPRM
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-1">
          {Object.entries(categoryCounts).map(([catName, count]) => (
            <div
              key={catName}
              className="rounded-lg border border-slate-800/90 bg-slate-950 p-3 space-y-1 hover:border-slate-700 transition-colors"
            >
              <div className="text-[11px] font-mono text-slate-400 truncate">{catName}</div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold font-mono text-white">{count}</span>
                <span className="text-[10px] font-mono text-slate-500">
                  {conflicts.length > 0 ? `${((count / conflicts.length) * 100).toFixed(0)}%` : '—'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* P1 Critical Escalations Section */}
      {p1Conflicts.length > 0 && (
        <div className="rounded-xl border border-rose-900/60 bg-rose-950/20 p-5 space-y-4 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
              <h2 className="text-sm font-bold text-rose-400 font-mono tracking-wide uppercase">
                Pilna eskalacja KPRM — alerty stopnia pierwszego ({p1Conflicts.length})
              </h2>
            </div>
            <span className="text-xs font-mono text-rose-300">
              Wymagana natychmiastowa dyspozycja premiera lub rzecznika
            </span>
          </div>

          <div className="space-y-3">
            {p1Conflicts.map((c) => (
              <div
                key={c.id}
                className="rounded-lg border border-rose-900/80 bg-slate-950 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-rose-400 uppercase tracking-wide">
                      {c.topic}:
                    </span>
                    <span className="text-slate-100 font-semibold">{c.title}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{c.summary}</p>
                </div>
                <div className="flex md:flex-col items-end justify-between min-w-[240px] text-right font-mono text-[11px] gap-1 bg-slate-900/90 p-2.5 rounded border border-slate-800">
                  <span className="text-amber-400 font-semibold">Rekomendacja KPRM:</span>
                  <span className="text-slate-200">{c.recommendedAction}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Conflicts Feed with Filter Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-3 gap-3">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-semibold text-slate-100 font-mono">
              Pełny rejestr rozbieżności i punktów kolizji
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {filteredConflicts.length} pozycji
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setSelectedFilter('ALL')}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                selectedFilter === 'ALL'
                  ? 'bg-slate-700 text-white font-bold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              Wszystkie
            </button>
            <button
              onClick={() => setSelectedFilter('P1')}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                selectedFilter === 'P1'
                  ? 'bg-rose-900/80 text-rose-200 font-bold border border-rose-700'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              Tylko P1
            </button>
            <button
              onClick={() => setSelectedFilter('P2')}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                selectedFilter === 'P2'
                  ? 'bg-amber-900/80 text-amber-200 font-bold border border-amber-700'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              Tylko P2
            </button>
            <button
              onClick={() => setSelectedFilter('KOALICJA')}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                selectedFilter === 'KOALICJA'
                  ? 'bg-blue-900/80 text-blue-200 font-bold border border-blue-700'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              Napięcia koalicji
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredConflicts.map((conflict) => (
            <ConflictCard key={conflict.id} conflict={conflict} />
          ))}
        </div>
      </div>
    </div>
  );
}
