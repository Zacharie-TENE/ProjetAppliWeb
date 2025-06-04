
## Analyse des Relations JPA

Lisez attentivement les relations entre les entités du modèle du point de vue JPA (correct je sais pas, c est comme ca que j ai fait):

### Hiérarchie des utilisateurs
- **User** : Classe de base avec stratégie d'héritage JOINED (@Inheritance(strategy = InheritanceType.JOINED))
  - **Player** : Hérite de User
  - **Coach** : Hérite de User
  - **Organizer** : Hérite de User
  - **Admin** : Hérite de User

### Relations principales

1. **User**
   - Classe de base pour tous les types d'utilisateurs
   - Possède des attributs communs (email, password, etc.)
   - Utilise l'énumération Role pour définir le rôle

2. **Team** et **Player**
   - Relation OneToMany bidirectionnelle entre Team et Player
   - Un Team peut avoir plusieurs Players (team.players)
   - Un Player appartient à un seul Team (player.team)

3. **Team** et **Coach**
   - Relation ManyToOne entre Team et Coach
   - Une équipe a un seul coach (team.coach)
   - Un coach peut avoir plusieurs équipes

4. **Competition** et **Team**
   - Relation ManyToMany à travers la table d'association CompetitionTeam
   - Une compétition peut avoir plusieurs équipes (competition.competitionTeams)
   - Une équipe peut participer à plusieurs compétitions (team.competitionTeams)
   - CompetitionTeam contient le statut de l'équipe dans la compétition

5. **Competition** et **Organizer**
   - Relation ManyToOne entre Competition et Organizer
   - Une compétition a un seul organisateur (competition.organizer)
   - Un organisateur peut créer plusieurs compétitions

6. **Competition** et **Match**
   - Relation OneToMany bidirectionnelle entre Competition et Match
   - Une compétition contient plusieurs matchs (competition.matches)
   - Un match appartient à une seule compétition (match.competition)

7. **Match** et **Team**
   - Relation ManyToMany à travers la table d'association MatchParticipant
   - Un match implique deux équipes (match.participants)
   - MatchParticipant contient le rôle de l'équipe (HOME/AWAY)

8. **Match** et **MatchSheet**
   - Relation OneToMany bidirectionnelle entre Match et MatchSheet
   - Un match a plusieurs feuilles de match (match.matchSheets)
   - Une feuille de match appartient à un seul match (matchSheet.match)
   - Chaque équipe a sa propre feuille de match pour un match donné

9. **MatchSheet** et **Team**
   - Relation ManyToOne entre MatchSheet et Team
   - Une feuille de match est pour une équipe spécifique (matchSheet.team)

10. **MatchSheet** et **PlayerParticipation**
    - Relation OneToMany bidirectionnelle
    - Une feuille de match contient plusieurs participations de joueurs (matchSheet.playerParticipations)
    - Une participation de joueur est liée à une feuille de match (playerParticipation.matchSheet)

11. **Player** et **PlayerParticipation**
    - Relation OneToMany bidirectionnelle
    - Un joueur peut avoir plusieurs participations (player.participations)
    - Une participation est liée à un joueur (playerParticipation.player)

12. **Player** et **PlayerPerformance**
    - Relation OneToMany bidirectionnelle
    - Un joueur peut avoir plusieurs performances (player.performances)
    - Une performance est liée à un joueur (playerPerformance.player)

13. **Competition** et **PlayerPerformance**
    - Relation ManyToOne
    - Une performance de joueur est liée à une compétition (playerPerformance.competition)

14. **Competition** et **TeamStanding**
    - Relation OneToMany
    - Une compétition a plusieurs classements d'équipes (competition.teamStandings)
    - Un classement est lié à une compétition et une équipe (teamStanding.competition)

15. **Message** et relations
    - Un message est envoyé par un utilisateur (message.sender)
    - Un message peut avoir plusieurs destinataires (message.recipients)
    - La relation MessageReadStatus suit l'état de lecture des messages

16. **Notification** et relations
    - Une notification a un expéditeur et un destinataire (notification.sender, notification.recipient)
    - Une notification peut être liée à une entité (entityType, entityId)

17. **Media** et relations
    - Un média est téléchargé par un utilisateur (media.uploader)
    - Un média peut être lié à une compétition, un match ou une équipe

18. **CompetitionRequest** et relations
    - Une demande de compétition est faite par un coach pour une équipe et une compétition spécifiques
    - Possède un type et un statut (RequestType, RequestStatus)



### Relations détaillées
1. **User** (Classe de base abstraite)
   - Héritée par: Player, Coach, Organizer, Admin

2. **Team** - **Player** : OneToMany
   - Team (1) ------> Player (*)

3. **Team** - **Coach** : ManyToOne
   - Team (*) ------> Coach (1)

4. **Competition** - **Team** : ManyToMany (via CompetitionTeam)
   - Competition (1) ---> CompetitionTeam (*) <--- Team (1)

5. **Competition** - **Organizer** : ManyToOne
   - Competition (*) ------> Organizer (1)

6. **Competition** - **Match** : OneToMany
   - Competition (1) ------> Match (*)

7. **Match** - **Team** : ManyToMany (via MatchParticipant)
   - Match (1) ---> MatchParticipant (*) <--- Team (1)

8. **Match** - **MatchSheet** : OneToMany
   - Match (1) ------> MatchSheet (*)

9. **MatchSheet** - **PlayerParticipation** : OneToMany
   - MatchSheet (1) ------> PlayerParticipation (*)

10. **Player** - **PlayerParticipation** : OneToMany
    - Player (1) ------> PlayerParticipation (*)

11. **Player** - **PlayerPerformance** : OneToMany
    - Player (1) ------> PlayerPerformance (*)

12. **Competition** - **PlayerPerformance** : ManyToOne
    - PlayerPerformance (*) ------> Competition (1)

13. **Competition** - **TeamStanding** : OneToMany
    - Competition (1) ------> TeamStanding (*)

14. **Message** - **User** (sender) : ManyToOne
    - Message (*) ------> User (1)

15. **Message** - **User** (recipients) : ManyToMany
    - Message (*) <-----> User (*)

16. **Notification** - **User** : ManyToOne (sender et recipient)
    - Notification (*) ------> User (1) (sender)
    - Notification (*) ------> User (1) (recipient)

17. **CompetitionRequest** - **Team/Coach/Competition** : ManyToOne
    - CompetitionRequest (*) ------> Team (1)
    - CompetitionRequest (*) ------> Coach (1)
    - CompetitionRequest (*) ------> Competition (1)

