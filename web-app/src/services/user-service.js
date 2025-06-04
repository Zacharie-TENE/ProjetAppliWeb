import api from '../lib/api/client';
import endpoints from '../lib/api/endpoints';

/**
 * Service de gestion des utilisateurs
 * Ce service permet de gérer les opérations liées aux utilisateurs comme la récupération 
 * des profils, la mise à jour des données utilisateur, etc.
 */
const userService = {
  /**
   * Récupère les informations d'un utilisateur par son identifiant
   * @param {number} userId - L'identifiant de l'utilisateur
   * @returns {Promise<Object>} - Les données de l'utilisateur
   * *utilisé unqiquement pour les admins
   */
  getUserById: async (userId) => {
    try {
      return await api.get(endpoints.users.byId(userId));
    } catch (error) {
      throw error;
    }
  },

  /**
   * Met à jour le profil de l'utilisateur connecté
   * @param {Object} profileData - Les données du profil à mettre à jour
   * @returns {Promise<Object>} - Les données mises à jour
   */
  updateProfile: async (profileData) => {
    try {
      return await api.put(endpoints.users.updateProfile, profileData);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Change le mot de passe de l'utilisateur connecté
   * @param {Object} passwordData - Objet contenant l'ancien et le nouveau mot de passe
   * @returns {Promise<Object>} - Réponse de l'API
   */
  changePassword: async (passwordData) => {
    try {
      return await api.put(endpoints.users.changePassword, passwordData);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Télécharge une nouvelle image de profil pour l'utilisateur
   * @param {File} imageFile - Le fichier image à télécharger
   * @returns {Promise<Object>} - Réponse de l'API avec l'URL de l'image
   */
  uploadProfilePicture: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', imageFile);
      
      return await api.post(endpoints.users.uploadProfilePicture, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      throw error;
    }
    },

  /**
   * Met à jour le profil d'un coach (accessible uniquement par le coach concerné)
   * @param {Object} profileData - Les données du profil à mettre à jour
   * @returns {Promise<Object>} - Les données mises à jour
   */
  updateCoachProfile: async (profileData) => {
    try {
      return await api.put(endpoints.users.profile.updateCoach, profileData);
    } catch (error) {
      throw error;
    }
  },



  /**
   * Met à jour le profil d'un organisateur (accessible uniquement par l'organisateur concerné)
   * @param {Object} profileData - Les données du profil à mettre à jour
   * @returns {Promise<Object>} - Les données mises à jour
   */
  updateOrganizerProfile: async (profileData) => {
    try {
      return await api.put(endpoints.users.profile.updateOrganizer, profileData);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupère la liste de tous les utilisateurs (fonction généralement réservée aux administrateurs)
   * @returns {Promise<Array>} - La liste des utilisateurs
   */
  getAllUsers: async () => {
    try {
      return await api.get(endpoints.users.base);
    } catch (error) {
      throw error;
    }
  }
};

export default userService;