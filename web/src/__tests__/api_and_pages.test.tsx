import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AlertyPage from '../app/alerty/page';
import EuropaPage from '../app/europa/page';
import MeldunekPage from '../app/meldunek/page';
import AudytorPage from '../app/audytor/page';
import { Header } from '../components/Header';
import { POST as authLoginPost } from '../app/api/auth/login/route';
import { NextRequest } from 'next/server';

describe('GOVscope Alert Center and EU Dimensions', () => {
  it('renders Header with Alert Center link and AI modules', () => {
    render(<Header />);
    expect(screen.getByText('Centrum alertów')).toBeDefined();
    expect(screen.getByText('Wymiar europejski')).toBeDefined();
    expect(screen.getByText('Audytor AI Gemini')).toBeDefined();
    expect(screen.getByText('Meldunek dobowy')).toBeDefined();
  });

  it('renders AlertyPage with operational title', () => {
    render(<AlertyPage />);
    expect(screen.getByText('Centrum Dyspozytorskie KPRM')).toBeDefined();
    expect(screen.getByText(/Powiadomienia i eskalacje/)).toBeDefined();
  });

  it('renders EuropaPage with EU tabs', () => {
    render(<EuropaPage />);
    expect(screen.getByText(/Wymiar europejski/)).toBeDefined();
    expect(screen.getByText(/Procedury naruszeniowe/)).toBeDefined();
    expect(screen.getByText(/Kamienie milowe KPO/)).toBeDefined();
  });

  it('renders MeldunekPage for Prime Minister Donald Tusk', () => {
    render(<MeldunekPage />);
    expect(screen.getAllByText(/Meldunek Dobowy dla Premiera/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Donald Tusk/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Kancelaria Prezesa Rady Ministrów/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Drukuj \/ Zapisz PDF/).length).toBeGreaterThan(0);
  });

  it('renders AudytorPage with Gemini 2.5 Flash controls', () => {
    render(<AudytorPage />);
    expect(screen.getAllByText(/Audytor Spójności Rządowej AI/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Silnik Google Gemini 2.5 Flash/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Uruchom natychmiastowy audyt spójności/).length).toBeGreaterThan(0);
  });

  it('authenticates with password PDT2026 and rejects unauthorized passwords', async () => {
    const invalidReq = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password: 'wrongpassword' }),
    });
    const invalidRes = await authLoginPost(invalidReq);
    expect(invalidRes.status).toBe(401);

    const validReq = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password: 'PDT2026' }),
    });
    const validRes = await authLoginPost(validReq);
    expect(validRes.status).toBe(200);
    const data = await validRes.json();
    expect(data.success).toBe(true);
    expect(validRes.cookies.get('govscope_session')).toBeDefined();
  });
});
