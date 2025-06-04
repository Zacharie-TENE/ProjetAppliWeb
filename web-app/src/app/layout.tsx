import './globals.css';
import { Inter } from 'next/font/google';
import ClientLayout from './Clientlayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'FootballManager - Gestion de compétitions sportives',
  description: 'Application de gestion sportive pour le football : compétitions, équipes, joueurs, matchs et plus',
  keywords: 'football, sport, gestion, compétition, équipe, joueur, match, coach, organisateur',
};

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body className={`${inter.className} h-full`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}