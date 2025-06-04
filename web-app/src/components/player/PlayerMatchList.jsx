import { useState, useEffect } from 'react';
import   * as Matchservice from '@/services/match-service';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const PlayerMatchList = ({ playerId }) => {
  // États pour les données et le chargement
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les matchs du joueur
  const fetchPlayerMatches = async () => {
    setLoading(true);
    try {
      const response = await Matchservice.getMatchesByPlayerId(playerId);
      setMatches(response.data || []);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les matchs du joueur. Veuillez réessayer plus tard.');
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour charger les matchs au montage
  useEffect(() => {
    if (playerId) {
      fetchPlayerMatches();
    }
  }, [playerId]);

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
          onClick={fetchPlayerMatches} 
          className="mt-2 text-sm font-medium text-red-700 underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Si pas de données
  if (matches.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-600 px-6 py-8 rounded-md text-center">
        <h3 className="text-lg font-medium mb-2">Aucun match trouvé</h3>
        <p className="text-gray-500">
          Ce joueur n'a pas encore participé à des matchs.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Matchs du joueur</h2>
      <div className="space-y-4">
        {matches.map(match => (
          <div 
            key={match.id} 
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-4">
              <div className="flex justify-between mb-2">
                <h3 className="font-bold text-lg">{match.title}</h3>
                <span 
                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                    match.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                    match.status === 'IN_PROGRESS' ? 'bg-green-100 text-green-800' :
                    match.status === 'COMPLETED' ? 'bg-purple-100 text-purple-800' :
                    match.status === 'POSTPONED' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}
                >
                  {match.status === 'SCHEDULED' ? 'Programmé' :
                   match.status === 'IN_PROGRESS' ? 'En cours' :
                   match.status === 'COMPLETED' ? 'Terminé' :
                   match.status === 'POSTPONED' ? 'Reporté' :
                   'Annulé'}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-1">
                {match.scheduledDateTime 
                  ? format(new Date(match.scheduledDateTime), 'dd MMMM yyyy - HH:mm', { locale: fr }) 
                  : 'Date non définie'}
              </p>
              
              <p className="text-xs text-gray-500 mb-3">
                {match.competitionName}
              </p>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="text-right mr-2">
                    <span className="font-semibold">
                      {match.homeTeamName}
                    </span>
                  </div>
                  <span className="bg-gray-200 px-2 py-1 rounded text-sm font-bold">
                    {match.status === 'COMPLETED' ? `${match.homeTeamScore} - ${match.awayTeamScore}` : 'VS'}
                  </span>
                  <div className="ml-2">
                    <span className="font-semibold">
                      {match.awayTeamName}
                    </span>
                  </div>
                </div>
                
                <Link 
                  href={`/matches/${match.id}`}
                  className="text-purple-600 hover:text-purple-800 font-medium text-sm"
                >
                  Détails
                </Link>
              </div>
              
              {match.playerPerformance && (
                <div className="bg-gray-50 p-3 rounded-lg mt-3">
                  <h4 className="font-medium text-sm mb-2">Performance du joueur</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="text-center">
                      <span className="block text-lg font-bold text-purple-600">{match.playerPerformance.minutesPlayed || 0}'</span>
                      <span className="text-xs text-gray-500">Minutes jouées</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-lg font-bold text-purple-600">{match.playerPerformance.goalsScored || 0}</span>
                      <span className="text-xs text-gray-500">Buts</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-lg font-bold text-purple-600">{match.playerPerformance.yellowCards || 0}</span>
                      <span className="text-xs text-gray-500">Cartons jaunes</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-lg font-bold text-purple-600">{match.playerPerformance.redCards || 0}</span>
                      <span className="text-xs text-gray-500">Cartons rouges</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerMatchList;