'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Header: React.FC = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Radar KPRM' },
    { href: '/resorty', label: 'Przegląd resortów' },
    { href: '/rozdzieki', label: 'Detektor rozdźwięków' },
    { href: '/europa', label: 'Wymiar europejski' },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950 text-slate-100 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-3">
              <span className="font-mono text-xl font-bold tracking-wider text-slate-100">
                GOV<span className="text-red-500">scope</span>
              </span>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
                KPRM System
              </span>
            </Link>

            <nav className="hidden md:flex space-x-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono text-slate-400">Monitoring aktywny</span>
            </div>
            <div className="hidden lg:block text-xs font-mono text-slate-400 border-l border-slate-800 pl-4">
              Pion KPRM i Minister ds. UE
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
