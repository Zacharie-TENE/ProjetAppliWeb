import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import * as Matchservice from '@/services/match-service';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import MatchStatistics from './MatchStatistics';
import MatchSheetTab from './MatchSheetTab';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const MatchDetails = ({ matchId, teamId, isUserView = true }) => {
  // États pour les données et le chargement
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  // Vérifier les permissions de l'utilisateur
  const { hasAccess } = useRoleAccess();
  const isOrganizer = hasAccess(['ORGANIZER', 'ADMIN']);
  const isCoach = hasAccess(['COACH']);

  // Charger les détails du match
  const fetchMatchDetails = async () => {
    if (!matchId) return;
    
    setLoading(true);
    try {
      // Récupérer les informations de base du match
      const matchData = await Matchservice.getMatchById(matchId);
      setMatch(matchData);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les détails du match. Veuillez réessayer plus tard.');
      setMatch(null);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour charger les données au montage
  useEffect(() => {
    fetchMatchDetails();
  }, [matchId]);

  // Traiter l'onglet actif
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

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
          onClick={fetchMatchDetails} 
          className="mt-2 text-sm font-medium text-red-700 underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Si pas de données
  if (!match) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-600 px-6 py-8 rounded-md text-center my-4">
        <h3 className="text-lg font-medium mb-2">Match non trouvé</h3>
        <p className="text-gray-500">
          Les détails de ce match ne sont pas disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* En-tête du match */}
      <div className="bg-gray-50 p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{match.title}</h1>
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-600">
                {match.scheduledDateTime 
                  ? format(new Date(match.scheduledDateTime), 'EEEE dd MMMM yyyy - HH:mm', { locale: fr }) 
                  : 'Date non définie'}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>
                {match.competitionName}
                {match.round ? ` - ${match.round}` : ''}
                {match.phase ? ` (${match.phase})` : ''}
              </span>
            </div>
            {match.location && (
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{match.location}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center mt-4 md:mt-0">
            <span 
              className={`px-3 py-1 text-sm rounded-full font-medium ${
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
        </div>
        
        {/* Actions (boutons d'édition pour coach/organizer) */}
        {!isUserView && (
          <div className="flex flex-wrap gap-2 mb-6">
            {isCoach && (
              <Link 
                href={`/dashboard/coach/matches/${match.id}`}
                className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                {match.matchSheetStatus === 'SUBMITTED' || match.matchSheetStatus === "UNVALIDATED" 
                || match.matchSheetStatus === 'ONGOING' ? 'Modifier la feuille de match' : 'Créer une feuille de match'}
              </Link>
            )}
            
            {isOrganizer && (
              <>
                <Link 
                  href={`/dashboard/organizer/matches/${match.id}`}
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Modifier le match
                </Link>
                {match.matchSheetStatus === 'SUBMITTED' && (
                  <Link 
                    href={`/dashboard/organizer/matches/match-validation?matchId=${match.id}`}
                    className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Valider la feuille de match
                  </Link>
                )}
              </>
            )}
          </div>
        )}
        
        {/* Score et équipes */}
        <div className="flex items-center justify-center my-8 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-inner">
          <div className="grid grid-cols-5 w-full max-w-3xl">
            <div className="col-span-2 flex flex-col items-center md:items-end text-center md:text-right">
              <Link 
                href={isUserView ? `/teams/${match.participants?.find(p => p.role === 'HOME')?.teamId}` : `/dashboard/teams/${match.participants?.find(p => p.role === 'HOME')?.teamId}`}
                className="text-xl font-semibold text-gray-800 hover:text-green-600 transition-colors mb-2"
              >
                {match.participants?.find(p => p.role === 'HOME')?.teamName || 'Non spécifié'}
              </Link>
              {/* À remplacer par un logo d'équipe si disponible */}
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-xs">Logo</span>
              </div>
            </div>
            
            <div className="col-span-1 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold my-4">
                {match.status === 'COMPLETED' || match.status === 'IN_PROGRESS'
                  ? `${match.homeTeamScore ?? 0} - ${match.awayTeamScore ?? 0}`
                  : 'VS'}
              </div>
            </div>
            
            <div className="col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
              <Link 
                href={isUserView ? `/teams/${match.participants?.find(p => p.role === 'AWAY')?.teamId}` : `/dashboard/teams/${match.participants?.find(p => p.role === 'AWAY')?.teamId}`}
                className="text-xl font-semibold text-gray-800 hover:text-green-600 transition-colors mb-2"
              >
                {match.participants?.find(p => p.role === 'AWAY')?.teamName || 'Non spécifié'}
              </Link>
              {/* À remplacer par un logo d'équipe si disponible */}
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-xs">Logo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation par onglets */}
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto scrollbar-hide">
          <button
            onClick={() => handleTabChange('details')}
            className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === 'details'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Informations
          </button>
          
        
            <button
              onClick={() => handleTabChange('matchsheet')}
              className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'matchsheet'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Feuille de match
            </button>
          
          
          {match.status === 'COMPLETED' && (
            <button
              onClick={() => handleTabChange('statistics')}
              className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'statistics'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Statistiques
            </button>
          )}
        </nav>
      </div>
      
      {/* Contenu des onglets */}
      <div className="p-6">
        {/* Onglet détails */}
        {activeTab === 'details' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Informations générales</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Compétition</span>
                    <Link 
                      href={isUserView ? `/competitions/${match.competitionId}` : `/dashboard/competitions/${match.competitionId}`}
                      className="font-medium text-green-600 hover:underline"
                    >
                      {match.competitionName}
                    </Link>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Type de compétition</span>
                    <span className="font-medium text-gray-800">{match.competitionType}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Statut</span>
                    <span className="font-medium text-gray-800">
                      {match.status === 'SCHEDULED' ? 'Programmé' :
                       match.status === 'IN_PROGRESS' ? 'En cours' :
                       match.status === 'COMPLETED' ? 'Terminé' :
                       match.status === 'POSTPONED' ? 'Reporté' :
                       'Annulé'}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Phase</span>
                    <span className="font-medium text-gray-800">{match.phase || 'Non spécifié'}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Tour/Journée</span>
                    <span className="font-medium text-gray-800">{match.round || 'Non spécifié'}</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Équipes</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Équipe à domicile</span>
                    <Link 
                      href={isUserView ? `/teams/${match.participants?.find(p => p.role === 'HOME')?.teamId}` : `/dashboard/teams/${match.participants?.find(p => p.role === 'HOME')?.teamId}`}
                      className="font-medium text-green-600 hover:underline"
                    >
                      {match.participants?.find(p => p.role === 'HOME')?.teamName || 'Non spécifié'}
                    </Link>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Équipe à l'extérieur</span>
                    <Link 
                      href={isUserView ? `/teams/${match.participants?.find(p => p.role === 'AWAY')?.teamId}` : `/dashboard/teams/${match.participants?.find(p => p.role === 'AWAY')?.teamId}`}
                      className="font-medium text-green-600 hover:underline"
                    >
                      {match.participants?.find(p => p.role === 'AWAY')?.teamName || 'Non spécifié'}
                    </Link>
                  </li>
                  {match.status === 'COMPLETED' && (
                    <>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Score final</span>
                        <span className="font-medium text-gray-800">{match.homeTeamScore} - {match.awayTeamScore}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Vainqueur</span>
                        <span className="font-medium text-gray-800">
                          {match.homeTeamScore > match.awayTeamScore
                            ? match.participants?.find(p => p.role === 'HOME')?.teamName
                            : match.homeTeamScore < match.awayTeamScore
                            ? match.participants?.find(p => p.role === 'AWAY')?.teamName
                            : 'Match nul'}
                        </span>
                      </li>
                    </>
                  )}
                  <li className="flex justify-between">
                    <span className="text-gray-600">Feuille de match</span>
                    <span className="font-medium text-gray-800">
                      {match.matchSheetStatus === 'VALIDATED' 
                          ? 'Validée' 
                          : 'Pas encore disponible'}
        
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* Onglet feuille de match */}
        {activeTab === 'matchsheet' && (
          <MatchSheetTab matchId={matchId} match={match} isUserView={isUserView} />
        )}
        
        {/* Onglet statistiques */}
        {activeTab === 'statistics' && match.status === 'COMPLETED' && (
          <MatchStatistics matchId={matchId} match={match} />
        )}
      </div>
    </div>
  );
};

export default MatchDetails;