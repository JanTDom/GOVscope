import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'GOVscope — System Monitoringu, Wczesnego Ostrzegania i Spójności Rządowej dla KPRM',
  description:
    'Rządowy radar ryzyka narracyjnego, spójności koalicyjnej i wczesnego ostrzegania dedykowany Kancelarii Prezesa Rady Ministrów oraz ministrowi ds. Unii Europejskiej.',
  icons: {
    icon: '/govscope-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        <Header />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
