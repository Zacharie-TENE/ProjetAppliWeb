import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import * as PlayerService from '@/services/player-service';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const TeamPlayers = ({ teamId }) => {
  // États pour les données et le chargement
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les joueurs de l'équipe
  const fetchPlayers = async () => {
    if (!teamId) return;
    
    setLoading(true);
    try {
      // Utiliser la fonction correcte du PlayerService au lieu de 
      const response = await PlayerService.getPlayersByTeam(teamId);
      setPlayers(response || []);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les joueurs de l\'équipe. Veuillez réessayer plus tard.');
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour charger les joueurs au montage
  useEffect(() => {
    fetchPlayers();
  }, [teamId]);

  // Afficher un message de chargement
  if (loading) {
    return <LoadingSpinner />;
  }

  // Afficher un message d'erreur
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>{error}</p>
        <button 
          onClick={fetchPlayers} 
          className="mt-2 text-sm font-medium text-red-700 underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Si pas de données
  if (players.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-600 px-6 py-8 rounded-md text-center">
        <h3 className="text-lg font-medium mb-2">Aucun joueur</h3>
        <p className="text-gray-500">
          Cette équipe n'a pas encore de joueurs.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Joueurs de l'équipe</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {players.map((player) => (
              <tr key={player.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-2">
                      <div className="text-sm font-medium text-gray-900">{player.firstName} {player.lastName}</div>
                      <div className="text-sm text-gray-500">{player.userName}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{player.position}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    player.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    player.status === 'INJURED' ? 'bg-red-100 text-red-800' :
                    player.status === 'SUSPENDED' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {player.status === 'ACTIVE' ? 'Actif' :
                     player.status === 'INJURED' ? 'Blessé' :
                     player.status === 'SUSPENDED' ? 'Suspendu' :
                     'Inactif'}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <Link href={`/players/${player.id}`} className="text-green-600 hover:text-green-900">
                    Voir le profil
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamPlayers;