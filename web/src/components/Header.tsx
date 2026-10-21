'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  // Executive Core Pulpits (Rzeczywiste stanowiska i organy KPRM)
  const executiveLinks = [
    { href: '/premier', label: 'Pulpit premiera' },
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

  return (
    <header className="border-b border-slate-800/90 bg-slate-950/95 backdrop-blur-md text-slate-100 sticky top-0 z-50 shadow-xl shadow-black/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-5">
            <Link href="/" className="flex items-center space-x-3 group py-1">
              <div className="relative py-1 px-1 rounded-xl bg-slate-900/60 border border-slate-800/60 transition-all group-hover:border-slate-700">
                <Image
                  src="/govscope-logo-dark.png"
                  alt="GOVscope Logo"
                  width={240}
                  height={80}
                  className="h-11 sm:h-13 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
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

          {/* Right Status Badges & User Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-300">KPRM 24/7</span>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-xs font-mono px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              title="Wyloguj z sesji KPRM"
            >
              {loggingOut ? 'Wylogowywanie...' : 'Wyloguj'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
