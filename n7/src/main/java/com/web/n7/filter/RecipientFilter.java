package com.web.n7.filter;

import lombok.Data;

/**
     * Filtre pour la recherche de destinataires
     */
@Data
public class RecipientFilter {
        private String teamName;
        private String competitionName;
        private String targetRole;
        private String search;
        
        // Constructeurs, getters et setters
    }