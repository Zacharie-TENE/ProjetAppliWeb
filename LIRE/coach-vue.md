# Spécifications pour l'interface frontend 

## Structure globale de l'application

### Sections principales
1. **Tableau de bord du Coach**
2. **Gestion des Équipes**
3. **Gestion des Joueurs**
4. **Gestion des Compétitions**
5. **Gestion des Feuilles de Match**

## Pages et fonctionnalités par catégorie

### 1. Tableau de bord Coach
- **Vue d'ensemble** avec:
  - Liste des équipes gérées
  - Prochains matchs
  - Notifications (demandes en cours, nouveaux matchs)
  - Accès rapide aux feuilles de match à compléter

### 2. Gestion des Équipes
- **Page Liste des Équipes**
  - Affichage de toutes les équipes (`getAllTeamsByCoach`)
  - Bouton de création d'équipe
  - Actions par équipe: voir détails, modifier, supprimer

- **Page Création d'Équipe**
  - Formulaire avec champs nécessaires pour `createTeam`
  - Redirection vers page détails après création

- **Page Détails d'Équipe**
  - Informations de l'équipe
  - Liste des joueurs de l'équipe (`getPlayersByTeam`)
  - Boutons pour modifier/supprimer l'équipe
  - Section pour ajouter de nouveaux joueurs
  - Option de transfert de joueurs entre équipes

- **Page Modification d'Équipe**
  - Formulaire pré-rempli pour `updateTeam`

### 3. Gestion des Joueurs
- **Page Liste des Joueurs**
  - Vue de tous les joueurs (`getPlayersByCoach`)
  - Filtres par équipe
  - Actions: voir détails, modifier, supprimer

- **Page Détails Joueur**
  - Informations complètes
  - Statistiques (si disponibles)
  - Options pour modifier/supprimer

- **Page Enregistrement Joueur**
  - Formulaire pour `registerPlayer`
  - Sélection d'équipe obligatoire

- **Page Modification Joueur**
  - Formulaire pré-rempli pour `updatePlayer`

### 4. Gestion des Compétitions
- **Page Compétitions Disponibles**
  - Liste des compétitions avec statut d'inscription
  - Boutons pour s'inscrire/se désinscrire

- **Page Demandes d'Inscription**
  - Liste des demandes en cours (`getCompetitionRequestsByCoach`)
  - Statut des demandes

- **Page Formulaire d'Inscription**
  - Sélection d'équipe
  - Motif d'inscription
  - Soumission via `requestTeamRegistration`

- **Page Formulaire de Retrait**
  - Sélection d'équipe et compétition
  - Motif de retrait
  - Options: retrait d'une compétition ou de toutes (`requestTeamWithdrawal`, `requestTeamsWithdrawalIntoAllCompetition`)

### 5. Gestion de Match
- **Page Liste des Feuilles de Match**
  - Vue de toutes les feuilles (`getMatchSheetsByCoach`)
  - Filtres par équipe et statut
  - Tri par date de match

- **Page Feuilles de Match par Équipe**
  - Vue filtrée (`getMatchSheetsByTeamAndCoach`)

- **Page Édition Feuille de Match**
  - Formulaire complet pour `updateMatchSheet`
  - Sélection des joueurs (titulaires/remplaçants)
  - Assignation des numéros et positions
  - Stratégie d'équipe
  - Soumission pour validation

## Navigation et relations entre pages

- Le tableau de bord doit offrir des accès directs vers toutes les sections
- Les listes doivent permettre la navigation vers les détails
- Prévoir des breadcrumbs pour faciliter la navigation
- Mettre en place une barre latérale avec les sections principales


## Workflow utilisateur

1. Le coach se connecte au tableau de bord
2. Il peut gérer ses équipes (créer, modifier, supprimer)
3. Il peut gérer les joueurs dans chaque équipe
4. Il peut inscrire/retirer ses équipes aux compétitions
5. Il peut compléter et soumettre les feuilles de match

