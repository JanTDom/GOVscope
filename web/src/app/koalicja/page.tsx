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

  // Sejm Discipline Simulator State
  const [koActive, setKoActive] = useState(true);
  const [pl2050Active, setPl2050Active] = useState(true);
  const [pslActive, setPslActive] = useState(true);
  const [lewicaActive, setLewicaActive] = useState(true);

  const koVotes = koActive ? 157 : 0;
  const pl2050Votes = pl2050Active ? 32 : 0;
  const pslVotes = pslActive ? 32 : 0;
  const lewicaVotes = lewicaActive ? 26 : 0;

  const currentCoalitionVotes = koVotes + pl2050Votes + pslVotes + lewicaVotes;
  const requiredMajority = 231;
  const hasMajority = currentCoalitionVotes >= requiredMajority;
  const voteMargin = currentCoalitionVotes - requiredMajority;

  const activeAxis = COALITION_FRICTIONS.find((a) => a.id === selectedAxisId) || COALITION_FRICTIONS[0];

  const resetSimulator = () => {
    setKoActive(true);
    setPl2050Active(true);
    setPslActive(true);
    setLewicaActive(true);
  };

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
            Pulpit Premiera
          </Link>
        </div>
      </div>

      {/* SEJM MAJORITY BAR & INTERACTIVE SIMULATOR */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              Kalkulator i symulator dyscypliny sejmowej
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-0.5 font-mono">
              Większość rządowa w Sejmie: {currentCoalitionVotes} / 460 posłów
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold border transition-all ${
                hasMajority
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  : 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse'
              }`}
            >
              {hasMajority
                ? `BEZPIECZNA WIĘKSZOŚĆ (+${voteMargin} głosów)`
                : `USTAWA ODRZUCONA (brak ${Math.abs(voteMargin)} głosów do 231)`}
            </span>

            <button
              onClick={resetSimulator}
              className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              Resetuj
            </button>
          </div>
        </div>

        {/* Visual Sejm Majority Representation */}
        <div className="space-y-2">
          <div className="w-full h-9 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex relative">
            {/* 231 majority threshold line */}
            <div
              style={{ left: `${(231 / 460) * 100}%` }}
              className="absolute top-0 bottom-0 w-1 bg-white/90 z-20 shadow-md shadow-black"
              title="Próg większości bezwzględnej: 231 posłów"
            />

            {/* KO */}
            {koActive && (
              <div
                style={{ width: `${(157 / 460) * 100}%` }}
                className="bg-orange-600 flex items-center justify-center text-[11px] font-mono text-white font-bold transition-all"
                title="Koalicja Obywatelska: 157 posłów"
              >
                KO (157)
              </div>
            )}
            {/* Polska 2050 */}
            {pl2050Active && (
              <div
                style={{ width: `${(32 / 460) * 100}%` }}
                className="bg-yellow-500 flex items-center justify-center text-[11px] font-mono text-slate-950 font-bold transition-all"
                title="Polska 2050: 32 posłów"
              >
                PL2050 (32)
              </div>
            )}
            {/* PSL */}
            {pslActive && (
              <div
                style={{ width: `${(32 / 460) * 100}%` }}
                className="bg-emerald-600 flex items-center justify-center text-[11px] font-mono text-white font-bold transition-all"
                title="Polskie Stronnictwo Ludowe: 32 posłów"
              >
                PSL (32)
              </div>
            )}
            {/* Nowa Lewica */}
            {lewicaActive && (
              <div
                style={{ width: `${(26 / 460) * 100}%` }}
                className="bg-rose-600 flex items-center justify-center text-[11px] font-mono text-white font-bold transition-all"
                title="Nowa Lewica: 26 posłów"
              >
                NL (26)
              </div>
            )}
            {/* Brakujące głosy koalicji lub opozycja */}
            <div
              className="bg-slate-800/80 flex-1 flex items-center justify-center text-[11px] font-mono text-slate-400"
              title="Opozycja i posłowie poza głosowaniem"
            >
              Opozycja / Brak poparcia ({460 - currentCoalitionVotes})
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
            <span>Biała linia = próg 231 głosów większości bezwzględnej</span>
            <span>Koalicja łącznie: 248 posłów • Opozycja: 212 posłów</span>
          </div>
        </div>

        {/* Interactive Scenario Buttons */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>Kliknij, aby przetestować scenariusze buntu lub braku porozumienia:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
            <button
              onClick={() => setPslActive(!pslActive)}
              className={`p-3 rounded-lg border text-left transition-all ${
                !pslActive
                  ? 'bg-rose-950/80 border-rose-600 text-rose-200 shadow-md shadow-rose-950'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="font-bold flex justify-between items-center">
                <span>PSL (32 posłów)</span>
                <span>{!pslActive ? 'WETO' : 'AKTYWNY'}</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {!pslActive ? 'PSL wstrzymuje się / przeciw' : 'Kliknij, by wyłączyć PSL'}
              </div>
            </button>

            <button
              onClick={() => setPl2050Active(!pl2050Active)}
              className={`p-3 rounded-lg border text-left transition-all ${
                !pl2050Active
                  ? 'bg-rose-950/80 border-rose-600 text-rose-200 shadow-md shadow-rose-950'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="font-bold flex justify-between items-center">
                <span>Polska 2050 (32 posłów)</span>
                <span>{!pl2050Active ? 'WETO' : 'AKTYWNY'}</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {!pl2050Active ? 'Polska 2050 blokuje projekt' : 'Kliknij, by wyłączyć PL2050'}
              </div>
            </button>

            <button
              onClick={() => setLewicaActive(!lewicaActive)}
              className={`p-3 rounded-lg border text-left transition-all ${
                !lewicaActive
                  ? 'bg-rose-950/80 border-rose-600 text-rose-200 shadow-md shadow-rose-950'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="font-bold flex justify-between items-center">
                <span>Nowa Lewica (26 posłów)</span>
                <span>{!lewicaActive ? 'WETO' : 'AKTYWNY'}</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {!lewicaActive ? 'Lewica głosuje przeciw' : 'Kliknij, by wyłączyć Lewicę'}
              </div>
            </button>

            <button
              onClick={() => setKoActive(!koActive)}
              className={`p-3 rounded-lg border text-left transition-all ${
                !koActive
                  ? 'bg-rose-950/80 border-rose-600 text-rose-200 shadow-md shadow-rose-950'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="font-bold flex justify-between items-center">
                <span>Koalicja Obywatelska (157)</span>
                <span>{!koActive ? 'WETO' : 'AKTYWNY'}</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Trzon większości rządowej
              </div>
            </button>
          </div>

          {!hasMajority && (
            <div className="p-3.5 rounded-lg bg-rose-950/90 border border-rose-700 text-xs text-rose-200 font-sans leading-relaxed">
              <strong className="font-mono text-white block mb-0.5">ALARM DYSCYPLINARNY DLA PREMIERA:</strong>
              Przy tym scenariuszu rząd traci większość w Sejmie. Ustawa zostanie odrzucona przez połączone głosy opozycji i wyłamanej formacji koalicyjnej. Wymagane pilne zwołanie spotkania liderów u premiera Donalda Tuska przed skierowaniem druku do III czytania.
            </div>
          )}
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
