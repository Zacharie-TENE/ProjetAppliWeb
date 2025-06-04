/**
 * Configuration des endpoints de l'API pour l'application SportApp
 * Ce fichier centralise tous les points d'entrée de l'API utilisés dans les services
 */

// Base URL de l'API
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Endpoints pour l'authentification
const authEndpoints = {
  login: `${baseUrl}/auth/login`,
  register: `${baseUrl}/auth/register`,
  forgotPassword: `${baseUrl}/auth/forgot-password`,
  resetPassword: `${baseUrl}/auth/reset-password`,
  refreshToken: `${baseUrl}/auth/refresh-token`,
  logout: `${baseUrl}/auth/logout`,
  verifyEmail: `${baseUrl}/auth/verify-email`,
  me: `${baseUrl}/auth/me`,
};

// Endpoints pour les utilisateurs
const usersEndpoints = {

  //l administrateur peut voir tous les utilisateurs
  base: `${baseUrl}/users`,
  // l objet user retourné depend de l utilisateur trouvé(user, coach, organisateur)
  byId: (id) => `${baseUrl}/users/${id}`,

  //l utilisateur peut modifier son propre profil
  updateProfile: `${baseUrl}/users/profile`,
  changePassword: `${baseUrl}/users/change-password`,
  uploadProfilePicture: `${baseUrl}/users/profile-picture`,


    profile: {
      updateCoach: `${baseUrl}/users/coach/profile`, //uniquement pour le coach
      updateOrganizer: `${baseUrl}/users/organizer/profile`, //uniquement pour l'organisateur
    } 
};

// Endpoints pour les compétitions
const competitionsEndpoints = {
  base: `${baseUrl}/competitions`,
  byId: (id) => `${baseUrl}/competitions/${id}`,
  byTeam: (teamId) => `${baseUrl}/competitions/team/${teamId}`,
  byUser: (userId) => `${baseUrl}/competitions/user/${userId}`,
  
  // Endpoints pour les organisateurs
  organizer: {
    base: (organizerId) => `${baseUrl}/competitions/organizer/${organizerId}`,
   // byId: (organizerId, competitionId) => `${baseUrl}/competitions/organizer/${organizerId}/${competitionId}`,
    create: (organizerId) => `${baseUrl}/competitions/organizer/${organizerId}`,
    update: (organizerId, competitionId) => `${baseUrl}/competitions/organizer/${organizerId}/${competitionId}`,
    delete: (organizerId, competitionId) => `${baseUrl}/competitions/organizer/${organizerId}/${competitionId}`,
    updateStatus: (organizerId, reason) => `${baseUrl}/competitions/organizer/${organizerId}/status?reason=${reason}`,
    updateTeamStatus: (organizerId, reason) => `${baseUrl}/competitions/organizer/${organizerId}/team-status?reason=${reason}`,
    processRequest: (organizerId, requestId, approved, reason) => `${baseUrl}/competitions/organizer/${organizerId}/request/${requestId}?approved=${approved}&reason=${reason}`,
    requests: (organizerId, competitionId) => `${baseUrl}/competitions/organizer/${organizerId}/competition/${competitionId}/requests`,
  
  },
  
  // Endpoints pour les coachs
  coach: {
    register: (coachId, teamId, competitionId,reason) => `${baseUrl}/competitions/coach/${coachId}/team/${teamId}/register/${competitionId}?reason=${reason}`,
    withdraw: (coachId, teamId, competitionId, reason) => `${baseUrl}/competitions/coach/${coachId}/team/${teamId}/withdraw/${competitionId}?reason=${reason}`,
    withdrawAll: (coachId, teamId, reason) => `${baseUrl}/competitions/coach/${coachId}/team/${teamId}/withdraw-all?reason=${reason}`,
    requests: (coachId) => `${baseUrl}/competitions/coach/${coachId}/requests`,
  }
};

// Endpoints pour les équipes
const teamsEndpoints = {
  base: `${baseUrl}/teams`,
  byId: (id) => `${baseUrl}/teams/${id}`,
  byCoach: (coachId) => `${baseUrl}/teams/coach/${coachId}`,
  byCompetition: (competitionId) => `${baseUrl}/teams/competition/${competitionId}`,
  byPlayer: (playerId) => `${baseUrl}/teams/player/${playerId}`,
  standings: (teamId) => `${baseUrl}/teams/${teamId}/standings`,
  competitionStandings: (competitionId) => `${baseUrl}/teams/competition/${competitionId}/standings`,
  teamCompetitionStanding: (competitionId, teamId) => `${baseUrl}/teams/competition/${competitionId}/team/${teamId}/standing`,
  
  // Endpoints pour les coachs
  coach: {
    create: (coachId) => `${baseUrl}/teams/coach/${coachId}`,
    update: (coachId) => `${baseUrl}/teams/coach/${coachId}`,
    delete: (coachId, teamId) => `${baseUrl}/teams/coach/${coachId}/team/${teamId}`,
    all: (coachId) => `${baseUrl}/teams/coach/${coachId}/all`,
    addPlayer: (coachId, teamId) => `${baseUrl}/teams/coach/${coachId}/team/${teamId}/player`,
    removePlayer: (coachId, teamId, playerId) => `${baseUrl}/teams/coach/${coachId}/team/${teamId}/player/${playerId}`,
    transferPlayer: (coachId, sourceTeamId, targetTeamId, playerId) => 
      `${baseUrl}/teams/coach/${coachId}/transfer/from/${sourceTeamId}/to/${targetTeamId}/player/${playerId}`,
  },
  
  // Endpoints pour les organisateurs
  organizer: {
    byCompetition: (organizerId, competitionId) => `${baseUrl}/teams/organizer/${organizerId}/competition/${competitionId}`,
    coaches: (organizerId, competitionId) => `${baseUrl}/teams/organizer/${organizerId}/competition/${competitionId}/coaches`,
  },
  

};

// Endpoints pour les joueurs
const playersEndpoints = {
  base: `${baseUrl}/players`,
  byId: (id) => `${baseUrl}/players/${id}`,
  performance: (playerId) => `${baseUrl}/players/${playerId}/performance`,
  
  // Endpoints pour les coachs
  coach: {
    register: (coachId, teamId) => `${baseUrl}/players/coach/${coachId}/team/${teamId}`,
    update: (coachId) => `${baseUrl}/players/coach/${coachId}`,
    remove: (coachId, playerId) => `${baseUrl}/players/coach/${coachId}/player/${playerId}`,
    all: (coachId) => `${baseUrl}/players/coach/${coachId}`,
    byTeam: (teamId,coachId,) => `${baseUrl}/players/coach/${coachId}/team/${teamId}`,
  },
  
  // Endpoints pour les organisateurs
  organizer: {
    byCompetition: (organizerId, competitionId) => `${baseUrl}/players/organizer/${organizerId}/competition/${competitionId}`,
    updatePerformance: (organizerId) => `${baseUrl}/players/organizer/${organizerId}/performance`,
  }
};

// Endpoints pour les matchs
const matchesEndpoints = {
  base: `${baseUrl}/matches/all`,
  byId: (id) => `${baseUrl}/matches/${id}`,
  
  byTeam: (teamId) => `${baseUrl}/matches/team/${teamId}`,
  byCompetition: (competitionId) => `${baseUrl}/matches/competition/${competitionId}`,
  sheets: (matchId) => `${baseUrl}/matches/${matchId}/sheets`,
  bySheet: (matchSheetId) => `${baseUrl}/matches/sheets/${matchSheetId}`,
  consolidated: (matchId) => `${baseUrl}/matches/${matchId}/consolidated`,
  teamMatch: (teamId, matchId) => `${baseUrl}/matches/team/${teamId}/match/${matchId}`,
  byPlayer: (playerId) => `${baseUrl}/matches/player/${playerId}`,
  
  // Endpoints pour les organisateurs
  organizer: {
    schedule: (organizerId) => `${baseUrl}/matches/organizer/${organizerId}`,
    updateStatus: (organizerId) => `${baseUrl}/matches/organizer/${organizerId}/status`,
    update: (organizerId) => `${baseUrl}/matches/organizer/${organizerId}`,
    updateScore: (organizerId) => `${baseUrl}/matches/organizer/${organizerId}/score`,
    updateParticipants: (organizerId, matchId) => `${baseUrl}/matches/organizer/${organizerId}/match/${matchId}/participants`,
    validateSheet: (organizerId) => `${baseUrl}/matches/organizer/${organizerId}/validate-sheet`,
  },
  
  // Endpoints pour les coachs
  coach: {
    sheets: (coachId, teamId) => `${baseUrl}/matches/coach/${coachId}/team/${teamId}/sheets`,
    allSheets: (coachId) => `${baseUrl}/matches/coach/${coachId}/sheets`,
    sheet: (coachId, matchSheetId) => `${baseUrl}/matches/coach/${coachId}/sheet/${matchSheetId}`,
    updateSheet: (coachId, matchSheetId) => `${baseUrl}/matches/coach/${coachId}/sheet/${matchSheetId}`,
  }
};

// Endpoints pour les médias
const mediaEndpoints = {
  base: `${baseUrl}/media`,
  byId: (id) => `${baseUrl}/media/${id}`,
  create: `${baseUrl}/media`,
  update: (id) => `${baseUrl}/media/${id}`,
  delete: (userId, mediaId) => `${baseUrl}/media/${userId}/${mediaId}`,
  report: (userId) => `${baseUrl}/media/${userId}/report`,
};

// Endpoints pour les messages
const messagesEndpoints = {
  base: `${baseUrl}/messages`,
  byId: (id) => `${baseUrl}/messages/${id}`,
  inbox: `${baseUrl}/messages/inbox`,
  sent: `${baseUrl}/messages/sent`,
  send: `${baseUrl}/messages`,
  read: (id) => `${baseUrl}/messages/${id}/read`,
  readAll: `${baseUrl}/messages/read-all`,
  delete: (messageId, userId) => `${baseUrl}/messages/${messageId}/${userId}`,
  recipients: `${baseUrl}/messages/recipients`,
  recipientCategories: (userRole) => `${baseUrl}/messages/recipient-categories/${userRole}`,
};

// Regroupement de tous les endpoints
const endpoints = {
  auth: authEndpoints,
  users: usersEndpoints,
  competitions: competitionsEndpoints,
  teams: teamsEndpoints,
  players: playersEndpoints,
  matches: matchesEndpoints,
  media: mediaEndpoints,
  messages: messagesEndpoints,
};

export default endpoints;