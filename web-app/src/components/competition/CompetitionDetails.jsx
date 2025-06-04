import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import * as CompetitionService from '../../services/competition-service';
import CompetitionStandings from './CompetitionStandings';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import CompetitionTeamList from './CompetitionTeamList';
import CompetitionMatchList from './CompetitionMatchList';
import LoadingSpinner from '@/components/ui/LoadingSpinner';



const CompetitionDetails = ({ competitionId, isUserView = true }) => {
  // États pour les données de la compétition
  const [competition, setCompetition] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Vérifier les droits d'accès selon le rôle
  const { hasAccess } = useRoleAccess();
  const canEdit = hasAccess(['ORGANIZER', 'ADMIN']);
  
  // Charger les détails de la compétition
  const fetchCompetitionDetails = async () => {
    setLoading(true);
    try {
      const data = await CompetitionService.getCompetitionById(competitionId);
      setCompetition(data);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les détails de la compétition. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  // Effet pour charger les détails au montage
  useEffect(() => {
    if (competitionId) {
      fetchCompetitionDetails();
    }
  }, [competitionId]);

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
  };

  // Fonction pour traduire le statut en français
  const translateStatus = (status) => {
    switch (status) {
      case 'UPCOMING':
        return 'À venir';
      case 'IN_PROGRESS':
        return 'En cours';
      case 'COMPLETED':
        return 'Terminée';
      case 'CANCELLED':
        return 'Annulée';
      default:
        return status;
    }
  };

  // Fonction pour obtenir la couleur du badge selon le statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'UPCOMING':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
          onClick={fetchCompetitionDetails} 
          className="mt-2 text-sm font-medium text-red-700 underline"
        >
          Réessayer
        </button>
        <Link href="/competitions" className="mt-4 inline-block text-blue-600 hover:underline">
           Retour aux compétitions
          </Link>
      </div>

    );
  }
  

  // Si pas de données
  if (!competition) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-600 px-6 py-8 rounded-md text-center">
        <h3 className="text-lg font-medium mb-2">Compétition non trouvée</h3>
        <p className="text-gray-500">
          Les détails de cette compétition ne sont pas disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* En-tête avec image de fond */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-white relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{competition.name}</h1>
            <div className="flex items-center space-x-2 mb-2">
              <span className={`text-xs font-semibold inline-block py-1 px-2 rounded-full ${getStatusColor(competition.status)}`}>
                {translateStatus(competition.status)}
              </span>
              <span className="text-sm opacity-90">{competition.category}</span>
            </div>
            <p className="text-sm opacity-80">
              Organisé par <span className="font-semibold">{competition.organizerName}</span>
            </p>
          </div>
          
          {/* Bouton d'édition pour les organisateurs et admins */}
          {canEdit && (
            <Link 
              href={`/dashboard/organizer/competitions/${competition.id}`}
              className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors mt-4 md:mt-0"
            >
              Modifier
            </Link>
          )}
        </div>
      </div>
      
      {/* Navigation par onglets */}
      <div className="border-b">
        <nav className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
              activeTab === 'info'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Informations
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
              activeTab === 'teams'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Équipes
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
              activeTab === 'matches'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Matchs
          </button>
          <button
            onClick={() => setActiveTab('standings')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
              activeTab === 'standings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Classement
          </button>
        </nav>
      </div>
      
      {/* Contenu des onglets */}
      <div className="p-6">
        {/* Onglet Informations */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">À propos de la compétition</h2>
              <p className="text-gray-600">{competition.description || 'Aucune description disponible.'}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Détails de la compétition</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium text-gray-800">
                      {competition.type === 'LEAGUE' ? 'Ligue' : 
                       competition.type === 'TOURNAMENT' ? 'Tournoi' : 
                       competition.type === 'CUP' ? 'Coupe' : competition.type}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Date de début</span>
                    <span className="font-medium text-gray-800">{formatDate(competition.startDate)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Date de fin</span>
                    <span className="font-medium text-gray-800">{formatDate(competition.endDate)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Lieu</span>
                    <span className="font-medium text-gray-800">{competition.location || 'Non défini'}</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Participation</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Équipes inscrites</span>
                    <span className="font-medium text-gray-800">{competition.registeredTeams}/{competition.maxTeams}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Catégorie</span>
                    <span className="font-medium text-gray-800">{competition.category}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Créée le</span>
                    <span className="font-medium text-gray-800">
                      {competition.createdAt ? format(new Date(competition.createdAt), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Mise à jour le</span>
                    <span className="font-medium text-gray-800">
                      {competition.updatedAt ? format(new Date(competition.updatedAt), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Organisateur</h3>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-4">
                <div className="h-14 w-14 bg-indigo-100 rounded-full flex items-center justify-center">
                  {competition.organizerName ? (
                    <span className="text-xl font-bold text-indigo-600">
                      {competition.organizerName.charAt(0)}
                    </span>
                  ) : (
                    <span className="text-xl font-bold text-indigo-600">O</span>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{competition.organizerName}</h4>
                  <p className="text-sm text-gray-600">Organisateur</p>
                  <Link 
                    href={`/profile/${competition.organizerId}/`}
                    className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-block"
                  >
                    Voir le profil
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Onglet Équipes */}
        {activeTab === 'teams' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Équipes participantes</h2>
            <CompetitionTeamList 
              competitionId={competition.id}
              isUserView={isUserView}
            />
          </div>
        )}
        
        {/* Onglet Matchs */}
        {activeTab === 'matches' && (
          <div>
            {/* <h2 className="text-xl font-semibold text-gray-800 mb-4">Matchs de la compétition</h2> */}
            <CompetitionMatchList 
              competitionId={competition.id}
              isUserView={isUserView}
            />
          </div>
        )}
        
        {/* Onglet Classement */}
        {activeTab === 'standings' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Classement</h2>
            <CompetitionStandings competitionId={competition.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitionDetails;