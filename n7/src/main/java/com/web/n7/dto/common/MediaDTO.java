package com.web.n7.dto.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MediaDTO {
    private Long id;
    private String title;
    private String url;
    private String description;
    private String mediaType; // VIDEO, IMAGE, DOCUMENT
    private Long uploaderId;
    private String uploaderName;
    private String uploaderRole;
    private Long competitionId;
    private String competitionName;
    private Long matchId;
    private String matchTitle;
    private Long teamId;
    private String teamName;
    private LocalDateTime uploadedAt;
    private Integer viewCount;
}