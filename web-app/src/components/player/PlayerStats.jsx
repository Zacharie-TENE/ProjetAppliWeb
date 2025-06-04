import { useState, useEffect } from 'react';
import   * as PlayerService from '@/services/player-service';
import PlayerStatsCard from './PlayerStatsCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const PlayerStats = ({ playerId }) => {
  // États pour les données et le chargement
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [competitionId, setCompetitionId] = useState(null);

  // Charger les performances du joueur
  const fetchPerformance = async () => {
    setLoading(true);
    try {
      const data = await PlayerService.getPlayerPerformance(playerId, competitionId);
      setPerformance(data);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les statistiques du joueur. Veuillez réessayer plus tard.');
      setPerformance(null);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour charger les performances au montage et lors du changement de filtres
  useEffect(() => {
    if (playerId) {
      fetchPerformance();
    }
  }, [playerId, competitionId]);

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
          onClick={fetchPerformance} 
          className="mt-2 text-sm font-medium text-red-700 underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Si pas de données
  if (!performance) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-600 px-6 py-8 rounded-md text-center">
        <h3 className="text-lg font-medium mb-2">Aucune statistique disponible</h3>
        <p className="text-gray-500">
          Ce joueur n'a pas encore de statistiques enregistrées.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Statistiques du joueur</h2>
      
      {/* Sélecteur de compétition */}
      <div className="mb-6">
        <label htmlFor="competitionFilter" className="block text-sm font-medium text-gray-700 mb-2">
          Filtrer par compétition
        </label>
        <select
          id="competitionFilter"
          value={competitionId || ''}
          onChange={(e) => setCompetitionId(e.target.value || null)}
          className="w-full md:w-64 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Toutes les compétitions</option>
          {performance.competitionId && (
            <option value={performance.competitionId}>{performance.competitionName}</option>
          )}
        </select>
      </div>
      
      {/* Statistiques générales */}
      <PlayerStatsCard 
        title="Statistiques générales"
        stats={[
          { label: "Matchs joués", value: performance.totalMatches || 0 },
          { label: "Minutes jouées", value: performance.totalMinutesPlayed || 0 },
          { label: "Note moyenne", value: performance.rating ? performance.rating.toFixed(1) : '-' },
          { label: "Fautes", value: performance.totalFouls || 0 }
        ]}
      />
      
      {/* Statistiques offensives */}
      <PlayerStatsCard 
        title="Statistiques offensives"
        stats={[
          { label: "Buts marqués", value: performance.totalGoals || 0 },
          { label: "Passes décisives", value: performance.totalAssists || 0 },
          { label: "Tirs", value: performance.totalShots || 0 },
          { label: "Tirs cadrés", value: performance.shotsOnTarget || 0 },
          { label: "Pénalties marqués", value: performance.penaltiesScored || 0 },
          { label: "Pénalties tentés", value: performance.penaltiesTaken || 0 },
          { label: "Dribbles réussis", value: performance.successfulDribbles || 0 }
        ]}
      />
      
      {/* Statistiques milieu de terrain */}
      <PlayerStatsCard 
        title="Statistiques de milieu de terrain"
        stats={[
          { label: "Précision des passes", value: performance.passAccuracy ? `${performance.passAccuracy.toFixed(1)}%` : '-' },
          { label: "Passes réussies", value: performance.successfulPasses || 0 },
          { label: "Ballons récupérés", value: performance.ballsRecovered || 0 },
          { label: "Centres réussis", value: performance.successfulCrosses || 0 }
        ]}
      />
      
      {/* Statistiques défensives */}
      <PlayerStatsCard 
        title="Statistiques défensives"
        stats={[
          { label: "Interceptions", value: performance.interceptions || 0 },
          { label: "Ballons perdus", value: performance.ballsLost || 0 },
          { label: "Cartons jaunes", value: performance.totalYellowCards || 0 },
          { label: "Cartons rouges", value: performance.totalRedCards || 0 }
        ]}
      />
      
      {/* Statistiques spécifiques aux gardiens */}
      {performance.position === 'GOALKEEPER' && (
        <PlayerStatsCard 
          title="Statistiques de gardien de but"
          stats={[
            { label: "Arrêts", value: performance.savesMade || 0 },
            { label: "Clean sheets", value: performance.cleanSheets || 0 },
            { label: "Pénalties arrêtés", value: performance.penaltiesSaved || 0 },
            { label: "Buts encaissés", value: performance.goalsConceded || 0 },
            { label: "Pourcentage d'arrêts", value: performance.savePercentage ? `${performance.savePercentage.toFixed(1)}%` : '-' }
          ]}
        />
      )}
    </div>
  );
};

export default PlayerStats;