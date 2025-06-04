// Utilitaires pour le formatage des données

/**
 * Limite la longueur d'une chaîne et ajoute "..." si nécessaire
 * @param {string} text - Texte à formater
 * @param {number} maxLength - Longueur maximale
 * @returns {string} Texte formaté
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Formate un prix en euros
 * @param {number} amount - Montant à formater
 * @returns {string} Montant formaté
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

/**
 * Formate un nombre avec séparateur de milliers
 * @param {number} number - Nombre à formater
 * @returns {string} Nombre formaté
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined) return '';
  return new Intl.NumberFormat('fr-FR').format(number);
};

/**
 * Capitalise la première lettre d'une chaîne
 * @param {string} text - Texte à formater
 * @returns {string} Texte formaté
 */
export const capitalizeFirstLetter = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Capitalise toutes les premières lettres des mots
 * @param {string} text - Texte à formater
 * @returns {string} Texte formaté
 */
export const capitalizeWords = (text) => {
  if (!text) return '';
  return text
    .split(' ')
    .map(word => capitalizeFirstLetter(word))
    .join(' ');
};

/**
 * Formate un pourcentage
 * @param {number} value - Valeur à formater
 * @param {number} decimals - Nombre de décimales
 * @returns {string} Pourcentage formaté
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '';
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formate une durée en minutes en format "h:mm"
 * @param {number} minutes - Durée en minutes
 * @returns {string} Durée formatée
 */
export const formatDuration = (minutes) => {
  if (!minutes && minutes !== 0) return '';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  return `${hours}:${mins.toString().padStart(2, '0')}`;
};

/**
 * Formate un statut en français
 * @param {string} status - Statut à formater
 * @returns {string} Statut formaté
 */
export const formatStatus = (status) => {
  if (!status) return '';
  
  const statusMap = {
    // Statuts de match
    'SCHEDULED': 'Programmé',
    'IN_PROGRESS': 'En cours',
    'COMPLETED': 'Terminé',
    'POSTPONED': 'Reporté',
    'CANCELLED': 'Annulé',
    
    // Statuts de feuille de match
    'DRAFT': 'Brouillon',
    'SUBMITTED': 'Soumise',
    'VALIDATED': 'Validée',
    'UNVALIDATED': 'Non validée',
    
    // Statuts de joueur
    'ACTIVE': 'Actif',
    'INJURED': 'Blessé',
    'SUSPENDED': 'Suspendu',
    'INACTIVE': 'Inactif',
    
    // Statuts de compétition
    'UPCOMING': 'À venir',
    'IN_PROGRESS': 'En cours',
    'COMPLETED': 'Terminée',
    'CANCELLED': 'Annulée',
    
    // Type de compétition
    'LEAGUE': 'Championnat',
    'TOURNAMENT': 'Tournoi',
    'CUP': 'Coupe',
    
    // Catégories
    'SENIOR': 'Senior',
    'JUNIOR': 'Junior',
    'VETERAN': 'Vétéran',
    
    // Positions
    'GOALKEEPER': 'Gardien',
    'DEFENDER': 'Défenseur',
    'MIDFIELDER': 'Milieu',
    'FORWARD': 'Attaquant',
    
    // Rôles match
    'HOME': 'Domicile',
    'AWAY': 'Extérieur',
    
    // Types de médias
    'VIDEO': 'Vidéo',
    'IMAGE': 'Image',
    'DOCUMENT': 'Document',
    
    // Rôles utilisateur
    'PLAYER': 'Joueur',
    'COACH': 'Entraîneur',
    'ADMIN': 'Administrateur',
    'ORGANIZER': 'Organisateur',
    'USER': 'Utilisateur'
  };
  
  return statusMap[status] || status;
};

/**
 * Formate un nom de joueur (prénom + nom)
 * @param {string} firstName - Prénom
 * @param {string} lastName - Nom
 * @returns {string} Nom complet
 */
export const formatPlayerName = (firstName, lastName) => {
  if (!firstName && !lastName) return '';
  if (!firstName) return lastName;
  if (!lastName) return firstName;
  
  return `${firstName} ${lastName}`;
};

/**
 * Formate une note sur 10
 * @param {number} rating - Note
 * @returns {string} Note formatée
 */
export const formatRating = (rating) => {
  if (rating === null || rating === undefined) return 'N/A';
  return rating.toFixed(1) + '/10';
};