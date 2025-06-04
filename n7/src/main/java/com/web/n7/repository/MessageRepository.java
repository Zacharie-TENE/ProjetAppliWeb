package com.web.n7.repository;

import com.web.n7.model.Message;
import com.web.n7.model.users.User;
import com.web.n7.model.enumeration.RecipientCategory;
import com.web.n7.model.enumeration.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    List<Message> findBySender(User sender);
    
    @Query("SELECT m FROM Message m JOIN m.recipients r WHERE r = :recipient")
    List<Message> findByRecipient(@Param("recipient") User recipient);
    
    @Query("SELECT m FROM Message m WHERE m.senderRole = :role")
    List<Message> findBySenderRole(@Param("role") Role role);
    
    @Query("SELECT m FROM Message m WHERE m.relatedEntityId = :entityId AND m.relatedEntityType = :entityType")
    List<Message> findByRelatedEntity(@Param("entityId") Long entityId, @Param("entityType") String entityType);
    
    @Query("SELECT m FROM Message m JOIN m.recipients r WHERE r = :user AND m.recipientCategory = :category")
    List<Message> findByRecipientAndCategory(@Param("user") User user, @Param("category") String category);
    
    @Query("SELECT DISTINCT m FROM Message m JOIN m.recipients r WHERE r = :user")
    List<Message> findAllInbox(@Param("user") User user);
}