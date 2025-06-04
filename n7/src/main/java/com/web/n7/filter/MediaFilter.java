package com.web.n7.filter;

import java.time.LocalDateTime;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;

@Data
public class MediaFilter {
    private String title;         // Filtre sur le titre du média
    private String mediaType;     // Filtre sur le type de média
    private Integer competitionName; // Filtre sur le nom de la compétition
    private String teamName;      // Filtre sur le nom de l'équipe
    private String matchTitle ; //titre du match
    private String uploaderName;  // Filtre sur le nom de l'uploader
     
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime startDate;     // Filtre sur la date de début
    
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime endDate;       // Filtre sur la date de fin
}
