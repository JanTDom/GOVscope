import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AlertyPage from '../app/alerty/page';
import EuropaPage from '../app/europa/page';
import { Header } from '../components/Header';

describe('GOVscope Alert Center and EU Dimensions', () => {
  it('renders Header with Alert Center link', () => {
    render(<Header />);
    expect(screen.getByText('Centrum alertów')).toBeDefined();
    expect(screen.getByText('Wymiar europejski')).toBeDefined();
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
});
