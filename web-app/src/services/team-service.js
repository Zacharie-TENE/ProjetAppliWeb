import api from '../lib/api/client';
import endpoints from '../lib/api/endpoints';

/**
 * Service pour la gestion des équipes
 */

/**
 * Récupère toutes les équipes
 * @param {Object} filters - Filtres pour les équipes
 * @returns {Promise<Array>} - Liste des équipes
 */
export const getAllTeams = async (filters = {}) => {
  const response = await api.get(endpoints.teams.base, filters);
  return response;
};

/**
 * Récupère une équipe par son ID
 * @param {number} teamId - ID de l'équipe
 * @returns {Promise<Object>} - Équipe trouvée
 */
export const getTeamById = async (teamId) => {
  const response = await api.get(endpoints.teams.byId(teamId));
  return response;
};

/**
 * Récupère les équipes d'un coach
 * @param {number} coachId - ID du coach
 * @returns {Promise<Array>} - Liste des équipes
 */
export const getTeamsByCoach = async (coachId, filters = {}) => {
  const response = await api.get(endpoints.teams.byCoach(coachId), filters);
  return response;
};

/**
 * Récupère les équipes participant à une compétition
 * @param {number} competitionId - ID de la compétition
 * @param {Object} filters - Filtres pour les équipes
 * @returns {Promise<Array>} - Liste des équipes
 */
export const getTeamsByCompetition = async (competitionId, filters = {}) => {
  const response = await api.get(endpoints.teams.byCompetition(competitionId), filters);
  return response;
};

/**
 * Récupère les équipes d'un joueur
 * @param {number} playerId - ID du joueur
 * @returns {Promise<Array>} - Liste des équipes
 */
export const getTeamsByPlayer = async (playerId) => {
  const response = await api.get(endpoints.teams.byPlayer(playerId));
  return response;
};

/**
 * Récupère les classements d'une équipe
 * @param {number} teamId - ID de l'équipe
 * @returns {Promise<Array>} - Classements de l'équipe
 */
export const getTeamStandings = async (teamId) => {
  const response = await api.get(endpoints.teams.standings(teamId));
  return response;
};

/**
 * Récupère les classements d'une compétition
 * @param {number} competitionId - ID de la compétition
 * @returns {Promise<Array>} - Classements de la compétition
 */
export const getCompetitionStandings = async (competitionId) => {
  const response = await api.get(endpoints.teams.competitionStandings(competitionId));
  return response;
};

/**
 * Récupère le classement d'une équipe dans une compétition
 * @param {number} competitionId - ID de la compétition
 * @param {number} teamId - ID de l'équipe
 * @returns {Promise<Object>} - Classement de l'équipe dans la compétition
 */
export const getTeamCompetitionStanding = async (competitionId, teamId) => {
  const response = await api.get(endpoints.teams.teamCompetitionStanding(competitionId, teamId));
  return response;
};

/**
 * [COACH] Crée une nouvelle équipe
 * @param {number} coachId - ID du coach
 * @param {Object} teamDTO - Données de l'équipe
 * @returns {Promise<Object>} - Équipe créée
 */
export const createTeam = async (coachId, teamDTO) => {
  const response = await api.post(endpoints.teams.coach.create(coachId), teamDTO);
  return response;
};

/**
 * [COACH] Met à jour une équipe
 * @param {number} coachId - ID du coach
 * @param {Object} teamDTO - Nouvelles données de l'équipe
 * @returns {Promise<Object>} - Équipe mise à jour
 */
export const updateTeam = async (coachId, teamDTO) => {
  const response = await api.put(endpoints.teams.coach.update(coachId), teamDTO);
  return response;
};

/**
 * [COACH] Supprime une équipe
 * @param {number} coachId - ID du coach
 * @param {number} teamId - ID de l'équipe à supprimer
 * @returns {Promise<void>}
 */
export const deleteTeam = async (coachId, teamId) => {
  await api.delete(endpoints.teams.coach.delete(coachId, teamId));
};

/**
 * [COACH] Récupère toutes les équipes d'un coach
 * @param {number} coachId - ID du coach
 * @returns {Promise<Array>} - Liste des équipes
 */
export const getAllCoachTeams = async (coachId) => {
  const response = await api.get(endpoints.teams.coach.all(coachId));
  return response;
};

/**
 * [COACH] Ajoute un joueur à une équipe
 * @param {number} coachId - ID du coach
 * @param {number} teamId - ID de l'équipe
 * @param {Object} playerDTO - Données du joueur à ajouter
 * @returns {Promise<Object>} - Joueur ajouté
 */
export const addPlayerToTeam = async (coachId, teamId, playerDTO) => {
  const response = await api.post(endpoints.teams.coach.addPlayer(coachId, teamId), playerDTO);
  return response;
};

/**
 * [COACH] Retire un joueur d'une équipe
 * @param {number} coachId - ID du coach
 * @param {number} teamId - ID de l'équipe
 * @param {number} playerId - ID du joueur à retirer
 * @returns {Promise<void>}
 */
export const removePlayerFromTeam = async (coachId, teamId, playerId) => {
  await api.delete(endpoints.teams.coach.removePlayer(coachId, teamId, playerId));
};

/**
 * [COACH] Transfère un joueur d'une équipe à une autre
 * @param {number} coachId - ID du coach
 * @param {number} sourceTeamId - ID de l'équipe source
 * @param {number} targetTeamId - ID de l'équipe cible
 * @param {number} playerId - ID du joueur à transférer
 * @returns {Promise<Object>} - Résultat du transfert
 */
export const transferPlayer = async (coachId, sourceTeamId, targetTeamId, playerId) => {
  const response = await api.post(
    endpoints.teams.coach.transferPlayer(coachId, sourceTeamId, targetTeamId, playerId)
  );
  return response;
};

/**
 * [ORGANIZER] Récupère les équipes d'une compétition
 * @param {number} organizerId - ID de l'organisateur
 * @param {number} competitionId - ID de la compétition
 * @returns {Promise<Array>} - Liste des équipes
 */
export const getCompetitionTeamsByOrganizer = async (organizerId, competitionId) => {
  const response = await api.get(endpoints.teams.organizer.byCompetition(organizerId, competitionId));
  return response;
};

/**
 * [ORGANIZER] Récupère les coachs d'une compétition
 * @param {number} organizerId - ID de l'organisateur
 * @param {number} competitionId - ID de la compétition
 * @returns {Promise<Array>} - Liste des coachs
 */
export const getCompetitionCoaches = async (organizerId, competitionId) => {
  const response = await api.get(endpoints.teams.organizer.coaches(organizerId, competitionId));
  return response;
};

