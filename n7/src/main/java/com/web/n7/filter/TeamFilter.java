package com.web.n7.filter;

import lombok.Data;

@Data
public class TeamFilter {
    private String name;        // Filtrage par nom d'équipe
    private String category;    // Filtrage par catégorie d'équipe
    private String coachName;   // Filtrage par nom du coach
}