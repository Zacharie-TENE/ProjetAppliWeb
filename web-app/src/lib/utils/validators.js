// Utilitaires pour la validation des données

/**
 * Vérifie si une chaîne est vide
 * @param {string} value - Valeur à vérifier
 * @returns {boolean} Vrai si la chaîne est vide
 */
export const isEmpty = (value) => {
  return value === undefined || value === null || value.trim() === '';
};

/**
 * Valide un email
 * @param {string} email - Email à valider
 * @returns {boolean} Vrai si l'email est valide
 */
export const isValidEmail = (email) => {
  if (isEmpty(email)) return false;
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

/**
 * Vérifie la longueur minimale d'une chaîne
 * @param {string} value - Valeur à vérifier
 * @param {number} minLength - Longueur minimale
 * @returns {boolean} Vrai si la chaîne a au moins la longueur minimale
 */
export const hasMinLength = (value, minLength) => {
  if (isEmpty(value)) return false;
  return value.length >= minLength;
};

/**
 * Vérifie la longueur maximale d'une chaîne
 * @param {string} value - Valeur à vérifier
 * @param {number} maxLength - Longueur maximale
 * @returns {boolean} Vrai si la chaîne ne dépasse pas la longueur maximale
 */
export const hasMaxLength = (value, maxLength) => {
  if (isEmpty(value)) return true;
  return value.length <= maxLength;
};

/**
 * Vérifie si un mot de passe est fort
 * @param {string} password - Mot de passe à vérifier
 * @returns {boolean} Vrai si le mot de passe est fort
 */
export const isStrongPassword = (password) => {
  if (isEmpty(password)) return false;
  
  // Au moins 8 caractères, incluant une majuscule, une minuscule, un chiffre et un caractère spécial
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

/**
 * Vérifie si deux valeurs sont identiques
 * @param {*} value1 - Première valeur
 * @param {*} value2 - Deuxième valeur
 * @returns {boolean} Vrai si les valeurs sont identiques
 */
export const isEqual = (value1, value2) => {
  return value1 === value2;
};

/**
 * Vérifie si une valeur est un nombre
 * @param {*} value - Valeur à vérifier
 * @returns {boolean} Vrai si la valeur est un nombre
 */
export const isNumber = (value) => {
  if (isEmpty(value)) return false;
  return !isNaN(Number(value));
};

/**
 * Vérifie si une valeur est un entier positif
 * @param {*} value - Valeur à vérifier
 * @returns {boolean} Vrai si la valeur est un entier positif
 */
export const isPositiveInteger = (value) => {
  if (!isNumber(value)) return false;
  const num = Number(value);
  return Number.isInteger(num) && num > 0;
};

/**
 * Vérifie si une date est valide
 * @param {string} dateString - Date au format YYYY-MM-DD
 * @returns {boolean} Vrai si la date est valide
 */
export const isValidDate = (dateString) => {
  if (isEmpty(dateString)) return false;
  
  // La date doit être au format YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  // Vérifier que la date est valide
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

/**
 * Valide la plage de dates (date de début < date de fin)
 * @param {string} startDate - Date de début au format YYYY-MM-DD
 * @param {string} endDate - Date de fin au format YYYY-MM-DD
 * @returns {boolean} Vrai si la plage de dates est valide
 */
export const isValidDateRange = (startDate, endDate) => {
  if (!isValidDate(startDate) || !isValidDate(endDate)) return false;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return start < end;
};

/**
 * Valide un numéro de téléphone
 * @param {string} phone - Numéro de téléphone à valider
 * @returns {boolean} Vrai si le numéro de téléphone est valide
 */
export const isValidPhone = (phone) => {
  if (isEmpty(phone)) return false;
  
  // Format international avec espaces, tirets ou points autorisés
  const regex = /^(\+\d{1,3}[- ]?)?\d{9,15}$/;
  return regex.test(phone.replace(/[\s.-]/g, ''));
};

/**
 * Valide un URL
 * @param {string} url - URL à valider
 * @returns {boolean} Vrai si l'URL est valide
 */
export const isValidUrl = (url) => {
  if (isEmpty(url)) return false;
  
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};