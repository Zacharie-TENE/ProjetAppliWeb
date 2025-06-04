/**
 * Utilitaires pour gérer les réponses des messages
 */

/**
 * Adapte la réponse du backend pour la rendre compatible avec le frontend
 * Gère les différents formats de réponse possible du backend
 * 
 * @param {*} response - Réponse du backend (MessageDTO, Array<MessageDTO>, ou structure paginée)
 * @returns {Object} - Structure normalisée { messages: Array, totalPages: number, total: number }
 */
export const adaptMessageResponse = (response) => {
  if (!response) {
    return {
      messages: [],
      totalPages: 1,
      total: 0
    };
  }

  // Structure paginée du contrôleur (format retourné par votre MessageController)
  if (response.data && Array.isArray(response.data) && response.total !== undefined) {
    return {
      messages: response.data,
      totalPages: response.totalPages || Math.ceil(response.total / (response.pageSize || 10)),
      total: response.total
    };
  }

  // MessageDTO unique
  if (response.id) {
    return {
      messages: [response],
      totalPages: 1,
      total: 1
    };
  }

  // Tableau de MessageDTO
  if (Array.isArray(response)) {
    return {
      messages: response,
      totalPages: 1,
      total: response.length
    };
  }

  // Format inconnu
  return {
    messages: [],
    totalPages: 1,
    total: 0
  };
};

/**
 * Compte les messages non lus dans une réponse du backend
 * 
 * @param {*} response - Réponse du backend
 * @returns {number} - Nombre de messages non lus
 */
export const countUnreadMessages = (response) => {
  if (!response) {
    return 0;
  }

  // Structure paginée avec total
  if (response.total !== undefined) {
    return response.total;
  }

  // MessageDTO unique
  if (response.id) {
    return response.isRead ? 0 : 1;
  }

  // Tableau de MessageDTO
  if (Array.isArray(response)) {
    return response.filter(msg => !msg.isRead).length;
  }

  return 0;
};
