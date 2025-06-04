package com.web.n7.filter;

import com.web.n7.model.enumeration.RecipientCategory;
import lombok.Data;

/**
     * Filtre pour les messages envoyés
     */
@Data
public class SentFilter {
        private RecipientCategory recipientCategory;
        private Long recipientId;
        private Long relatedEntityId;
        private String relatedEntityType;
        

}