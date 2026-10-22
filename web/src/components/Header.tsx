'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { CommandPalette } from '@/components/CommandPalette';
import { ExecutiveBriefingModal } from '@/components/ExecutiveBriefingModal';
import { MobileExecutiveDock } from '@/components/MobileExecutiveDock';
import { getPolishDateWithWeekday } from '@/lib/dates';

const executiveLinks = [
  { href: '/premier', label: 'Pulpit Premiera' },
  { href: '/szef-kprm', label: 'Szef KPRM' },
  { href: '/rzecznik', label: 'Rzecznik (CIR)' },
  { href: '/koalicja', label: 'Komitet koalicji' },
];
const systemLinks = [
  { href: '/', label: 'Radar KPRM' },
  { href: '/wykresy', label: 'Wykresy i metryki' },
  { href: '/alerty', label: 'Centrum alertów' },
  { href: '/resorty', label: 'Przegląd resortów' },
  { href: '/rozdzieki', label: 'Detektor rozdźwięków' },
  { href: '/europa', label: 'Wymiar europejski' },
  { href: '/audytor', label: 'Audytor AI Gemini' },
  { href: '/meldunek', label: 'Meldunek dobowy' },
];

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isExecutiveBriefingOpen, setIsExecutiveBriefingOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentDateString, setCurrentDateString] = useState('');

  useEffect(() => {
    if (pathname === '/login') return;
    setCurrentDateString(getPolishDateWithWeekday());
    setIsMobileMenuOpen(false);
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); setIsCommandPaletteOpen((open) => !open);
      } else if (!isInput && event.key.toLowerCase() === 'b' && !event.metaKey && !event.ctrlKey) {
        event.preventDefault(); setIsExecutiveBriefingOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pathname]);

  if (pathname === '/login') return null;

  const handleLogout = async () => {
    setLoggingOut(true);
    try { await fetch('/api/auth/logout', { method: 'POST', cache: 'no-store' }); } finally { window.location.href = '/login'; }
  };
  const linkClass = (href: string, executive = false) => {
    const active = pathname === href;
    return `rounded-lg px-3 py-2 text-xs font-medium transition-colors ${active ? (executive ? 'bg-amber-400 text-slate-950 shadow-sm' : 'bg-slate-800 text-white') : executive ? 'text-amber-200 hover:bg-amber-400/10 hover:text-amber-100' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}`;
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-800/90 bg-[#07111f]/95 text-slate-100 shadow-lg shadow-slate-950/40 backdrop-blur-xl print:hidden">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[68px] items-center justify-between gap-4">
            <Link href="/" className="flex min-w-0 items-center gap-3 group">
              <Image src="/govscope-logo-dark.png" alt="GOVscope" width={240} height={100} className="h-10 w-auto object-contain transition-transform group-hover:scale-[1.02]" priority />
              <span className="hidden min-w-0 border-l border-slate-700 pl-3 lg:block"><span className="block truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-300">KPRM</span><span className="block truncate text-xs text-slate-400">Radar spójności rządowej</span></span>
            </Link>
            <nav className={`${isMobileMenuOpen ? 'absolute left-0 right-0 top-[68px] grid grid-cols-1 gap-1 border-b border-slate-800 bg-[#07111f] p-4 shadow-2xl sm:grid-cols-2 xl:static xl:flex xl:flex-1 xl:justify-center xl:border-0 xl:bg-transparent xl:p-0 xl:shadow-none' : 'hidden xl:flex xl:flex-1 xl:justify-center'} max-w-[820px]`} aria-label="Nawigacja systemu">
              <div className="contents xl:flex xl:items-center xl:gap-1">{executiveLinks.map((link) => <Link key={link.href} href={link.href} className={linkClass(link.href, true)}>{link.label}</Link>)}</div>
              <span className="hidden xl:block mx-2 h-5 w-px bg-slate-700" aria-hidden="true" />
              <div className="contents xl:flex xl:items-center xl:gap-1">{systemLinks.map((link) => <Link key={link.href} href={link.href} className={linkClass(link.href)}>{link.label}</Link>)}</div>
            </nav>
            <div className="flex shrink-0 items-center gap-2">
              <button onClick={() => setIsCommandPaletteOpen(true)} className="hidden items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-300 transition hover:border-slate-500 hover:text-white sm:flex" title="Szybkie wyszukiwanie"><span className="text-amber-300">⌕</span><span className="hidden lg:inline">Szukaj</span><kbd className="text-[10px] text-slate-500">⌘K</kbd></button>
              <button onClick={() => setIsExecutiveBriefingOpen(true)} className="hidden rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-200 transition hover:bg-amber-400/20 lg:block">Tryb gabinetowy</button>
              <button onClick={handleLogout} disabled={loggingOut} className="hidden rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 transition hover:border-rose-400/50 hover:text-rose-200 sm:block">{loggingOut ? 'Wylogowanie…' : 'Wyloguj'}</button>
              <button onClick={() => setIsMobileMenuOpen((open) => !open)} className="rounded-lg border border-slate-700 bg-slate-900/80 p-2 text-slate-300 transition hover:border-slate-500 hover:text-white xl:hidden" aria-label="Otwórz menu nawigacyjne">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d={isMobileMenuOpen ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} strokeLinecap="round" /></svg>
              </button>
            </div>
          </div>
        </div>
        <div className="hidden border-t border-slate-800/80 bg-slate-950/35 md:block"><div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-2 text-[11px] sm:px-6 lg:px-8"><div className="flex items-center gap-4 text-slate-400"><span className="text-amber-200">{currentDateString}</span><span className="hidden lg:inline">Rada Ministrów: <b className="text-slate-200">Wtorek 11:00</b></span><span className="hidden lg:inline">SKRM: <b className="text-slate-200">Czwartek 10:00</b></span></div><div className="flex items-center gap-2 text-slate-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Dyżur CIR <b className="text-emerald-300">aktywny</b><span className="hidden sm:inline text-slate-600">•</span><span className="hidden sm:inline">KPRM zastrzeżone</span></div></div></div>
      </header>
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} onOpenExecutiveBriefing={() => setIsExecutiveBriefingOpen(true)} />
      <ExecutiveBriefingModal isOpen={isExecutiveBriefingOpen} onClose={() => setIsExecutiveBriefingOpen(false)} />
      <MobileExecutiveDock onOpenBriefing={() => setIsExecutiveBriefingOpen(true)} onOpenSearch={() => setIsCommandPaletteOpen(true)} />
    </>
  );
};
