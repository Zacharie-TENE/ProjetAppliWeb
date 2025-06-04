
### Énumérations générales
```javascript
// Role - Rôles des utilisateurs
const Role = {
  USER: "USER",
  COACH: "COACH",
  ORGANIZER: "ORGANIZER",
  ADMIN: "ADMIN",
  PLAYER: "PLAYER"
};

// MediaType - Types de médias
const MediaType = {
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
  DOCUMENT: "DOCUMENT"
};

// RecipientCategory - Catégories de destinataires pour les messages
const RecipientCategory = {
  INDIVIDUAL: "INDIVIDUAL",         // Un destinataire unique
  TEAM: "TEAM",                     // Tous les membres d'une équipe
  TEAM_WITH_COACH: "TEAM_WITH_COACH", // Tous les membres d'une équipe + le coach
  ALL_PLAYERS: "ALL_PLAYERS",       // Tous les joueurs
  ALL_COACHES: "ALL_COACHES",       // Tous les coachs
  ALL_ORGANIZERS: "ALL_ORGANIZERS", // Tous les organisateurs
  COMPETITION_COACHES: "COMPETITION_COACHES", // Tous les coachs d'une compétition
  GLOBAL: "GLOBAL"                  // Tout le monde
};
```

### Énumérations liées aux matchs
```javascript
// MatchStatus - État d'un match
const MatchStatus = {
  SCHEDULED: "SCHEDULED",     // Programmé
  IN_PROGRESS: "IN_PROGRESS", // En cours
  COMPLETED: "COMPLETED",     // Terminé
  POSTPONED: "POSTPONED",     // Reporté
  CANCELLED: "CANCELLED"      // Annulé
};

// MatchSheetStatus - État d'une feuille de match
const MatchSheetStatus = {
  VALIDATED: "VALIDATED",     // Validée
  UNVALIDATED: "UNVALIDATED", // Non validée
  ONGOING: "ONGOING",         // En cours
  SUBMITTED: "SUBMITTED"      // Soumise
};

// MatchRole - Rôle d'une équipe dans un match
const MatchRole = {
  HOME: "HOME", // Équipe à domicile
  AWAY: "AWAY"  // Équipe à l'extérieur
};
```

### Énumérations liées aux joueurs
```javascript
// PlayerPosition - Position d'un joueur
const PlayerPosition = {
  GOALKEEPER: "GOALKEEPER", // Gardien de but
  DEFENDER: "DEFENDER",     // Défenseur
  MIDFIELDER: "MIDFIELDER", // Milieu de terrain
  FORWARD: "FORWARD"        // Attaquant
};

// PlayerStatus - Statut d'un joueur lors d'un match
const PlayerStatus = {
  STARTER: "STARTER",       // Titulaire
  SUBSTITUTE: "SUBSTITUTE", // Remplaçant
  NOT_PLAYED: "NOT_PLAYED", // N'a pas joué
  INJURED: "INJURED",       // Blessé pendant le match
  EXPELLED: "EXPELLED",     // Expulsé (carton rouge)
  RESERVE: "RESERVE"        // Réserve
};
```

### Énumérations liées aux compétitions
```javascript
// CompetitionType - Type de compétition
const CompetitionType = {
  LEAGUE: "LEAGUE",         // Championnat
  TOURNAMENT: "TOURNAMENT", // Tournoi
  CUP: "CUP"                // Coupe
};

// CompetitionStatus - État d'une compétition
const CompetitionStatus = {
  UPCOMING: "UPCOMING",         // À venir
  REGISTRATION: "REGISTRATION", // Inscriptions ouvertes
  IN_PROGRESS: "IN_PROGRESS",   // En cours
  COMPLETED: "COMPLETED",       // Terminée
  CANCELLED: "CANCELLED"        // Annulée
};

// CompetitionTeamStatus - État d'une équipe dans une compétition
const CompetitionTeamStatus = {
  ACTIVE: "ACTIVE",             // Active
  SUSPENDED: "SUSPENDED",       // Suspendue
  DISQUALIFIED: "DISQUALIFIED"  // Disqualifiée
};

// RequestStatus - État d'une demande
const RequestStatus = {
  PENDING: "PENDING",   // En attente de traitement
  APPROVED: "APPROVED", // Approuvée 
  REJECTED: "REJECTED"  // Rejetée
};

// RequestType - Type de demande
const RequestType = {
  REGISTRATION: "REGISTRATION", // Inscription d'une équipe
  WITHDRAWAL: "WITHDRAWAL"      // Retrait d'une équipe
};
```

