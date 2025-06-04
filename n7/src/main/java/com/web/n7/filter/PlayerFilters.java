package com.web.n7.filter;

import lombok.Data;

@Data
public class PlayerFilters {
    private String userName;     // Filtre sur le nom d'utilisateur
    private String firstName;    // Filtre sur le prénom
    private String lastName;     // Filtre sur le nom de famille
    private String position;     // Filtre sur la position du joueur
    private String status;       // Filtre sur le statut du joueur
    private String teamName;     // Filtre sur le nom de l'équipe (recherche partielle)
    private String competitionName; //filtre nom de competition (competition auquel le jouer a participe)
    private Long competitionId; //filtre id de competition (competition auquel le jouer a participe)
    private Long teamId; //filtre id de l'equipe (equipe auquel le jouer a jouer)
}