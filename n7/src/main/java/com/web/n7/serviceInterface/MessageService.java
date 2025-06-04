package com.web.n7.serviceInterface;

import com.web.n7.dto.common.MessageDTO;
import com.web.n7.filter.InboxFilter;
import com.web.n7.filter.RecipientFilter;
import com.web.n7.filter.SentFilter;
import com.web.n7.model.enumeration.RecipientCategory;

import java.util.List;
import java.util.Map;

public interface MessageService {
    MessageDTO getInboxMessages(InboxFilter filter);
    MessageDTO getSentMessages(SentFilter filter);
    MessageDTO getMessageById(Long messageId);
    MessageDTO sendMessage(MessageDTO message);
    // Gestion des messages
    Boolean markAsRead(Long messageId);
    Boolean markAllAsRead();
    void deleteMessage(Long messageId, Long userId);

    /**
     * Récupérer les destinataires potentiels selon le rôle de l'utilisateur
     * Filtres possibles:
     * - teamId (Long): ID de l'équipe pour filtrer les destinataires
     * - competitionId (Long): ID de la compétition pour filtrer les destinataires
     * - targetRole (String): rôle cible pour filtrer les destinataires (admin uniquement)
     * - search (String): recherche textuelle sur les noms des destinataires
     *
     * @param filter objet contenant les filtres à appliquer
     * @return liste des destinataires potentiels
     */
    List<Map<String, Object>> getPotentialRecipients(RecipientFilter filter);
    List<RecipientCategory> getAvailableRecipientCategories(String userRole);
}