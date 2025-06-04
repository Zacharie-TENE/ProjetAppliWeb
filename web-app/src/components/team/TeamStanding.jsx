import React, { useEffect, useState } from 'react';
import  Card  from '@/components/ui/Card';
import   * as  TeamService from '@/services/team-service';


const TeamStanding = ({ teamId, competitionId = null }) => {
  const [standing, setStanding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formItems, setFormItems] = useState([]);
  
  // Charger les données de classement de l'équipe

    const fetchStandings = async () => {
      if (!teamId) return;
      
      setLoading(true);
      try {
        // Si un competitionId est fourni, obtenir le classement pour cette compétition spécifique
        // Sinon, obtenir le meilleur/dernier classement de l'équipe
        const response = competitionId 
          ? await TeamService.getTeamCompetitionStanding(teamId, competitionId)
          : await TeamService.getTeamStandings(teamId);
        
        // Si nous obtenons un tableau (plusieurs compétitions), prendre le premier
        const standingData = Array.isArray(response) ? response[0] : response;
        
        setStanding(standingData);
        setError(null);
        
        // Traiter la chaîne de forme si elle existe
        if (standingData?.form) {
          const formArray = standingData.form.split('-');
          setFormItems(formArray);
        }
      } catch (err) {
        setError('Impossible de charger les informations de classement.');
      } finally {
        setLoading(false);
      }
    };
    



    useEffect(() => {
        fetchStandings();
    }, [teamId,competitionId]);
  

  // Détermine la couleur du badge en fonction du résultat du match
  const getFormItemColor = (item) => {
    switch (item) {
      case 'W':
        return 'bg-green-500';
      case 'L':
        return 'bg-red-500';
      case 'D':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-300';
    }
  };

  // Détermine le texte complet en fonction de l'abréviation du résultat
  const getFormItemText = (item) => {
    switch (item) {
      case 'W':
        return 'Victoire';
      case 'L':
        return 'Défaite';
      case 'D':
        return 'Match nul';
      default:
        return 'Inconnu';
    }
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
    //     <div className="flex justify-center items-center h-48">
    //     <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    //   </div>
      <Card className="p-4 w-full animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>{error}</p>
        <button 
          onClick={fetchStandings} 
          className="mt-2 text-sm font-medium text-red-700 underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Si aucune donnée de classement n'est disponible
  if (!standing || Object.keys(standing).length === 0) {
    return (
      <Card className="p-6 w-full bg-gray-50 border border-gray-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucun classement disponible</h3>
          <p className="text-gray-500">
            Cette équipe ne participe actuellement à aucune compétition ou le classement n'est pas encore établi.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden border border-gray-200 rounded-lg shadow-sm">
      {/* En-tête du classement */}
      <div className="bg-blue-600 text-white px-6 py-4">
        <h3 className="text-lg font-bold flex items-center">
          <span>Classement dans {standing.competitionName}</span>
          <span className="ml-auto bg-blue-700 text-white text-xl font-extrabold w-8 h-8 rounded-full flex items-center justify-center">
            {standing.position}
          </span>
        </h3>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white">
        <div className="text-center">
          <p className="text-gray-500 text-sm">Points</p>
          <p className="text-2xl font-bold text-blue-600">{standing.points}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 text-sm">Matchs joués</p>
          <p className="text-2xl font-bold">{standing.matchesPlayed}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 text-sm">Différence de buts</p>
          <p className={`text-2xl font-bold ${standing.goalDifference > 0 ? 'text-green-600' : standing.goalDifference < 0 ? 'text-red-600' : 'text-gray-600'}`}>
            {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 text-sm">Buts</p>
          <p className="text-2xl font-bold">
            <span className="text-green-600">{standing.goalsFor}</span>
            <span className="text-gray-400 mx-1">/</span>
            <span className="text-red-600">{standing.goalsAgainst}</span>
          </p>
        </div>
      </div>

      {/* Détails des résultats */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-3 p-4 gap-4">
          <div className="text-center">
            <div className="bg-green-100 text-green-800 rounded-md p-2">
              <p className="text-sm">Victoires</p>
              <p className="text-xl font-bold">{standing.wins}</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-yellow-100 text-yellow-800 rounded-md p-2">
              <p className="text-sm">Nuls</p>
              <p className="text-xl font-bold">{standing.draws}</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-red-100 text-red-800 rounded-md p-2">
              <p className="text-sm">Défaites</p>
              <p className="text-xl font-bold">{standing.losses}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Derniers résultats */}
      {formItems.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Derniers résultats</p>
          <div className="flex space-x-2">
            {formItems.map((item, index) => (
              <div 
                key={index} 
                className={`w-8 h-8 rounded-full ${getFormItemColor(item)} text-white flex items-center justify-center text-sm font-bold`}
                title={getFormItemText(item)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default TeamStanding;