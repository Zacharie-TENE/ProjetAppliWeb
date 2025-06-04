// Définition des liens de navigation pour l'application SportApp
// Ces liens sont utilisés dans les différents layouts pour générer le menu de navigation

export const navigationLinks = [
  { name: 'Tableau de bord', href: '/dashboard', icon: 'dashboard' },
  { name: 'Compétitions', href: '/competitions', icon: 'trophy' },
  { name: 'Équipes', href: '/teams', icon: 'team' },
  { name: 'Joueurs', href: '/players', icon: 'user' },
  { name: 'Matchs', href: '/matches', icon: 'whistle' },
  { name: 'Médiathèque', href: '/media', icon: 'media' },
  { name: 'Profil', href: '/dashboard/profile', icon: 'profile' }
];

// Liens pour la partie publique (accessibles sans authentification)
export const publicNavigationLinks = [
  { name: 'Accueil', href: '/' },
  { name: 'Compétitions', href: '/competitions' },
  { name: 'Équipes', href: '/teams' },
  { name: 'Joueurs', href: '/players' },
  { name: 'Matchs', href: '/matches' },
  { name: 'Médiathèque', href: '/media' },
];

// Fonction pour obtenir les liens de navigation en fonction de l'utilisateur et de ses rôles
export const getNavigationLinks = (user, hasRole, userRoles) => {

  // Initialiser le tableau de liens avec les liens de base
  let links = [...navigationLinks];

  // Ajouter des liens spécifiques en fonction des rôles
  if (user && hasRole) {
    // Liens communs pour PLAYER, COACH, ORGANIZER et ADMIN
    if (hasRole(userRoles.PLAYER) || hasRole(userRoles.COACH) || hasRole(userRoles.ORGANIZER) || hasRole(userRoles.ADMIN)) {
      links.push(
        { name: 'Messagerie', href: '/dashboard/messages', icon: 'message' },
      );
    }
    
    // Liens spécifiques pour COACH
    if (hasRole(userRoles.COACH)) {
      links.push(
        { name: 'Gestion d\'équipe', href: '/dashboard/coach/teams', icon: 'manage-teams' },
        { name: 'Gestion de joueurs', href: '/dashboard/coach/players', icon: 'manage-players' },
        { name: 'Gestion de matchs', href: '/dashboard/coach/matches', icon: 'manage-matches' },
        { name: 'Gestion de compétitions', href: '/dashboard/coach/competitions', icon: 'manage-competitions' },

      );
    }
    
    // Liens spécifiques pour ORGANIZER
    if (hasRole(userRoles.ORGANIZER)) {
      links.push(
        { name: 'Gestion de compétitions', href: '/dashboard/organizer/competitions', icon: 'manage-competitions' },
        { name: 'Gestion de matchs', href: '/dashboard/organizer/matches', icon: 'manage-matches' },
        { name: 'Validation des Feuilles de Match', href: '/dashboard/organizer/match-validation', icon: 'validation-match' },
      );
    }
    
    // Liens spécifiques pour ADMIN
    if (hasRole(userRoles.ADMIN)) {
      links.push(
        { name: 'Administration', href: '/dashboard/admin', icon: 'admin' },
        { name: 'Gestion d\'utilisateurs', href: '/dashboard/admin/users', icon: 'manage-users' }
      );
    }
  }
  
  return links;
};


 
