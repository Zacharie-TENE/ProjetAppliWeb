package com.web.n7.filter;

import com.web.n7.model.enumeration.RecipientCategory;
import lombok.Data;

import java.util.List;

@Data
public class InboxFilter {
        private Boolean isRead;
        private RecipientCategory recipientCategory;
        private Long senderId;
        private String senderRole;
        private List<String> senderRoles;
        private List<String> excludeSenderRoles;
        private Boolean isPlatformMessage;
        private String senderName;
        private Long relatedEntityId;
        private String relatedEntityType;
        
        // Constructeurs, getters et setters
    }