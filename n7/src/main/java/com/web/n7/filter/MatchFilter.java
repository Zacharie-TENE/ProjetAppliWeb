package com.web.n7.filter;

import lombok.Data;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

@Data
public class MatchFilter {
    private String status;
    private String title;
    private String competitionName;
    private String teamName;
    private int limit;

    private Long teamId;
    private Long competitionId;
    
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDate startDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDate endDate;



}