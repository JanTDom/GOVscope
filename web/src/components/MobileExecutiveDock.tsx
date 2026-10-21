'use client';

import React from 'react';
import Link from 'next/link';

interface MobileExecutiveDockProps {
  onOpenBriefing: () => void;
  onOpenSearch: () => void;
}

export const MobileExecutiveDock: React.FC<MobileExecutiveDockProps> = ({
  onOpenBriefing,
  onOpenSearch,
}) => {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <aside
      aria-label="Pasek operacyjny na tablet i telefon"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center space-x-2 px-3 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-lg border border-slate-700/80 shadow-2xl shadow-black/80 lg:hidden print:hidden"
    >
      {/* Executive Briefing trigger */}
      <button
        onClick={onOpenBriefing}
        className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-500 text-slate-950 font-mono text-xs font-bold shadow-md shadow-amber-500/30 active:scale-95 transition-transform"
        title="Otwórz tryb gabinetowy (Odprawa Premiera)"
      >
        <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
        <span>Odprawa</span>
      </button>

      {/* Quick Search trigger */}
      <button
        onClick={onOpenSearch}
        className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-mono text-xs font-semibold active:scale-95 transition-transform"
        title="Wyszukiwarka krzyżowa KPRM"
      >
        <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Szukaj</span>
      </button>

      {/* Print Briefing Sheet */}
      <button
        onClick={handlePrint}
        className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 font-mono text-xs font-semibold active:scale-95 transition-transform"
        title="Drukuj briefing KPRM w formacie A4"
      >
        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        <span>A4</span>
      </button>

      {/* Quick CIR Dispatches Link */}
      <Link
        href="/rzecznik"
        className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-800 text-emerald-400 border border-slate-700 font-mono text-xs font-semibold active:scale-95 transition-transform"
        title="Przejdź do dyspozycji CIR"
      >
        <span>CIR</span>
      </Link>
    </aside>
  );
};
