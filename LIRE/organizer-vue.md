## Structure globale de l'application - Module Organisateur

### Sections principales
1. **Tableau de bord Organisateur**
2. **Gestion des Compétitions**
3. **Gestion des Équipes Participantes**
4. **Gestion des Matchs**
5. **Validation des Feuilles de Match**

## Pages et fonctionnalités par catégorie

### 1. Tableau de bord Organisateur
- **Vue d'ensemble** avec:
  - Liste des compétitions organisées
  - Demandes d'inscription en attente
  - Feuilles de match à valider
  - Matchs prochains/en cours
  - Statistiques globales (équipes, joueurs, matchs)

### 2. Gestion des Compétitions
- **Page Liste des Compétitions**
  - Affichage de toutes les compétitions organisées (`getCompetitionsByOrganizer`)
  - Filtres par statut (en cours, à venir, terminées)
  - Bouton de création de compétition
  - Actions par compétition: voir détails, modifier, supprimer

- **Page Création de Compétition**
  - Formulaire avec champs nécessaires (`createCompetition`):
    - Nom, description, type (championnat, tournoi, coupe)
    - Dates (début, fin, limite d'inscription)
    - Localisation, catégorie, nombre maximal d'équipes
  - Prévisualisation avant création

- **Page Détails Compétition**
  - Informations complètes (`getCompetitionById`)
  - Liste des équipes participantes
  - Classement (si applicable)
  - Matchs programmés
  - Actions: modifier statut, gérer équipes, programmer matchs

- **Page Modification Compétition**
  - Formulaire pré-rempli pour `updateCompetition`
  - Option pour modifier le statut (`updateCompetitionStatus`)

- **Page Gestion des Demandes**
  - Liste des demandes d'inscription/retrait
  - Actions: approuver/refuser (`processCompetitionRequest`)
  - Formulaire pour justifier la décision

### 3. Gestion des Équipes Participantes
- **Page Équipes par Compétition**
  - Liste des équipes inscrites (`getTeamsByCompetition`)
  - Filtres par statut (actif, en attente, retiré)
  - Actions: voir détails, modifier statut

- **Page Détails Équipe**
  - Informations de l'équipe
  - Liste des joueurs (`getPlayersByCompetition`)
  - Informations du coach (`getCoachesByCompetition`)
  - Statistiques de l'équipe dans la compétition

- **Page Gestion Statut Équipe**
  - Formulaire pour modifier le statut d'une équipe (`updateTeamCompetitionStatus`)
  - Champ pour justifier le changement

### 4. Gestion des Matchs
- **Page Calendrier des Matchs**
  - Vue calendrier de tous les matchs
  - Filtres par équipe, statut, date
  - Bouton pour programmer un nouveau match

- **Page Programmation Match**
  - Formulaire complet pour `scheduleMatch`:
    - Sélection des équipes participantes
    - Date, heure, lieu
    - Tour de compétition
  - Option pour ajouter des détails supplémentaires

- **Page Détails Match**
  - Informations complètes du match
  - Option de modification des informations (`updateMatchInfo`)
  - Gestion des participants (`updateMatchParticipants`)
  - Mise à jour du score (`updateMatchScore`)
  - Changement de statut (`updateMatchStatus`)

- **Page Performances des Joueurs**
  - Tableau des performances par joueur
  - Formulaire pour mettre à jour les statistiques (`updatePlayerMatchPerformance`)
  - Visualisation des données de performance

### 5. Validation des Feuilles de Match
- **Page Feuilles de Match à Valider**
  - Liste des feuilles soumises en attente de validation
  - Filtres par équipe, compétition, date

- **Page Validation Feuille de Match**
  - Affichage complet de la feuille à valider
  - Vérification des compositions d'équipe
  - Formulaire pour commentaires et validation (`validateMatchSheet`)
  - Options: valider, rejeter avec motif


## Workflow utilisateur typique

1. L'organisateur se connecte à son tableau de bord
2. Il crée une nouvelle compétition ou gère celles existantes
3. Il traite les demandes d'inscription des équipes
4. Il programme des matchs entre les équipes participantes
5. Il valide les feuilles de match soumises par les coachs
6. Il met à jour les scores et performances des joueurs





