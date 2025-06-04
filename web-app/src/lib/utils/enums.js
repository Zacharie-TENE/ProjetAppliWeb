/**
 * Statuts possibles pour un joueur dans une feuille de match
 * @enum {string}
 */
export const PlayerStatus = {
  STARTER: 'STARTER',       // Titulaire
  SUBSTITUTE: 'SUBSTITUTE', // Remplaçant
  NOT_PLAYED: 'NOT_PLAYED', // N'a pas joué
  INJURED: 'INJURED',       // Blessé pendant le match
  EXPELLED: 'EXPELLED',     // Expulsé (carton rouge)
  RESERVE: 'RESERVE'        // Réserviste
};

/**
 * Positions possibles pour un joueur
 * @enum {string}
 */
export const PlayerPosition = {
  GOALKEEPER: 'GOALKEEPER',   // Gardien de but
  DEFENDER: 'DEFENDER',       // Défenseur
  MIDFIELDER: 'MIDFIELDER',   // Milieu de terrain
  FORWARD: 'FORWARD'          // Attaquant
};

/**
 * Statuts possibles pour une feuille de match
 * @enum {string}
 */
export const MatchSheetStatus = {
  DRAFT: 'DRAFT',           // Brouillon
  SUBMITTED: 'SUBMITTED',   // Soumise
  VALIDATED: 'VALIDATED',   // Validée
  REJECTED: 'REJECTED'      // Rejetée
};

/**
 * Types d'événements possibles dans un match
 * @enum {string}
 */
export const EventType = {
  GOAL: 'GOAL',                 // But
  YELLOW_CARD: 'YELLOW_CARD',   // Carton jaune
  RED_CARD: 'RED_CARD',         // Carton rouge
  SUBSTITUTION: 'SUBSTITUTION', // Remplacement
  INJURY: 'INJURY',             // Blessure
  OTHER: 'OTHER'                // Autre
};

export const CompetitionStatus = {
    UPCOMING: 'UPCOMING',       // À venir
    REGISTRATION: 'REGISTRATION',   // Inscriptions ouvertes
    IN_PROGRESS: 'IN_PROGRESS',        // En cours
    COMPLETED: 'COMPLETED',      // Terminée
    CANCELLED: 'CANCELLED'       // Annulée
}

export const mediaType = {
    IMAGE: 'IMAGE',
    VIDEO: 'VIDEO',
    DOCUMENT: 'DOCUMENT',
}

export const CompetitionTeamStatus= {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',          
    SUSPENDED: 'SUSPENDED',
    IN_VERIFICATION: 'IN_VERIFICATION',
    REJECTED: 'REJECTED',
    DISQUALIFIED: 'DISQUALIFIED'
}

export const MatchStatus ={
    SCHEDULED:  'SCHEDULED',  // Programmé
    IN_PROGRESS:    'IN_PROGRESS',    // En cours
    COMPLETED:  'COMPLETED',  // Terminé
    POSTPONED:  'POSTPONED',  // Reporté
    CANCELLED:   'CANCELLED'   // Annulé
}