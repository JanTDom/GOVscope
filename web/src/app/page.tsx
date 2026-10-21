import React from 'react';
import { INITIAL_METRICS, INITIAL_CONFLICTS } from '@/lib/store';
import { MetricCard } from '@/components/MetricCard';
import { ConflictCard } from '@/components/ConflictCard';

export default function RadarKPRMPage() {
  const metrics = INITIAL_METRICS;
  const conflicts = INITIAL_CONFLICTS;

  // Breakdown by risk categories
  const categoryCounts: Record<string, number> = {
    'Napięcie koalicyjne': conflicts.filter((c) => c.conflictType === 'NAPIĘCIE_KOALICYJNE').length,
    'Rozdźwięk z Brukselą': conflicts.filter((c) => c.conflictType === 'ROZDŹWIĘK_Z_BRUKSELĄ').length,
    'Balon próbny': conflicts.filter((c) => c.conflictType === 'BALON_PRÓBNY').length,
    'Kakofonia resortowa': conflicts.filter((c) => c.conflictType === 'KAKOFONIA_RESORTOWA').length,
    'Sprzeczność z exposé': conflicts.filter((c) => c.conflictType === 'SPRZECZNOŚĆ_Z_EXPOSE').length,
  };

  const p1Conflicts = conflicts.filter((c) => c.severity === 'P1_CRITICAL');

  return (
    <div className="space-y-6">
      {/* Page Title & Operational Status */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
            Radar KPRM — centrum wczesnego ostrzegania i spójności rządu
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Ciągły monitoring wypowiedzi ministrów, inicjatyw legislacyjnych RCL oraz wykrywanie kolizji z linią Prezesa Rady Ministrów.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded">
          <span className="text-slate-400">Stan systemu:</span>
          <span className="text-emerald-400 font-bold">AKTYWNY 24/7</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-200">21 października 2026</span>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          label="Indeks spójności rządu"
          value={`${metrics.overallCohesionIndex}%`}
          subtext="-1.2 pkt w ciągu 24h"
          trend="positive"
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
          subtext="100% administracji i komitetów"
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
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 space-y-3">
        <div className="flex items-center justify-between">
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
              className="rounded border border-slate-800 bg-slate-950 p-3 space-y-1"
            >
              <div className="text-[11px] font-mono text-slate-400 truncate">{catName}</div>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold font-mono text-white">{count}</span>
                <span className="text-[10px] font-mono text-slate-500">
                  {((count / conflicts.length) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* P1 Critical Escalations Section */}
      {p1Conflicts.length > 0 && (
        <div className="rounded-lg border border-red-900/60 bg-red-950/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-sm font-bold text-red-400 font-mono tracking-wide uppercase">
                Pilna eskalacja KPRM — alerty stopnia pierwszego ({p1Conflicts.length})
              </h2>
            </div>
            <span className="text-xs font-mono text-red-300">
              Wymagana natychmiastowa dyspozycja premiera lub rzecznika
            </span>
          </div>

          <div className="space-y-3">
            {p1Conflicts.map((c) => (
              <div
                key={c.id}
                className="rounded border border-red-900/80 bg-slate-950 p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-red-400">{c.topic}:</span>
                    <span className="text-slate-200 font-semibold">{c.title}</span>
                  </div>
                  <p className="text-slate-400">{c.summary}</p>
                </div>
                <div className="flex md:flex-col items-end justify-between min-w-[220px] text-right font-mono text-[11px] gap-1">
                  <span className="text-amber-400 font-semibold">Rekomendacja:</span>
                  <span className="text-slate-300">{c.recommendedAction}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Conflicts Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100 font-mono">
            Pełny rejestr rozbieżności i punktów kolizji
          </h2>
          <span className="text-xs font-mono text-slate-400">
            Hierarchia według stopnia krytyczności (P1 &rarr; P2 &rarr; P3)
          </span>
        </div>

        <div className="space-y-4">
          {conflicts.map((conflict) => (
            <ConflictCard key={conflict.id} conflict={conflict} />
          ))}
        </div>
      </div>
    </div>
  );
}
