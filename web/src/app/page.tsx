import React from 'react';
import { INITIAL_METRICS, INITIAL_CONFLICTS } from '@/lib/store';
import { MetricCard } from '@/components/MetricCard';
import { ConflictCard } from '@/components/ConflictCard';

export default function RadarKPRMPage() {
  const metrics = INITIAL_METRICS;
  const conflicts = INITIAL_CONFLICTS;

  return (
    <div className="space-y-6">
      {/* Page Title & Operational Status */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
            Radar KPRM — bieżący stan spójności rządu
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Wczesne ostrzeganie przed kakofonią resortową, sporami koalicyjnymi i kolizjami europejskimi.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded">
          <span className="text-slate-400">Stan na:</span>
          <span className="text-slate-200 font-bold">21 października 2026, 21:30 CET</span>
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
          subtext="Do wyjaśnienia na SKRM"
          trend="neutral"
        />
        <MetricCard
          label="Dzienne wypowiedzi"
          value={metrics.totalMonitoredStatementsToday}
          subtext="Przeanalizowane przez silnik"
          trend="neutral"
        />
        <MetricCard
          label="Monitorowane resorty"
          value={metrics.monitoredMinistriesCount}
          subtext="100% pokrycia administracji"
          trend="positive"
        />
        <MetricCard
          label="Członkowie rządu"
          value={metrics.monitoredOfficialsCount}
          subtext="Ministrowie i wiceministrowie"
          trend="neutral"
        />
      </div>

      {/* Active Narrative Conflicts Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100 font-mono">
            Aktywne punkty zapalne i rozbieżności
          </h2>
          <span className="text-xs font-mono text-slate-400">
            Kolejność według stopnia pilności (P1 &rarr; P2)
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
