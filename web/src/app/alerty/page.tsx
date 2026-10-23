'use client';

import React, { useState, useEffect } from 'react';
import { INITIAL_CONFLICTS } from '@/lib/store';
import { LiveActivityFeed } from '@/components/LiveActivityFeed';

interface AlertItem {
  id: string;
  conflictId: string;
  priority: 'P1' | 'P2' | 'P3';
  topic: string;
  title: string;
  targetAudience: string;
  status: 'QUEUED' | 'DELIVERED' | 'ACKNOWLEDGED' | 'RESOLVED';
  createdAt: string;
}

const DEFAULT_ALERTS: AlertItem[] = INITIAL_CONFLICTS.map((c, idx) => ({
  id: `alt-2026-00${idx + 1}`,
  conflictId: c.id,
  priority: c.severity === 'P1_CRITICAL' ? 'P1' : 'P2',
  topic: c.topic,
  title: c.title,
  targetAudience: c.severity === 'P1_CRITICAL' ? 'KPRM_PREMIER' : 'KPRM_KOMUNIKACJA',
  status: 'DELIVERED',
  createdAt: c.detectedAt,
}));

export default function AlertyPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>(DEFAULT_ALERTS);
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchAlerts() {
      if (typeof window === 'undefined') return;
      try {
        const ministry = new URLSearchParams(window.location.search).get('ministry');
        const res = await fetch(ministry ? `/api/alerty?ministry=${encodeURIComponent(ministry)}` : '/api/alerty', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.alerts && Array.isArray(data.alerts)) {
            setAlerts(data.alerts);
          }
        }
      } catch {
        // Fallback to default state on local test environment
      }
    }
    fetchAlerts();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'ACKNOWLEDGED' | 'RESOLVED') => {
    try {
      const res = await fetch('/api/alerty', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setAlerts((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
      }
    } catch (err) {
      console.error('Błąd aktualizacji statusu alertu:', err);
    }
  };

  const filtered = alerts.filter(
    (a) => filterPriority === 'ALL' || a.priority === filterPriority
  );

  const p1Count = alerts.filter((a) => a.priority === 'P1').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
              Centrum Dyspozytorskie KPRM
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white font-mono">
            Powiadomienia i eskalacje w czasie rzeczywistym
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Kanał natychmiastowych dyspozycji dla Prezesa Rady Ministrów, Szefa KPRM oraz rzecznika rządu.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px]">Alerty P1:</span>
            <span className="text-red-400 font-bold text-base">{p1Count} pilne</span>
          </div>
          <div className="border-l border-slate-800 pl-3">
            <span className="text-slate-400 block text-[10px]">Łącznie alertów:</span>
            <span className="text-white font-bold text-base">{alerts.length}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-xs font-mono">
        <button
          onClick={() => setFilterPriority('ALL')}
          className={`px-3 py-1.5 rounded transition-colors ${
            filterPriority === 'ALL'
              ? 'bg-slate-200 text-slate-950 font-bold'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Wszystkie alerty ({alerts.length})
        </button>
        <button
          onClick={() => setFilterPriority('P1')}
          className={`px-3 py-1.5 rounded transition-colors ${
            filterPriority === 'P1'
              ? 'bg-red-600 text-white font-bold'
              : 'bg-slate-950 text-red-400 hover:bg-slate-900 border border-red-900/60'
          }`}
        >
          Alerty krytyczne P1 ({alerts.filter((a) => a.priority === 'P1').length})
        </button>
        <button
          onClick={() => setFilterPriority('P2')}
          className={`px-3 py-1.5 rounded transition-colors ${
            filterPriority === 'P2'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-slate-950 text-amber-400 hover:bg-slate-900 border border-amber-900/60'
          }`}
        >
          Alerty ostrzegawcze P2 ({alerts.filter((a) => a.priority === 'P2').length})
        </button>
      </div>

      {/* Alerts Feed */}
      {loading ? (
        <div className="p-8 text-center text-xs font-mono text-slate-400">
          Ładowanie rejestru powiadomień KPRM...
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`rounded-lg border p-4 space-y-3 ${
                item.priority === 'P1'
                  ? 'border-red-900/80 bg-red-950/20'
                  : 'border-slate-800 bg-slate-900'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                <div className="flex items-center space-x-2">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-bold font-mono border ${
                      item.priority === 'P1'
                        ? 'bg-red-950 text-red-400 border-red-800'
                        : 'bg-amber-950 text-amber-400 border-amber-800'
                    }`}
                  >
                    PRIORYTET {item.priority}
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-200">
                    Oś sporu: {item.topic}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
                  <span>Adresat: <strong className="text-slate-300">{item.targetAudience}</strong></span>
                  <span>ID: {item.id}</span>
                  <span className="text-slate-500">
                    {new Date(item.createdAt).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60 text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400">Status operacyjny:</span>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      item.status === 'RESOLVED'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : item.status === 'ACKNOWLEDGED'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {item.status !== 'ACKNOWLEDGED' && item.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'ACKNOWLEDGED')}
                      className="px-2.5 py-1 rounded bg-slate-950 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors"
                    >
                      Potwierdź odbiór
                    </button>
                  )}
                  {item.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'RESOLVED')}
                      className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800 text-xs transition-colors"
                    >
                      Oznacz jako wyjaśnione
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <LiveActivityFeed title="Materiały źródłowe dla centrum alertów" />
    </div>
  );
}
