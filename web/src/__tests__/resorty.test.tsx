import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResortyPage from '../app/resorty/page';
import RozdziekiPage from '../app/rozdzieki/page';
import { OFFICIAL_MINISTRIES } from '../lib/constants';

describe('GOVscope Ministries & Clashes Views', () => {
  it('contains full constitutional leadership mapping across ministries', () => {
    const kprm = OFFICIAL_MINISTRIES.find((m) => m.code === 'KPRM');
    expect(kprm).toBeDefined();
    expect(kprm?.leadership.some((l) => l.name === 'Donald Tusk')).toBe(true);

    const mf = OFFICIAL_MINISTRIES.find((m) => m.code === 'MF');
    expect(mf).toBeDefined();
    expect(mf?.leadership.some((l) => l.name === 'Andrzej Domański')).toBe(true);

    const mon = OFFICIAL_MINISTRIES.find((m) => m.code === 'MON');
    expect(mon).toBeDefined();
    expect(mon?.leadership.some((l) => l.name === 'Władysław Kosiniak-Kamysz')).toBe(true);

    const mc = OFFICIAL_MINISTRIES.find((m) => m.code === 'MC');
    expect(mc).toBeDefined();
    expect(mc?.leadership.some((l) => l.name === 'Krzysztof Gawkowski')).toBe(true);
  });

  it('renders ResortyPage without errors and displays header', () => {
    render(<ResortyPage />);
    expect(screen.getByText('Katalog resortów i skład kierownictwa rządu')).toBeDefined();
    expect(screen.getByPlaceholderText('Szukaj resortu lub członka rządu...')).toBeDefined();
  });

  it('renders RozdziekiPage with timeline confrontation', () => {
    render(<RozdziekiPage />);
    expect(screen.getByText('Detektor rozdźwięków — oś czasu i analiza zderzeń wypowiedzi')).toBeDefined();
    expect(screen.getAllByText(/Sedno sprzeczności|Analiza logiczna sprzeczności/).length).toBeGreaterThan(0);
  });
});
