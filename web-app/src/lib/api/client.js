/**
 * Client API pour l'application SportApp
 * Gère les appels HTTP vers l'API REST du backend
 */

import axios from 'axios';

// Création d'une instance axios avec la configuration de base
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 secondes de timeout
});

// Interception des requêtes pour ajouter le token d'authentification
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.log("BONJOUR ")
    return Promise.reject(error);
  }
);

// Interception des réponses pour gérer les err
// eurs et le rafraîchissement du token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si l'erreur est 401 (Non autorisé) et que nous n'avons pas déjà essayé de rafraîchir le token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Essayer de rafraîchir le token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // Si pas de refreshToken, rediriger vers la page de connexion
          if (typeof window !== 'undefined') {
            // Sauvegarder l'URL actuelle pour redirection après connexion
            localStorage.setItem('redirectAfterLogin', window.location.pathname);
            // Rediriger vers la page de connexion
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }
        
        // Appel pour rafraîchir le token
        const response = await axios.post(
          `${axiosInstance.defaults.baseURL}/auth/refresh-token`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );
        
        // Si la demande de rafraîchissement réussit
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          
          // Mettre à jour le header d'autorisation pour la requête originale
          originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
          
          // Réessayer la requête originale
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Si le rafraîchissement échoue, déconnecter l'utilisateur
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        if (typeof window !== 'undefined') {
          // Sauvegarder l'URL actuelle pour redirection après connexion
          localStorage.setItem('redirectAfterLogin', window.location.pathname);
          // Rediriger vers la page de connexion
          window.location.href = '/login';
        }
      }
    }
    
    // Pour les autres erreurs, simplement les rejeter
    return Promise.reject(error);
  }
);

// Client API avec méthodes HTTP standard
const api = {
  /**
   * Effectue une requête GET
   * @param {string} url - L'URL de l'endpoint
   * @param {Object} params - Les paramètres de requête (query params)
   * @param {Object} config - Configuration axios supplémentaire
   * @returns {Promise} - La promesse de la réponse
   */
  get: async (url, params = {}, config = {}) => {
    try {
      const response = await axiosInstance.get(url, { params, ...config });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Effectue une requête POST
   * @param {string} url - L'URL de l'endpoint
   * @param {Object} data - Les données à envoyer
   * @param {Object} config - Configuration axios supplémentaire
   * @returns {Promise} - La promesse de la réponse
   */
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await axiosInstance.post(url, data, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Effectue une requête PUT
   * @param {string} url - L'URL de l'endpoint
   * @param {Object} data - Les données à envoyer
   * @param {Object} config - Configuration axios supplémentaire
   * @returns {Promise} - La promesse de la réponse
   */
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await axiosInstance.put(url, data, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Effectue une requête PATCH
   * @param {string} url - L'URL de l'endpoint
   * @param {Object} data - Les données à envoyer
   * @param {Object} config - Configuration axios supplémentaire
   * @returns {Promise} - La promesse de la réponse
   */
  patch: async (url, data = {}, config = {}) => {
    try {
      const response = await axiosInstance.patch(url, data, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Effectue une requête DELETE
   * @param {string} url - L'URL de l'endpoint
   * @param {Object} config - Configuration axios supplémentaire
   * @returns {Promise} - La promesse de la réponse
   */
  delete: async (url, config = {}) => {
    try {
      const response = await axiosInstance.delete(url, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Télécharge un fichier
   * @param {string} url - L'URL de l'endpoint
   * @param {Object} params - Les paramètres de requête
   * @returns {Promise} - La promesse de la réponse avec blob
   */
  downloadFile: async (url, params = {}) => {
    try {
      const response = await axiosInstance.get(url, {
        params,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Téléverse un fichier
   * @param {string} url - L'URL de l'endpoint
   * @param {FormData} formData - Les données du formulaire avec fichier
   * @param {Function} onUploadProgress - Callback pour suivre la progression
   * @returns {Promise} - La promesse de la réponse
   */
  uploadFile: async (url, formData, onUploadProgress = null) => {
    try {
      const response = await axiosInstance.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onUploadProgress ? 
          (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onUploadProgress(percentCompleted);
          } : undefined,
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};

/**
 * Gère les erreurs API de manière centralisée
 * @param {Error} error - L'erreur survenue
 */
const handleApiError = (error) => {
  // Si l'erreur vient d'axios et a une réponse
  if (error.response) {
    const { status, data } = error.response;
    
    // Personnaliser le message d'erreur en fonction du code d'état
    switch (status) {
      case 400:
        console.error('Erreur de requête:', data.message || 'Données invalides');
        break;
      case 401:
        console.error('Non autorisé:', data.message || 'Authentification requise');
        break;
      case 403:
        console.error('Accès refusé:', data.message || 'Vous n\'avez pas les permissions nécessaires');
        break;
      case 404:
        console.error('Non trouvé:', data.message || 'La ressource demandée n\'existe pas');
        break;
      case 409:
        console.error('Conflit:', data.message || 'La ressource existe déjà ou conflit de données');
        break;
      case 422:
        console.error('Données non traitables:', data.message || 'Les données fournies sont invalides');
        break;
      case 500:
        console.error('Erreur serveur:', data.message || 'Une erreur est survenue sur le serveur');
        break;
      default:
        console.error(`Erreur HTTP ${status}:`, data.message || 'Une erreur est survenue');
    }
    
    // Ajouter des informations supplémentaires à l'objet d'erreur
    error.statusCode = status;
    error.apiMessage = data.message || 'Une erreur est survenue';
    error.validationErrors = data.errors || [];
  } else if (error.request) {
    // La requête a été faite mais pas de réponse reçue
    console.error('Erreur de connexion:', 'Pas de réponse du serveur');
    error.apiMessage = 'Impossible de se connecter au serveur';
  } else {
    // Une erreur s'est produite lors de la configuration de la requête
    console.error('Erreur de configuration:', error.message);
    error.apiMessage = 'Erreur lors de la préparation de la requête';
  }
};

export default api;