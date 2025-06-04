'use client';

import { useContext, useCallback } from 'react';
import { NotificationContext } from '../context/NotificationContext';

/**
 * Hook personnalisé pour gérer les notifications de l'application
 * 
 * @returns {Object} Fonctions et état pour gérer les notifications
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotification doit être utilisé à l\'intérieur d\'un NotificationProvider');
  }
  
  const { 
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  } = context;
  
  // Fonction pour afficher une nouvelle notification
  const showNotification = useCallback(({ type = 'info', message, title, duration = 5000 }) => {
    // Cette fonction est implémentée dans le contexte de notification
    // pour afficher des messages temporaires à l'utilisateur
    if (context.showNotification) {
      context.showNotification({ type, message, title, duration });
    } else {
      console.warn('La fonction showNotification n\'est pas disponible dans le contexte');
    }
  }, [context]);
  
  // Fonction pour supprimer une notification
  const dismissNotification = useCallback((notificationId) => {
    if (context.dismissNotification) {
      context.dismissNotification(notificationId);
    } else {
      console.warn('La fonction dismissNotification n\'est pas disponible dans le contexte');
    }
  }, [context]);
  
  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    showNotification,
    dismissNotification
  };
};

export default useNotification;