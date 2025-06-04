package com.web.n7.model.enumeration;

public enum RecipientCategory {
    INDIVIDUAL, // Un destinataire unique
    TEAM, // Tous les membres d'une équipe
    TEAM_WITH_COACH, // Tous les membres d'une équipe + le coach
    ALL_PLAYERS, // Tous les joueurs
    ALL_COACHES, // Tous les coachs
    ALL_ORGANIZERS, // Tous les organisateurs
    COMPETITION_COACHES, // Tous les coachs d'une compétition
    GLOBAL // Tout le monde
}