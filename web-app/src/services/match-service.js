import api from '../lib/api/client';
import endpoints from '../lib/api/endpoints';

/**
 * Service pour la gestion des matchs
 */

// Méthodes génériques pour les matchs
/**
 * Récupère les matchs d'une équipe
 * @param {number} teamId - ID de l'équipe
 * @param {Object} filter - Filtres pour les matchs
 * @returns {Promise<Array>} - Liste des matchs
 */
export const getMatchesByTeamId = async (teamId, filter = {}) => {
  const response = await api.get(endpoints.matches.byTeam(teamId), filter);
  return response;
};



/**
 * Récupère tous les matchs avec filtres optionnels
 * @param {Object} filter - Filtres pour les matchs
 * @returns {Promise<Array>} - Liste des matchs
 */   

export const getAllMatches = async (filter = {}) => {
  const response = await api.get(endpoints.matches.base, filter);
  return response;
}

/*
*récupère un match par son ID
* @param {number} matchId - ID du match
* @returns {Promise<Object>} - Match trouvé 
*/
export const getMatchById = async (matchId) => {
  const response = await api.get(endpoints.matches.byId(matchId));
  return response;
}

/**
 * Récupère les matchs d'une compétition
 * @param {number} competitionId - ID de la compétition
 * @param {Object} filter - Filtres pour les matchs
 * @returns {Promise<Array>} - Liste des matchs
 */
export const getMatchesByCompetitionId = async (competitionId, filter = {}) => {
  const response = await api.get(endpoints.matches.byCompetition(competitionId), filter);
  return response;
};

/**
 * Récupère les feuilles de match d'un match
 * @param {number} matchId - ID du match
 * @returns {Promise<Array>} - Liste des feuilles de match
 */
export const getMatchSheetByMatchId = async (matchId) => {
  const response = await api.get(endpoints.matches.sheets(matchId));
  return response;
};

/**
 * Récupère une feuille de match spécifique
 * @param {number} matchSheetId - ID de la feuille de match
 * @returns {Promise<Object>} - Feuille de match
 */
export const getMatchSheetBy = async (matchSheetId) => {
  const response = await api.get(endpoints.matches.bySheet(matchSheetId));
  return response;
};

/**
 * Récupère les informations consolidées d'un match
 * @param {number} matchId - ID du match
 * @returns {Promise<Object>} - Informations consolidées du match
 */
export const getConsolidatedMatchSheetByMatchId = async (matchId) => {
  const response = await api.get(endpoints.matches.consolidated(matchId));
  return response;
};

/**
 * Récupère un match pour une équipe spécifique
 * @param {number} teamId - ID de l'équipe
 * @param {number} matchId - ID du match
 * @returns {Promise<Object>} - Feuille de match
 */
export const getMatchByTeamId = async (teamId, matchId) => {
  const response = await api.get(endpoints.matches.teamMatch(teamId, matchId));
  return response;
};

/**
 * Récupère les matchs d'un joueur
 * @param {number} playerId - ID du joueur
 * @returns {Promise<Array>} - Liste des matchs
 */
export const getMatchesByPlayerId = async (playerId) => {
  const response = await api.get(endpoints.matches.byPlayer(playerId));
  return response;
};

// Méthodes pour les organisateurs
/**
 * Planifie un nouveau match (organisateur)
 * @param {number} organizerId - ID de l'organisateur
 * @param {Object} matchDTO - Données du match
 * @returns {Promise<Object>} - Match créé
 */
export const scheduleMatch = async (organizerId, matchDTO) => {
  const response = await api.post(endpoints.matches.organizer.schedule(organizerId), matchDTO);
  return response;
};

/**
 * Met à jour le statut d'un match (organisateur)
 * @param {number} organizerId - ID de l'organisateur
 * @param {Object} matchStatusUpdateDTO - Données de mise à jour du statut
 * @param {string} reason - Raison du changement de statut
 * @returns {Promise<Object>} - Match mis à jour
 */
export const updateMatchStatus = async (organizerId, matchStatusUpdateDTO, reason) => {
  const response = await api.put(
    endpoints.matches.organizer.updateStatus(organizerId), 
    { ...matchStatusUpdateDTO, reason }
  );
  return response;
};

/**
 * Met à jour les informations d'un match (organisateur)
 * @param {number} organizerId - ID de l'organisateur
 * @param {Object} matchDTO - Données du match
 * @returns {Promise<Object>} - Match mis à jour
 */
export const updateMatchInfo = async (organizerId, matchDTO) => {
  const response = await api.put(endpoints.matches.organizer.update(organizerId), matchDTO);
  return response;
};

/**
 * Met à jour le score d'un match (organisateur)
 * @param {number} organizerId - ID de l'organisateur
 * @param {Object} matchScoreUpdateDTO - Données de mise à jour du score
 * @returns {Promise<Object>} - Match mis à jour
 */
export const updateMatchScore = async (organizerId, matchScoreUpdateDTO) => {
  const response = await api.put(endpoints.matches.organizer.updateScore(organizerId), matchScoreUpdateDTO);
  return response;
};

/**
 * Met à jour les participants d'un match (organisateur)
 * @param {number} organizerId - ID de l'organisateur
 * @param {number} matchId - ID du match
 * @param {Array} participants - Liste des participants
 * @returns {Promise<Array>} - Liste des participants mis à jour
 */
export const updateMatchParticipants = async (organizerId, matchId, participants) => {
  const response = await api.put(
    endpoints.matches.organizer.updateParticipants(organizerId, matchId), 
    participants
  );
  return response;
};

/**
 * Valide une feuille de match (organisateur)
 * @param {number} organizerId - ID de l'organisateur
 * @param {Object} matchSheetValidationDTO - Données de validation
 * @param {string} comments - Commentaires sur la validation
 * @returns {Promise<Object>} - Feuille de match validée
 */
export const validateMatchSheet = async (organizerId, matchSheetValidationDTO, comments) => {
  const response = await api.put(
    endpoints.matches.organizer.validateSheet(organizerId), 
    { ...matchSheetValidationDTO, comments }
  );
  return response;
};

// Méthodes pour les coachs
/**
 * Récupère les feuilles de match d'une équipe pour un coach
 * @param {number} coachId - ID du coach
 * @param {number} teamId - ID de l'équipe
 * @returns {Promise<Object>} - Réponse contenant les feuilles de match
 */
export const getMatchSheetsByTeamAndCoach = async (coachId, teamId) => {
  const response = await api.get(endpoints.matches.coach.sheets(coachId, teamId));
  return response;
};

/**
 * Récupère toutes les feuilles de match d'un coach
 * @param {number} coachId - ID du coach
 * @returns {Promise<Object>} - Réponse contenant les feuilles de match
 */
export const getMatchSheetsByCoach = async (coachId) => {
  const response = await api.get(endpoints.matches.coach.allSheets(coachId));
  return response;
};

/**
 * Récupère une feuille de match spécifique pour un coach
 * @param {number} coachId - ID du coach
 * @param {number} matchSheetId - ID de la feuille de match
 * @returns {Promise<Object>} - Feuille de match pour gestion
 */
export const getMatchSheet = async (coachId, matchSheetId) => {
  const response = await api.get(endpoints.matches.coach.sheet(coachId, matchSheetId));
  return response;
};

/**
 * Met à jour une feuille de match (coach)
 * @param {number} coachId - ID du coach
 * @param {number} matchSheetId - ID de la feuille de match
 * @param {Object} matchSheetDTO - Données de la feuille de match
 * @returns {Promise<Object>} - Feuille de match mise à jour
 */
export const updateMatchSheet = async (coachId, matchSheetId, matchSheetDTO) => {
  const response = await api.put(
    endpoints.matches.coach.updateSheet(coachId, matchSheetId), 
    matchSheetDTO
  );
  return response;
};
