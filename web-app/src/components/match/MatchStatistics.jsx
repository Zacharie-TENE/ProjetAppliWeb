import React, { useState, useEffect } from 'react';
import  * as  Matchservice from '@/services/match-service';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const MatchStatistics = ({ matchId, match }) => {
  const [consolidatedMatch, setConsolidatedMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les statistiques du match
  const fetchMatchStatistics = async () => {
    if (!matchId || match?.status !== 'COMPLETED') {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      // Récupérer les données consolidées pour le match
      const consolidatedData = await Matchservice.getConsolidatedMatchSheetByMatchId(matchId);
      setConsolidatedMatch(consolidatedData);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les statistiques du match. Veuillez réessayer plus tard.');
      setConsolidatedMatch(null);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour charger les données au montage
  useEffect(() => {
    fetchMatchStatistics();
  }, [matchId]);

  // Afficher un message de chargement
  if (loading) {
    return <LoadingSpinner />;
  }

  // Afficher un message d'erreur
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md my-4">
        <p>{error}</p>
        <button 
          onClick={fetchMatchStatistics} 
          className="mt-2 text-sm font-medium text-red-700 underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Statistiques du match</h3>
      
      {consolidatedMatch?.statistics ? (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="text-center mb-4 md:mb-0">
              <span className="block text-lg font-semibold">{match.homeTeamName}</span>
            </div>
            <div className="text-center">
              <span className="block text-sm uppercase font-medium text-gray-500 mb-1">Statistiques</span>
            </div>
            <div className="text-center">
              <span className="block text-lg font-semibold">{match.awayTeamName}</span>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Possession */}
            <div className="flex items-center">
              <div className="w-1/4 text-right pr-3">
                <span className="font-medium">{consolidatedMatch.statistics.homeTeamStats.possession}%</span>
              </div>
              <div className="w-1/2">
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-green-600"
                    style={{ width: `${consolidatedMatch.statistics.homeTeamStats.possession}%` }}
                  ></div>
                </div>
                <div className="text-center text-xs text-gray-500 mt-1">Possession</div>
              </div>
              <div className="w-1/4 pl-3">
                <span className="font-medium">{consolidatedMatch.statistics.awayTeamStats.possession}%</span>
              </div>
            </div>
            
            {/* Tirs cadrés */}
            <div className="flex items-center">
              <div className="w-1/4 text-right pr-3">
                <span className="font-medium">{consolidatedMatch.statistics.homeTeamStats.shotsOnTarget}</span>
              </div>
              <div className="w-1/2">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                </div>
                <div className="text-center text-xs text-gray-500 mt-1">Tirs cadrés</div>
              </div>
              <div className="w-1/4 pl-3">
                <span className="font-medium">{consolidatedMatch.statistics.awayTeamStats.shotsOnTarget}</span>
              </div>
            </div>
            
            {/* Autres statistiques */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                <div className="font-medium text-xl">{consolidatedMatch.statistics.homeTeamStats.shotsOffTarget}</div>
                <div className="text-xs text-gray-500">Tirs non cadrés</div>
                <div className="font-medium text-xl mt-2">{consolidatedMatch.statistics.awayTeamStats.shotsOffTarget}</div>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                <div className="font-medium text-xl">{consolidatedMatch.statistics.homeTeamStats.corners}</div>
                <div className="text-xs text-gray-500">Corners</div>
                <div className="font-medium text-xl mt-2">{consolidatedMatch.statistics.awayTeamStats.corners}</div>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                <div className="font-medium text-xl">{consolidatedMatch.statistics.homeTeamStats.fouls}</div>
                <div className="text-xs text-gray-500">Fautes</div>
                <div className="font-medium text-xl mt-2">{consolidatedMatch.statistics.awayTeamStats.fouls}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-600">Les statistiques détaillées ne sont pas disponibles pour ce match.</p>
        </div>
      )}
    </div>
  );
};

export default MatchStatistics;