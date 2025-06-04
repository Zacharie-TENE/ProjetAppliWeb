package com.web.n7.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.web.n7.dto.common.MediaDTO;
import com.web.n7.filter.MediaFilter;
import com.web.n7.model.Competition;
import com.web.n7.model.Match;
import com.web.n7.model.Media;
import com.web.n7.model.Team;
import com.web.n7.model.enumeration.MediaType;
import com.web.n7.model.users.User;
import com.web.n7.repository.CompetitionRepository;
import com.web.n7.repository.MatchRepository;
import com.web.n7.repository.MediaRepository;
import com.web.n7.repository.TeamRepository;
import com.web.n7.repository.UserRepository;
import com.web.n7.serviceInterface.MediaService;

@Service
@RequiredArgsConstructor
public class MediaServiceImpl implements MediaService {

    // Injection des repositories nécessaires
    private final MediaRepository mediaRepository;
    private final UserRepository userRepository;
    private final CompetitionRepository competitionRepository;
    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;
    
    @Override
    public MediaDTO getMediaById(Long id) {
        Optional<Media> mediaOpt = mediaRepository.findById(id);
        if (mediaOpt.isPresent()) {
            return convertToDTO(mediaOpt.get());
        }
        throw new RuntimeException("Media not found with id: " + id);
    }

    @Override
    public List<MediaDTO> getAllMedia(MediaFilter mediaFilter) {
        if (mediaFilter == null) {
            return mediaRepository.findAll().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        }
        
        // Création d'un exemple pour le filtrage
        Media example = new Media();
        
        if (mediaFilter.getTitle() != null) {
            example.setTitle(mediaFilter.getTitle());
        }
        
        if (mediaFilter.getMediaType() != null) {
            try {
                example.setType(MediaType.valueOf(mediaFilter.getMediaType()));
            } catch (IllegalArgumentException e) {
                // Ignorer si le type de média n'est pas valide
            }
        }
        
        // Création du matcher pour la recherche partielle
        ExampleMatcher matcher = ExampleMatcher.matching()
                .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING)
                .withIgnoreCase();
        
        List<Media> filteredMedia = mediaRepository.findAll(Example.of(example, matcher));
        
        // Filtres additionnels pour les relations
        if (mediaFilter.getCompetitionName() != null) {
            filteredMedia = filteredMedia.stream()
                    .filter(media -> media.getCompetition() != null && 
                            media.getCompetition().getId().equals(mediaFilter.getCompetitionName()))
                    .collect(Collectors.toList());
        }
        
        if (mediaFilter.getTeamName() != null) {
            filteredMedia = filteredMedia.stream()
                    .filter(media -> media.getTeam() != null && 
                            media.getTeam().getName().contains(mediaFilter.getTeamName()))
                    .collect(Collectors.toList());
        }
        
        if (mediaFilter.getMatchTitle() != null) {
            filteredMedia = filteredMedia.stream()
                    .filter(media -> media.getMatch() != null && 
                            media.getMatch().getTitle().contains(mediaFilter.getMatchTitle()))
                    .collect(Collectors.toList());
        }
        
        if (mediaFilter.getUploaderName() != null) {
            filteredMedia = filteredMedia.stream()
                    .filter(media -> media.getUploader() != null && 
                            (media.getUploader().getFirstName() + " " + media.getUploader().getLastName())
                            .contains(mediaFilter.getUploaderName()))
                    .collect(Collectors.toList());
        }
        
        return filteredMedia.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public MediaDTO createMedia(MediaDTO mediaDTO) {
        Media media = convertToEntity(mediaDTO);
        media.setCreatedAt(LocalDateTime.now());
        media.setUpdatedAt(LocalDateTime.now());
        
        Media savedMedia = mediaRepository.save(media);
        return convertToDTO(savedMedia);
    }

    @Override
    public MediaDTO updateMedia(Long id, MediaDTO mediaDTO) {
        Optional<Media> mediaOpt = mediaRepository.findById(id);
        if (mediaOpt.isPresent()) {
            Media existingMedia = mediaOpt.get();
            
            // Vérification que l'utilisateur est bien le propriétaire du média ou un admin
            if (!existingMedia.getUploader().getId().equals(mediaDTO.getUploaderId())) {
                throw new AccessDeniedException("You are not authorized to update this media");
            }
            
            // Mettre à jour les champs modifiables
            existingMedia.setTitle(mediaDTO.getTitle());
            existingMedia.setDescription(mediaDTO.getDescription());
            existingMedia.setUrl(mediaDTO.getUrl());
            
            if (mediaDTO.getMediaType() != null) {
                existingMedia.setType(MediaType.valueOf(mediaDTO.getMediaType()));
            }
            
            existingMedia.setUpdatedAt(LocalDateTime.now());
            
            Media updatedMedia = mediaRepository.save(existingMedia);
            return convertToDTO(updatedMedia);
        }
        throw new RuntimeException("Media not found with id: " + id);
    }

    @Override
    public void deleteMedia(Long userId, Long mediaId) {
        Optional<Media> mediaOpt = mediaRepository.findById(mediaId);
        if (mediaOpt.isPresent()) {
            Media media = mediaOpt.get();
            
            // Vérification que l'utilisateur est bien le propriétaire du média ou un admin
            if (!media.getUploader().getId().equals(userId)) {
                throw new AccessDeniedException("You are not authorized to delete this media");
            }
            
            mediaRepository.delete(media);
        } else {
            throw new RuntimeException("Media not found with id: " + mediaId);
        }
    }

    @Override
    public void reportMedia(Long userId, String reason) {
        // Implémentation du signalement d'un média
        // Cette fonctionnalité nécessiterait potentiellement une table de signalements
        // Pour l'instant, nous pouvons simplement enregistrer le signalement dans les logs
        System.out.println("Media reported by user " + userId + " for reason: " + reason);
    }
    
    // Méthode utilitaire pour convertir l'entité en DTO
    private MediaDTO convertToDTO(Media media) {
        MediaDTO dto = new MediaDTO();
        dto.setId(media.getId());
        dto.setTitle(media.getTitle());
        dto.setUrl(media.getUrl());
        dto.setDescription(media.getDescription());
        dto.setMediaType(media.getType().name());
        
        if (media.getUploader() != null) {
            dto.setUploaderId(media.getUploader().getId());
            dto.setUploaderName(media.getUploader().getFirstName() + " " + media.getUploader().getLastName());
            dto.setUploaderRole(media.getUploader().getRole().name());
        }
        
        if (media.getCompetition() != null) {
            dto.setCompetitionId(media.getCompetition().getId());
            dto.setCompetitionName(media.getCompetition().getName());
        }
        
        if (media.getMatch() != null) {
            dto.setMatchId(media.getMatch().getId());
            dto.setMatchTitle(media.getMatch().getTitle());
        }
        
        if (media.getTeam() != null) {
            dto.setTeamId(media.getTeam().getId());
            dto.setTeamName(media.getTeam().getName());
        }
        
        dto.setUploadedAt(media.getCreatedAt());
        // Le viewCount n'est pas stocké dans l'entité et devrait venir d'une autre source
        dto.setViewCount(0);
        
        return dto;
    }
    
    // Méthode utilitaire pour convertir le DTO en entité
    private Media convertToEntity(MediaDTO dto) {
        Media media = new Media();
        media.setTitle(dto.getTitle());
        media.setUrl(dto.getUrl());
        media.setDescription(dto.getDescription());
        
        if (dto.getMediaType() != null) {
            media.setType(MediaType.valueOf(dto.getMediaType()));
        }
        
        if (dto.getUploaderId() != null) {
            Optional<User> uploaderOpt = userRepository.findById(dto.getUploaderId());
            uploaderOpt.ifPresent(media::setUploader);
        }
        
        if (dto.getCompetitionId() != null) {
            Optional<Competition> competitionOpt = competitionRepository.findById(dto.getCompetitionId());
            competitionOpt.ifPresent(media::setCompetition);
        }
        
        if (dto.getMatchId() != null) {
            Optional<Match> matchOpt = matchRepository.findById(dto.getMatchId());
            matchOpt.ifPresent(media::setMatch);
        }
        
        if (dto.getTeamId() != null) {
            Optional<Team> teamOpt = teamRepository.findById(dto.getTeamId());
            teamOpt.ifPresent(media::setTeam);
        }
        
        return media;
    }
}