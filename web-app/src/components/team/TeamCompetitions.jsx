import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import * as CompetitionService from '@/services/competition-service';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const TeamCompetitions = ({ teamId }) => {
  // États pour les données et le chargement
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les compétitions de l'équipe
  const fetchCompetitions = async () => {
    if (!teamId) return;
    
    setLoading(true);
    try {
      const response = await CompetitionService.getCompetitionsByTeamId(teamId);
      
      // Vérifier le format de la réponse
      const competitionsData = response.data ? response.data : response;
      
      console.log('Competitions fetched:', competitionsData);
      setCompetitions(competitionsData || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching competitions:', err);
      setError('Impossible de charger les compétitions de l\'équipe. Veuillez réessayer plus tard.');
      setCompetitions([]);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour charger les compétitions au montage
  useEffect(() => {
    fetchCompetitions();
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
          onClick={fetchCompetitions} 
          className="mt-2 text-sm font-medium text-red-700 underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Si pas de données
  if (competitions.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-600 px-6 py-8 rounded-md text-center">
        <h3 className="text-lg font-medium mb-2">Aucune compétition</h3>
        <p className="text-gray-500">
          Cette équipe ne participe actuellement à aucune compétition.
        </p>
      </div>
    );
  }

  // Fonction pour formater le type de compétition
  const getCompetitionTypeLabel = (type) => {
    const types = {
      'LEAGUE': 'Championnat',
      'TOURNAMENT': 'Tournoi',
      'CUP': 'Coupe'
    };
    return types[type] || type;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Compétitions de l'équipe</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {competitions.map((competition) => (
          <div 
            key={competition.id} 
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white">
              <h3 className="font-bold text-xl">{competition.name}</h3>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm opacity-90">{competition.category}</p>
                <span className="text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded">
                  {getCompetitionTypeLabel(competition.type)}
                </span>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Statut</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  competition.status === 'UPCOMING' ? 'bg-blue-100 text-blue-800' :
                  competition.status === 'IN_PROGRESS' ? 'bg-green-100 text-green-800' :
                  competition.status === 'COMPLETED' ? 'bg-purple-100 text-purple-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {competition.status === 'UPCOMING' ? 'À venir' :
                   competition.status === 'IN_PROGRESS' ? 'En cours' :
                   competition.status === 'COMPLETED' ? 'Terminée' :
                   'Annulée'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Dates:</span>
                  <span className="font-medium">
                    {competition.startDate && competition.endDate 
                      ? `${format(new Date(competition.startDate), 'dd/MM/yyyy', { locale: fr })} - ${format(new Date(competition.endDate), 'dd/MM/yyyy', { locale: fr })}`
                      : 'Non définies'
                    }
                  </span>
                </div>
                
                {competition.registeredTeams !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Équipes inscrites:</span>
                    <span className="font-medium">
                      {competition.registeredTeams} / {competition.maxTeams || '∞'}
                    </span>
                  </div>
                )}
                
                {competition.location && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Lieu:</span>
                    <span className="font-medium">{competition.location}</span>
                  </div>
                )}
                
                {competition.organizerName && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Organisateur:</span>
                    <span className="font-medium">{competition.organizerName}</span>
                  </div>
                )}
              </div>
              
              {competition.description && (
                <div className="text-sm text-gray-600 mt-2">
                  <p className="line-clamp-2">{competition.description}</p>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-100">
                <Link 
                  href={`/competitions/${competition.id}`}
                  className="block w-full text-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md font-medium hover:bg-blue-200 transition-colors"
                >
                  Voir la compétition
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamCompetitions;