'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_CONFLICTS } from '@/lib/store';

interface JournalistQuestion {
  id: string;
  source: string;
  journalist: string;
  topic: string;
  question: string;
  recommendedRiposte: string;
  severity: 'P1_CRITICAL' | 'P2_HIGH';
}

const JOURNALIST_QUESTIONS_TODAY: JournalistQuestion[] = [
  {
    id: 'jq-01',
    source: 'RMF FM / Poranna Rozmowa',
    journalist: 'Robert Mazurek',
    topic: 'Składka zdrowotna (MF vs PSL)',
    question:
      'Panie Premierze, minister Paszyk z PSL mówi wprost, że bez powrotu do dawnych zasad składki zdrowotnej nie zagłosują za budżetem. Czy to oznacza rozpad koalicji, czy Andrzej Domański ugnie się przed Kosiniakiem-Kamyszem?',
    recommendedRiposte:
      'Budżet państwa to nie koncert życzeń, ale odpowiedzialność za finanse i bezpieczeństwo Polski. W koalicji czterech partii twarde negocjacje są rzeczą normalną — wypracujemy rozwiązanie, które ulży przedsiębiorcom, nie rozbijając stabilności fiskalnej i ochrony zdrowia. Żadnego rozpadu koalicji nie będzie.',
    severity: 'P1_CRITICAL',
  },
  {
    id: 'jq-02',
    source: 'TVN24 / Rozmowa Piaseckiego',
    journalist: 'Konrad Piasecki',
    topic: 'Program Kredyt 0% / Mieszkalnictwo',
    question:
      'Minister Pełczyńska-Nałęcz z Polski 2050 publicznie stwierdziła, że program dopłat do kredytów to wspieranie deweloperów i jej partia go zablokuje. Jak zamierza Pan pogodzić Lewicę, Polskę 2050 i PSL w polityce mieszkaniowej?',
    recommendedRiposte:
      'Polityka mieszkaniowa rządu to nie tylko jeden instrument. Zgodziliśmy się na kompleksowy pakiet: zarówno wsparcie budownictwa społecznego i komunalnego, jak i pomoc młodym rodzinom w zakupie pierwszego mieszkania. Wszelkie projekty ustaw muszą najpierw przejść Stały Komitet Rady Ministrów — tam zapadają ostateczne decyzje, a nie na konferencjach prasowych.',
    severity: 'P2_HIGH',
  },
  {
    id: 'jq-03',
    source: 'Polsat News / Graffiti',
    journalist: 'Marcin Fijołek',
    topic: 'Procedura nadmiernego deficytu UE a obietnice wyborcze',
    question:
      'Bruksela objęła Polskę procedurą nadmiernego deficytu. Czy w związku z tym rząd ostatecznie wycofuje się z podniesienia kwoty wolnej od podatku do 60 tysięcy złotych?',
    recommendedRiposte:
      'Sprzątamy finanse publiczne po ośmiu latach radosnej twórczości naszych poprzedników, którzy ukryli setki miliardów złotych w funduszach pozabudżetowych. Kwota wolna pozostaje naszym zobowiązaniem, wprowadzimy ją w bezpiecznym dla państwa horyzoncie czasowym, w porozumieniu z Komisją Europejską, nie rezygnując z rekordowych nakładów na obronność i Tarczę Wschód.',
    severity: 'P1_CRITICAL',
  },
];

export default function PremierPulpitPage() {
  const [selectedQuestion, setSelectedQuestion] = useState<string>(JOURNALIST_QUESTIONS_TODAY[0].id);
  const [directiveStatus, setDirectiveStatus] = useState<string | null>(null);

  const activeQ = JOURNALIST_QUESTIONS_TODAY.find((q) => q.id === selectedQuestion) || JOURNALIST_QUESTIONS_TODAY[0];

  const handleSendDirective = (target: string) => {
    setDirectiveStatus(`Wysłano autoryzowaną dyspozycję premiera do: ${target}. Status: Doręczono.`);
    setTimeout(() => setDirectiveStatus(null), 5000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Ministerial Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-slate-800 pb-6 gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-amber-400 uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Gabinet Prezesa Rady Ministrów • Donald Tusk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            Pulpit Prezesa Rady Ministrów
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-3xl">
            Centrum operacyjne szefa rządu: poranna odprawa przed wejściem na posiedzenie Rady Ministrów i konferencję prasową, riposty dnia oraz dyspozycje dla rzecznika rządu i SKRM.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/meldunek"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20"
          >
            Meldunek dobowy KPRM
          </Link>
          <Link
            href="/audytor"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20 border border-blue-400/30"
          >
            Audytor AI Gemini
          </Link>
        </div>
      </div>

      {directiveStatus && (
        <div className="rounded-xl bg-emerald-950/80 border border-emerald-800/80 p-4 text-xs font-mono text-emerald-300 flex items-center justify-between">
          <span>{directiveStatus}</span>
          <button onClick={() => setDirectiveStatus(null)} className="text-emerald-400 hover:text-white">
            Zamknij
          </button>
        </div>
      )}

      {/* Morning Briefing Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
          <div className="text-xs font-mono text-slate-400">Stan spójności rządu</div>
          <div className="text-3xl font-extrabold text-white font-mono">89.4%</div>
          <div className="text-[11px] text-emerald-400 font-mono">Większość sejmowa: 248 posłów</div>
        </div>

        <div className="rounded-xl border border-rose-900/60 bg-rose-950/20 p-4 space-y-1">
          <div className="text-xs font-mono text-rose-300">Punkty zapalne P1</div>
          <div className="text-3xl font-extrabold text-rose-400 font-mono">2 sprawy</div>
          <div className="text-[11px] text-rose-300 font-mono">Składka zdrowotna, Kredyt 0%</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
          <div className="text-xs font-mono text-slate-400">Poranny nasłuch mediów</div>
          <div className="text-3xl font-extrabold text-white font-mono">14 wywiadów</div>
          <div className="text-[11px] text-slate-400 font-mono">3 próby wciągnięcia w polemikę</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
          <div className="text-xs font-mono text-slate-400">Dyscyplina Stałego Komitetu</div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">94%</div>
          <div className="text-[11px] text-slate-400 font-mono">1 projekt bez kontrasygnaty MF</div>
        </div>
      </div>

      {/* SECTION 1: 3 Questions from Journalists Today with Donald Tusk Ripostes */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 gap-2">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              Gotowość na konferencję prasową i korytarze sejmowe
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              3 pytania, które na 100% padną dzisiaj od dziennikarzy
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
            Aktualizacja: 22 października 2026 r., godz. 07:45
          </span>
        </div>

        {/* Question Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {JOURNALIST_QUESTIONS_TODAY.map((q) => (
            <button
              key={q.id}
              onClick={() => setSelectedQuestion(q.id)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                selectedQuestion === q.id
                  ? 'border-amber-500 bg-slate-950 shadow-lg shadow-amber-500/10'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                  {q.source}
                </span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    q.severity === 'P1_CRITICAL'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {q.severity === 'P1_CRITICAL' ? 'P1 PILNE' : 'P2 WYSOKIE'}
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-200 line-clamp-2">
                {q.topic}
              </div>
            </button>
          ))}
        </div>

        {/* Detailed Selected Question & Riposte Box */}
        <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950 p-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-slate-400">Redakcja:</span>
              <span className="text-xs font-semibold text-white">{activeQ.source}</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">Dziennikarz: {activeQ.journalist}</span>
            </div>
            <span className="text-xs font-mono text-amber-400 font-semibold">{activeQ.topic}</span>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Przewidywane pytanie dziennikarza:
            </div>
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-sm italic text-slate-200 leading-relaxed border-l-4 border-l-rose-500">
              &ldquo;{activeQ.question}&rdquo;
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="font-bold">Rekomendowana riposta i linia obrony Donalda Tuska:</span>
            </div>
            <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-800/40 text-sm font-sans text-amber-100 leading-relaxed font-medium">
              {activeQ.recommendedRiposte}
            </div>
          </div>

          {/* Quick Action Directives */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <span className="text-slate-400">Dyspozycja z gabinetu premiera:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSendDirective('Centrum Informacyjne Rządu (CIR)')}
                className="px-3 py-1.5 rounded-lg bg-blue-900/80 hover:bg-blue-800 border border-blue-700 text-blue-200 transition-colors"
              >
                Wyślij linię do CIR
              </button>
              <button
                onClick={() => handleSendDirective('Stały Komitet Rady Ministrów (Maciej Berek)')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
              >
                Skieruj na SKRM
              </button>
              <button
                onClick={() => handleSendDirective('Liderzy Koalicji (Kosiniak-Kamysz, Hołownia, Czarzasty)')}
                className="px-3 py-1.5 rounded-lg bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-300 transition-colors"
              >
                Powiadom liderów koalicji
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Active P1 Escalations for Prime Minister's Direct Intervention */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
            <h2 className="text-base font-bold text-white font-mono uppercase tracking-wide">
              Sprawy wymagające bezpośredniego rozstrzygnięcia premiera (P1)
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Zgłoszone przez KPRM i Ministra Finansów
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_CONFLICTS.filter((c) => c.severity === 'P1_CRITICAL').map((conflict) => (
            <div
              key={conflict.id}
              className="rounded-xl border border-rose-900/60 bg-slate-900 p-5 space-y-4 relative"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono font-bold text-rose-400">
                  {conflict.topic}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300 font-bold">
                  {conflict.conflictType}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{conflict.title}</h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  {conflict.summary}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                <span className="font-mono text-amber-400 font-semibold block mb-1">
                  Rekomendowana decyzja premiera:
                </span>
                <span className="text-slate-200">{conflict.recommendedAction}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-mono">
                <span className="text-slate-400">Status: Do rozstrzygnięcia</span>
                <button
                  onClick={() => handleSendDirective(`Zatwierdzono dyspozycję premiera dla sprawy ${conflict.topic}`)}
                  className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors"
                >
                  Zatwierdź dyspozycję
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
