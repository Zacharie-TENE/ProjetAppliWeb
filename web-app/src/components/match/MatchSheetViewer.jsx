import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import   * as  Matchservice from '@/services/match-service';
import { PlayerStatus } from '@/lib/utils/enums';

// Importation des composants extraits
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import MatchSheetHeader from './MatchSheetHeader';
import MatchSheetPlayerTable from './MatchSheetPlayerTable';
import PlayerCardList from './PlayerCardList';
import MatchSheetFilter from './MatchSheetFilter';

const MatchSheetViewer = ({ matchId, teamId, isUserView = true }) => {
  // États pour les données et le chargement
  const [matchSheet, setMatchSheet] = useState(null);
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour les joueurs filtrés
  const [allPlayers, setAllPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState({
    starters: [],
    substitutes: [],
    benchPlayers: [],
    unavailablePlayers: []
  });

  // Charger les données de la feuille de match
  useEffect(() => {
    const fetchMatchSheetData = async () => {
      if (!matchId || !teamId) return;
      
      setLoading(true);
      try {
        // Récupérer les détails du match
        const matchData = await Matchservice.getMatchById(matchId);
        setMatch(matchData);
        
        // Récupérer les feuilles de match de ce match
        const matchSheetsResponse = await Matchservice.getMatchSheetByMatchId(matchId);
        
        // Trouver la feuille de match pour l'équipe spécifiée
        const teamMatchSheet = matchSheetsResponse.find(
          sheet => sheet.teamId === Number(teamId)
        );
        
        if (!teamMatchSheet) {
          throw new Error('Feuille de match non trouvée');
        }
        
        // Récupérer les détails complets de la feuille de match
        const detailedMatchSheet = await Matchservice.getMatchSheetBy(teamMatchSheet.id);
        setMatchSheet(detailedMatchSheet);
        
        // Mettre à jour les joueurs
        const playerParticipations = detailedMatchSheet.playerParticipations || [];
        setAllPlayers(playerParticipations);
        updateFilteredPlayers(playerParticipations);
        
        setError(null);
      } catch (err) {
        setError('Impossible de charger la feuille de match. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMatchSheetData();
  }, [matchId, teamId]);

  // Fonction pour mettre à jour les joueurs filtrés
  const updateFilteredPlayers = (players) => {
    const starters = players.filter(p => p.playerStatus === PlayerStatus.STARTER);
    const substitutes = players.filter(p => p.playerStatus === PlayerStatus.SUBSTITUTE);
    const notPlayed = players.filter(p => p.playerStatus === PlayerStatus.NOT_PLAYED);
    const injured = players.filter(p => p.playerStatus === PlayerStatus.INJURED);
    const expelled = players.filter(p => p.playerStatus === PlayerStatus.EXPELLED);
    const reserves = players.filter(p => p.playerStatus === PlayerStatus.RESERVE);
    
    const benchPlayers = [...notPlayed, ...reserves];
    const unavailablePlayers = [...injured, ...expelled];
    
    setFilteredPlayers({
      starters,
      substitutes,
      benchPlayers,
      unavailablePlayers
    });
  };

  // Gestionnaire pour mettre à jour les joueurs filtrés
  const handleFilterChange = (filteredPlayers) => {
    updateFilteredPlayers(filteredPlayers);
  };

  // Afficher un message de chargement
  if (loading) {
    return <LoadingSpinner />;
  }

  // Afficher un message d'erreur
  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        returnLink={isUserView ? `/matches/${matchId}` : `/dashboard/matches/${matchId}`}
        returnText="Retour aux détails du match"
      />
    );
  }

  // Si pas de données
  if (!matchSheet || !match) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-600 px-6 py-8 rounded-md text-center">
        <h3 className="text-lg font-medium mb-2">Feuille de match non trouvée</h3>
        <p className="text-gray-500">
          La feuille de match demandée n'est pas disponible ou n'a pas encore été validée.
        </p>
        <Link
          href={isUserView ? `/matches/${matchId}` : `/dashboard/matches/${matchId}`}
          className="mt-4 inline-block text-sm font-medium text-green-600 underline"
        >
          Retour aux détails du match
        </Link>
      </div>
    );
  }

  // Formatter la date et l'heure
  const formattedDateTime = match.scheduledDateTime
    ? format(new Date(match.scheduledDateTime), 'dd MMMM yyyy - HH:mm', { locale: fr })
    : 'Date non définie';

  // Déterminer si l'équipe est à domicile ou à l'extérieur
  const isHomeTeam = matchSheet.teamRole === 'HOME';
  const opponentName = isHomeTeam ? match.awayTeamName : match.homeTeamName;
  const opponentId = isHomeTeam ? match.awayTeamId : match.homeTeamId;

  return (
    <div className="space-y-8">
      {/* Filtre pour les joueurs */}
      <MatchSheetFilter 
        players={allPlayers} 
        onFilterChange={handleFilterChange} 
      />
      
      {/* En-tête avec les informations du match */}
      <MatchSheetHeader 
        match={match}
        matchSheet={matchSheet}
        formattedDateTime={formattedDateTime}
        matchId={matchId}
        opponentName={opponentName}
        opponentId={opponentId}
        isUserView={isUserView}
      />
      
      {/* Tableau des joueurs */}
      {(filteredPlayers.starters.length > 0 || filteredPlayers.substitutes.length > 0) && (
        <MatchSheetPlayerTable 
          starters={filteredPlayers.starters} 
          substitutes={filteredPlayers.substitutes} 
        />
      )}
      
      {/* Banc de touche */}
      {filteredPlayers.benchPlayers.length > 0 && (
        <PlayerCardList 
          players={filteredPlayers.benchPlayers} 
          title="Banc de touche" 
          variant="default" 
        />
      )}
      
      {/* Joueurs non disponibles */}
      {filteredPlayers.unavailablePlayers.length > 0 && (
        <PlayerCardList 
          players={filteredPlayers.unavailablePlayers} 
          title="Joueurs indisponibles" 
          variant="unavailable" 
        />
      )}
    </div>
  );
};

export default MatchSheetViewer;