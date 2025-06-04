import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import   * as PlayerService from '@/services/player-service';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import PlayerStats from '@/components/player/PlayerStats';
import PlayerMatchList from '@/components/player/PlayerMatchList';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const PlayerDetails = ({ playerId, isUserView = true }) => {
  // États pour les données du joueur
  const [player, setPlayer] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [performanceSummary, setPerformanceSummary] = useState(null);
  
  // Vérifier les droits d'accès selon le rôle
  const { hasAccess } = useRoleAccess();
  const canEdit = hasAccess(['COACH', 'ADMIN']);
  
  // Charger les détails du joueur
  const fetchPlayerDetails = async () => {
    setLoading(true);
    try {
      const data = await PlayerService.getPlayerById(playerId);
      setPlayer(data);
      
      // Charger un résumé des performances
      const performanceData = await PlayerService.getPlayerPerformance(playerId);
      setPerformanceSummary(performanceData);
      
      setError(null);
    } catch (err) {
      setError('Impossible de charger les détails du joueur. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  // Effet pour charger les détails au montage
  useEffect(() => {
    if (playerId) {
      fetchPlayerDetails();
    }
  }, [playerId]);

  // Fonctions utilitaires pour l'affichage
  const translatePosition = (position) => {
    const positionMap = {
      'GOALKEEPER': 'Gardien',
      'DEFENDER': 'Défenseur',
      'MIDFIELDER': 'Milieu',
      'FORWARD': 'Attaquant'
    };
    return positionMap[position] || position;
  };

  const translateStatus = (status) => {
    const statusMap = {
      'STARTER': 'Titulaire',
      'SUBSTITUTE': 'Remplaçant',
      'INJURED': 'Blessé',
      'SUSPENDED': 'Suspendu',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const statusColorMap = {
      'STARTER': 'bg-green-100 text-green-800',
      'INJURED': 'bg-red-100 text-red-800',
      'SUSPENDED': 'bg-yellow-100 text-yellow-800',
      'SUBSTITUTE': 'bg-gray-100 text-gray-800'
    };
    return statusColorMap[status] || 'bg-gray-100 text-gray-800';
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
          onClick={fetchPlayerDetails} 
          className="mt-2 text-sm font-medium text-red-700 underline"
        >
          Réessayer
        </button>

        <Link href="/players" className="mt-4 inline-block text-blue-600 hover:underline">
          Retour aux joueurs
        </Link>
      </div>
    );
  }

  // Si pas de données
  if (!player) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-600 px-6 py-8 rounded-md text-center">
        <h3 className="text-lg font-medium mb-2">Joueur non trouvé</h3>
        <p className="text-gray-500">
          Les détails de ce joueur ne sont pas disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* En-tête du joueur */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{player.firstName} {player.lastName}</h1>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full bg-white/20">
                {translatePosition(player.position)}
              </span>
              <span className={`text-xs font-semibold inline-block py-1 px-2 rounded-full bg-white/20`}>
                {translateStatus(player.status)}
              </span>
            </div>
            {player.teamId && (
              <p className="text-sm opacity-90">
                Équipe: <Link href={`/teams/${player.teamId}`} className="font-semibold hover:underline">{player.teamName}</Link>
              </p>
            )}
          </div>
          
          {/* Bouton d'édition pour les coachs et admins */}
          {canEdit && !isUserView && (
            <Link 
              href={`/dashboard/coach/players/${player.id}/edit`}
              className="bg-white text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors mt-4 md:mt-0"
            >
              Modifier
            </Link>
          )}
          
          {player.profilePicture && (
            <div className="mt-4 md:mt-0">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src={player.profilePicture} 
                  alt={`Photo ${player.firstName} ${player.lastName}`} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/globe.svg'; // Fallback image
                  }}
                />
              </div>
            </div>
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
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Informations
          </button>

          <button
              onClick={() => setActiveTab('performance')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === 'performance'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Performances
            </button>
            <button
              onClick={() => setActiveTab('matches')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === 'matches'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Matchs
            </button>
        </nav>

       
    
        
      </div>

      {/* Contenu des onglets */}
      <div className="p-6">
        {/* Onglet Informations */}
        <div className="space-y-6">

        {activeTab === 'performance' && <PlayerStats playerId={playerId} />}
        {activeTab === 'matches' && <PlayerMatchList playerId={playerId} />}
        {activeTab === 'info' && (
            <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Informations personnelles</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Nom</span>
                  <span className="font-medium text-gray-800">{player.firstName} {player.lastName}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Nom d'utilisateur</span>
                  <span className="font-medium text-gray-800">@{player.userName}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium text-gray-800">{player.email}</span>
                </li>
                {player.phone && (
                  <li className="flex justify-between">
                    <span className="text-gray-600">Téléphone</span>
                    <span className="font-medium text-gray-800">{player.phone}</span>
                  </li>
                )}
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Informations sportives</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Position</span>
                  <span className="font-medium text-gray-800">{translatePosition(player.position)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Statut</span>
                  <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${getStatusColor(player.status)}`}>
                    {translateStatus(player.status)}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Numéro de licence</span>
                  <span className="font-medium text-gray-800">{player.licenseNumber || 'Non défini'}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Équipe</span>
                  {player.teamId ? (
                    <Link 
                      href={`/teams/${player.teamId}`} 
                      className="font-medium text-purple-600 hover:underline"
                    >
                      {player.teamName}
                    </Link>
                  ) : (
                    <span className="font-medium text-gray-500">Sans équipe</span>
                  )}
                </li>
              </ul>
            </div>
          </div>

       
          {/* {performanceSummary && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Résumé des performances</h3>
                <Link 
                  href={`/players/${player.id}/stats`} 
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                >
                  Voir toutes les statistiques
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <span className="text-3xl font-bold text-purple-600">{performanceSummary.totalMatches || 0}</span>
                  <p className="text-sm text-gray-600 mt-1">Matchs joués</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <span className="text-3xl font-bold text-purple-600">{performanceSummary.totalGoals || 0}</span>
                  <p className="text-sm text-gray-600 mt-1">Buts</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <span className="text-3xl font-bold text-purple-600">{performanceSummary.totalAssists || 0}</span>
                  <p className="text-sm text-gray-600 mt-1">Passes décisives</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <span className="text-3xl font-bold text-purple-600">{performanceSummary.rating?.toFixed(1) || '-'}</span>
                  <p className="text-sm text-gray-600 mt-1">Note moyenne</p>
                </div>
              </div>
            </div>
          )} */}
      
{performanceSummary && (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-medium text-gray-800">Résumé des performances</h3>
      <Link 
        href={`/players/${player.id}/stats`} 
        className="text-purple-600 hover:text-purple-800 text-sm font-medium"
      >
        Voir toutes les statistiques
      </Link>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Stats communes à tous les joueurs */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
        <span className="text-3xl font-bold text-purple-600">{performanceSummary.totalMatches || 0}</span>
        <p className="text-sm text-gray-600 mt-1">Matchs joués</p>
      </div>
      
      {/* Statistiques spécifiques par position */}
      {player.position === 'GOALKEEPER' ? (
        <>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <span className="text-3xl font-bold text-purple-600">{performanceSummary.savesMade || 0}</span>
            <p className="text-sm text-gray-600 mt-1">Arrêts</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <span className="text-3xl font-bold text-purple-600">{performanceSummary.cleanSheets || 0}</span>
            <p className="text-sm text-gray-600 mt-1">Clean sheets</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <span className="text-3xl font-bold text-purple-600">{performanceSummary.savePercentage?.toFixed(1) || '-'}%</span>
            <p className="text-sm text-gray-600 mt-1">% Arrêts</p>
          </div>
        </>
      ) : player.position === 'DEFENDER' ? (
        <>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <span className="text-3xl font-bold text-purple-600">{performanceSummary.interceptions || 0}</span>
            <p className="text-sm text-gray-600 mt-1">Interceptions</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <span className="text-3xl font-bold text-purple-600">{performanceSummary.ballsRecovered || 0}</span>
            <p className="text-sm text-gray-600 mt-1">Ballons récupérés</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <span className="text-3xl font-bold text-purple-600">{performanceSummary.rating?.toFixed(1) || '-'}</span>
            <p className="text-sm text-gray-600 mt-1">Note moyenne</p>
          </div>
        </>
      ) : player.position === 'MIDFIELDER' ? (
        <>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <span className="text-3xl font-bold text-purple-600">{performanceSummary.successfulPasses || 0}</span>
            <p className="text-sm text-gray-600 mt-1">Passes réussies</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <span className="text-3xl font-bold text-purple-600">{performanceSummary.totalAssists || 0}</span>
            <p className="text-sm text-gray-600 mt-1">Passes décisives</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <span className="text-3xl font-bold text-purple-600">{performanceSummary.passAccuracy?.toFixed(1) || '-'}%</span>
            <p className="text-sm text-gray-600 mt-1">Précision passes</p>
          </div>
        </>
      ) : (
        // FORWARD
        <>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <span className="text-3xl font-bold text-purple-600">{performanceSummary.totalGoals || 0}</span>
            <p className="text-sm text-gray-600 mt-1">Buts</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <span className="text-3xl font-bold text-purple-600">{performanceSummary.shotsOnTarget || 0}</span>
            <p className="text-sm text-gray-600 mt-1">Tirs cadrés</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <span className="text-3xl font-bold text-purple-600">{performanceSummary.totalAssists || 0}</span>
            <p className="text-sm text-gray-600 mt-1">Passes décisives</p>
          </div>
        </>
      )}
    </div>
  </div>
)}
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default PlayerDetails;