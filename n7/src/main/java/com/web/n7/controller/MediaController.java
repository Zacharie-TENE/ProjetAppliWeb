package com.web.n7.controller;

import java.util.List;

import com.web.n7.service.MediaServiceImpl;
import com.web.n7.serviceInterface.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.web.n7.dto.common.MediaDTO;
import com.web.n7.filter.MediaFilter;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaServiceImpl mediaService;


    // Endpoints pour tous les utilisateurs
    @GetMapping("/{id}")
    public ResponseEntity<MediaDTO> getMediaById(@PathVariable Long id) {
        return ResponseEntity.ok(mediaService.getMediaById(id));
    }

    @GetMapping
    public ResponseEntity<List<MediaDTO>> getAllMedia(MediaFilter mediaFilter) {
        return ResponseEntity.ok(mediaService.getAllMedia(mediaFilter));
    }

    // Endpoints pour les utilisateurs authentifiés
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<MediaDTO> createMedia(@RequestBody MediaDTO mediaDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mediaService.createMedia(mediaDTO));
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{id}")
    public ResponseEntity<MediaDTO> updateMedia(
            @PathVariable Long id, @RequestBody MediaDTO mediaDTO) {
        return ResponseEntity.ok(mediaService.updateMedia(id, mediaDTO));
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{userId}/{mediaId}")
    public ResponseEntity<Void> deleteMedia(
            @PathVariable Long userId, @PathVariable Long mediaId) {
        mediaService.deleteMedia(userId, mediaId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{userId}/report")
    public ResponseEntity<Void> reportMedia(
            @PathVariable Long userId, @RequestParam String reason) {
        mediaService.reportMedia(userId, reason);
        return ResponseEntity.ok().build();
    }
}