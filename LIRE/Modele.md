

## Classes principales

### Utilisateurs
- **User** : Classe de base pour tous les utilisateurs
  - Attributs : id, email, password, phone, userName, firstName, lastName, role, address, profilePicture, etc.
  - Classe abstraite avec héritage

- **Player** (extends User) : Représente un joueur
- **Coach** (extends User) : Représente un entraîneur
- **Organizer** (extends User) : Représente un organisateur de compétition
- **Admin** (extends User) : Représente un administrateur

### Équipe et Compétition
- **Team** 
  - Attributs : id, name, description, logo, category, coach, players, etc.
  
- **Competition**
  - Attributs : id, name, description, type, status, startDate, endDate, registrationDeadline, location, etc.
  
- **CompetitionTeam** 
  - Relation entre Team et Competition (many-to-many)
  - Attributs : competition, team, status

- **Match**
  - Attributs : id, title, description, competition, participants, matchDate, location, homeScore, awayScore, status, etc.

- **MatchParticipant**
  - Relation entre Match et Team
  
- **PlayerParticipation**
  - Relation entre Player et Match
  
- **PlayerPerformance**
  - Statistiques de performance d'un joueur

- **TeamStanding**
  - Classement d'une équipe dans une compétition

### Communication
- **Message**
  - Messages dans le système
  
- **MessageReadStatus**
  - État de lecture des messages
  
- **Notification**
  - Notifications système

- **Media**
  - Fichiers média (images, vidéos, documents)

## Énumérations

### Utilisateur
- **Role** : USER, COACH, ORGANIZER, ADMIN, PLAYER

### Compétition
- **CompetitionType** : LEAGUE, TOURNAMENT, CUP
- **CompetitionStatus** : états de la compétition
- **CompetitionTeamStatus** : état d'une équipe dans la compétition
- **RequestType** : types de demandes
- **RequestStatus** : états des demandes

### Match
- **MatchStatus** : SCHEDULED, IN_PROGRESS, COMPLETED, POSTPONED, CANCELLED
- **MatchSheetStatus** : états des feuilles de match
- **MatchRole** : rôles pendant un match

### Joueur
- **PlayerPosition** : GOALKEEPER, DEFENDER, MIDFIELDER, FORWARD
- **PlayerStatus** : états des joueurs

### Divers
- **MediaType** : IMAGE, VIDEO, DOCUMENT
- **RecipientCategory** : catégories de destinataires
