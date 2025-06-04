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
public class NotificationDTO {
    private Long id;
    private String message;
    private Long senderId;
    private String senderName;
    private Long recipientId;
    private boolean isRead;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
    private String entityType;
    private Long entityId;
}