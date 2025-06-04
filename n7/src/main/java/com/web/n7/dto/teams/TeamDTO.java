package com.web.n7.dto.teams;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TeamDTO {
    private Long id;
    private String name;
    private String description;
    private String logo;
    private String category;
    private Long coachId;
    private String coachName;
    private Integer playerCount;
    private Integer competitionCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}