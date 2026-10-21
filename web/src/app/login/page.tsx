'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

function LoginForm() {
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get('redirect') || '/';
  const redirectTarget =
    rawRedirect && rawRedirect !== '/login' && !rawRedirect.startsWith('/login')
      ? rawRedirect
      : '/';

  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // If already authenticated via cookie in browser, automatically redirect to dashboard
  useEffect(() => {
    if (typeof document !== 'undefined' && document.cookie.includes('govscope_session=authenticated_pdt_kprm_2026')) {
      window.location.href = redirectTarget;
    }
  }, [redirectTarget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPassword = password.trim();
    if (!cleanPassword) {
      setError('Wprowadź hasło dostępu.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: cleanPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Nieprawidłowe hasło dostępu.');
        setLoading(false);
        return;
      }

      // Client-side cookie fallback to guarantee persistence across all browsers/webviews
      try {
        const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
        document.cookie = `govscope_session=authenticated_pdt_kprm_2026; path=/; max-age=604800; samesite=lax${isHttps ? '; secure' : ''}`;
      } catch {
        // ignore
      }

      // Hard document navigation ensures cookies are sent fresh in request headers to bypass App Router cache
      window.location.href = redirectTarget;
    } catch {
      setError('Błąd połączenia z serwerem uwierzytelniania KPRM.');
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 backdrop-blur-xl p-8 shadow-2xl shadow-black/60 relative">
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 font-mono"
          >
            Hasło dostępu do systemu
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Wprowadź hasło autoryzacyjne..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-200 font-mono"
            >
              {showPassword ? 'Ukryj' : 'Pokaż'}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-rose-950/60 border border-rose-800/80 p-3 text-xs text-rose-300 flex items-start space-x-2">
            <span className="font-bold font-mono">BŁĄD:</span>
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-700 hover:from-blue-600 hover:to-indigo-500 text-white font-medium py-3 px-4 text-sm transition-all shadow-lg shadow-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/30 font-mono"
        >
          {loading ? (
            <span className="flex items-center justify-center space-x-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Weryfikacja uprawnień...</span>
            </span>
          ) : (
            'Zaloguj do Centrum Dowodzenia'
          )}
        </button>
      </form>

      {/* Security Notice */}
      <div className="mt-6 pt-5 border-t border-slate-800/80 text-[11px] text-slate-500 text-center leading-relaxed">
        <span className="font-semibold text-slate-400">Klauzula bezpieczeństwa:</span> System
        przeznaczony wyłącznie dla Prezesa Rady Ministrów, członków rządu oraz wyznaczonych
        doradców KPRM. Wszystkie próby nieautoryzowanego dostępu są rejestrowane.
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-80 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-blue-900/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Official Header & Large Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative p-2 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/60 shadow-2xl shadow-black/80">
              <Image
                src="/govscope-logo-dark.png"
                alt="GOVscope Logo"
                width={360}
                height={150}
                className="h-16 sm:h-20 w-auto object-contain"
                priority
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-mono uppercase tracking-widest text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Kancelaria Prezesa Rady Ministrów</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white pt-2">
              Centrum Dowodzenia KPRM
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              System Wczesnego Ostrzegania i Spójności Rządowej
            </p>
          </div>
        </div>

        {/* Authentication Card in Suspense */}
        <Suspense
          fallback={
            <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-8 text-center text-xs font-mono text-slate-400">
              Ładowanie modułu uwierzytelniania...
            </div>
          }
        >
          <LoginForm />
        </Suspense>

        {/* Footer info */}
        <div className="mt-8 text-center text-[11px] font-mono text-slate-500 space-y-1">
          <div>GOVscope v2.4 • Kancelaria Prezesa Rady Ministrów</div>
          <div>Al. Ujazdowskie 1/3, 00-583 Warszawa</div>
        </div>
      </div>
    </div>
  );
}
