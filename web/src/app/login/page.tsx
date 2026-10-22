'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

function LoginForm() {
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get('redirect') || '/';
  const redirectTarget = rawRedirect && rawRedirect !== '/login' && !rawRedirect.startsWith('/login') ? rawRedirect : '/';
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const cleanPassword = password.trim();
    if (!cleanPassword) { setError('Wprowadź hasło dostępu.'); return; }
    setLoading(true); setError(null);
    try {
      const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: cleanPassword }), cache: 'no-store' });
      const data = await response.json() as { error?: string };
      if (!response.ok) { setError(data.error || 'Nieprawidłowe hasło dostępu.'); setLoading(false); return; }
      window.location.href = redirectTarget;
    } catch { setError('Błąd połączenia z serwerem uwierzytelniania KPRM.'); setLoading(false); }
  };

  return (
    <div className="rounded-2xl border border-slate-700/70 bg-slate-950/45 p-6 shadow-xl shadow-black/20 sm:p-8">
      <div className="mb-8"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">Dostęp operacyjny</p><h2 className="mt-3 text-2xl font-semibold text-white">Zaloguj się do GOVscope</h2><p className="mt-2 text-sm leading-6 text-slate-400">Wprowadź hasło, aby otworzyć pulpit monitoringu KPRM.</p></div>
      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
        <div><label htmlFor="password" className="mb-2 block text-xs font-medium text-slate-300">Hasło dostępu</label><div className="relative"><input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required autoFocus value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Wprowadź hasło" className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3.5 pr-20 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20" /><button type="button" onClick={() => setShowPassword((shown) => !shown)} className="absolute inset-y-0 right-0 px-4 text-xs text-slate-400 hover:text-white">{showPassword ? 'Ukryj' : 'Pokaż'}</button></div></div>
        {error && <div role="alert" className="rounded-xl border border-rose-800/70 bg-rose-950/40 p-3 text-sm text-rose-200"><span className="font-semibold">Logowanie nieudane. </span>{error}</div>}
        <button type="submit" disabled={loading} className="flex w-full items-center justify-center rounded-xl bg-amber-400 px-4 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/10 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Sprawdzanie dostępu…' : 'Otwórz pulpit'}</button>
      </form>
      <div className="mt-7 border-t border-slate-800 pt-5 text-xs leading-5 text-slate-500">Sesja jest tymczasowa. Dostęp nie jest zapisywany na urządzeniu przez aplikację.</div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-2rem)] items-center overflow-hidden bg-[#07111f] px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(30,64,175,0.24),transparent_35%),radial-gradient(circle_at_90%_80%,rgba(245,158,11,0.09),transparent_30%)]" />
      <div className="relative z-10 mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-700/70 bg-slate-900/80 shadow-2xl shadow-black/50 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex flex-col justify-between border-b border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/50 p-8 sm:p-12 lg:border-b-0 lg:border-r">
          <div><div className="mb-10 inline-flex rounded-2xl border border-slate-700/70 bg-slate-950/50 p-3 shadow-xl"><Image src="/govscope-logo-dark.png" alt="GOVscope" width={300} height={125} className="h-16 w-auto object-contain sm:h-20" priority /></div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">Kancelaria Prezesa Rady Ministrów</p><h1 className="max-w-lg text-3xl font-semibold tracking-tight text-white sm:text-4xl">Centrum dowodzenia spójnością rządu</h1><p className="mt-5 max-w-md text-sm leading-7 text-slate-300">GOVscope łączy monitoring wypowiedzi, prac legislacyjnych i ryzyk europejskich w jeden operacyjny obraz dla KPRM.</p></div>
          <div className="mt-12 grid grid-cols-2 gap-3 text-xs text-slate-400"><div className="rounded-2xl border border-slate-700/70 bg-slate-950/35 p-4"><span className="mb-2 block h-2 w-2 rounded-full bg-emerald-400" />Monitoring ciągły</div><div className="rounded-2xl border border-slate-700/70 bg-slate-950/35 p-4"><span className="mb-2 block h-2 w-2 rounded-full bg-amber-400" />Analiza eskalacji</div></div>
        </section>
        <section className="p-8 sm:p-12"><Suspense fallback={<div className="text-sm text-slate-400">Ładowanie modułu uwierzytelniania…</div>}><LoginForm /></Suspense><p className="mt-5 text-center text-[11px] text-slate-600">GOVscope • dostęp zastrzeżony dla uprawnionych użytkowników KPRM</p></section>
      </div>
    </div>
  );
}
