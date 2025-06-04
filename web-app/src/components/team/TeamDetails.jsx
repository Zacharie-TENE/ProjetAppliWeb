import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import   * as  TeamService from '@/services/team-service';
import * as Matchservice from '@/services/match-service';
import * as PlayerService from '@/services/player-service';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import TeamHeader from './TeamHeader';
import TeamTabs from './TeamTabs';
import TeamPlayers from './TeamPlayers';
import TeamMatches from './TeamMatches';
import TeamCompetitions from './TeamCompetitions';
import TeamStanding from './TeamStanding';


const TeamDetails = ({ teamId,  activeTab = 'info', 
  onTabChange,
  onViewAllPlayers, 
  onViewAllMatches }) => {
  // États pour les données et le chargement
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //const [activeTab, setActiveTab] = useState('info');
  
  // // Fonction pour gérer le changement d'onglet
  // const handleTabChange = (tab) => {
  //   setActiveTab(tab);
  // };

  // Charger les données de l'équipe
  const fetchTeamDetails = async () => {
    if (!teamId) return;
    
    setLoading(true);
    try {
      // Récupérer les détails de l'équipe
      const teamData = await TeamService.getTeamById(teamId);
      setTeam(teamData || []);

      // Récupérer les joueurs de l'équipe (limité à 3 pour l'aperçu)
      const playersResponse = await PlayerService.getPlayersByTeam(teamId, teamData.coachId);
      setPlayers(playersResponse || []);

      // Récupérer les matchs de l'équipe (limité à 3 pour l'aperçu)
      const matchesResponse = await Matchservice.getMatchesByTeamId(teamId);
      setMatches(matchesResponse || []);

      setError(null);
    } catch (err) {
      setError('Impossible de charger les détails de l\'équipe. Veuillez réessayer plus tard.');
      setTeam(null);
      setPlayers([]);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour charger les données au montage
  useEffect(() => {
    fetchTeamDetails();
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
          onClick={fetchTeamDetails} 
          className="mt-2 text-sm font-medium text-red-700 underline"
        >
          Réessayer
        </button>
      </div>
    );
  }


  return (
    <div className="">

            {/* En-tête et contenu principal */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* En-tête de l'équipe - charge ses propres données via TeamService */}
              <TeamHeader teamId={teamId} />
      
              {/* Navigation par onglets */}
              <TeamTabs activeTab={activeTab} onTabChange={onTabChange} />
      

{activeTab === 'info' && (
<>
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">À propos de l'équipe</h2>
        <p className="text-gray-600">{team.description || 'Aucune description disponible.'}</p>
      </div>

        
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Détails de l'équipe</h3>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span className="text-gray-600">Nom</span>
              <span className="font-medium text-gray-800">{team.name}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Catégorie</span>
              <span className="font-medium text-gray-800">{team.category}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Nombre de joueurs</span>
              <span className="font-medium text-gray-800">{team.playerCount || 0}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Compétitions</span>
              <span className="font-medium text-gray-800">{team.competitionCount || 0}</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Coach</h3>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span className="text-gray-600">Nom</span>
              <span className="font-medium text-gray-800">{team.coachName}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Créée le</span>
              <span className="font-medium text-gray-800">
                {team.createdAt ? format(new Date(team.createdAt), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Mise à jour le</span>
              <span className="font-medium text-gray-800">
                {team.updatedAt ? format(new Date(team.updatedAt), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}
              </span>
            </li>
          </ul>
          {team.coachId && (
            <div className="mt-4">
              <Link 
                href={`/profile/${team.coachId}`}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                Voir le profil du coach
              </Link>
            </div>
          )}
        </div>
      </div>
     

      {/* Aperçu des joueurs */}
      {players.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Joueurs de l'équipe</h3>
            <button 
              onClick={onViewAllPlayers}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              Voir tous les joueurs
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {players.slice(0, 3).map(player => (
              <div key={player.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-800">{player.firstName} {player.lastName}</h4>
                <p className="text-sm text-gray-600">{player.position}</p>
                <div className="mt-2">
                  <Link 
                    href={`/players/${player.id}`}
                    className="text-green-600 hover:underline text-sm"
                  >
                    Voir le profil
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aperçu des matchs */}
      {matches.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Prochains matchs</h3>
            <button 
              onClick={onViewAllMatches}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              Voir tous les matchs
            </button>
          </div>
          <div className="space-y-3">
            {matches.slice(0, 3).map(match => (
              <div key={match.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-800">{match.title}</h4>
                    <p className="text-sm text-gray-600">
                      {match.scheduledDateTime ? format(new Date(match.scheduledDateTime), 'dd MMMM yyyy - HH:mm', { locale: fr }) : 'Date non définie'}
                    </p>
                    <p className="text-xs text-gray-500">{match.competitionName}</p>
                  </div>
                  <Link 
                    href={`/matches/${match.id}`}
                    className="text-green-600 hover:underline text-sm"
                  >
                    Détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

</>
  )}
              {activeTab === 'players' && (
                <TeamPlayers teamId={teamId} />
              )}

              {activeTab === 'matches' && (
                <TeamMatches teamId={teamId} />
              )}

              {activeTab === 'competitions' && (
                <TeamCompetitions teamId={teamId} />
              )}

              {activeTab === 'standings' && (
                <TeamStanding teamId={teamId} />
              )}
      
    </div>

    </div>
  );
};

export default TeamDetails;