'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface FrictionAxis {
  id: string;
  parties: string;
  label: string;
  activeTopics: string[];
  riskSeverity: 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MODERATE';
  votingRiskSummary: string;
  keyQuotes: {
    speaker: string;
    party: string;
    quote: string;
  }[];
}

const COALITION_FRICTIONS: FrictionAxis[] = [
  {
    id: 'f-ko-psl',
    parties: 'KO & PSL',
    label: 'Koalicja Obywatelska & Polskie Stronnictwo Ludowe',
    activeTopics: ['Składka zdrowotna dla przedsiębiorców', 'Związki partnerskie', 'Pomoc dla rolników a Zielony Ład'],
    riskSeverity: 'P1_CRITICAL',
    votingRiskSummary:
      'Głosowanie nad ustawą budżetową oraz przepisami deregulacyjnymi. PSL (32 posłów) ma zdolność zablokowania większości rządowej (248 posłów - 32 = 216; próg większości to 231).',
    keyQuotes: [
      {
        speaker: 'Krzysztof Paszyk (PSL)',
        party: 'PSL',
        quote: 'Dla nas powrót do ryczałtowej składki zdrowotnej to kwestia wiarygodności wobec wyborców.',
      },
      {
        speaker: 'Andrzej Domański (MF)',
        party: 'KO',
        quote: 'Wszelkie ulgi muszą mieścić się w rygorach procedury nadmiernego deficytu UE.',
      },
    ],
  },
  {
    id: 'f-pl2050-mrit',
    parties: 'Polska 2050 & MRiT (PSL)',
    label: 'Polska 2050 & Ministerstwo Rozwoju (PSL)',
    activeTopics: ['Program dopłat mieszkaniowych Kredyt 0%', 'Uwolnienie handlu w niedziele', 'Finansowanie CPK'],
    riskSeverity: 'P2_HIGH',
    votingRiskSummary:
      'Polska 2050 (32 posłów) zapowiedziała weto wobec dopłat do rat kredytowych. Konieczny kompromis na poziomie Stałego Komitetu RM.',
    keyQuotes: [
      {
        speaker: 'Katarzyna Pełczyńska-Nałęcz (PL2050)',
        party: 'Polska 2050',
        quote: 'Pieniądze z budżetu muszą wspierać budownictwo komunalne, a nie zyski deweloperów.',
      },
      {
        speaker: 'Krzysztof Paszyk (MRiT)',
        party: 'PSL',
        quote: 'Kredyt na start to wsparcie dla rodzin, które nie mają szans na własne mieszkanie.',
      },
    ],
  },
  {
    id: 'f-psl-lewica',
    parties: 'PSL & Nowa Lewica',
    label: 'Polskie Stronnictwo Ludowe & Nowa Lewica',
    activeTopics: ['Związki partnerskie i przysposobienie', 'Liberalizacja prawa aborcyjnego', 'Kodeks pracy a niedziele'],
    riskSeverity: 'P1_CRITICAL',
    votingRiskSummary:
      'Spory światopoglądowe i socjalne. Głosowania projektów poselskich dzielą koalicję, dając opozycji paliwo do zarzutów o brak spójności.',
    keyQuotes: [
      {
        speaker: 'Władysław Kosiniak-Kamysz (PSL)',
        party: 'PSL',
        quote: 'W sprawach światopoglądowych w PSL zawsze obowiązuje wolność sumienia posłów.',
      },
      {
        speaker: 'Krzysztof Gawkowski (Lewica)',
        party: 'Nowa Lewica',
        quote: 'Umowa koalicyjna miała przywrócić godność i równe prawa dla wszystkich obywateli.',
      },
    ],
  },
  {
    id: 'f-ko-lewica',
    parties: 'KO & Nowa Lewica',
    label: 'Koalicja Obywatelska & Nowa Lewica',
    activeTopics: ['Wydatki na ochronę zdrowia (MZ)', 'Renta wdowia i waloryzacja emerytur', 'Budownictwo na wynajem'],
    riskSeverity: 'P3_MODERATE',
    votingRiskSummary:
      'Uzgodniono kompromis w sprawie renty wdowiej i programów społecznych. Stabilna współpraca w obszarze obronności i funduszy unijnych.',
    keyQuotes: [
      {
        speaker: 'Agnieszka Dziemianowicz-Bąk (MRPiPS)',
        party: 'Nowa Lewica',
        quote: 'Renta wdowia weszła w życie jako dowód na społeczną wrażliwość tego rządu.',
      },
      {
        speaker: 'Donald Tusk (KPRM)',
        party: 'KO',
        quote: 'Koalicja 15 Października łączy różne wrażliwości, ale cel jest wspólny: bezpieczna i europejska Polska.',
      },
    ],
  },
];

export default function KoalicjaPage() {
  const [selectedAxisId, setSelectedAxisId] = useState<string>(COALITION_FRICTIONS[0].id);

  const activeAxis = COALITION_FRICTIONS.find((a) => a.id === selectedAxisId) || COALITION_FRICTIONS[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-slate-800 pb-6 gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-amber-400 uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Koalicja 15 Października • Większość Sejmowa X Kadencji</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            Pulpit Komitetu Politycznego Koalicji
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-3xl">
            Zarządzanie spójnością czterech formacji rządowych: Koalicja Obywatelska (157), Polska 2050 (32), Polskie Stronnictwo Ludowe (32), Nowa Lewica (26). Bilans większości sejmowej i matryca tarć programowych.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/premier"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20"
          >
            Pulpit premiera
          </Link>
        </div>
      </div>

      {/* Parliamentary Majority Bar (248 votes out of 460) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <h2 className="text-base font-bold text-white font-mono uppercase tracking-wide">
              Struktura większości sejmowej koalicji rządowej
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold">
              248 / 460 posłów
            </span>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Wymagana większość: <strong className="text-white">231 posłów</strong> • Margines: <strong className="text-emerald-400">+17 posłów</strong>
          </div>
        </div>

        {/* Visual Sejm Majority Representation */}
        <div className="space-y-2">
          <div className="w-full h-8 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex">
            {/* KO */}
            <div
              style={{ width: `${(157 / 460) * 100}%` }}
              className="bg-orange-600 hover:bg-orange-500 transition-colors flex items-center justify-center text-[11px] font-mono text-white font-bold"
              title="Koalicja Obywatelska: 157 posłów"
            >
              KO (157)
            </div>
            {/* Polska 2050 */}
            <div
              style={{ width: `${(32 / 460) * 100}%` }}
              className="bg-yellow-500 hover:bg-yellow-400 transition-colors flex items-center justify-center text-[11px] font-mono text-slate-950 font-bold"
              title="Polska 2050: 32 posłów"
            >
              PL2050 (32)
            </div>
            {/* PSL */}
            <div
              style={{ width: `${(32 / 460) * 100}%` }}
              className="bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center justify-center text-[11px] font-mono text-white font-bold"
              title="Polskie Stronnictwo Ludowe: 32 posłów"
            >
              PSL (32)
            </div>
            {/* Nowa Lewica */}
            <div
              style={{ width: `${(26 / 460) * 100}%` }}
              className="bg-rose-600 hover:bg-rose-500 transition-colors flex items-center justify-center text-[11px] font-mono text-white font-bold"
              title="Nowa Lewica: 26 posłów"
            >
              NL (26)
            </div>
            {/* Opozycja (PiS, Konfederacja, Razem, Wolni) */}
            <div
              style={{ width: `${(213 / 460) * 100}%` }}
              className="bg-slate-800 flex items-center justify-center text-[11px] font-mono text-slate-400"
              title="Opozycja: 212 posłów"
            >
              Opozycja (212)
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 pt-1">
            <span className="text-orange-400 font-semibold">• Koalicja Obywatelska: 157</span>
            <span className="text-yellow-400 font-semibold">• Polska 2050: 32</span>
            <span className="text-emerald-400 font-semibold">• PSL: 32</span>
            <span className="text-rose-400 font-semibold">• Nowa Lewica: 26</span>
            <span className="text-slate-500">• Opozycja: 212</span>
          </div>
        </div>
      </div>

      {/* SECTION: Interactive Friction Matrix */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 gap-2">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              Matryca napięć programowych
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Zderzenie stanowisk między formacjami koalicji rządowej
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
            Wybierz parę koalicyjną poniżej:
          </span>
        </div>

        {/* Matrix Axis Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {COALITION_FRICTIONS.map((axis) => (
            <button
              key={axis.id}
              onClick={() => setSelectedAxisId(axis.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedAxisId === axis.id
                  ? 'border-amber-500 bg-slate-950 shadow-lg shadow-amber-500/10'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-white">
                  {axis.parties}
                </span>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                    axis.riskSeverity === 'P1_CRITICAL'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : axis.riskSeverity === 'P2_HIGH'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-blue-950 text-blue-300 border border-blue-800'
                  }`}
                >
                  {axis.riskSeverity.replace('_', ' ')}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-sans line-clamp-2">
                Tematy: {axis.activeTopics.join(', ')}
              </div>
            </button>
          ))}
        </div>

        {/* Active Selected Axis In-Depth Analysis */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-3 gap-2">
            <div>
              <span className="text-xs font-mono uppercase text-amber-400 font-semibold">
                Szczegółowa analiza osi sporu:
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">{activeAxis.label}</h3>
            </div>
            <span
              className={`text-xs font-mono px-3 py-1 rounded-full font-bold border ${
                activeAxis.riskSeverity === 'P1_CRITICAL'
                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                  : 'bg-amber-950 text-amber-300 border-amber-800'
              }`}
            >
              {activeAxis.riskSeverity.replace('_', ' ')}
            </span>
          </div>

          {/* Active Topics Chips */}
          <div>
            <div className="text-xs font-mono uppercase text-slate-400 mb-2">
              Przedmiot rozbieżności merytorycznych:
            </div>
            <div className="flex flex-wrap gap-2">
              {activeAxis.activeTopics.map((t, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Voting Risk Assessment */}
          <div className="space-y-1.5">
            <div className="text-xs font-mono uppercase text-rose-400 font-bold flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>Ryzyko sejmowe i stabilność większości rządowej:</span>
            </div>
            <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-800/40 text-sm text-rose-100 leading-relaxed font-sans">
              {activeAxis.votingRiskSummary}
            </div>
          </div>

          {/* Public Quotes Clash */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase text-slate-400">
              Ostatnie publiczne deklaracje polityków:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeAxis.keyQuotes.map((q, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-900 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{q.speaker}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                      {q.party}
                    </span>
                  </div>
                  <blockquote className="text-xs italic text-slate-300 leading-relaxed border-l-2 border-amber-500 pl-2.5">
                    &ldquo;{q.quote}&rdquo;
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
