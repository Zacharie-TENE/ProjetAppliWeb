'use client';

import React from 'react';
import MatchList from '@/components/match/MatchList';

export default function MatchesPage() {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-orange-800 to-red-800 p-6 sm:p-10 text-white rounded-lg shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Calendrier des Matchs</h1>
        <p className="text-orange-100 max-w-3xl">
          Consultez tous les matchs à venir et passés. Utilisez les filtres pour trouver les matchs qui vous intéressent.
        </p>
      </div>

      {/* Composant MatchList qui gère toute la logique et l'affichage */}
      <MatchList isUserView={true} />
    </div>
  );
}