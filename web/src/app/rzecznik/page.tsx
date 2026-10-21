'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface MediaDirectiveItem {
  id: string;
  topic: string;
  targetSpokespersons: string;
  mandatoryLine: string;
  defensivePoints: string[];
  status: 'AKTYWNA' | 'W_PRZYGOTOWANIU' | 'ARCHIWALNA';
  updatedAt: string;
}

const DEFAULT_DIRECTIVES: MediaDirectiveItem[] = [
  {
    id: 'dir-01',
    topic: 'Stanowisko rządu w sprawie składki zdrowotnej dla przedsiębiorców',
    targetSpokespersons: 'Wszyscy rzecznicy ministerstw (ze szczególnym uwzględnieniem MF, MRiT, MZ)',
    mandatoryLine:
      'Rząd Koalicji 15 Października jest zdeterminowany, by naprawić błędy Polskiego Ładu i ulżyć przedsiębiorcom. Kwestia ta jest przedmiotem bieżących, odpowiedzialnych uzgodnień międzyresortowych w ramach Komitetu Ekonomicznego. Decyzje zapadną z poszanowaniem stabilności budżetu i ochrony zdrowia.',
    defensivePoints: [
      'Nie potwierdzać żadnych rzekomych ultimatum koalicyjnych ani terminów rozpadu koalicji.',
      'Wskazywać, że dyskusje o szczegółach fiskalnych są naturalne w koalicji demokratycznej.',
      'Przypominać o wielomiliardowej dziurze budżetowej odziedziczonej po rządach PiS.',
    ],
    status: 'AKTYWNA',
    updatedAt: '2026-10-22T07:15:00Z',
  },
  {
    id: 'dir-02',
    topic: 'Bezpieczeństwo granic i program Tarcza Wschód',
    targetSpokespersons: 'Rzecznicy MON, MSWiA, MSZ, KPRM',
    mandatoryLine:
      'Bezpieczeństwo Polski i nienaruszalność wschodniej granicy są bezwzględnym priorytetem rządu Donalda Tuska. Prace nad Tarczą Wschód przebiegają zgodnie z harmonogramem, przy pełnym wsparciu sojuszniczym NATO i środkach z budżetu państwa.',
    defensivePoints: [
      'Podkreślać pełną jedność koalicji w sprawach obronności (MON - KPRM - MSWiA).',
      'Akcentować pozyskiwanie środków unijnych na ochronę zewnętrznej granicy UE.',
    ],
    status: 'AKTYWNA',
    updatedAt: '2026-10-22T06:30:00Z',
  },
];

export default function RzecznikPage() {
  const [directives, setDirectives] = useState<MediaDirectiveItem[]>(DEFAULT_DIRECTIVES);
  const [broadcastSimulationTopic, setBroadcastSimulationTopic] = useState('Składka zdrowotna i spór MF z PSL');
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);
  const [broadcastNotice, setBroadcastNotice] = useState<string | null>(null);

  const handleBroadcastDirective = (id: string) => {
    setBroadcastNotice(`Wysłano dyrektywę ${id} kanałem pilnym CIR do rzeczników 19 ministerstw.`);
    setTimeout(() => setBroadcastNotice(null), 4000);
  };

  const handleRunPressSparring = async () => {
    setSimulating(true);
    setSimulationResult(null);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officialName: 'Rzecznik Rządu / CIR',
          roleTitle: 'Rzecznik Prasowy',
          ministryCode: 'KPRM',
          coalitionParty: 'KO',
          topic: broadcastSimulationTopic,
          sourceMedium: 'Konferencja prasowa po posiedzeniu rządu',
          statementText: `Przygotowanie rzecznika do pytań dziennikarzy o temat: ${broadcastSimulationTopic}. Jakie najtrudniejsze pytania padną i jak CIR ma instruować ministrów?`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.audit) {
        setSimulationResult(
          `Zalecenie CIR: ${data.audit.recommended_cir_directive}\n\nOś sporu: ${data.audit.friction_axis}\n\nRyzyko wizerunkowe premiera: ${data.audit.prime_minister_impact}`
        );
      } else {
        setSimulationResult('Zalecenie CIR: Podtrzymywać jednolity przekaz o trwających pracach komitetowych rządu.');
      }
    } catch {
      setSimulationResult('Zalecenie CIR: Wszelkie pytania kierować do wspólnego komunikatu CIR i MF.');
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-slate-800 pb-6 gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-amber-400 uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span>Kancelaria Prezesa Rady Ministrów • Piony Komunikacji</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            Pulpit Rzecznika Prasowego Rządu i CIR
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-3xl">
            Centrum Informacyjne Rządu (CIR): zarządzanie linią narracyjną gabinetu, codzienne dyspozycje dla 19 rzeczników ministerstw, monitoring wywiadów radiowych i symulator konferencji prasowej.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/audytor"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20"
          >
            Audytor AI Gemini
          </Link>
        </div>
      </div>

      {broadcastNotice && (
        <div className="rounded-xl bg-emerald-950/80 border border-emerald-800 p-4 text-xs font-mono text-emerald-300">
          {broadcastNotice}
        </div>
      )}

      {/* CIR Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
          <div className="text-xs font-mono text-slate-400">Aktywne dyspozycje CIR</div>
          <div className="text-3xl font-extrabold text-white font-mono">{directives.length}</div>
          <div className="text-[11px] text-emerald-400 font-mono">Rozesłane do 19 resortów</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
          <div className="text-xs font-mono text-slate-400">Poranny nasłuch mediów</div>
          <div className="text-3xl font-extrabold text-white font-mono">48 depesz</div>
          <div className="text-[11px] text-slate-400 font-mono">PAP, RMF, ZET, TVN24, Polsat</div>
        </div>

        <div className="rounded-xl border border-amber-900/60 bg-amber-950/20 p-4 space-y-1">
          <div className="text-xs font-mono text-amber-300">Incydenty narracyjne 24h</div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">3 uwagi</div>
          <div className="text-[11px] text-amber-300 font-mono">Wymagały sprostowania CIR</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
          <div className="text-xs font-mono text-slate-400">Spójność przekazu dnia</div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">92.6%</div>
          <div className="text-[11px] text-slate-400 font-mono">Zgodność z linią premiera</div>
        </div>
      </div>

      {/* SECTION 1: Active Media Directives for Ministries */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 gap-2">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              Oficjalna linia komunikacyjna rządu
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Dyspozycje medialne rozsyłane do rzeczników ministerstw
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
            System łączności CIR
          </span>
        </div>

        <div className="space-y-6">
          {directives.map((dir) => (
            <div
              key={dir.id}
              className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4 shadow-lg"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <span className="text-sm font-bold text-white font-mono">{dir.topic}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">
                    {dir.status}
                  </span>
                  <span className="text-xs font-mono text-slate-500">ID: {dir.id}</span>
                </div>
              </div>

              <div className="text-xs font-mono text-slate-400">
                Adresaci: <strong className="text-slate-200">{dir.targetSpokespersons}</strong>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                  Obowiązująca teza rządowa (Mandatory line):
                </div>
                <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-sm font-sans text-slate-100 leading-relaxed border-l-4 border-l-blue-500">
                  {dir.mandatoryLine}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Punkty defensywne i instrukcja reagowania na trudne pytania:
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                  {dir.defensivePoints.map((pt, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs font-mono">
                <span className="text-slate-500">
                  Zaktualizowano: {new Date(dir.updatedAt).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <button
                  onClick={() => handleBroadcastDirective(dir.id)}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
                >
                  Wyślij alertem do wszystkich rzeczników
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: AI Press Sparring with Gemini 2.5 Flash */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <div className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
            Trening przed wejściem na briefing prasowy
          </div>
          <h2 className="text-lg font-bold text-white mt-0.5">
            Symulator konferencji prasowej (Press Sparring z Google Gemini 2.5 Flash)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Wprowadź drażliwy temat dnia i sprawdź, jakie pytania kontrujące zadadzą dziennikarze oraz jaką dyspozycję defensywną wygeneruje silnik AI.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">
              Temat briefingu lub konferencji:
            </label>
            <input
              type="text"
              value={broadcastSimulationTopic}
              onChange={(e) => setBroadcastSimulationTopic(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleRunPressSparring}
            disabled={simulating}
            className="w-full rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white font-medium py-3 px-4 text-sm transition-all shadow-lg shadow-blue-900/30 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {simulating ? (
              <span>Generowanie symulacji przez Gemini 2.5 Flash...</span>
            ) : (
              <span>Uruchom symulację pytań i przygotuj dyspozycję CIR</span>
            )}
          </button>

          {simulationResult && (
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="text-amber-400 font-bold uppercase tracking-wider">
                Wynik symulacji konferencji prasowej:
              </div>
              <div className="text-slate-200 whitespace-pre-line leading-relaxed font-sans text-sm">
                {simulationResult}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
