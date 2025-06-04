package com.web.n7.serviceInterface;

import com.web.n7.dto.common.NotificationDTO;
import com.web.n7.model.users.User;

import java.util.List;

public interface NotificationService {
    
    /**
     * Envoie une notification à un utilisateur
     * @param message contenu de la notification
     * @param sender utilisateur qui envoie la notification (peut être null pour notifications système)
     * @param recipient utilisateur destinataire
     * @return la notification créée
     */
    NotificationDTO sendNotification(String message, User sender, User recipient);
    
    /**
     * Envoie une notification en lien avec une entité spécifique
     * @param message contenu de la notification
     * @param sender utilisateur qui envoie la notification (peut être null pour notifications système)
     * @param recipient utilisateur destinataire
     * @param entityType type d'entité concernée (match, compétition, équipe, etc.)
     * @param entityId identifiant de l'entité
     * @return la notification créée
     */
    NotificationDTO sendNotification(String message, User sender, User recipient, String entityType, Long entityId);
    
    /**
     * Récupère toutes les notifications d'un utilisateur
     * @param userId identifiant de l'utilisateur
     * @return liste des notifications
     */
    List<NotificationDTO> getUserNotifications(Long userId);
    
    /**
     * Récupère les notifications non lues d'un utilisateur
     * @param userId identifiant de l'utilisateur
     * @return liste des notifications non lues
     */
    List<NotificationDTO> getUnreadNotifications(Long userId);
    
    /**
     * Marque une notification comme lue
     * @param notificationId identifiant de la notification
     * @return la notification mise à jour
     */
    NotificationDTO markAsRead(Long notificationId);
    
    /**
     * Marque toutes les notifications d'un utilisateur comme lues
     * @param userId identifiant de l'utilisateur
     * @return nombre de notifications mises à jour
     */
    int markAllAsRead(Long userId);
    
    /**
     * Supprime une notification
     * @param notificationId identifiant de la notification à supprimer
     */
    void deleteNotification(Long notificationId);
    
    /**
     * Compte les notifications non lues d'un utilisateur
     * @param userId identifiant de l'utilisateur
     * @return nombre de notifications non lues
     */
    long countUnreadNotifications(Long userId);
}