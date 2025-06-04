package com.web.n7.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.web.n7.dto.common.MessageDTO;
import com.web.n7.filter.InboxFilter;
import com.web.n7.filter.RecipientFilter;
import com.web.n7.filter.SentFilter;
import com.web.n7.model.Message;
import com.web.n7.model.MessageReadStatus;
import com.web.n7.model.enumeration.RecipientCategory;
import com.web.n7.model.enumeration.Role;
import com.web.n7.model.users.User;
import com.web.n7.repository.MessageReadStatusRepository;
import com.web.n7.repository.MessageRepository;
import com.web.n7.repository.UserRepository;
import com.web.n7.serviceInterface.MessageService;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final MessageReadStatusRepository messageReadStatusRepository;
    private final UserRepository userRepository;
    
    @Override
    public MessageDTO getInboxMessages(InboxFilter filter) {
        List<Message> messages = new ArrayList<>();
        
        // Récupérer l'utilisateur actuel (à implémenter avec le contexte de sécurité)
        User currentUser = getCurrentUser();
        
        if (filter.getSenderId() != null) {
            User sender = userRepository.findById(filter.getSenderId()).orElse(null);
            if (sender != null) {
                messages = messageRepository.findBySender(sender).stream()
                        .filter(m -> m.getRecipients().contains(currentUser))
                        .collect(Collectors.toList());
            }
        } else if (filter.getSenderRole() != null) {
            Role role = Role.valueOf(filter.getSenderRole());
            messages = messageRepository.findBySenderRole(role).stream()
                    .filter(m -> m.getRecipients().contains(currentUser))
                    .collect(Collectors.toList());
        } else if (filter.getSenderRoles() != null && !filter.getSenderRoles().isEmpty()) {
            // Filtrer par plusieurs rôles d'expéditeur
            List<Role> roles = filter.getSenderRoles().stream()
                    .map(Role::valueOf)
                    .collect(Collectors.toList());
            messages = messageRepository.findAllInbox(currentUser).stream()
                    .filter(m -> roles.contains(m.getSenderRole()))
                    .collect(Collectors.toList());
        } else if (filter.getRecipientCategory() != null) {
            messages = messageRepository.findByRecipientAndCategory(currentUser, filter.getRecipientCategory().name());
        } else if (filter.getRelatedEntityId() != null && filter.getRelatedEntityType() != null) {
            messages = messageRepository.findByRelatedEntity(filter.getRelatedEntityId(), filter.getRelatedEntityType())
                    .stream()
                    .filter(m -> m.getRecipients().contains(currentUser))
                    .collect(Collectors.toList());
        } else {
            messages = messageRepository.findAllInbox(currentUser);
        }
        
        // Filtrer par rôles d'expéditeur à exclure si spécifié
        if (filter.getExcludeSenderRoles() != null && !filter.getExcludeSenderRoles().isEmpty()) {
            List<Role> excludeRoles = filter.getExcludeSenderRoles().stream()
                    .map(Role::valueOf)
                    .collect(Collectors.toList());
            messages = messages.stream()
                    .filter(m -> !excludeRoles.contains(m.getSenderRole()))
                    .collect(Collectors.toList());
        }
        
        // Filtrer par statut de lecture si spécifié
        if (filter.getIsRead() != null) {
            messages = messages.stream()
                    .filter(m -> hasReadStatus(m, currentUser, filter.getIsRead()))
                    .collect(Collectors.toList());
        }
        
        // Mapper le premier message (ou retourner null)
        return messages.isEmpty() ? null : mapToDTO(messages.get(0), currentUser);
    }

    @Override
    public MessageDTO getSentMessages(SentFilter filter) {
        List<Message> messages = new ArrayList<>();
        
        // Récupérer l'utilisateur actuel (à implémenter avec le contexte de sécurité)
        User currentUser = getCurrentUser();
        
        // Récupérer les messages envoyés par l'utilisateur actuel
        messages = messageRepository.findBySender(currentUser);
        
        // Appliquer les filtres
        if (filter.getRecipientCategory() != null) {
            messages = messages.stream()
                    .filter(m -> filter.getRecipientCategory().name().equals(m.getRecipientCategory()))
                    .collect(Collectors.toList());
        }
        
        if (filter.getRecipientId() != null) {
            User recipient = userRepository.findById(filter.getRecipientId()).orElse(null);
            if (recipient != null) {
                messages = messages.stream()
                        .filter(m -> m.getRecipients().contains(recipient))
                        .collect(Collectors.toList());
            }
        }
        
        if (filter.getRelatedEntityId() != null && filter.getRelatedEntityType() != null) {
            messages = messages.stream()
                    .filter(m -> filter.getRelatedEntityId().equals(m.getRelatedEntityId()) 
                            && filter.getRelatedEntityType().equals(m.getRelatedEntityType()))
                    .collect(Collectors.toList());
        }
        
        // Mapper le premier message (ou retourner null)
        return messages.isEmpty() ? null : mapToDTO(messages.get(0), currentUser);
    }

    @Override
    public MessageDTO getMessageById(Long messageId) {
        Optional<Message> messageOpt = messageRepository.findById(messageId);
        if (messageOpt.isEmpty()) {
            return null;
        }
        
        User currentUser = getCurrentUser();
        return mapToDTO(messageOpt.get(), currentUser);
    }

    @Override
    @Transactional
    public MessageDTO sendMessage(MessageDTO messageDTO) {
        // Récupérer l'expéditeur
        User sender = userRepository.findById(messageDTO.getSenderId()).orElseThrow(
                () -> new RuntimeException("Expéditeur non trouvé")
        );
        
        // Construire l'entité Message
        Message message = Message.builder()
                .content(messageDTO.getContent())
                .sender(sender)
                .senderRole(Role.valueOf(messageDTO.getSenderRole()))
                .recipientCategory(messageDTO.getRecipientCategory())
                .relatedEntityId(messageDTO.getRelatedEntityId())
                .relatedEntityType(messageDTO.getRelatedEntityType())
                .sentAt(LocalDateTime.now())
                .build();
        
        // Récupérer les destinataires
        List<User> recipients = new ArrayList<>();
        if (messageDTO.getRecipientIds() != null && !messageDTO.getRecipientIds().isEmpty()) {
            recipients = userRepository.findAllById(messageDTO.getRecipientIds());
            message.setRecipients(recipients);
        }
        
        // Enregistrer le message
        message = messageRepository.save(message);
        
        // Créer les statuts de lecture pour chaque destinataire
        List<MessageReadStatus> readStatuses = new ArrayList<>();
        for (User recipient : recipients) {
            MessageReadStatus readStatus = MessageReadStatus.builder()
                    .message(message)
                    .user(recipient)
                    .isRead(false)
                    .build();
            readStatuses.add(readStatus);
        }
        messageReadStatusRepository.saveAll(readStatuses);
        
        return mapToDTO(message, sender);
    }

    @Override
    @Transactional
    public Boolean markAsRead(Long messageId) {
        Optional<Message> messageOpt = messageRepository.findById(messageId);
        if (messageOpt.isEmpty()) {
            return false;
        }
        
        User currentUser = getCurrentUser();
        Message message = messageOpt.get();
        
        // Vérifier si l'utilisateur est bien un destinataire du message
        if (!message.getRecipients().contains(currentUser)) {
            return false;
        }
        
        // Récupérer ou créer le statut de lecture
        Optional<MessageReadStatus> statusOpt = messageReadStatusRepository.findByMessageAndUser(message, currentUser);
        MessageReadStatus readStatus;
        
        if (statusOpt.isPresent()) {
            readStatus = statusOpt.get();
            // Si déjà marqué comme lu, ne rien faire
            if (readStatus.isRead()) {
                return true;
            }
            readStatus.setRead(true);
            readStatus.setReadAt(LocalDateTime.now());
        } else {
            readStatus = MessageReadStatus.builder()
                    .message(message)
                    .user(currentUser)
                    .isRead(true)
                    .readAt(LocalDateTime.now())
                    .build();
        }
        
        messageReadStatusRepository.save(readStatus);
        return true;
    }

    @Override
    @Transactional
    public Boolean markAllAsRead() {
        User currentUser = getCurrentUser();
        messageReadStatusRepository.markAllAsReadForUser(currentUser);
        return true;
    }

    @Override
    @Transactional
    public void deleteMessage(Long messageId, Long userId) {
        Optional<Message> messageOpt = messageRepository.findById(messageId);
        if (messageOpt.isEmpty()) {
            return;
        }
        
        Message message = messageOpt.get();
        User user = userRepository.findById(userId).orElse(null);
        
        if (user == null) {
            return;
        }
        
        // Si l'utilisateur est l'expéditeur ou un destinataire
        if (message.getSender().equals(user) || message.getRecipients().contains(user)) {
            // Supprimer les statuts de lecture associés
            List<MessageReadStatus> statuses = messageReadStatusRepository.findByMessage(message);
            messageReadStatusRepository.deleteAll(statuses);
            
            // Si l'utilisateur est l'expéditeur, supprimer le message
            if (message.getSender().equals(user)) {
                messageRepository.delete(message);
            } 
            // Si c'est un destinataire, le retirer de la liste des destinataires
            else if (message.getRecipients().contains(user)) {
                message.getRecipients().remove(user);
                messageRepository.save(message);
            }
        }
    }

    @Override
    public List<Map<String, Object>> getPotentialRecipients(RecipientFilter filter) {
        List<User> potentialRecipients = new ArrayList<>();
        
        // Logique pour récupérer les destinataires potentiels selon les filtres
        if (filter.getTargetRole() != null) {
            // Filtrer par rôle
            potentialRecipients = userRepository.findAll().stream()
                    .filter(u -> u.getRole().name().equals(filter.getTargetRole()))
                    .collect(Collectors.toList());
        } else {
            potentialRecipients = userRepository.findAll();
        }
        
        // Recherche textuelle si spécifiée
        if (filter.getSearch() != null && !filter.getSearch().isEmpty()) {
            String search = filter.getSearch().toLowerCase();
            potentialRecipients = potentialRecipients.stream()
                    .filter(u -> u.getUserName().toLowerCase().contains(search))
                    .collect(Collectors.toList());
        }
        
        // Convertir en Map pour le retour
        return potentialRecipients.stream().map(this::mapUserToMap).collect(Collectors.toList());
    }

    @Override
    public List<RecipientCategory> getAvailableRecipientCategories(String userRole) {
        List<RecipientCategory> availableCategories = new ArrayList<>();
        
        // Catégories disponibles selon le rôle
        switch (Role.valueOf(userRole)) {
            case ADMIN:
                // L'admin peut envoyer à toutes les catégories
                return Arrays.asList(RecipientCategory.values());
            case ORGANIZER:
                availableCategories.add(RecipientCategory.INDIVIDUAL);
                availableCategories.add(RecipientCategory.TEAM);
                availableCategories.add(RecipientCategory.TEAM_WITH_COACH);
                availableCategories.add(RecipientCategory.ALL_COACHES);
                availableCategories.add(RecipientCategory.ALL_PLAYERS);
                availableCategories.add(RecipientCategory.COMPETITION_COACHES);
                break;
            case COACH:
                availableCategories.add(RecipientCategory.INDIVIDUAL);
                availableCategories.add(RecipientCategory.TEAM);
                break;
            case PLAYER:
                availableCategories.add(RecipientCategory.INDIVIDUAL);
                break;
            default:
                availableCategories.add(RecipientCategory.INDIVIDUAL);
                break;
        }
        
        return availableCategories;
    }
    
    // Méthodes utilitaires privées
    
    /**
     * Convertir une entité Message en DTO
     */
    private MessageDTO mapToDTO(Message message, User currentUser) {
        MessageDTO dto = MessageDTO.builder()
                .id(message.getId())
                .content(message.getContent())
                .senderId(message.getSender().getId())
                .senderRole(message.getSenderRole().name())
                .recipientIds(message.getRecipients().stream().map(User::getId).collect(Collectors.toList()))
                .recipientCategory(message.getRecipientCategory())
                .relatedEntityId(message.getRelatedEntityId())
                .relatedEntityType(message.getRelatedEntityType())
                .sentAt(message.getSentAt())
                .build();
        
        // Ajout des informations de lecture si l'utilisateur actuel est un destinataire
        if (message.getRecipients().contains(currentUser)) {
            Optional<MessageReadStatus> readStatusOpt = messageReadStatusRepository.findByMessageAndUser(message, currentUser);
            if (readStatusOpt.isPresent()) {
                MessageReadStatus readStatus = readStatusOpt.get();
                dto.setRead(readStatus.isRead());
                dto.setReadAt(readStatus.getReadAt());
            } else {
                dto.setRead(false);
                dto.setReadAt(null);
            }
        }
        
        return dto;
    }
    
    /**
     * Convertir un utilisateur en Map pour l'API
     */
    private Map<String, Object> mapUserToMap(User user) {
        Map<String, Object> result = new HashMap<>();
        result.put("id", user.getId());
        result.put("email", user.getEmail());
        result.put("userName", user.getUserName());
        result.put("firstName", user.getFirstName());
        result.put("lastName", user.getLastName());
        result.put("role", user.getRole().name());
        // Ajouter d'autres attributs si nécessaire
        return result;
    }
    
    /**
     * Vérifier le statut de lecture d'un message pour un utilisateur
     */
    private boolean hasReadStatus(Message message, User user, boolean isRead) {
        Optional<MessageReadStatus> readStatusOpt = messageReadStatusRepository.findByMessageAndUser(message, user);
        return readStatusOpt.isPresent() && readStatusOpt.get().isRead() == isRead;
    }
    
    /**
     * Obtenir l'utilisateur actuel (à implémenter avec Spring Security)
     */
    private User getCurrentUser() {
        // TODO: À implémenter avec le contexte de sécurité Spring
        // Pour le moment, on retourne un utilisateur mock pour les tests
        return userRepository.findById(1L).orElseThrow(
                () -> new RuntimeException("Utilisateur non trouvé")
        );
    }
}