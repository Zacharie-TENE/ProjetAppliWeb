import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Pagination, 
  CircularProgress, 
  Alert, 
  Divider,
  FormControlLabel,
  Switch
} from '@mui/material';
import { useRouter } from 'next/navigation';
import MessageCard from './MessageCard';
import MessageFilter from './filters/MessageFilter';
import  * as  MessageService from '../../services/message-service';
import { useNotification } from '../../hooks/useNotification';
import { useAuth } from '../../hooks/useAuth';
import { adaptMessageResponse } from '../../utils/messageUtils';

/**
 * Liste de messages (boîte de réception ou envoyés)
 * Adaptée en fonction du rôle de l'utilisateur avec un système de filtrage simplifié
 * 
 * @param {Object} props - Propriétés du composant
 * @param {boolean} props.isInbox - Indique si on affiche la boîte de réception (true) ou les messages envoyés (false)
 * @param {Function} props.onComposeClick - Fonction appelée quand l'utilisateur veut composer un nouveau message
 * @param {Object} props.filters - Filtres à appliquer aux messages
 */
const MessageList = ({ 
  isInbox = true, 
  onComposeClick,
  filters = {} 
}) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const router = useRouter();
  const { showNotification } = useNotification();
  const { user, userRoles } = useAuth();

  // Mémoriser la fonction fetchMessages pour éviter des re-renders inutiles
  const fetchMessages = useCallback(async () => {
    if (!loading) setLoading(true);

    try {
      // Préparation des filtres
      const messageFilters = {
        ...filters,
        ...activeFilters,
        page: page - 1, // Convertir de pagination 1-indexed à 0-indexed pour le backend
        size: 10, // Utiliser 'size' au lieu de 'pageSize' pour correspondre au contrôleur
        isRead: showUnreadOnly ? false : activeFilters.isRead
      };
      
      // Appel du service approprié selon qu'on affiche la boîte de réception ou les messages envoyés
      const response = isInbox 
        ? await MessageService.getInboxMessages(messageFilters)
        : await MessageService.getSentMessages(messageFilters);
      
      // Adapter la réponse selon le format retourné par le backend
      const adaptedResponse = adaptMessageResponse(response);
      setMessages(adaptedResponse.messages);
      setTotalPages(adaptedResponse.totalPages);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des messages:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement des messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [page, showUnreadOnly, activeFilters, isInbox, filters]);
  
  // Recharger les messages quand les paramètres internes changent
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      await fetchMessages();
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, [fetchMessages]);
  
  // Gérer le changement de filtres depuis le composant MessageFilter
  const handleFilterChange = useCallback((newFilters) => {
    setActiveFilters(newFilters);
    setPage(1); // Réinitialiser la pagination lors du changement de filtres
  }, []);
  
  // Optimisation: Mémoriser les fonctions de gestion d'événements
  const handleMarkAsRead = useCallback(async (messageId) => {
    try {
      await MessageService.markAsRead(messageId);
      
      // Mettre à jour l'état local sans déclencher de re-render complet
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId 
            ? { ...msg, isRead: true, readAt: new Date().toISOString() } 
            : msg
        )
      );
      
      showNotification({
        type: 'success',
        message: 'Message marqué comme lu'
      });
    } catch (err) {
      console.error('Erreur lors du marquage du message comme lu:', err);
      showNotification({
        type: 'error',
        message: 'Erreur lors du marquage du message comme lu'
      });
    }
  }, [showNotification]);
  
  // Supprimer un message
  const handleDelete = useCallback(async (messageId) => {
    try {
      // Récupérer l'ID de l'utilisateur connecté
      const userId = user?.id;
      if (!userId) {
        showNotification({
          type: 'error',
          message: 'Utilisateur non authentifié'
        });
        return;
      }
      
      await MessageService.deleteMessage(messageId, userId);
      
      // Mettre à jour l'état local sans déclencher de re-render complet
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
      
      showNotification({
        type: 'success',
        message: 'Message supprimé avec succès'
      });
    } catch (err) {
      console.error('Erreur lors de la suppression du message:', err);
      showNotification({
        type: 'error',
        message: 'Erreur lors de la suppression du message'
      });
    }
  }, [showNotification, user]);
  
  // Répondre à un message
  const handleReply = useCallback((message) => {
    if (onComposeClick) {
      onComposeClick({
        replyTo: message.id,
        recipientIds: [message.senderId],
        recipientCategory: 'INDIVIDUAL',
        subject: `Re: ${message.subject || ''}`.trim(),
      });
    }
  }, [onComposeClick]);
  
  // Changement de page
  const handlePageChange = useCallback((event, value) => {
    setPage(value);
    // Le scroll vers le haut permet d'éviter des problèmes d'interface après changement de page
    window.scrollTo(0, 0);
  }, []);
  
  // Filtrer les messages non lus uniquement
  const handleUnreadToggle = useCallback((event) => {
    setShowUnreadOnly(event.target.checked);
    setPage(1); // Réinitialiser la pagination
  }, []);
  
  // Rendu du contenu principal - optimisé avec useMemo pour éviter des re-renders inutiles
  const renderContent = useMemo(() => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (error) {
      return (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      );
    }
    
    if (messages.length === 0) {
      return (
        <Alert severity="info" sx={{ my: 2 }}>
          {showUnreadOnly 
            ? "Aucun message non lu" 
            : isInbox 
              ? "Votre boîte de réception est vide" 
              : "Vous n'avez envoyé aucun message"}
        </Alert>
      );
    }
    
    return (
      <>
        {messages.map(message => (
          <MessageCard 
            key={message.id}
            message={message}
            isInbox={isInbox}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
            onReply={handleReply}
          />
        ))}
        
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
            />
          </Box>
        )}
      </>
    );
  }, [loading, error, messages, showUnreadOnly, isInbox, totalPages, page, handlePageChange, handleMarkAsRead, handleDelete, handleReply]);
  
  // Titre adaptif selon le rôle
  const getContextualTitle = () => {
    if (!user) return isInbox ? 'Boîte de réception' : 'Messages envoyés';
    
    // Personnaliser le titre en fonction du rôle
    switch(user.role) {
      case userRoles.PLAYER:
        return isInbox ? 'Mes messages' : 'Messages envoyés';
      case userRoles.COACH:
        return isInbox ? 'Communications' : 'Messages envoyés';
      default:
        return isInbox ? 'Boîte de réception' : 'Messages envoyés';
    }
  };
  
  return (
    <Box>
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">
          {getContextualTitle()}
        </Typography>
        {isInbox && (
          <FormControlLabel
            control={
              <Switch 
                checked={showUnreadOnly}
                onChange={handleUnreadToggle}
                color="primary"
                size="small"
              />
            }
            label="Non lus uniquement"
          />
        )}
      </Box>
      
      {/* Nouveau système de filtrage */}
      {isInbox && (
        <MessageFilter 
          isInbox={isInbox}
          onFilterChange={handleFilterChange}
          currentFilters={activeFilters}
        />
      )}
      
      <Divider sx={{ my: 2 }} />
      
      {renderContent}
    </Box>
  );
};

export default React.memo(MessageList);