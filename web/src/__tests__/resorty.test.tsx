import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResortyPage from '../app/resorty/page';
import RozdziekiPage from '../app/rozdzieki/page';

describe('GOVscope Ministries & Clashes Views', () => {
  it('renders ResortyPage without errors and displays header', () => {
    render(<ResortyPage />);
    expect(screen.getByText('Katalog resortów i skład kierownictwa rządu')).toBeDefined();
    expect(screen.getByPlaceholderText('Szukaj resortu lub członka rządu...')).toBeDefined();
  });

  it('renders RozdziekiPage with an honest empty state before verified ingest', () => {
    render(<RozdziekiPage />);
    expect(screen.getByText('Detektor rozdźwięków — oś czasu i analiza zderzeń wypowiedzi')).toBeDefined();
    expect(screen.getByText(/Brak zweryfikowanych zderzeń wypowiedzi/)).toBeDefined();
  });
});
