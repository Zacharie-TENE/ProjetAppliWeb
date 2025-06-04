// Utilitaires pour le formatage des dates
import { format, parseISO, isValid, formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formate une date ISO en format lisible
 * @param {string} dateString - Date au format ISO
 * @param {string} formatString - Format de date souhaité
 * @returns {string} Date formatée
 */
export const formatDate = (dateString, formatString = 'dd/MM/yyyy') => {
  if (!dateString) return '';
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Date invalide';
    return format(date, formatString, { locale: fr });
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return 'Date invalide';
  }
};

/**
 * Formate une date ISO en format date et heure
 * @param {string} dateString - Date au format ISO
 * @returns {string} Date et heure formatées
 */
export const formatDateTime = (dateString) => {
  return formatDate(dateString, 'dd/MM/yyyy HH:mm');
};

/**
 * Affiche une date relative (par ex. "il y a 3 jours")
 * @param {string} dateString - Date au format ISO
 * @returns {string} Date relative
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Date invalide';
    return formatDistance(date, new Date(), { addSuffix: true, locale: fr });
  } catch (error) {
    console.error('Erreur de formatage de date relative:', error);
    return 'Date invalide';
  }
};

/**
 * Formate une date pour les matchs (jour et heure)
 * @param {string} dateString - Date au format ISO
 * @returns {string} Date formatée pour match
 */
export const formatMatchDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Date invalide';
    
    // Format: "Dimanche 15 Sept. 2024 à 15:00"
    return format(date, "EEEE dd MMM yyyy 'à' HH:mm", { locale: fr });
  } catch (error) {
    console.error('Erreur de formatage de date de match:', error);
    return 'Date invalide';
  }
};

/**
 * Vérifie si une date est dans le futur
 * @param {string} dateString - Date au format ISO
 * @returns {boolean} Vrai si la date est dans le futur
 */
export const isFutureDate = (dateString) => {
  if (!dateString) return false;
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return false;
    return date > new Date();
  } catch (error) {
    console.error('Erreur de vérification de date future:', error);
    return false;
  }
};

/**
 * Vérifie si une date est aujourd'hui
 * @param {string} dateString - Date au format ISO
 * @returns {boolean} Vrai si la date est aujourd'hui
 */
export const isToday = (dateString) => {
  if (!dateString) return false;
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return false;
    
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  } catch (error) {
    console.error('Erreur de vérification si date est aujourd\'hui:', error);
    return false;
  }
};

/**
 * Formate une plage de dates (ex: "01/01/2024 - 31/12/2024")
 * @param {string} startDateString - Date de début au format ISO
 * @param {string} endDateString - Date de fin au format ISO
 * @returns {string} Plage de dates formatée
 */
export const formatDateRange = (startDateString, endDateString) => {
  if (!startDateString || !endDateString) return '';
  
  try {
    const startDate = formatDate(startDateString);
    const endDate = formatDate(endDateString);
    
    return `${startDate} - ${endDate}`;
  } catch (error) {
    console.error('Erreur de formatage de plage de dates:', error);
    return '';
  }
};