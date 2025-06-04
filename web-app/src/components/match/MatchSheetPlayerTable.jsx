import React from 'react';
import { PlayerPosition } from '@/lib/utils/enums';

// Fonction utilitaire pour obtenir le libellé d'une position
export const getPositionLabel = (position) => {
  const positionMap = {
    [PlayerPosition.GOALKEEPER]: 'Gardien',
    [PlayerPosition.DEFENDER]: 'Défenseur',
    [PlayerPosition.MIDFIELDER]: 'Milieu',
    [PlayerPosition.FORWARD]: 'Attaquant'
  };
  
  return positionMap[position] || position;
};

// Composant pour afficher les cartons jaunes et rouges
const PlayerCards = ({ yellowCards, redCards }) => {
  return (
    <>
      {yellowCards > 0 && (
        <span className="inline-block w-4 h-4 bg-yellow-300 mr-1"></span>
      )}
      {yellowCards > 1 && (
        <span className="inline-block w-4 h-4 bg-yellow-300 mr-1"></span>
      )}
      {redCards > 0 && (
        <span className="inline-block w-4 h-4 bg-red-500 mr-1"></span>
      )}
    </>
  );
};

// Composant pour le tableau des joueurs
const MatchSheetPlayerTable = ({ starters, substitutes }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Composition</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                N°
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joueur
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Minutes
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Buts
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cartons
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Titulaires */}
            {starters.map((player) => (
              <tr key={player.playerId} className="bg-green-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {player.shirtNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {player.playerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getPositionLabel(player.position)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {player.minutesPlayed}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {player.goalsScored > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      {player.goalsScored}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <PlayerCards yellowCards={player.yellowCards} redCards={player.redCards} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {player.substitutionOutTime > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      Remplacé à la {player.substitutionOutTime}'
                    </span>
                  )}
                </td>
              </tr>
            ))}
            
            {/* Remplaçants entrés en jeu */}
            {substitutes.map((player) => (
              <tr key={player.playerId} className="bg-blue-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {player.shirtNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {player.playerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getPositionLabel(player.positionPlayed)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {player.minutesPlayed}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {player.goalsScored > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      {player.goalsScored}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <PlayerCards yellowCards={player.yellowCards} redCards={player.redCards} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    Entré à la {player.substitutionInTime}'
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MatchSheetPlayerTable;