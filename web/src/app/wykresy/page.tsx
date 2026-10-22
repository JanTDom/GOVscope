'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getPolishLongDate } from '@/lib/dates';

type TimeRange = '24H' | '7D' | '30D' | 'Q4_2026';
type CategoryFilter = 'ALL' | 'KOALICJA' | 'RESORTY' | 'RYZYKA' | 'EUROPA' | 'MEDIA';

export default function WykresyPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30D');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('ALL');
  const [selectedChartId, setSelectedChartId] = useState<string | null>(null);

  const categories = [
    { id: 'ALL', label: 'Wszystkie wykresy (32)' },
    { id: 'KOALICJA', label: 'Spójność koalicji (6)' },
    { id: 'RESORTY', label: 'Dyscyplina 21 resortów (6)' },
    { id: 'RYZYKA', label: 'Zagrożenia & alerty (6)' },
    { id: 'EUROPA', label: 'Wymiar UE & finanse (6)' },
    { id: 'MEDIA', label: 'Media, CIR & opozycja (8)' },
  ];

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-slate-800/90 pb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Centrum Analityki i Metryk KPRM</span>
            </span>
            <span className="text-xs font-mono text-slate-500">
              Stan na: {getPolishLongDate()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Matryca Wskaźników i Wykresów Rządowych
          </h1>
          <p className="text-sm text-slate-400 max-w-3xl mt-1">
            Wieloźródłowy kompleks 32 specjalistycznych wykresów telemetrycznych monitorujących
            spójność koalicji, dyscyplinę 21 resortów, dynamikę incydentów prasowych oraz zgodność z linią premiera.
          </p>
        </div>

        {/* Global Controls: Time Range & Print */}
        <div className="flex items-center space-x-3 self-start lg:self-auto">
          <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-xl">
            {(['24H', '7D', '30D', 'Q4_2026'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all ${
                  timeRange === range
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {range === '24H' && '24h'}
                {range === '7D' && '7 dni'}
                {range === '30D' && '30 dni'}
                {range === 'Q4_2026' && 'IV kw. 2026'}
              </button>
            ))}
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-mono transition-colors shadow-sm"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Drukuj raport</span>
          </button>
        </div>
      </div>

      {/* KPI Hero Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/80 shadow-lg">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Zagregowana Spójność Rządu
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1 font-mono">
            Brak danych
          </div>
          <div className="text-xs text-emerald-500 font-medium mt-1 flex items-center space-x-1">
            <span>↑ +1.2% w tym tygodniu</span>
            <span className="text-slate-500">• norma KPRM: 85%</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/80 shadow-lg">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Aktywne Napięcia Koalicyjne
          </div>
          <div className="text-3xl font-extrabold text-amber-400 mt-1 font-mono">
            2
          </div>
          <div className="text-xs text-amber-300/80 font-medium mt-1">
            Składka zdrowotna, Kredyt 0%
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/80 shadow-lg">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Średni Czas Reakcji CIR
          </div>
          <div className="text-3xl font-extrabold text-white mt-1 font-mono">
            34 min
          </div>
          <div className="text-xs text-emerald-400 font-medium mt-1">
            W normie SLA (limit KPRM: &lt; 45 min)
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/80 shadow-lg">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Zgodność z Kamieniami UE
          </div>
          <div className="text-3xl font-extrabold text-purple-400 mt-1 font-mono">
            94.8%
          </div>
          <div className="text-xs text-purple-300/80 font-medium mt-1">
            32 z 34 wskaźników zrealizowane
          </div>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800/60 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as CategoryFilter)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* GRID OF DOZENS OF HIGH-CRAFT CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* ========================================================================= */}
        {/* SEKTON 1: SPÓJNOŚĆ KOALICJI */}
        {/* ========================================================================= */}

        {/* WYKRES 1: 30-dniowy trend spójności 4 partii koalicyjnych */}
        {(activeCategory === 'ALL' || activeCategory === 'KOALICJA') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 01 • Koalicja 15 Października</span>
                <h3 className="text-sm font-bold text-white">Trend spójności partii (ostatnie 30 dni)</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">Stabilny</span>
            </div>
            <div className="h-44 w-full relative flex flex-col justify-end">
              <svg className="w-full h-36 overflow-visible" viewBox="0 0 300 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="koGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal reference grid */}
                <line x1="0" y1="20" x2="300" y2="20" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
                <line x1="0" y1="60" x2="300" y2="60" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
                <line x1="0" y1="100" x2="300" y2="100" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />

                {/* KO (Amber) */}
                <path d="M 0,25 Q 75,20 150,30 T 300,18 L 300,120 L 0,120 Z" fill="url(#koGrad)" />
                <path d="M 0,25 Q 75,20 150,30 T 300,18" fill="none" stroke="#f59e0b" strokeWidth="2.5" />

                {/* PSL (Green) */}
                <path d="M 0,40 Q 75,55 150,45 T 300,38" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />

                {/* Polska 2050 (Yellow) */}
                <path d="M 0,35 Q 75,30 150,50 T 300,32" fill="none" stroke="#eab308" strokeWidth="1.8" />

                {/* Nowa Lewica (Purple) */}
                <path d="M 0,45 Q 75,40 150,60 T 300,42" fill="none" stroke="#c084fc" strokeWidth="1.8" />
              </svg>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-amber-500" /><span>KO (96%)</span></span>
                <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /><span>PSL (84%)</span></span>
                <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /><span>PL2050 (89%)</span></span>
                <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-purple-400" /><span>Lewica (86%)</span></span>
              </div>
            </div>
          </div>
        )}

        {/* WYKRES 2: Cohesion Volatility Index */}
        {(activeCategory === 'ALL' || activeCategory === 'KOALICJA') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 02 • Stabilność</span>
                <h3 className="text-sm font-bold text-white">Indeks zmienności narracyjnej (CVI)</h3>
              </div>
              <span className="text-xs font-mono text-slate-300 font-bold">14.2 pkt (Niski)</span>
            </div>
            <div className="h-44 w-full flex flex-col justify-between">
              <div className="text-[11px] text-slate-400">Amplituda rozbieżności wypowiedzi w 7-dniowym oknie kroczącym</div>
              <svg className="w-full h-28 overflow-visible" viewBox="0 0 280 80">
                <path d="M0,40 L30,42 L60,35 L90,55 L120,38 L150,25 L180,60 L210,30 L240,32 L280,28" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                <circle cx="180" cy="60" r="4" fill="#f43f5e" className="animate-ping" />
                <circle cx="180" cy="60" r="3" fill="#f43f5e" />
                <text x="185" y="75" fill="#f43f5e" fontSize="9" fontFamily="monospace">Szczyt sporu (składka)</text>
              </svg>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-800 pt-1">
                <span>D-30</span>
                <span>D-15</span>
                <span>Dziś (Spadek zmienności)</span>
              </div>
            </div>
          </div>
        )}

        {/* WYKRES 3: Bilans nastrojów w koalicji */}
        {(activeCategory === 'ALL' || activeCategory === 'KOALICJA') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 03 • Retoryka</span>
                <h3 className="text-sm font-bold text-white">Struktura wypowiedzi koalicjantów</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">N=428 wypowiedzi</span>
            </div>
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1 text-slate-300">
                  <span>Konsensualne i popierające linię rządu</span>
                  <span className="text-emerald-400 font-bold">78%</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '78%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono mb-1 text-slate-300">
                  <span>Neutralne / czysto resortowe</span>
                  <span className="text-blue-400 font-bold">16%</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '16%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono mb-1 text-slate-300">
                  <span>Polemizujące / balony próbne</span>
                  <span className="text-rose-400 font-bold">6%</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '6%' }} />
                </div>
              </div>
            </div>
            <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
              <span>Wskaźnik konsensusu:</span>
              <strong className="text-emerald-400 font-bold">94% spójności</strong>
            </div>
          </div>
        )}

        {/* WYKRES 4: Heatmapa napięć międzyresortowych (Cross-ministry friction) */}
        {(activeCategory === 'ALL' || activeCategory === 'KOALICJA') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 04 • Interakcje</span>
                <h3 className="text-sm font-bold text-white">Macierz tarć międzyresortowych</h3>
              </div>
              <span className="text-[10px] font-mono text-amber-400">Relacje bilateralne</span>
            </div>
            <div className="space-y-2 pt-1 font-mono text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-200">MF vs MRiT (składka, podatki)</span>
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold">Wysokie tarcie</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-200">MZ vs MRPiPS (NFZ vs praca)</span>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold">Umiarkowane</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-200">MON vs MSZ (Tarcza Wschód, NATO)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">Pełna spójność</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-200">MKiŚ vs ME (sieci, OZE, atom)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">Koordynacja KPRM</span>
              </div>
            </div>
          </div>
        )}

        {/* WYKRES 5: Udział w czasie antenowym koalicjantów (Share of voice) */}
        {(activeCategory === 'ALL' || activeCategory === 'KOALICJA') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 05 • Wizerunek</span>
                <h3 className="text-sm font-bold text-white">Share of voice koalicji w TV i radiu</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Ostatnie 7 dni</span>
            </div>
            <div className="h-44 flex flex-col justify-center space-y-3">
              <div className="flex h-6 rounded-xl overflow-hidden border border-slate-800">
                <div style={{ width: '48%' }} className="bg-amber-500 flex items-center justify-center text-[10px] font-mono text-slate-950 font-bold">KO 48%</div>
                <div style={{ width: '24%' }} className="bg-emerald-500 flex items-center justify-center text-[10px] font-mono text-slate-950 font-bold">PSL 24%</div>
                <div style={{ width: '15%' }} className="bg-yellow-500 flex items-center justify-center text-[10px] font-mono text-slate-950 font-bold">PL 15%</div>
                <div style={{ width: '13%' }} className="bg-purple-500 flex items-center justify-center text-[10px] font-mono text-slate-950 font-bold">NL 13%</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">Donald Tusk: <strong>32.4%</strong> obecności</div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">Władysław Kosiniak-Kamysz: <strong>16.1%</strong></div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">Radosław Sikorski: <strong>14.5%</strong></div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">Krzysztof Gawkowski: <strong>11.2%</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* WYKRES 6: Sondaże poparcia rządu (Średnia krocząca) */}
        {(activeCategory === 'ALL' || activeCategory === 'KOALICJA') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 06 • Elektorał</span>
                <h3 className="text-sm font-bold text-white">Sondażowa średnia krocząca koalicji</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">51.8% poparcia</span>
            </div>
            <div className="h-44 flex flex-col justify-end">
              <svg className="w-full h-32 overflow-visible" viewBox="0 0 280 80">
                <line x1="0" y1="40" x2="280" y2="40" stroke="#475569" strokeDasharray="2 2" strokeWidth="0.8" />
                <path d="M0,50 Q70,45 140,38 T280,30" fill="none" stroke="#10b981" strokeWidth="3" />
                <path d="M0,55 Q70,60 140,58 T280,62" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x="210" y="24" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">Koalicja: 51.8%</text>
                <text x="210" y="75" fill="#94a3b8" fontSize="9" fontFamily="monospace">Opozycja: 42.1%</text>
              </svg>
              <div className="text-[10px] font-mono text-slate-500 border-t border-slate-800 pt-1 flex justify-between">
                <span>CBOS / IBRiS / Opinia24</span>
                <span>Stabilna większość parlamentarna</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SEKTON 2: DYSCYPLINA 21 RESORTÓW */}
        {/* ========================================================================= */}

        {/* WYKRES 7: Ranking dyscypliny resortów (Top 7) */}
        {(activeCategory === 'ALL' || activeCategory === 'RESORTY') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 07 • Ranking KPRM</span>
                <h3 className="text-sm font-bold text-white">Dyscyplina komunikacyjna (Liderzy)</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">Średnia: 91.2%</span>
            </div>
            <div className="space-y-2 pt-1 font-mono text-xs">
              {[
                { name: 'KPRM (Kancelaria Premiera)', score: 98, color: 'bg-emerald-500' },
                { name: 'MSZ (Radosław Sikorski)', score: 96, color: 'bg-emerald-500' },
                { name: 'MC (Krzysztof Gawkowski)', score: 95, color: 'bg-emerald-500' },
                { name: 'MF (Andrzej Domański)', score: 94, color: 'bg-emerald-500' },
                { name: 'MKiDN (Marta Cienkowska)', score: 93, color: 'bg-emerald-500' },
                { name: 'MEN (Barbara Nowacka)', score: 92, color: 'bg-emerald-500' },
                { name: 'MON (W. Kosiniak-Kamysz)', score: 92, color: 'bg-emerald-500' },
              ].map((res) => (
                <div key={res.name}>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
                    <span>{res.name}</span>
                    <strong className="text-white">{res.score}%</strong>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className={`${res.color} h-full rounded-full`} style={{ width: `${res.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WYKRES 8: Resorty wymagające wzmożonego nadzoru KPRM */}
        {(activeCategory === 'ALL' || activeCategory === 'RESORTY') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 08 • Wzmożony Nadzór</span>
                <h3 className="text-sm font-bold text-white">Resorty z ryzykiem rozdźwięku</h3>
              </div>
              <span className="text-xs font-mono text-rose-400 font-bold">Do korekty CIR</span>
            </div>
            <div className="space-y-2.5 pt-1 font-mono text-xs">
              {[
                { name: 'MRiT (Krzysztof Paszyk)', score: 78, reason: 'Niespójne zapowiedzi składki i kredytu 0%' },
                { name: 'MdsR (Katarzyna Kotula)', score: 81, reason: 'Spór o ustawę o związkach partnerskich' },
                { name: 'MKiŚ (P. Hennig-Kloska)', score: 82, reason: 'Kwestie cen energii i ETS2' },
                { name: 'MRiRW (Stefan Krajewski)', score: 84, reason: 'Dopłaty i rynki rolne bez zgody MF' },
                { name: 'MRPiPS (A. Dziemianowicz-Bąk)', score: 85, reason: 'Rozbieżność kalkulacji NFZ z MZ' },
              ].map((res) => (
                <div key={res.name} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-slate-200">{res.name}</span>
                    <span className="text-amber-400 font-bold">{res.score}%</span>
                  </div>
                  <div className="text-[10px] text-slate-400">{res.reason}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WYKRES 9: Rozkład godzinowy wypowiedzi medialnych (Nasłuch 24h) */}
        {(activeCategory === 'ALL' || activeCategory === 'RESORTY') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 09 • Monitoring dobowy</span>
                <h3 className="text-sm font-bold text-white">Szczyty aktywności medialnej rządu</h3>
              </div>
              <span className="text-[10px] font-mono text-amber-400">Wywiady na żywo</span>
            </div>
            <div className="h-44 flex flex-col justify-end">
              <div className="flex items-end justify-between h-32 gap-1 px-1">
                {[
                  { h: '06', v: 8 }, { h: '07', v: 85 }, { h: '08', v: 100 }, { h: '09', v: 65 },
                  { h: '10', v: 30 }, { h: '11', v: 45 }, { h: '12', v: 55 }, { h: '13', v: 35 },
                  { h: '14', v: 40 }, { h: '15', v: 30 }, { h: '16', v: 25 }, { h: '17', v: 75 },
                  { h: '18', v: 90 }, { h: '19', v: 70 }, { h: '20', v: 50 }, { h: '21', v: 35 },
                ].map((item) => (
                  <div key={item.h} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t transition-all ${
                        item.v >= 70 ? 'bg-amber-500 shadow-sm shadow-amber-500/30' : 'bg-slate-700'
                      }`}
                      style={{ height: `${item.v}%` }}
                      title={`${item.h}:00 - ${item.v}% natężenia wywiadów`}
                    />
                    <span className="text-[9px] font-mono text-slate-500">{item.h}</span>
                  </div>
                ))}
              </div>
              <div className="text-[10px] font-mono text-slate-400 border-t border-slate-800 pt-1 flex justify-between">
                <span>Szczyt poranny: 07:00–09:00</span>
                <span>Szczyt wieczorny: 17:00–19:30</span>
              </div>
            </div>
          </div>
        )}

        {/* WYKRES 10: Skuteczność konsultacji w Stałym Komitecie Rady Ministrów (SKRM) */}
        {(activeCategory === 'ALL' || activeCategory === 'RESORTY') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 10 • Legislacja</span>
                <h3 className="text-sm font-bold text-white">Przepustowość projektów w SKRM</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Q4 2026</span>
            </div>
            <div className="h-44 flex flex-col justify-center space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Projekty przyjęte jednogłośnie</span>
                  <span className="text-emerald-400 font-bold">64 (76%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-emerald-500 h-full" style={{ width: '76%' }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Zwrócone do uzgodnień międzyresortowych</span>
                  <span className="text-amber-400 font-bold">14 (17%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-amber-500 h-full" style={{ width: '17%' }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Zablokowane (brak OSR / sprzeciw MF)</span>
                  <span className="text-rose-400 font-bold">6 (7%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-rose-500 h-full" style={{ width: '7%' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WYKRES 11: Zgodność z Expose Premiera per dział administracji */}
        {(activeCategory === 'ALL' || activeCategory === 'RESORTY') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 11 • Zobowiązania</span>
                <h3 className="text-sm font-bold text-white">Zgodność z Expose Premiera</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">Średnia: 93%</span>
            </div>
            <div className="space-y-2.5 pt-1 font-mono text-xs">
              {[
                { label: 'Bezpieczeństwo i armia (MON/MSWiA)', score: 99 },
                { label: 'Odbudowa relacji z UE (MdsUE/MSZ)', score: 98 },
                { label: 'Edukacja i podwyżki (MEN/MNiSW)', score: 94 },
                { label: 'Praworządność i sądy (MS)', score: 91 },
                { label: 'Uproszczenia dla biznesu (MF/MRiT)', score: 82 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
                    <span>{item.label}</span>
                    <strong className="text-amber-400">{item.score}%</strong>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${item.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WYKRES 12: Interpelacje poselskie i wnioski kontrolne opozycji per resort */}
        {(activeCategory === 'ALL' || activeCategory === 'RESORTY') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 12 • Presja Sejmowa</span>
                <h3 className="text-sm font-bold text-white">Liczba interpelacji poselskich opozycji</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Październik 2026</span>
            </div>
            <div className="space-y-2 pt-1 font-mono text-xs">
              {[
                { name: 'Ministerstwo Zdrowia (MZ)', count: 214, pct: 100 },
                { name: 'Ministerstwo Finansów (MF)', count: 188, pct: 88 },
                { name: 'Ministerstwo Infrastruktury (MI)', count: 156, pct: 73 },
                { name: 'Ministerstwo Sprawiedliwości (MS)', count: 142, pct: 66 },
                { name: 'Ministerstwo Klimatu (MKiŚ)', count: 110, pct: 51 },
              ].map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
                    <span>{item.name}</span>
                    <strong className="text-rose-400">{item.count} zapytań</strong>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-rose-500/80 h-full rounded-full" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SEKTON 3: ZAGROŻENIA & WCZESNE OSTRZEGANIE */}
        {/* ========================================================================= */}

        {/* WYKRES 13: Macierz Ryzyka Politycznego (Impact vs Prawdopodobieństwo) */}
        {(activeCategory === 'ALL' || activeCategory === 'RYZYKA') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 13 • Risk Matrix</span>
                <h3 className="text-sm font-bold text-white">Macierz ryzyka politycznego KPRM</h3>
              </div>
              <span className="text-[10px] font-mono text-rose-400 font-bold">Kwadrant krytyczny P1</span>
            </div>
            <div className="h-44 w-full relative border border-slate-800 rounded-xl bg-slate-950 p-2 font-mono text-[9px]">
              {/* Axes lines */}
              <div className="absolute left-1/2 top-0 bottom-0 border-l border-slate-800 border-dashed" />
              <div className="absolute top-1/2 left-0 right-0 border-t border-slate-800 border-dashed" />

              {/* Labels */}
              <span className="absolute top-1 right-2 text-rose-400 font-bold">P1 • Wysoki wpływ & prawdop.</span>
              <span className="absolute bottom-1 left-2 text-slate-600">P3 • Niski wpływ</span>

              {/* Plotted Risk Nodes */}
              <div className="absolute top-4 right-10 flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 -ml-3.5" />
                <span className="text-white font-bold bg-slate-900/90 px-1 py-0.5 rounded border border-rose-600">Składka zdrowotna</span>
              </div>
              <div className="absolute top-12 right-24 flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-slate-300 bg-slate-900 px-1 py-0.5 rounded border border-slate-700">Kredyt 0% MRiT</span>
              </div>
              <div className="absolute bottom-6 left-12 flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-slate-400 bg-slate-900 px-1 py-0.5 rounded border border-slate-800">Ceny energii OZE</span>
              </div>
            </div>
          </div>
        )}

        {/* WYKRES 14: Typologia zagrożeń komunikacyjnych */}
        {(activeCategory === 'ALL' || activeCategory === 'RYZYKA') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 14 • Typologia</span>
                <h3 className="text-sm font-bold text-white">Struktura zarejestrowanych incydentów</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Łącznie: 18 incydentów</span>
            </div>
            <div className="h-44 flex items-center justify-between gap-4">
              <svg className="w-28 h-28" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#1e293b" strokeWidth="3" />
                {/* Kakofonia (Rose) 40% */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f43f5e" strokeWidth="4" strokeDasharray="40 60" strokeDashoffset="25" />
                {/* Balon próbny (Amber) 35% */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="35 65" strokeDashoffset="85" />
                {/* Rozdźwięk z Brukselą (Purple) 15% */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#a855f7" strokeWidth="4" strokeDasharray="15 85" strokeDashoffset="50" />
                {/* Błąd w wywiadzie 10% */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#38bdf8" strokeWidth="4" strokeDasharray="10 90" strokeDashoffset="35" />
              </svg>
              <div className="flex-1 space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /><span>Kakofonia resortowa</span></span>
                  <strong className="text-rose-400">40%</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /><span>Balon próbny</span></span>
                  <strong className="text-amber-400">35%</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" /><span>Rozdźwięk z UE</span></span>
                  <strong className="text-purple-400">15%</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1.5"><span className="w-2 h-2 rounded-full bg-sky-400" /><span>Błąd w wywiadzie</span></span>
                  <strong className="text-sky-400">10%</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WYKRES 15: Czas reakcji CIR na niespójności komunikacyjne */}
        {(activeCategory === 'ALL' || activeCategory === 'RYZYKA') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 15 • Czas Reakcji CIR</span>
                <h3 className="text-sm font-bold text-white">Średni czas wydania dyspozycji (min)</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">Cel: &lt; 45 min</span>
            </div>
            <div className="h-44 flex flex-col justify-end">
              <svg className="w-full h-32 overflow-visible" viewBox="0 0 280 90">
                <line x1="0" y1="40" x2="280" y2="40" stroke="#f43f5e" strokeDasharray="3 3" strokeWidth="1" />
                <text x="210" y="35" fill="#f43f5e" fontSize="9" fontFamily="monospace">Limit SLA (45 min)</text>
                <path d="M0,75 L45,65 L90,52 L135,42 L180,38 L225,35 L280,34" fill="none" stroke="#10b981" strokeWidth="2.5" />
                <circle cx="280" cy="34" r="4" fill="#10b981" />
              </svg>
              <div className="text-[10px] font-mono text-slate-400 border-t border-slate-800 pt-1 flex justify-between">
                <span>Styczeń: 75 min</span>
                <strong className="text-emerald-400">Aktualnie: 34 min (-54%)</strong>
              </div>
            </div>
          </div>
        )}

        {/* WYKRES 16: Krzywa alertów P1 / P2 / P3 w 14-dniowym oknie */}
        {(activeCategory === 'ALL' || activeCategory === 'RYZYKA') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 16 • Trajektoria Alertów</span>
                <h3 className="text-sm font-bold text-white">Rozkład alertów dobowych KPRM</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">14 dni</span>
            </div>
            <div className="h-44 flex flex-col justify-end">
              <svg className="w-full h-32" viewBox="0 0 280 80">
                {/* Area chart for P3, P2, P1 */}
                <path d="M0,60 L50,65 L100,50 L150,70 L200,60 L250,55 L280,68" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                <path d="M0,45 L50,50 L100,35 L150,48 L200,40 L250,38 L280,42" fill="none" stroke="#f59e0b" strokeWidth="2" />
                <path d="M0,20 L50,28 L100,15 L150,22 L200,18 L250,14 L280,12" fill="none" stroke="#f43f5e" strokeWidth="2" />
              </svg>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800 pt-1">
                <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-rose-500" /><span>P1 (Krytyczne)</span></span>
                <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-amber-500" /><span>P2 (Wysokie)</span></span>
                <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-sky-400" /><span>P3 (Umiarkowane)</span></span>
              </div>
            </div>
          </div>
        )}

        {/* WYKRES 17: Ryzyko wet prezydenckich dla kluczowych projektów rządu */}
        {(activeCategory === 'ALL' || activeCategory === 'RYZYKA') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 17 • Pałac Prezydencki</span>
                <h3 className="text-sm font-bold text-white">Wskaźnik prawdopodobieństwa weta</h3>
              </div>
              <span className="text-[10px] font-mono text-amber-400 font-bold">Analiza KPRM</span>
            </div>
            <div className="space-y-2 pt-1 font-mono text-xs">
              {[
                { name: 'Ustawa o związkach partnerskich (MdsR)', risk: 92, label: 'Krytyczne (Weto niemal pewne)' },
                { name: 'Reforma Krajowej Rady Sądownictwa (MS)', risk: 85, label: 'Bardzo wysokie' },
                { name: 'Kredyt na start / mieszkalnictwo (MRiT)', risk: 45, label: 'Umiarkowane' },
                { name: 'Budżet państwa na 2027 r. (MF)', risk: 10, label: 'Minimalne (brak weta do budżetu)' },
              ].map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
                    <span>{item.name}</span>
                    <strong className={item.risk >= 80 ? 'text-rose-400' : 'text-amber-400'}>{item.risk}%</strong>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full ${item.risk >= 80 ? 'bg-rose-500' : 'bg-amber-400'}`}
                      style={{ width: `${item.risk}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WYKRES 18: Wskaźnik odporności na dezinformację i ataki kognitywne */}
        {(activeCategory === 'ALL' || activeCategory === 'RYZYKA') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 18 • Cyberbezpieczeństwo</span>
                <h3 className="text-sm font-bold text-white">Odporność na wrogie narracje</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">NASK / CSIRT GOV</span>
            </div>
            <div className="h-44 flex flex-col justify-center space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-slate-200 font-bold">Skuteczność neutralizacji fejków</div>
                  <div className="text-[10px] text-slate-400">Czas zdementowania przez CIR &lt; 20 min</div>
                </div>
                <span className="text-emerald-400 text-lg font-bold">96.4%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-slate-200 font-bold">Próby sztucznego podbijania konfliktów</div>
                  <div className="text-[10px] text-slate-400">Wykryte boty na portalu X (temat: składka)</div>
                </div>
                <span className="text-rose-400 text-lg font-bold">1 420 kont</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SEKTON 4: WYMIAR EUROPEJSKI & FINANSE */}
        {/* ========================================================================= */}

        {/* WYKRES 19: Wskaźnik zgodności z Brukselą i kamieniami KPO */}
        {(activeCategory === 'ALL' || activeCategory === 'EUROPA') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 19 • Krajowy Plan Odbudowy</span>
                <h3 className="text-sm font-bold text-white">Realizacja kamieni milowych KPO</h3>
              </div>
              <span className="text-xs font-mono text-purple-400 font-bold">MFiPR / MdsUE</span>
            </div>
            <div className="h-44 flex flex-col justify-center space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Kamienie zrealizowane i zaakceptowane przez KE</span>
                  <span className="text-emerald-400 font-bold">84% (42/50)</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-emerald-500 h-full" style={{ width: '84%' }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>W toku wdrożenia (wymóg IV kw. 2026 r.)</span>
                  <span className="text-amber-400 font-bold">12% (6/50)</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-amber-500 h-full" style={{ width: '12%' }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Ryzyko opóźnienia legislacyjnego</span>
                  <span className="text-rose-400 font-bold">4% (2/50)</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-rose-500 h-full" style={{ width: '4%' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WYKRES 20: Procedury naruszeniowe i ryzyka traktatowe */}
        {(activeCategory === 'ALL' || activeCategory === 'EUROPA') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 20 • Infringements</span>
                <h3 className="text-sm font-bold text-white">Aktywne procedury naruszeniowe KE</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">Spadek z 84 do 14</span>
            </div>
            <div className="h-44 flex flex-col justify-end">
              <svg className="w-full h-32" viewBox="0 0 280 80">
                <path d="M0,15 L70,30 L140,55 L210,65 L280,70" fill="none" stroke="#10b981" strokeWidth="2.5" />
                <circle cx="280" cy="70" r="4" fill="#10b981" />
                <text x="180" y="60" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">14 postępowań</text>
              </svg>
              <div className="text-[10px] font-mono text-slate-400 border-t border-slate-800 pt-1 flex justify-between">
                <span>Rząd PiS (2023): 84</span>
                <span>Rząd Tuska (2026): 14 procedur</span>
              </div>
            </div>
          </div>
        )}

        {/* WYKRES 21: Przygotowanie polskiego stanowiska do Szczytu Rady Europejskiej */}
        {(activeCategory === 'ALL' || activeCategory === 'EUROPA') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 21 • Szczyt Brukselski</span>
                <h3 className="text-sm font-bold text-white">Gotowość instrukcji negocjacyjnych</h3>
              </div>
              <span className="text-xs font-mono text-purple-400 font-bold">za 6 dni</span>
            </div>
            <div className="space-y-2 pt-1 font-mono text-xs">
              {[
                { name: 'Obrona i finansowanie granicy wschodniej (Tarcza)', status: 'ZATWIERDZONE', pct: 100 },
                { name: 'Pakt migracyjny i specyfika granicy z Białorusią', status: 'ZATWIERDZONE', pct: 100 },
                { name: 'Rewizja budżetu wieloletniego UE (MFF)', status: 'W TOKU (90%)', pct: 90 },
                { name: 'Pakiet konkurencyjności przemysłu UE', status: 'KONSULTACJE MF/ME', pct: 85 },
              ].map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
                    <span>{item.name}</span>
                    <strong className="text-emerald-400">{item.status}</strong>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WYKRES 22: Konsolidacja budżetowa: Wnioski o rezerwy vs Limit MF */}
        {(activeCategory === 'ALL' || activeCategory === 'EUROPA') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 22 • Dyscyplina Fiskalna</span>
                <h3 className="text-sm font-bold text-white">Presja wydatkowa resortów na MF</h3>
              </div>
              <span className="text-xs font-mono text-amber-400">Procedura EDP</span>
            </div>
            <div className="h-44 flex flex-col justify-center space-y-3 font-mono text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Wnioski o rezerwy celowe: <strong>14.2 mld zł</strong></span>
                  <span className="text-rose-400">+42% ponad plan</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-rose-500 h-full" style={{ width: '85%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Dopuszczalny limit MF: <strong>10.0 mld zł</strong></span>
                  <span className="text-emerald-400">Próg bezpieczeństwa</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-emerald-500 h-full" style={{ width: '60%' }} />
                </div>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-400">
                Minister Domański zablokował 4.2 mld zł wniosków bez kontrasygnaty KERM.
              </div>
            </div>
          </div>
        )}

        {/* WYKRES 23: Środki unijne z KPO przekazane beneficjentom */}
        {(activeCategory === 'ALL' || activeCategory === 'EUROPA') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 23 • Płynność KPO</span>
                <h3 className="text-sm font-bold text-white">Wypłaty dla samorządów i firm</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">67 mld zł wypłacone</span>
            </div>
            <div className="h-44 flex flex-col justify-end">
              <svg className="w-full h-32 overflow-visible" viewBox="0 0 280 80">
                <path d="M0,70 Q70,60 140,40 T280,15" fill="none" stroke="#a855f7" strokeWidth="3" />
                <circle cx="280" cy="15" r="4" fill="#a855f7" />
              </svg>
              <div className="text-[10px] font-mono text-slate-400 border-t border-slate-800 pt-1 flex justify-between">
                <span>Dynamika wydatkowania: +18% m/m</span>
                <strong className="text-purple-400">Brak zagrożenia utraty środków</strong>
              </div>
            </div>
          </div>
        )}

        {/* WYKRES 24: Wpływ unijnego pakietu ETS2 na budżety domowe (Prognoza) */}
        {(activeCategory === 'ALL' || activeCategory === 'EUROPA') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 24 • Klimat & Koszty</span>
                <h3 className="text-sm font-bold text-white">Polityka rządu ws. ETS2 i cen ciepła</h3>
              </div>
              <span className="text-xs font-mono text-amber-400 font-bold">Negocjacje w Brukseli</span>
            </div>
            <div className="space-y-2 pt-1 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-200">Stanowisko premiera Tuska:</span>
                  <span className="text-amber-400 font-bold">Konieczność rewizji / odroczenia</span>
                </div>
                <div className="text-[10px] text-slate-400">Koalicja państw regionu (Polska, Czechy, Słowacja)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-200">Osłona taryfowa odbiorców:</span>
                  <span className="text-emerald-400 font-bold">Zabezpieczona w budżecie</span>
                </div>
                <div className="text-[10px] text-slate-400">Działania osłonowe MKiŚ i Ministerstwa Energii</div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SEKTON 5: MEDIA, CIR & OPOZYCJA */}
        {/* ========================================================================= */}

        {/* WYKRES 25: Aktywność medialna rzecznika rządu (CIR Defense Index) */}
        {(activeCategory === 'ALL' || activeCategory === 'MEDIA') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 25 • CIR Rzecznik</span>
                <h3 className="text-sm font-bold text-white">Wskaźnik obrony medialnej rządu</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">Radosław Sikorski</span>
            </div>
            <div className="h-44 flex flex-col justify-center space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Wydane dyspozycje defensywne</span>
                <strong className="text-amber-400 text-sm">28 dyrektyw</strong>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Sprostowania depesz agencyjnych PAP</span>
                <strong className="text-emerald-400 text-sm">100% skuteczności</strong>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Briefingi rzecznika prasowego rządu</span>
                <strong className="text-white text-sm">Codziennie 12:00</strong>
              </div>
            </div>
          </div>
        )}

        {/* WYKRES 26: Wektory ataków opozycji (PiS vs Konfederacja) */}
        {(activeCategory === 'ALL' || activeCategory === 'MEDIA') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 26 • Opozycja</span>
                <h3 className="text-sm font-bold text-white">Główne kierunki natarcia opozycji</h3>
              </div>
              <span className="text-[10px] font-mono text-rose-400">Monitoring konferencji</span>
            </div>
            <div className="space-y-2 pt-1 font-mono text-xs">
              {[
                { theme: 'Deficyt budżetowy i zarzut drożyzny (PiS)', intensity: 95 },
                { theme: 'Spory koalicji ws. składki zdrowotnej (Konfederacja)', intensity: 88 },
                { theme: 'Tempo inwestycji w CPK i atom (PiS)', intensity: 75 },
                { theme: 'Pakt migracyjny i granica (PiS/Konfederacja)', intensity: 70 },
              ].map((item) => (
                <div key={item.theme}>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
                    <span>{item.theme}</span>
                    <strong className="text-rose-400">{item.intensity}%</strong>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${item.intensity}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WYKRES 27: Dystrybucja tematów w mediach społecznościowych (Sentyment X) */}
        {(activeCategory === 'ALL' || activeCategory === 'MEDIA') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 27 • Social Media</span>
                <h3 className="text-sm font-bold text-white">Sentyment wzmianek o rządzie w sieci X</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Analiza semantyczna</span>
            </div>
            <div className="h-44 flex flex-col justify-center space-y-3 font-mono text-xs">
              <div className="flex h-5 rounded-lg overflow-hidden border border-slate-800">
                <div style={{ width: '42%' }} className="bg-emerald-500 flex items-center justify-center text-[10px] text-slate-950 font-bold">Pozytywny 42%</div>
                <div style={{ width: '31%' }} className="bg-slate-500 flex items-center justify-center text-[10px] text-white font-bold">Neutralny 31%</div>
                <div style={{ width: '27%' }} className="bg-rose-500 flex items-center justify-center text-[10px] text-white font-bold">Krytyczny 27%</div>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                Wskaźnik bilansu sentymentu netto: <strong className="text-emerald-400">+15 pkt</strong> (przewaga ocen pozytywnych i neutralnych).
              </div>
            </div>
          </div>
        )}

        {/* WYKRES 28: Obecność ministrów w mediach porannych (Rozmowy 7:00-9:00) */}
        {(activeCategory === 'ALL' || activeCategory === 'MEDIA') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 28 • Poranny Salon</span>
                <h3 className="text-sm font-bold text-white">Wystąpienia w stacjach radiowych i TV</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">RMF, Zet, TVN24, Polsat</span>
            </div>
            <div className="space-y-2 pt-1 font-mono text-xs">
              {[
                { station: 'Rozmowa Piaseckiego (TVN24)', person: 'Jan Grabiec (Szef KPRM)', status: 'AUTORYZOWANE' },
                { station: 'Gość Radia ZET (Bogdan Rymanowski)', person: 'Krzysztof Paszyk (MRiT)', status: 'POD NADZOREM' },
                { station: 'Poranna Rozmowa RMF FM (Robert Mazurek)', person: 'Andrzej Domański (MF)', status: 'AUTORYZOWANE' },
                { station: 'Graffiti (Polsat News)', person: 'Stefan Krajewski (MRiRW)', status: 'AUTORYZOWANE' },
              ].map((item) => (
                <div key={item.station} className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-[11px]">
                  <div>
                    <div className="font-bold text-slate-200">{item.station}</div>
                    <div className="text-[10px] text-slate-400">{item.person}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    item.status === 'AUTORYZOWANE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WYKRES 29: Akceptacja społeczna flagowych inwestycji rządu */}
        {(activeCategory === 'ALL' || activeCategory === 'MEDIA') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 29 • Opinia Publiczna</span>
                <h3 className="text-sm font-bold text-white">Akceptacja reform strategicznych rządu</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">Poparcie społeczne</span>
            </div>
            <div className="space-y-2 pt-1 font-mono text-xs">
              {[
                { name: 'Tarcza Wschód i wydatki na obronność 4.7% PKB', pct: 86 },
                { name: 'Polska w 100 minut i lotnisko w Baranowie (CPK)', pct: 74 },
                { name: 'Energetyka jądrowa i transformacja OZE (ME)', pct: 72 },
                { name: 'Podwyższenie kwoty wolnej / reforma składki', pct: 68 },
              ].map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
                    <span>{item.name}</span>
                    <strong className="text-emerald-400">{item.pct}% poparcia</strong>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WYKRES 30: Wolumen zapytań dziennikarskich do rzeczników resortów */}
        {(activeCategory === 'ALL' || activeCategory === 'MEDIA') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 30 • Pytania Prasowe</span>
                <h3 className="text-sm font-bold text-white">Napływ pytań od redakcji (doba)</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">468 zapytań</span>
            </div>
            <div className="h-44 flex flex-col justify-end">
              <svg className="w-full h-32" viewBox="0 0 280 80">
                <path d="M0,60 L40,45 L80,20 L120,35 L160,50 L200,30 L240,15 L280,25" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                <circle cx="240" cy="15" r="4" fill="#f43f5e" />
                <text x="160" y="15" fill="#f43f5e" fontSize="9" fontFamily="monospace">Szczyt konferencji KPRM</text>
              </svg>
              <div className="text-[10px] font-mono text-slate-400 border-t border-slate-800 pt-1 flex justify-between">
                <span>Średni czas odpowiedzi resortu: 2.4 godz.</span>
                <span className="text-emerald-400 font-bold">100% obsłużonych</span>
              </div>
            </div>
          </div>
        )}

        {/* WYKRES 31: Bilans sprostowań medialnych wysłanych przez KPRM/CIR */}
        {(activeCategory === 'ALL' || activeCategory === 'MEDIA') && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 31 • Sprostowania</span>
                <h3 className="text-sm font-bold text-white">Skuteczność żądań sprostowań (CIR)</h3>
              </div>
                <span className="text-xs font-mono text-slate-400 font-bold">Brak zweryfikowanych danych</span>
            </div>
            <div className="h-44 flex flex-col justify-center space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span>Żądania sprostowań w trybie Prawa prasowego</span>
                <strong className="text-slate-400 text-base">Brak danych</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span>Opublikowane bez zmian przez redakcje</span>
                <strong className="text-slate-400 text-base">Brak danych</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span>Skierowane na drogę sądową</span>
                <strong className="text-slate-400 text-base">Brak danych</strong>
              </div>
            </div>
          </div>
        )}

        {/* WYKRES 32: Ogólny Indeks Zdrowia i Stabilności Gabinetu (Government Health Index) */}
        {(activeCategory === 'ALL' || activeCategory === 'KOALICJA' || activeCategory === 'RESORTY') && (
          <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/20 p-5 space-y-4 hover:border-amber-500/70 transition-all shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Wykres 32 • Meta-Indeks KPRM</span>
                <h3 className="text-base font-extrabold text-white">Zagregowany Indeks Zdrowia Rządu (GHI)</h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                Brak zweryfikowanego wyniku
              </span>
            </div>
            <div className="h-44 flex flex-col justify-end">
              <svg className="w-full h-32 overflow-visible" viewBox="0 0 280 80">
                <defs>
                  <linearGradient id="ghiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0,45 Q70,30 140,25 T280,18 L280,80 L0,80 Z" fill="url(#ghiGrad)" />
                <path d="M0,45 Q70,30 140,25 T280,18" fill="none" stroke="#10b981" strokeWidth="3" />
                <circle cx="280" cy="18" r="4" fill="#10b981" />
              </svg>
              <div className="text-[10px] font-mono text-slate-400 border-t border-slate-800 pt-1 flex justify-between">
                <span>Stabilność koalicji: <strong>WYSOKA</strong></span>
                <span className="text-emerald-400 font-bold">Perspektywa 4-letniej kadencji</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer Info Box */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
        <div>
          Źródła danych: Biuletyn Informacji Publicznej KPRM, Rządowe Centrum Legislacji (RCL), Centrum Informacyjne Rządu (CIR), Kancelaria Sejmu, depesze Polskiej Agencji Prasowej (PAP).
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <Link
            href="/premier"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider transition-all shadow-md shadow-amber-500/20"
          >
            Pulpit Premiera
          </Link>
          <Link
            href="/meldunek"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all border border-slate-700"
          >
            Meldunek dobowy
          </Link>
        </div>
      </div>
    </div>
  );
}
