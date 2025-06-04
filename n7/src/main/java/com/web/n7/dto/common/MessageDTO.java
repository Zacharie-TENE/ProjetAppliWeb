package com.web.n7.dto.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageDTO {
    private Long id;
    private String content; // Contenu du message
    private Long senderId; // ID de l'expéditeur
    private String senderRole; // Rôle de l'expéditeur (PLAYER, COACH, ORGANIZER, ADMIN)
    private List<Long> recipientIds; // Liste des IDs des destinataires
    private String recipientCategory; // Catégorie des destinataires (INDIVIDUAL, TEAM, ALL_COACHES, ALL_PLAYERS, etc.)
    private Long relatedEntityId; // ID d'une entité liée (équipe, compétition, etc.)
    private String relatedEntityType; // Type de l'entité liée (TEAM, COMPETITION, etc.)
    private LocalDateTime sentAt; // Date d'envoi
    private LocalDateTime readAt; // Date de lecture (null si non lu)
    private boolean isRead; // Statut de lecture
}