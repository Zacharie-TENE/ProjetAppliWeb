import api from '../lib/api/client';
import endpoints from '../lib/api/endpoints';

/**
 * Service pour la gestion des médias
 */

/**
 * Récupère un média par son identifiant
 * @param {number} id - ID du média
 * @returns {Promise<Object>} - Média trouvé
 */
export const getMediaById = async (id) => {
  const response = await api.get(endpoints.media.byId(id));
  return response;
};

/**
 * Récupère tous les médias selon les filtres spécifiés
 * @param {Object} mediaFilter - Filtres pour les médias
 * @returns {Promise<Array>} - Liste des médias
 */
export const getAllMedia = async (mediaFilter = {}) => {
  const response = await api.get(endpoints.media.base,mediaFilter);
  return response;
};

/**
 * Crée un nouveau média
 * @param {Object} mediaDTO - Données du média à créer
 * @returns {Promise<Object>} - Média créé
 */
export const createMedia = async (mediaDTO) => {
  const response = await api.post(endpoints.media.create, mediaDTO);
  return response;
};

/**
 * Met à jour un média existant
 * @param {number} id - ID du média à mettre à jour
 * @param {Object} mediaDTO - Nouvelles données du média
 * @returns {Promise<Object>} - Média mis à jour
 */
export const updateMedia = async (id, mediaDTO) => {
  const response = await api.put(endpoints.media.update(id), mediaDTO);
  return response;
};

/**
 * Supprime un média
 * @param {number} userId - ID de l'utilisateur qui effectue la suppression
 * @param {number} mediaId - ID du média à supprimer
 * @returns {Promise<void>}
 */
export const deleteMedia = async (userId, mediaId) => {
  await api.delete(endpoints.media.delete(userId, mediaId));
};

/**
 * Signale un média comme inapproprié
 * @param {number} userId - ID de l'utilisateur qui fait le signalement
 * @param {string} reason - Raison du signalement
 * @returns {Promise<void>}
 */
export const reportMedia = async (userId, reason) => {
  await api.post(endpoints.media.report(userId), { reason });
};
