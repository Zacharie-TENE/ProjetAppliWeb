package com.web.n7.serviceInterface;

import com.web.n7.dto.common.MediaDTO;
import com.web.n7.filter.MediaFilter;

import java.util.List;

public interface MediaService {
    // Récupération des médias
    MediaDTO getMediaById(Long id);
    List<MediaDTO> getAllMedia(MediaFilter mediaFilter);
    // Opérations CRUD (pour utilisateurs autorisés)
    MediaDTO createMedia(MediaDTO mediaDTO);
    MediaDTO updateMedia(Long id, MediaDTO mediaDTO);
    void deleteMedia(Long userId, Long mediaId);
    void reportMedia(Long userId, String reason);
}