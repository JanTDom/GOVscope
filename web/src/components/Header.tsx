'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { CommandPalette } from '@/components/CommandPalette';
import { ExecutiveBriefingModal } from '@/components/ExecutiveBriefingModal';
import { MobileExecutiveDock } from '@/components/MobileExecutiveDock';
import { getPolishDateWithWeekday } from '@/lib/dates';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isExecutiveBriefingOpen, setIsExecutiveBriefingOpen] = useState(false);
  const [currentDateString, setCurrentDateString] = useState<string>('');

  // Executive Core Pulpits (Rzeczywiste stanowiska i organy KPRM)
  const executiveLinks = [
    { href: '/premier', label: 'Pulpit Premiera' },
    { href: '/szef-kprm', label: 'Szef KPRM' },
    { href: '/rzecznik', label: 'Rzecznik (CIR)' },
    { href: '/koalicja', label: 'Komitet koalicji' },
  ];

  // Radar & Intelligence Modules
  const systemLinks = [
    { href: '/', label: 'Radar KPRM' },
    { href: '/alerty', label: 'Centrum alertów' },
    { href: '/resorty', label: 'Przegląd resortów' },
    { href: '/rozdzieki', label: 'Detektor rozdźwięków' },
    { href: '/europa', label: 'Wymiar europejski' },
    { href: '/audytor', label: 'Audytor AI Gemini' },
    { href: '/meldunek', label: 'Meldunek dobowy' },
  ];

  // Keyboard shortcut listeners (Cmd+K and B)
  useEffect(() => {
    // Format current date dynamically in Polish
    setCurrentDateString(getPolishDateWithWeekday());

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger hotkeys if typing in input or textarea
      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (!isInput && e.key.toLowerCase() === 'b' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsExecutiveBriefingOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <>
      <header className="border-b border-slate-800/90 bg-slate-950/95 backdrop-blur-md text-slate-100 sticky top-0 z-50 shadow-xl shadow-black/40 print:hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-24 sm:h-26 items-center justify-between">
            {/* Logo & Identity */}
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-3.5 group py-1">
                <div className="relative p-2 sm:p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 transition-all group-hover:border-slate-700 shadow-md">
                  <Image
                    src="/govscope-logo-dark.png"
                    alt="GOVscope Logo"
                    width={380}
                    height={140}
                    className="h-14 sm:h-18 lg:h-20 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                    priority
                  />
                </div>
                <div className="hidden 2xl:flex flex-col">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold leading-tight">
                    Kancelaria Prezesa Rady Ministrów
                  </span>
                  <span className="text-xs font-semibold text-slate-300 leading-tight">
                    System Spójności Rządowej
                  </span>
                </div>
              </Link>

              {/* Navigation links */}
              <nav className="flex items-center space-x-1 overflow-x-auto py-1 scrollbar-none">
                {/* Executive Tier */}
                <div className="flex items-center space-x-1 pr-1.5 border-r border-slate-800/90">
                  {executiveLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-mono transition-all ${
                          isActive
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                            : 'text-amber-300 hover:bg-slate-900 hover:text-amber-200 border border-amber-500/30'
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>

                {/* System Tier */}
                <div className="flex items-center space-x-1 pl-1.5">
                  {systemLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`whitespace-nowrap rounded-lg px-2 py-1.5 text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80 font-semibold'
                            : 'text-slate-300 hover:bg-slate-900/90 hover:text-white border border-transparent'
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </nav>
            </div>

            {/* Right Status Badges & Executive Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Executive Briefing Trigger Button */}
              <button
                onClick={() => setIsExecutiveBriefingOpen(true)}
                className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 font-mono text-xs font-bold transition-all shadow-sm"
                title="Włącz tryb gabinetowy premiera (Skrót: B)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Tryb gabinetowy [B]</span>
              </button>

              {/* Quick Search Cmd+K Trigger */}
              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 font-mono text-xs transition-colors"
                title="Szybkie wyszukiwanie krzyżowe (Cmd+K)"
              >
                <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden sm:inline">Szukaj</span>
                <kbd className="text-[10px] text-slate-400 bg-slate-950 px-1 py-0.5 rounded border border-slate-800">
                  ⌘K
                </kbd>
              </button>

              {/* Print Briefing Sheet Trigger */}
              <button
                onClick={handlePrint}
                className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700 font-mono text-xs transition-colors"
                title="Drukuj oficjalny briefing KPRM (Format A4)"
              >
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Drukuj [A4]</span>
              </button>

              {/* 24/7 Status Badge */}
              <div className="hidden 2xl:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-300">KPRM 24/7</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="text-xs font-mono px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                title="Wyloguj z sesji KPRM"
              >
                {loggingOut ? '...' : 'Wyloguj'}
              </button>
            </div>
          </div>
        </div>

        {/* KPRM Operational Situation & Clocks Bar */}
        <div className="bg-slate-950/90 border-t border-slate-900/80 text-[11px] font-mono text-slate-400 hidden md:block">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {currentDateString && (
                <>
                  <span className="flex items-center space-x-1.5 text-amber-300 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span>{currentDateString}</span>
                  </span>
                  <span className="text-slate-700">|</span>
                </>
              )}
              <span className="flex items-center space-x-1.5 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Rada Ministrów: <strong className="text-white">Wtorek 11:00</strong></span>
              </span>
              <span className="text-slate-700">|</span>
              <span className="flex items-center space-x-1.5 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Stały Komitet RM: <strong className="text-white">Czwartek 10:00</strong></span>
              </span>
              <span className="text-slate-700">|</span>
              <span className="flex items-center space-x-1.5 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>Szczyt Rady Europejskiej: <strong className="text-white">za 6 dni (Bruksela)</strong></span>
              </span>
            </div>

            <div className="flex items-center space-x-3 text-slate-400">
              <span>Dyżur CIR: <strong className="text-emerald-400 font-bold">AKTYWNY</strong></span>
              <span className="text-slate-700">|</span>
              <span>Dostęp: <strong className="text-slate-200">KPRM Zastrzeżone</strong></span>
            </div>
          </div>
        </div>
      </header>

      {/* Global Modals */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenExecutiveBriefing={() => setIsExecutiveBriefingOpen(true)}
      />

      <ExecutiveBriefingModal
        isOpen={isExecutiveBriefingOpen}
        onClose={() => setIsExecutiveBriefingOpen(false)}
      />

      {/* Mobile & Tablet Executive Dock for iPad / Mobile */}
      <MobileExecutiveDock
        onOpenBriefing={() => setIsExecutiveBriefingOpen(true)}
        onOpenSearch={() => setIsCommandPaletteOpen(true)}
      />
    </>
  );
};
