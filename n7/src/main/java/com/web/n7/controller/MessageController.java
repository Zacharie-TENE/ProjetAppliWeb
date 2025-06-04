package com.web.n7.controller;

import java.util.List;
import java.util.Map;

import com.web.n7.service.MessageServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.web.n7.dto.common.MessageDTO;
import com.web.n7.filter.InboxFilter;
import com.web.n7.filter.RecipientFilter;
import com.web.n7.filter.SentFilter;
import com.web.n7.model.enumeration.RecipientCategory;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageServiceImpl messageService;



    @PreAuthorize("isAuthenticated()")
    @GetMapping("/inbox")
    public ResponseEntity<MessageDTO> getInboxMessages(InboxFilter filter) {
        return ResponseEntity.ok(messageService.getInboxMessages(filter));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/sent")
    public ResponseEntity<MessageDTO> getSentMessages(SentFilter filter) {
        return ResponseEntity.ok(messageService.getSentMessages(filter));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{messageId}")
    public ResponseEntity<MessageDTO> getMessageById(@PathVariable Long messageId) {
        return ResponseEntity.ok(messageService.getMessageById(messageId));
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<MessageDTO> sendMessage(@RequestBody MessageDTO message) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(messageService.sendMessage(message));
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{messageId}/read")
    public ResponseEntity<Boolean> markAsRead(@PathVariable Long messageId) {
        return ResponseEntity.ok(messageService.markAsRead(messageId));
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/read-all")
    public ResponseEntity<Boolean> markAllAsRead() {
        return ResponseEntity.ok(messageService.markAllAsRead());
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{messageId}/{userId}")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable Long messageId, @PathVariable Long userId) {
        messageService.deleteMessage(messageId, userId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/recipients")
    public ResponseEntity<List<Map<String, Object>>> getPotentialRecipients(RecipientFilter filter) {
        return ResponseEntity.ok(messageService.getPotentialRecipients(filter));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/recipient-categories/{userRole}")
    public ResponseEntity<List<RecipientCategory>> getAvailableRecipientCategories(
            @PathVariable String userRole) {
        return ResponseEntity.ok(messageService.getAvailableRecipientCategories(userRole));
    }
}