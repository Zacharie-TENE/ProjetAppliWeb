
### 1. MatchFilter
```javascript
// Filtre pour la recherche de matchs
const MatchFilter = {
  status: String,        // Statut du match (SCHEDULED, IN_PROGRESS, COMPLETED, etc.)
  title: String,         // Titre du match pour recherche partielle
  competitionName: String, // nom de la compétition 
  teamName: String,      // Nom de l'équipe participante
  startDate: Date,       // Date de début de la période de recherche
  endDate: Date          // Date de fin de la période de recherche
  limit:int,
  teamId:int,
  competitionId:Long 
};
```

### 2. TeamFilter
```javascript
// Filtre pour la recherche d'équipes
const TeamFilter = {
  name: String,      // Nom de l'équipe (recherche partielle)
  category: String,  // Catégorie de l'équipe (JUNIOR, SENIOR, etc.)
  coachId: Long,     // ID du coach
  coachName: String  // Nom du coach (recherche partielle)
};
```

### 3. CompetitionFilter
```javascript
// Filtre pour la recherche de compétitions
const CompetitionFilter = {
  status: String,        // Statut de la compétition (UPCOMING, REGISTRATION, IN_PROGRESS, etc.)
  name: String,          // Nom de la compétition (recherche partielle)
  category: String,      // Catégorie de la compétition
  organizerName: String, // Nom de l'organisateur (recherche partielle)
  startDate: Date,       // Date de début iso striing
  endDate: Date,         // Date de fin
  createdAt: Date        // Date de création
  limit:int

};
```

### 4. MediaFilter
```javascript
// Filtre pour la recherche de médias
const MediaFilter = {
  title: String,          // Titre du média (recherche partielle)
  mediaType: String,      // Type de média (IMAGE, VIDEO, DOCUMENT)
  competitionName: Number, // ID de la compétition associée
  teamName: String,       // Nom de l'équipe associée
  matchTitle: String,     // Titre du match associé
  uploaderName: String,   // Nom de l'utilisateur qui a uploadé le média
  startDate: Date,      // Date de début pour la recherche
  endDate: Date         // Date de fin pour la recherche
};
```

### 5. RecipientFilter
```javascript
// Filtre pour la recherche de destinataires de messages
const RecipientFilter = {
  teamName: Long,         // ID de l'équipe 
  competitionName: Long,  // ID de la compétition
  targetRole: String,     // Rôle cible (PLAYER, COACH, ORGANIZER, etc.)
  search: String          // Recherche textuelle générale
};
```

### 6. SentFilter
```javascript
// Filtre pour les messages envoyés
const SentFilter = {
  recipientCategory: RecipientCategory, // Catégorie de destinataire (enum)
  recipientId: Long,                    // ID du destinataire spécifique
  relatedEntityId: Long,                // ID de l'entité associée (équipe, compétition, etc.)
  relatedEntityType: String             // Type de l'entité associée
};
```

### 7. InboxFilter
```javascript
// Filtre pour la boîte de réception des messages
const InboxFilter = {
  isRead: Boolean,                  // État de lecture (lu/non lu)
  recipientCategory: String,        // Catégorie de destinataire
  senderId: Long,                   // ID de l'expéditeur
  senderRole: String,               // Rôle de l'expéditeur
  senderRoles: Array[String],       // Liste des rôles d'expéditeur à inclure
  excludeSenderRoles: Array[String], // Liste des rôles d'expéditeur à exclure
  senderName: String,               // Nom de l'expéditeur (recherche)
  relatedEntityId: Long,            // ID de l'entité associée
  relatedEntityType: String         // Type de l'entité associée
};
```

### 8. PlayerFilters
```javascript
// Filtre pour la recherche de joueurs
const PlayerFilters = {
  userName: String,       // Nom d'utilisateur du joueur
  firstName: String,      // Prénom du joueur
  lastName: String,       // Nom de famille du joueur
  position: String,       // Position du joueur (GOALKEEPER, DEFENDER, etc.)
  status: String,         // Statut du joueur
  teamName: String,       // Nom de l'équipe du joueur (recherche partielle)
  competitionName: String // Nom de la compétition à laquelle le joueur a participé
  competitionId:Long
  teamId:long
};
```

### 9. PlayerMatchFilter
```javascript
// Filtre pour les joueurs dans un match
const PlayerMatchFilter = {
  position: String,     // Position du joueur
  status: String,       // Statut du joueur dans le match
  minGoals: Number,     // Nombre minimum de buts marqués
  hasCards: Boolean,    // Présence de cartons
  search: String        // Recherche textuelle (nom du joueur)
};
```

