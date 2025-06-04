package com.web.n7.repository;

import com.web.n7.model.Message;
import com.web.n7.model.MessageReadStatus;
import com.web.n7.model.users.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageReadStatusRepository extends JpaRepository<MessageReadStatus, Long> {
    
    Optional<MessageReadStatus> findByMessageAndUser(Message message, User user);
    
    List<MessageReadStatus> findByMessage(Message message);
    
    List<MessageReadStatus> findByUser(User user);
    
    @Query("SELECT mrs FROM MessageReadStatus mrs WHERE mrs.user = :user AND mrs.isRead = false")
    List<MessageReadStatus> findUnreadMessagesByUser(@Param("user") User user);
    
    @Modifying
    @Query("UPDATE MessageReadStatus mrs SET mrs.isRead = true WHERE mrs.user = :user")
    void markAllAsReadForUser(@Param("user") User user);
} 