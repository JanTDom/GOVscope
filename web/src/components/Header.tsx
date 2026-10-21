'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  const navLinks = [
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
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-3.5 group py-1">
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
              <div className="hidden xl:flex flex-col">
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
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-slate-800 text-white shadow-sm shadow-slate-900 border border-slate-700/80 font-semibold'
                        : 'text-slate-300 hover:bg-slate-900/90 hover:text-white border border-transparent'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Status Badges & User Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-300">Nasłuch 24/7</span>
            </div>

            <div className="hidden 2xl:block text-[11px] font-mono text-slate-400 border-l border-slate-800 pl-3">
              Pion KPRM & Minister ds. UE
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
