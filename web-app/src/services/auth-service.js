import api from '../lib/api/client';
import endpoints from '../lib/api/endpoints';

// Service d'authentification
const AuthService = {
  // Connexion utilisateur
  login: async (credentials) => {
    try {

      
      // En production, appel à l'API réelle
      const response = await api.post(endpoints.auth.login, credentials);
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Inscription utilisateur
  register: async (userData) => {
    try {
  
      // En production, appel à l'API réelle
      return await api.post(endpoints.auth.register, userData);
    } catch (error) {
      throw error;
    }
  },

  // Récupération du mot de passe
  forgotPassword: async (email) => {
    try {
      // En mode développement, simuler l'envoi d'email
      if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Vérifier si l'email existe
        const userExists = predefinedUsers.some(u => u.email === email);
        
        if (!userExists) {
          // Pour des raisons de sécurité, ne pas indiquer si l'email existe ou non
          return {
            success: true,
            message: "Si cet email existe dans notre système, des instructions de récupération ont été envoyées"
          };
        }
        
        return {
          success: true,
          message: "Instructions de récupération envoyées à votre adresse email"
        };
      }
      
      // En production, appel à l'API réelle
      return await api.post(endpoints.auth.forgotPassword, { email });
    } catch (error) {
      throw error;
    }
  },

  // Réinitialisation du mot de passe
  resetPassword: async (token, newPassword) => {
    try {
      return await api.post(endpoints.auth.resetPassword, { token, newPassword });
    } catch (error) {
      throw error;
    }
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    // Optionnel : appel à l'API pour invalider le token côté serveur
    return api.post(endpoints.auth.logout);
  },

  // Récupération des infos de l'utilisateur connecté
  getCurrentUser: async () => {
    try {
      // Essayer de récupérer l'utilisateur du localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }

      // Si non disponible, faire un appel API
      const response = await api.get(endpoints.auth.me);
      localStorage.setItem('user', JSON.stringify(response));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return localStorage.getItem('authToken') !== null;
  },

  // Récupérer le rôle de l'utilisateur
  getUserRole: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.role;
    }
    return null;
  },

  // Rafraîchir le token
  refreshToken: async () => {
    try {
      const response = await api.post(endpoints.auth.refreshToken);
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default AuthService;