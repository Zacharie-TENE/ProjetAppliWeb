'use client';

import React from 'react';
import PlayerList from '@/components/player/PlayerList';

export default function PlayersPage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-white mb-4">Joueurs</h1>
        <p className="text-purple-100 text-lg">
          Découvrez les profils et les performances des joueurs.
        </p>
      </div>

      {/* Liste des joueurs avec filtres intégrés */}
      <PlayerList isUserView={true} />
    </div>
  );
}