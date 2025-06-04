/**
 * Types et constantes pour les messages
 * Basés sur les DTOs et modèles du backend
 */

// Rôles des utilisateurs dans le système
export const USER_ROLES = {
  PLAYER: 'PLAYER',
  COACH: 'COACH',
  ORGANIZER: 'ORGANIZER',
  ADMIN: 'ADMIN'
};

// Catégories de destinataires pour les messages
export const RECIPIENT_CATEGORIES = {
  INDIVIDUAL: 'INDIVIDUAL',
  TEAM: 'TEAM',
  TEAM_WITH_COACH: 'TEAM_WITH_COACH',
  ALL_PLAYERS: 'ALL_PLAYERS',
  ALL_COACHES: 'ALL_COACHES',
  ALL_ORGANIZERS: 'ALL_ORGANIZERS',
  COMPETITION_COACHES: 'COMPETITION_COACHES',
  GLOBAL: 'GLOBAL'
};

// Types d'entités liées aux messages
export const ENTITY_TYPES = {
  TEAM: 'TEAM',
  COMPETITION: 'COMPETITION',
  MATCH: 'MATCH',
  TRAINING: 'TRAINING'
};

// Libellés français pour les rôles
export const ROLE_LABELS = {
  [USER_ROLES.PLAYER]: 'Joueur',
  [USER_ROLES.COACH]: 'Coach',
  [USER_ROLES.ORGANIZER]: 'Organisateur',
  [USER_ROLES.ADMIN]: 'Administrateur'
};

// Libellés français pour les catégories de destinataires
export const RECIPIENT_CATEGORY_LABELS = {
  [RECIPIENT_CATEGORIES.INDIVIDUAL]: 'Message individuel',
  [RECIPIENT_CATEGORIES.TEAM]: 'Équipe',
  [RECIPIENT_CATEGORIES.TEAM_WITH_COACH]: 'Équipe + Coach',
  [RECIPIENT_CATEGORIES.ALL_PLAYERS]: 'Tous les joueurs',
  [RECIPIENT_CATEGORIES.ALL_COACHES]: 'Tous les coachs',
  [RECIPIENT_CATEGORIES.ALL_ORGANIZERS]: 'Tous les organisateurs',
  [RECIPIENT_CATEGORIES.COMPETITION_COACHES]: 'Coachs de la compétition',
  [RECIPIENT_CATEGORIES.GLOBAL]: 'Message global'
};

// Couleurs pour les badges des rôles
export const ROLE_BADGE_COLORS = {
  [USER_ROLES.PLAYER]: 'primary',
  [USER_ROLES.COACH]: 'success',
  [USER_ROLES.ORGANIZER]: 'warning',
  [USER_ROLES.ADMIN]: 'error'
};

// Catégories de diffusion (broadcast)
export const BROADCAST_CATEGORIES = [
  RECIPIENT_CATEGORIES.ALL_PLAYERS,
  RECIPIENT_CATEGORIES.ALL_COACHES,
  RECIPIENT_CATEGORIES.ALL_ORGANIZERS,
  RECIPIENT_CATEGORIES.COMPETITION_COACHES,
  RECIPIENT_CATEGORIES.GLOBAL
];

/**
 * Vérifie si un message est un message de diffusion
 * @param {string} recipientCategory - Catégorie du destinataire
 * @returns {boolean}
 */
export const isBroadcastMessage = (recipientCategory) => {
  return BROADCAST_CATEGORIES.includes(recipientCategory);
};

/**
 * Obtient le libellé d'un rôle
 * @param {string} role - Rôle de l'utilisateur
 * @returns {string}
 */
export const getRoleLabel = (role) => {
  return ROLE_LABELS[role] || role;
};

/**
 * Obtient la couleur du badge pour un rôle
 * @param {string} role - Rôle de l'utilisateur
 * @returns {string}
 */
export const getRoleBadgeColor = (role) => {
  return ROLE_BADGE_COLORS[role] || 'default';
};

/**
 * Obtient le libellé d'une catégorie de destinataire
 * @param {string} category - Catégorie de destinataire
 * @param {number} recipientCount - Nombre de destinataires (pour INDIVIDUAL)
 * @returns {string}
 */
export const getRecipientCategoryLabel = (category, recipientCount = 1) => {
  if (category === RECIPIENT_CATEGORIES.INDIVIDUAL && recipientCount > 1) {
    return `${recipientCount} destinataires`;
  }
  return RECIPIENT_CATEGORY_LABELS[category] || 'Destinataires multiples';
};
