import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'GameVault 3D - Play Free Online 3D & HTML5 Games',
  description: 'Play hundreds of free 3D games, geometry arrows, puzzle, action, drift racing, basketball superstars, and arcade games on GameVault 3D!',
  keywords: '3D games, webgl games, GameVault 3D, online games, html5 games, mahjong, drift racing, game developer portal',
};

import { ThemeProvider } from '@/components/ThemeProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased selection:bg-lime-400 selection:text-slate-950">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
