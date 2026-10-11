import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Verdant | AI Micro-Sanctuary Discovery & Disconnect Companion',
  description:
    'An outdoor disconnect companion. Discover restorative nature spots within a 5-15m walk, reduce screen time under 30s, and activate physical Disconnect Mode.',
  keywords: [
    'Verdant',
    'Touch Grass',
    'Mastra AI',
    'Tiger Data pgvector',
    'Entire Checkpoints',
    'Digital Detox',
    'Screen Fatigue',
    'Micro-Sanctuaries',
  ],
  authors: [{ name: 'Verdant AI Team' }],
};

export const viewport: Viewport = {
  themeColor: '#0d1312',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-emerald-800/40 selection:text-emerald-200 min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
