import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PrepShare — Interview Experiences for Companies, Colleges & Freshers',
  description: 'Read authentic round-by-round interview experiences, placement questions, and coding assessment patterns for Google, TCS, Infosys, Microsoft, Amazon.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 bg-mesh-light antialiased selection:bg-indigo-500 selection:text-white min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
