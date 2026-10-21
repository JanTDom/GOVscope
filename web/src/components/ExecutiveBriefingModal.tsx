'use client';

import React, { useEffect } from 'react';

interface ExecutiveBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveBriefingModal: React.FC<ExecutiveBriefingModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8 lg:p-12 print:p-0 print:bg-white print:text-black">
      {/* Top Bar with Dismiss and Print controls */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
        <div className="flex items-center space-x-3">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-widest">
            Kancelaria Prezesa Rady Ministrów • Tryb gabinetowy
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-red-950 text-red-300 border border-red-800 font-bold uppercase">
            Klauzula: Zastrzeżone / Do użytku służbowego
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs font-bold transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Drukuj teczkę A4</span>
          </button>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold transition-colors flex items-center space-x-1"
          >
            <span>Zamknij [Esc]</span>
          </button>
        </div>
      </div>

      {/* Main Content Container (Max-Width 6xl for comfortable reading on high-res displays) */}
      <div className="max-w-6xl mx-auto w-full my-auto py-8 space-y-8">
        {/* Header Block */}
        <div className="space-y-2 text-center sm:text-left border-b border-slate-800 pb-6 print:text-black print:border-black">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-400">
            Warszawa, Aleje Ujazdowskie 1/3 • Gabinet Prezesa Rady Ministrów
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-mono text-white print:text-black">
            Poranna odprawa strategiczna Prezesa Rady Ministrów
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-mono">
            Raport sytuacyjny spójności koalicji, dyscypliny sejmowej i linii obronnej rządu przed mediami.
          </p>
        </div>

        {/* Grid: 3 Key Morning Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3 shadow-xl print:border-black print:bg-white print:text-black">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                Priorytet 1 • Spór fiskalny
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                PILNE
              </span>
            </div>
            <h3 className="text-lg font-bold font-mono text-white print:text-black">
              Składka zdrowotna (MF vs PSL)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans print:text-black">
              Nie dopuścić do publicznej licytacji w mediach. Linia dla premiera: wypracowanie kompromisu w Komitecie Ekonomicznym RM (KERM). Ulga dla przedsiębiorców bez dziury w NFZ.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3 shadow-xl print:border-black print:bg-white print:text-black">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold">
                Priorytet 2 • Bezpieczeństwo
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800 font-bold">
                JEDNOŚĆ KOALICJI
              </span>
            </div>
            <h3 className="text-lg font-bold font-mono text-white print:text-black">
              Tarcza Wschód i granica
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans print:text-black">
              Pełna zgodność wszystkich 4 ugrupowań koalicji. Podkreślać 10 mld zł na fortyfikacje granicy oraz poparcie sojusznicze NATO i funduszy UE.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3 shadow-xl print:border-black print:bg-white print:text-black">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Priorytet 3 • Finanse i UE
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                STRATEGIA DEFICYTU
              </span>
            </div>
            <h3 className="text-lg font-bold font-mono text-white print:text-black">
              Procedura nadmiernego deficytu
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans print:text-black">
              Plan redukcji deficytu uzgodniony z Brukselą. Wyjaśniać, że to spadek po ukrytych długach PiS, a programy społeczne i wydatki obronne (4.7% PKB) są nienaruszalne.
            </p>
          </div>
        </div>

        {/* Row 2: Sejm Majority Balance + Mandatory Prime Minister Riposte */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sejm Majority Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl print:border-black print:bg-white print:text-black">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 print:border-black">
              <h2 className="text-sm font-bold font-mono uppercase tracking-wide text-white print:text-black">
                Większość rządowa w Sejmie X kadencji
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold">
                247 / 460 posłów (+16 zapasu)
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex h-6 w-full rounded-lg overflow-hidden border border-slate-700 font-mono text-[11px] font-bold">
                <div style={{ width: '34.1%' }} className="bg-orange-500 text-slate-950 flex items-center justify-center">
                  KO (157)
                </div>
                <div style={{ width: '7.0%' }} className="bg-yellow-500 text-slate-950 flex items-center justify-center">
                  PL50 (32)
                </div>
                <div style={{ width: '7.0%' }} className="bg-emerald-600 text-white flex items-center justify-center">
                  PSL (32)
                </div>
                <div style={{ width: '5.7%' }} className="bg-rose-600 text-white flex items-center justify-center">
                  NL (26)
                </div>
                <div style={{ width: '46.2%' }} className="bg-slate-800 text-slate-400 flex items-center justify-center">
                  Opozycja (213)
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
                <span>Próg większości bezwzględnej: <strong>231 posłów</strong></span>
                <span className="text-emerald-400 font-bold">Dyscyplina: STABILNA</span>
              </div>
            </div>

            <div className="text-xs text-slate-300 border-t border-slate-800/80 pt-3">
              <strong>Zalecenie Szefa KPRM:</strong> Wszystkie projekty ustaw muszą uzyskać formalną zgodę Stałego Komitetu RM przed skierowaniem do Sejmu, aby uniknąć publicznych podziałów podczas głosowań.
            </div>
          </div>

          {/* Prime Minister Master Riposte Box */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6 space-y-4 shadow-xl print:border-black print:bg-white print:text-black">
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-3 print:border-black">
              <h2 className="text-sm font-bold font-mono uppercase tracking-wide text-amber-400 print:text-black">
                Obowiązująca riposta Donalda Tuska do kamer
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-900/60 text-amber-200 border border-amber-700 font-bold">
                DYSPOZYCJA CIR
              </span>
            </div>

            <blockquote className="text-sm sm:text-base text-slate-100 font-serif italic leading-relaxed border-l-2 border-amber-400 pl-4 py-1 print:text-black">
              &bdquo;Budżet państwa to nie koncert życzeń, ale odpowiedzialność za finanse i bezpieczeństwo Polski. W koalicji czterech partii twarde negocjacje są rzeczą normalną — wypracujemy rozwiązanie, które ulży przedsiębiorcom, nie rozbijając stabilności fiskalnej i ochrony zdrowia. Żadnego rozpadu koalicji nie będzie.&rdquo;
            </blockquote>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400 print:text-black pt-1">
              <span>Zastosowanie: Poranna rozmowa radiowa i konferencja prasowa po RM</span>
              <span className="text-amber-400 font-bold">Status: ZATWIERDZONE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 print:text-black print:border-black">
        <span>System Monitoringu i Spójności Rządowej GOVscope • Kancelaria Prezesa Rady Ministrów</span>
        <span>Dokument wygenerowano automatycznie z rejestru zdarzeń KPRM</span>
      </div>
    </div>
  );
};
