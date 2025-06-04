import api from '../lib/api/client';
import endpoints from '../lib/api/endpoints';

/**
 * Service de gestion des messages
 */

/**
 * Transforme les paramètres de tableau pour éviter les crochets dans l'URL
 * Spring Boot peut accepter des paramètres multiples avec le même nom sans crochets
 * @param {Object} params - Paramètres originaux
 * @returns {URLSearchParams} - Paramètres transformés en format URLSearchParams
 */
const transformArrayParameters = (params) => {
  const searchParams = new URLSearchParams();
  
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      // Pour les tableaux, ajouter chaque valeur avec le même nom de paramètre
      // Cela génère senderRoles=SYSTEM&senderRoles=ADMIN au lieu de senderRoles[]=...
      value.forEach(item => {
        if (item !== undefined && item !== null) {
          searchParams.append(key, item);
        }
      });
    } else if (value !== undefined && value !== null) {
      searchParams.append(key, value);
    }
  }
  
  return searchParams;
};

/**
 * Récupère les messages de la boîte de réception selon les filtres spécifiés
 * @param {Object} filter - Filtres pour la boîte de réception
 * @returns {Promise<Object>} - Messages de la boîte de réception
 */
export const getInboxMessages = async (filter = {}) => {
  // Transformer les paramètres de tableau pour éviter les crochets dans l'URL
  const processedFilter = transformArrayParameters(filter);
  const response = await api.get(endpoints.messages.inbox, processedFilter);
  return response.data;
};

/**
 * Récupère les messages envoyés selon les filtres spécifiés
 * @param {Object} filter - Filtres pour les messages envoyés
 * @returns {Promise<Object>} - Messages envoyés
 */
export const getSentMessages = async (filter = {}) => {
  const processedFilter = transformArrayParameters(filter);
  const response = await api.get(endpoints.messages.sent, processedFilter);
  return response.data;
};

/**
 * Récupère un message spécifique par son ID
 * @param {number} messageId - ID du message
 * @returns {Promise<Object>} - Message trouvé
 */
export const getMessageById = async (messageId) => {
  const response = await api.get(endpoints.messages.byId(messageId));
  return response.data;
};

/**
 * Envoie un nouveau message
 * @param {Object} message - Données du message à envoyer
 * @returns {Promise<Object>} - Message envoyé
 */
export const sendMessage = async (message) => {
  const response = await api.post(endpoints.messages.send, message);
  return response.data;
};

/**
 * Marque un message comme lu
 * @param {number} messageId - ID du message à marquer comme lu
 * @returns {Promise<boolean>} - Status de l'opération
 */
export const markAsRead = async (messageId) => {
  const response = await api.put(endpoints.messages.read(messageId));
  return response.data;
};

/**
 * Marque tous les messages comme lus
 * @returns {Promise<boolean>} - Status de l'opération
 */
export const markAllAsRead = async () => {
  const response = await api.put(endpoints.messages.readAll);
  return response.data;
};

/**
 * Supprime un message
 * @param {number} messageId - ID du message à supprimer
 * @param {number} userId - ID de l'utilisateur
 * @returns {Promise<void>}
 */
export const deleteMessage = async (messageId, userId) => {
  await api.delete(endpoints.messages.delete(messageId, userId));
};

/**
 * Récupère la liste des destinataires potentiels selon les filtres spécifiés
 * @param {Object} filter - Filtres pour les destinataires
 * @returns {Promise<Array>} - Liste des destinataires potentiels
 */
export const getPotentialRecipients = async (filter = {}) => {
  const processedFilter = transformArrayParameters(filter);
  const response = await api.get(endpoints.messages.recipients, processedFilter);
  // Adapter les données reçues du backend pour inclure le champ 'name'
  const recipients = response.data || [];
  return recipients.map(recipient => ({
    ...recipient,
    name: `${recipient.firstName || ''} ${recipient.lastName || ''}`.trim() || recipient.userName || 'Utilisateur inconnu'
  }));
};

/**
 * Récupère les catégories de destinataires disponibles pour un rôle utilisateur spécifique
 * @param {string} userRole - Rôle de l'utilisateur
 * @returns {Promise<Array>} - Liste des catégories de destinataires
 */
export const getAvailableRecipientCategories = async (userRole) => {
  const response = await api.get(endpoints.messages.recipientCategories(userRole));
  return response.data;
};
