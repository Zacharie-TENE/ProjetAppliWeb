import api from '../lib/api/client';
import endpoints from '../lib/api/endpoints';

/**
 * Service pour la gestion des compétitions
 */

// Méthodes génériques pour les compétitions
/**
 * Récupère toutes les compétitions avec filtres optionnels
 * @param {Object} filter - Filtres pour les compétitions
 * @returns {Promise<Array>} - Liste des compétitions
 */
export const getAllCompetitions = async (filter = {}) => {
  const response = await api.get(endpoints.competitions.base,  filter);

  return response;
};

/**
 * Récupère une compétition par son ID
 * @param {number} competitionId - ID de la compétition
 * @returns {Promise<Object>} - Données de la compétition
 */
export const getCompetitionById = async (competitionId) => {
  const response = await api.get(endpoints.competitions.byId(competitionId));
  return response;
};

/**
 * Récupère les compétitions d'une équipe
 * @param {number} teamId - ID de l'équipe
 * @param {Object} filter - Filtres pour les compétitions
 * @returns {Promise<Array>} - Liste des compétitions
 */
export const getCompetitionsByTeamId = async (teamId, filter = {}) => {
  const response = await api.get(endpoints.competitions.byTeam(teamId), filter);
  return response;
};

/**
 * Récupère les compétitions d'un utilisateur
 * @param {number} userId - ID de l'utilisateur
 * @returns {Promise<Array>} - Liste des compétitions
 */
export const getCompetitionsByUserId = async (userId) => {
  const response = await api.get(endpoints.competitions.byUser(userId));
  return response;
};

// Méthodes pour les organisateurs
/**
 * Récupère les compétitions d'un organisateur
 * @param {number} organizerId - ID de l'organisateur
 * @param {Object} filter - Filtres pour les compétitions
 * @returns {Promise<Object>} - Réponse contenant les compétitions
 */
export const getCompetitionsByOrganizer = async (organizerId, filter = {}) => {
  const response = await api.get(endpoints.competitions.organizer.base(organizerId),  filter );
  return response;
};


/**
 * Crée une nouvelle compétition (organisateur)
 * @param {number} organizerId - ID de l'organisateur
 * @param {Object} competitionDTO - Données de la compétition
 * @returns {Promise<Object>} - Compétition créée
 */
export const createCompetition = async (organizerId, competitionDTO) => {
  const response = await api.post(endpoints.competitions.organizer.create(organizerId), competitionDTO);
  return response;
};

/**
 * Met à jour une compétition (organisateur)
 * @param {number} organizerId - ID de l'organisateur
 * @param {number} competitionId - ID de la compétition
 * @param {Object} competitionDTO - Données mises à jour de la compétition
 * @returns {Promise<Object>} - Compétition mise à jour
 */
export const updateCompetition = async (organizerId, competitionId, competitionDTO) => {
  const response = await api.put(
    endpoints.competitions.organizer.update(organizerId, competitionId), 
    competitionDTO
  );
  return response;
};

/**
 * Supprime une compétition (organisateur)
 * @param {number} organizerId - ID de l'organisateur
 * @param {number} competitionId - ID de la compétition
 * @returns {Promise<void>}
 */
export const deleteCompetition = async (organizerId, competitionId) => {
  await api.delete(endpoints.competitions.organizer.delete(organizerId, competitionId));
};

/**
 * Met à jour le statut d'une compétition (organisateur)
 * @param {number} organizerId - ID de l'organisateur
 * @param {Object} statusUpdateDTO - Données de mise à jour du statut
 * @param {string} reason - Raison du changement de statut
 * @returns {Promise<Object>} - Compétition mise à jour
 */
export const updateCompetitionStatus = async (organizerId, statusUpdateDTO, reason) => {
  const response = await api.put(
    endpoints.competitions.organizer.updateStatus(organizerId, reason), 
    { ...statusUpdateDTO }
  );
  return response;
};

/**
 * Met à jour le statut d'une équipe dans une compétition (organisateur)
 * @param {number} organizerId - ID de l'organisateur
 * @param {Object} statusUpdateDTO - Données de mise à jour du statut
 * @param {string} reason - Raison du changement de statut
 * @returns {Promise<void>}
 */
export const updateTeamCompetitionStatus = async (organizerId, statusUpdateDTO, reason) => {
  await api.put(
    endpoints.competitions.organizer.updateTeamStatus(organizerId, reason), 
    { ...statusUpdateDTO }
  );
};

/**
 * Traite une demande d'inscription à une compétition (organisateur)
 * @param {number} organizerId - ID de l'organisateur
 * @param {number} requestId - ID de la demande
 * @param {boolean} approved - Si la demande est approuvée
 * @param {string} reason - Raison de la décision
 * @returns {Promise<void>}
 */
export const processCompetitionRequest = async (organizerId, requestId, approved, reason) => {
  await api.put(
    endpoints.competitions.organizer.processRequest(organizerId, requestId,approved, reason), 
    
  );
};

/**
 * Récupère les demandes d'inscription/retrait d'une compétition pour un organisateur
 * @param {number} organizerId - ID de l'organisateur
 * @param {number} competitionId - ID de la compétition
 * @returns {Promise<Array>} - Liste des demandes
 */
export const getRequestsByCompetitionId = async (organizerId, competitionId) => {
  const response = await api.get(endpoints.competitions.organizer.requests(organizerId, competitionId));
  return response;
};

// Méthodes pour les coachs
/**
 * Demande l'inscription d'une équipe à une compétition (coach)
 * @param {number} coachId - ID du coach
 * @param {number} teamId - ID de l'équipe
 * @param {number} competitionId - ID de la compétition
 * @param {string} reason - Raison de la demande
 * @returns {Promise<Object>} - Demande d'inscription créée
 */
export const requestTeamRegistration = async (coachId, teamId, competitionId, reason) => {
  const response = await api.post(
    endpoints.competitions.coach.register(coachId, teamId, competitionId, reason), 
  );
  return response;
};

/**
 * Demande le retrait d'une équipe d'une compétition (coach)
 * @param {number} coachId - ID du coach
 * @param {number} teamId - ID de l'équipe
 * @param {number} competitionId - ID de la compétition
 * @param {string} reason - Raison de la demande
 * @returns {Promise<Object>} - Demande de retrait créée
 */
export const requestTeamWithdrawal = async (coachId, teamId, competitionId, reason) => {
  const response = await api.post(
    endpoints.competitions.coach.withdraw(coachId, teamId, competitionId,reason), 
  );
  return response;
};

/**
 * Demande le retrait d'une équipe de toutes les compétitions (coach)
 * @param {number} coachId - ID du coach
 * @param {number} teamId - ID de l'équipe
 * @param {string} reason - Raison de la demande
 * @returns {Promise<void>}
 */
export const requestTeamsWithdrawalIntoAllCompetition = async (coachId, teamId, reason) => {
  await api.post(
    endpoints.competitions.coach.withdrawAll(coachId, teamId, reason), 
 
  );
};

/**
 * Récupère les demandes d'inscription/retrait d'un coach
 * @param {number} coachId - ID du coach
 * @returns {Promise<Array>} - Liste des demandes
 */
export const getCompetitionRequestsByCoach = async (coachId) => {
  const response = await api.get(endpoints.competitions.coach.requests(coachId));
  return response;
};

