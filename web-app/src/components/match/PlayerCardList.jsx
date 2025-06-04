import React from 'react';
import { getPositionLabel } from './MatchSheetPlayerTable';

// Composant pour afficher une liste de cartes de joueurs
const PlayerCardList = ({ players, title, variant = 'default' }) => {
  const bgColor = variant === 'unavailable' ? 'bg-gray-50' : '';
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {players.map((player) => (
          <div key={player.playerId} className={`p-3 border border-gray-200 rounded-md ${bgColor}`}>
            <div className="font-medium">{player.playerName}</div>
            <div className="text-sm text-gray-500">
              {player.shirtNumber && `N° ${player.shirtNumber} - `}
              {getPositionLabel(player.position)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerCardList;