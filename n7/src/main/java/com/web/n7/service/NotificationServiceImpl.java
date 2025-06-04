package com.web.n7.service;

import com.web.n7.dto.common.NotificationDTO;
import com.web.n7.model.users.User;
import com.web.n7.serviceInterface.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    @Override
    public NotificationDTO sendNotification(String message, User sender, User recipient) {
        return null;
    }

    @Override
    public NotificationDTO sendNotification(String message, User sender, User recipient, String entityType, Long entityId) {
        return null;
    }

    @Override
    public List<NotificationDTO> getUserNotifications(Long userId) {
        return List.of();
    }

    @Override
    public List<NotificationDTO> getUnreadNotifications(Long userId) {
        return List.of();
    }

    @Override
    public NotificationDTO markAsRead(Long notificationId) {
        return null;
    }

    @Override
    public int markAllAsRead(Long userId) {
        return 0;
    }

    @Override
    public void deleteNotification(Long notificationId) {

    }

    @Override
    public long countUnreadNotifications(Long userId) {
        return 0;
    }
}
