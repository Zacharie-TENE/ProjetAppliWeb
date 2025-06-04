import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import * as Matchservice from '@/services/match-service';
import * as TeamService from '@/services/team-service';
import * as PlayerService from '@/services/player-service';
import { useNotification } from '@/hooks/useNotification';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const MatchSheetForm = ({ matchId, teamId = null }) => {
  const router = useRouter();
  const { showNotification } = useNotification();
  const { hasAccess, userRole } = useRoleAccess();
  
  // États pour les données du formulaire
  const [matchData, setMatchData] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [matchSheet, setMatchSheet] = useState({
    teamId: teamId || '',
    players: [],
    startingLineup: [],
    substitutes: [],
    staff: [],
    events: [],
    notes: ''
  });
  
  // États pour les options et UI
  const [allTeamPlayers, setAllTeamPlayers] = useState([]);
  const [allTeamStaff, setAllTeamStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [eventType, setEventType] = useState('GOAL');
  const [tempEvent, setTempEvent] = useState({
    type: 'GOAL',
    minute: '',
    playerId: '',
    description: '',
    relatedPlayerId: ''
  });

  // Vérifier les permissions
  const isCoach = hasAccess(['COACH']);
  const userTeams = []; // À remplacer par les équipes associées à l'utilisateur

  // Fonction pour charger les données initiales
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // Récupérer les informations du match
      const match = await Matchservice.getMatchById(matchId);
      setMatchData(match);
      
      // Déterminer l'équipe pour laquelle l'utilisateur crée la feuille de match
      let userTeamId = teamId;
      if (!userTeamId && isCoach) {
        // Si l'utilisateur est un coach et qu'aucune équipe n'est spécifiée,
        // déterminer l'équipe du coach (à adapter selon votre logique d'application)
        if (userTeams.includes(match.homeTeamId)) {
          userTeamId = match.homeTeamId;
        } else if (userTeams.includes(match.awayTeamId)) {
          userTeamId = match.awayTeamId;
        } else {
          throw new Error("Vous n'êtes pas autorisé à créer une feuille de match pour ce match");
        }
      }
      
      // Charger les informations de l'équipe
      const team = await TeamService.getTeamById(userTeamId);
      setTeamData(team);
      
      // Récupérer les joueurs de l'équipe
      const playersResponse = await PlayerService.getPlayersByTeam(userTeamId);
      setAllTeamPlayers(playersResponse || []);
      
      // Pour le staff, nous devrons utiliser une autre méthode ou adapter la logique
      // car il n'y a pas de méthode getTeamStaff disponible
      setAllTeamStaff([]); // Temporairement vide jusqu'à ce qu'une méthode appropriée soit disponible
      
      // Vérifier si une feuille de match existe déjà
      try {
        // Utilisons getMatchSheetByMatchId au lieu de getMatchSheetByTeam qui n'existe pas
        const matchSheets = await Matchservice.getMatchSheetByMatchId(matchId);
        // Filtrer pour trouver la feuille de match de l'équipe spécifique
        const existingSheet = matchSheets?.find(sheet => sheet.teamId === userTeamId);
        
        if (existingSheet) {
          setIsEdit(true);
          setMatchSheet({
            ...existingSheet,
            teamId: userTeamId
          });
        } else {
          setMatchSheet(prev => ({
            ...prev,
            teamId: userTeamId
          }));
        }
      } catch (err) {
        // Aucune feuille de match existante, continuer avec une nouvelle
        setMatchSheet(prev => ({
          ...prev,
          teamId: userTeamId
        }));
      }
      
      setFormErrors({});
    } catch (error) {
      showNotification('Erreur lors du chargement des données', error.message, 'error');
      router.push('/dashboard/coach/matches');
    } finally {
      setLoading(false);
    }
  };

  // Effet pour charger les données au montage
  useEffect(() => {
    if (matchId) {
      fetchInitialData();
    }
  }, [matchId, teamId]);

  // Gérer la sélection des joueurs pour la composition
  const handlePlayerSelection = (playerId, section) => {
    setMatchSheet(prev => {
      // Fonction auxiliaire pour ajouter ou retirer un joueur d'une liste
      const togglePlayer = (list, id) => {
        return list.includes(id)
          ? list.filter(item => item !== id)
          : [...list, id];
      };
      
      // Mise à jour spécifique selon la section
      switch (section) {
        case 'players':
          const updatedPlayers = togglePlayer(prev.players, playerId);
          
          // Si on retire un joueur des joueurs sélectionnés, le retirer aussi
          // des titulaires et des remplaçants si nécessaire
          const updatedStartingLineup = prev.startingLineup.filter(id => 
            updatedPlayers.includes(id)
          );
          
          const updatedSubstitutes = prev.substitutes.filter(id => 
            updatedPlayers.includes(id)
          );
          
          return {
            ...prev,
            players: updatedPlayers,
            startingLineup: updatedStartingLineup,
            substitutes: updatedSubstitutes
          };
          
        case 'startingLineup':
          // Vérifier si le joueur est déjà dans les joueurs sélectionnés
          // Si non, l'ajouter automatiquement
          let newPlayers = [...prev.players];
          if (!newPlayers.includes(playerId)) {
            newPlayers.push(playerId);
          }
          
          // Ajouter aux titulaires
          const newStartingLineup = togglePlayer(prev.startingLineup, playerId);
          
          // Si on l'ajoute aux titulaires, le retirer des remplaçants si nécessaire
          let newSubstitutes = [...prev.substitutes];
          if (newStartingLineup.includes(playerId) && newSubstitutes.includes(playerId)) {
            newSubstitutes = newSubstitutes.filter(id => id !== playerId);
          }
          
          return {
            ...prev,
            players: newPlayers,
            startingLineup: newStartingLineup,
            substitutes: newSubstitutes
          };
          
        case 'substitutes':
          // Vérifier si le joueur est déjà dans les joueurs sélectionnés
          // Si non, l'ajouter automatiquement
          let updatedPlayersList = [...prev.players];
          if (!updatedPlayersList.includes(playerId)) {
            updatedPlayersList.push(playerId);
          }
          
          // Ajouter aux remplaçants
          const updatedSubstitutesList = togglePlayer(prev.substitutes, playerId);
          
          // Si on l'ajoute aux remplaçants, le retirer des titulaires si nécessaire
          let updatedStartingLineupList = [...prev.startingLineup];
          if (updatedSubstitutesList.includes(playerId) && updatedStartingLineupList.includes(playerId)) {
            updatedStartingLineupList = updatedStartingLineupList.filter(id => id !== playerId);
          }
          
          return {
            ...prev,
            players: updatedPlayersList,
            startingLineup: updatedStartingLineupList,
            substitutes: updatedSubstitutesList
          };
          
        case 'staff':
          return {
            ...prev,
            staff: togglePlayer(prev.staff, playerId)
          };
          
        default:
          return prev;
      }
    });
  };

  // Gérer les changements dans l'événement temporaire
  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setTempEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gérer le changement de type d'événement
  const handleEventTypeChange = (e) => {
    const type = e.target.value;
    setEventType(type);
    setTempEvent(prev => ({
      ...prev,
      type,
      relatedPlayerId: type === 'SUBSTITUTION' ? prev.relatedPlayerId : ''
    }));
  };

  // Ajouter un événement à la liste
  const addEvent = () => {
    // Valider l'événement
    if (!tempEvent.minute || !tempEvent.playerId) {
      showNotification('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }
    
    // Ajouter l'événement à la liste
    const newEvent = {
      ...tempEvent,
      id: `event-${Date.now()}` // ID temporaire
    };
    
    setMatchSheet(prev => ({
      ...prev,
      events: [...prev.events, newEvent]
    }));
    
    // Réinitialiser le formulaire d'événement
    setTempEvent({
      type: eventType,
      minute: '',
      playerId: '',
      description: '',
      relatedPlayerId: ''
    });
  };

  // Supprimer un événement
  const removeEvent = (eventId) => {
    setMatchSheet(prev => ({
      ...prev,
      events: prev.events.filter(event => event.id !== eventId)
    }));
  };

  // Gérer les changements dans les notes
  const handleNotesChange = (e) => {
    setMatchSheet(prev => ({
      ...prev,
      notes: e.target.value
    }));
  };

  // Valider le formulaire
  const validateForm = () => {
    const errors = {};
    
    if (matchSheet.startingLineup.length === 0) {
      errors.startingLineup = 'Veuillez sélectionner au moins un joueur titulaire';
    }
    
    if (matchSheet.staff.length === 0) {
      errors.staff = 'Veuillez sélectionner au moins un membre du staff';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotification('Veuillez corriger les erreurs du formulaire', 'error');
      return;
    }
    
    setSubmitting(true);
    try {
      // Récupérer le coachId - à adapter selon votre contexte d'application
      const coachId = 1; // Exemple - à remplacer par l'ID réel du coach connecté
      
      if (isEdit) {
        // Mettre à jour une feuille de match existante
        // On utilise updateMatchSheet de match-service.js qui attend coachId, matchSheetId et matchSheetDTO
        await Matchservice.updateMatchSheet(coachId, matchSheet.id, matchSheet);
        showNotification('Feuille de match mise à jour avec succès', 'success');
      } else {
        // Créer une nouvelle feuille de match
        // Comme il n'y a pas de méthode createMatchSheet définie, utilisons updateMatchSheet
        // avec les paramètres appropriés
        await Matchservice.updateMatchSheet(coachId, matchId, matchSheet);
        showNotification('Feuille de match créée avec succès', 'success');
      }
      
      // Rediriger vers la page des matchs
      router.push('/dashboard/coach/matches');
    } catch (error) {
      showNotification(
        `Erreur lors de la ${isEdit ? 'mise à jour' : 'création'} de la feuille de match`,
        error.message || 'Une erreur est survenue',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Annuler et retourner à la page précédente
  const handleCancel = () => {
    router.back();
  };

  // Afficher un message de chargement
  if (loading) {
    return <LoadingSpinner />;
  }


  // Trouver le nom du joueur à partir de son ID
  const getPlayerName = (playerId) => {
    const player = allTeamPlayers.find(p => p.id === playerId);
    return player ? `${player.firstName} ${player.lastName}` : 'Joueur inconnu';
  };

  // Trouver le nom du membre du staff à partir de son ID
  const getStaffName = (staffId) => {
    const staff = allTeamStaff.find(s => s.id === staffId);
    return staff ? `${staff.firstName} ${staff.lastName} (${staff.role})` : 'Staff inconnu';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? 'Modifier la feuille de match' : 'Créer une feuille de match'}
      </h1>
      
      {/* Informations sur le match */}
      {matchData && teamData && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Informations sur le match</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600"><span className="font-medium">Match:</span> {matchData.title}</p>
              <p className="text-gray-600"><span className="font-medium">Date:</span> {new Date(matchData.scheduledDateTime).toLocaleDateString('fr-FR')}</p>
              <p className="text-gray-600"><span className="font-medium">Compétition:</span> {matchData.competitionName}</p>
            </div>
            <div>
              <p className="text-gray-600"><span className="font-medium">Équipe:</span> {teamData.name}</p>
              <p className="text-gray-600">
                <span className="font-medium">Adversaire:</span> {
                  teamData.id === matchData.homeTeamId ? matchData.awayTeamName : matchData.homeTeamName
                }
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Type:</span> {
                  teamData.id === matchData.homeTeamId ? 'Domicile' : 'Extérieur'
                }
              </p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Sélection des joueurs */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Sélection des joueurs</h2>
          
          {allTeamPlayers.length === 0 ? (
            <p className="text-gray-600 mb-4">Aucun joueur n'est disponible pour cette équipe.</p>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-700 mb-2">Joueurs disponibles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {allTeamPlayers.map(player => (
                    <div 
                      key={player.id}
                      className={`flex items-center p-2 rounded border ${
                        matchSheet.players.includes(player.id)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        id={`player-${player.id}`}
                        checked={matchSheet.players.includes(player.id)}
                        onChange={() => handlePlayerSelection(player.id, 'players')}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`player-${player.id}`}
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {player.firstName} {player.lastName} ({player.position})
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Composition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-2">
                    Titulaires
                    {formErrors.startingLineup && (
                      <span className="text-sm text-red-500 ml-2">{formErrors.startingLineup}</span>
                    )}
                  </h3>
                  <div className="space-y-2">
                    {matchSheet.players.length > 0 ? (
                      matchSheet.players.map(playerId => (
                        <div 
                          key={`starting-${playerId}`}
                          className={`flex items-center p-2 rounded border ${
                            matchSheet.startingLineup.includes(playerId)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            id={`starting-${playerId}`}
                            checked={matchSheet.startingLineup.includes(playerId)}
                            onChange={() => handlePlayerSelection(playerId, 'startingLineup')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`starting-${playerId}`}
                            className="ml-2 block text-sm text-gray-700"
                          >
                            {getPlayerName(playerId)}
                          </label>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">Sélectionnez d'abord des joueurs disponibles</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-2">Remplaçants</h3>
                  <div className="space-y-2">
                    {matchSheet.players.length > 0 ? (
                      matchSheet.players.map(playerId => (
                        <div 
                          key={`substitute-${playerId}`}
                          className={`flex items-center p-2 rounded border ${
                            matchSheet.substitutes.includes(playerId)
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            id={`substitute-${playerId}`}
                            checked={matchSheet.substitutes.includes(playerId)}
                            onChange={() => handlePlayerSelection(playerId, 'substitutes')}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`substitute-${playerId}`}
                            className="ml-2 block text-sm text-gray-700"
                          >
                            {getPlayerName(playerId)}
                          </label>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">Sélectionnez d'abord des joueurs disponibles</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Sélection du staff */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Staff technique</h2>
          {formErrors.staff && (
            <p className="text-sm text-red-500 mb-2">{formErrors.staff}</p>
          )}
          
          {allTeamStaff.length === 0 ? (
            <p className="text-gray-600">Aucun membre du staff n'est disponible pour cette équipe.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {allTeamStaff.map(staff => (
                <div 
                  key={staff.id}
                  className={`flex items-center p-2 rounded border ${
                    matchSheet.staff.includes(staff.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    id={`staff-${staff.id}`}
                    checked={matchSheet.staff.includes(staff.id)}
                    onChange={() => handlePlayerSelection(staff.id, 'staff')}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`staff-${staff.id}`}
                    className="ml-2 block text-sm text-gray-700"
                  >
                    {staff.firstName} {staff.lastName} ({staff.role})
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Événements du match */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Événements du match</h2>
          
          {/* Formulaire d'ajout d'événement */}
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <h3 className="text-md font-medium text-gray-700 mb-3">Ajouter un événement</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type d'événement <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={tempEvent.type}
                  onChange={handleEventTypeChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="GOAL">But</option>
                  <option value="YELLOW_CARD">Carton jaune</option>
                  <option value="RED_CARD">Carton rouge</option>
                  <option value="SUBSTITUTION">Remplacement</option>
                  <option value="INJURY">Blessure</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="minute" className="block text-sm font-medium text-gray-700 mb-1">
                  Minute <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="minute"
                  name="minute"
                  value={tempEvent.minute}
                  onChange={handleEventChange}
                  min="0"
                  max="120"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="Ex: 42"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="playerId" className="block text-sm font-medium text-gray-700 mb-1">
                  Joueur concerné <span className="text-red-500">*</span>
                </label>
                <select
                  id="playerId"
                  name="playerId"
                  value={tempEvent.playerId}
                  onChange={handleEventChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="">Sélectionner un joueur</option>
                  {matchSheet.players.map(playerId => (
                    <option key={playerId} value={playerId}>
                      {getPlayerName(playerId)}
                    </option>
                  ))}
                </select>
              </div>
              
              {tempEvent.type === 'SUBSTITUTION' && (
                <div>
                  <label htmlFor="relatedPlayerId" className="block text-sm font-medium text-gray-700 mb-1">
                    Remplacé par <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="relatedPlayerId"
                    name="relatedPlayerId"
                    value={tempEvent.relatedPlayerId}
                    onChange={handleEventChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    <option value="">Sélectionner un joueur</option>
                    {matchSheet.players
                      .filter(id => id !== tempEvent.playerId)
                      .map(playerId => (
                        <option key={playerId} value={playerId}>
                          {getPlayerName(playerId)}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={tempEvent.description}
                onChange={handleEventChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Ex: But sur penalty, Carton pour simulation..."
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={addEvent}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Ajouter l'événement
              </button>
            </div>
          </div>
          
          {/* Liste des événements */}
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2">Événements ajoutés</h3>
            
            {matchSheet.events.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucun événement ajouté pour le moment</p>
            ) : (
              <div className="space-y-2">
                {matchSheet.events
                  .sort((a, b) => a.minute - b.minute)
                  .map(event => (
                    <div 
                      key={event.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
                    >
                      <div className="flex items-center">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-xs font-medium text-gray-800 mr-2">
                          {event.minute}'
                        </span>
                        <div>
                          <span className="font-medium">
                            {event.type === 'GOAL' && '⚽ But'}
                            {event.type === 'YELLOW_CARD' && '🟨 Carton jaune'}
                            {event.type === 'RED_CARD' && '🟥 Carton rouge'}
                            {event.type === 'SUBSTITUTION' && '🔄 Remplacement'}
                            {event.type === 'INJURY' && '🩹 Blessure'}
                            {event.type === 'OTHER' && '📝 Autre'}
                          </span>
                          <span className="mx-1">-</span>
                          <span>{getPlayerName(event.playerId)}</span>
                          {event.type === 'SUBSTITUTION' && event.relatedPlayerId && (
                            <span className="text-gray-600"> remplacé par {getPlayerName(event.relatedPlayerId)}</span>
                          )}
                          {event.description && (
                            <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => removeEvent(event.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Notes supplémentaires */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Notes supplémentaires</h2>
          <textarea
            name="notes"
            value={matchSheet.notes}
            onChange={handleNotesChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="Notez ici toute information complémentaire sur le match..."
          ></textarea>
        </div>
        
        {/* Boutons de soumission et d'annulation */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
              submitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? (
              <>
                <span className="inline-block animate-spin mr-2">&#9696;</span>
                {isEdit ? 'Mise à jour...' : 'Création...'}
              </>
            ) : (
              isEdit ? 'Mettre à jour' : 'Créer'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MatchSheetForm;