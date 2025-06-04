import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Paper, 
  Box, 
  Typography, 
  Divider, 
  Button, 
  IconButton, 
  Chip, 
  Avatar,
  CircularProgress,
  Alert,
  Tooltip
} from '@mui/material';
import { 
  ArrowBack, 
  Delete, 
  Reply, 
  MarkEmailRead,
  Person, 
  Group, 
  MeetingRoom, 
  Sports, 
  EmojiEvents, 
  SupervisorAccount,
  Public
} from '@mui/icons-material';
import   * as  MessageService from '../../services/message-service';
import { useNotification } from '../../hooks/useNotification';
import { useAuth } from '../../hooks/useAuth';

/**
 * Composant pour visualiser un message en détail
 * 
 * @param {Object} props - Propriétés du composant
 * @param {string|number} props.messageId - ID du message à afficher
 * @param {Function} props.onBack - Fonction à appeler lors du retour à la liste
 * @param {Function} props.onReply - Fonction à appeler pour répondre au message
 * @param {Function} props.onDelete - Fonction à appeler pour supprimer le message
 */
const MessageViewer = ({ 
  messageId, 
  onBack, 
  onReply, 
  onDelete 
}) => {
  const router = useRouter();
  const { showNotification } = useNotification();
  const { user } = useAuth();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Charger les détails du message
  useEffect(() => {
    const fetchMessage = async () => {
      if (!messageId) return;
      
      setLoading(true);
      try {
        const messageData = await MessageService.getMessageById(messageId);
        setMessage(messageData);
        
        // Si le message n'est pas encore lu, le marquer comme lu
        if (!messageData.isRead) {
          await MessageService.markAsRead(messageId);
        }
      } catch (err) {
        console.error('Erreur lors du chargement du message:', err);
        setError(err.message || 'Une erreur est survenue lors du chargement du message');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessage();
  }, [messageId]);
  
  // Gestion du retour à la liste
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };
  
  // Gestion de la réponse au message
  const handleReply = () => {
    if (onReply && message) {
      onReply({
        replyTo: message.id,
        recipientIds: [message.senderId],
        recipientCategory: 'INDIVIDUAL',
        subject: `Re: ${message.subject || ''}`.trim(),
      });
    }
  };
  
  // Gestion de la suppression du message
  const handleDelete = async () => {
    if (!messageId) return;
    
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
      
      showNotification({
        type: 'success',
        message: 'Message supprimé avec succès'
      });
      
      if (onDelete) {
        onDelete(messageId);
      } else {
        router.back();
      }
    } catch (err) {
      console.error('Erreur lors de la suppression du message:', err);
      showNotification({
        type: 'error',
        message: err.message || 'Une erreur est survenue lors de la suppression du message'
      });
    }
  };
  
  // Formatter les dates en français
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy à HH:mm', { locale: fr });
  };
  
  // Déterminer l'icône associée à la catégorie de destinataire
  const getCategoryIcon = () => {
    if (!message) return null;
    
    switch (message.recipientCategory) {
      case 'INDIVIDUAL':
        return <Person />;
      case 'TEAM':
        return <Group />;
      case 'TEAM_WITH_COACH':
        return <MeetingRoom />;
      case 'ALL_PLAYERS':
        return <Sports />;
      case 'ALL_COACHES':
        return <SupervisorAccount />;
      case 'COMPETITION_COACHES':
        return <EmojiEvents />;
      case 'GLOBAL':
        return <Public />;
      default:
        return <Person />;
    }
  };
  
  // Récupérer le libellé de catégorie de destinataire
  const getCategoryLabel = () => {
    if (!message) return '';
    
    switch (message.recipientCategory) {
      case 'INDIVIDUAL':
        return 'Message individuel';
      case 'TEAM':
        return 'Équipe';
      case 'TEAM_WITH_COACH':
        return 'Équipe et coach';
      case 'ALL_PLAYERS':
        return 'Tous les joueurs';
      case 'ALL_COACHES':
        return 'Tous les coachs';
      case 'ALL_ORGANIZERS':
        return 'Tous les organisateurs';
      case 'COMPETITION_COACHES':
        return 'Coachs de compétition';
      case 'GLOBAL':
        return 'Message global';
      default:
        return 'Message';
    }
  };
  
  // Récupérer la couleur du badge en fonction du rôle
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'PLAYER':
        return 'primary';
      case 'COACH':
        return 'success';
      case 'ORGANIZER':
        return 'warning';
      case 'ADMIN':
        return 'error';
      default:
        return 'default';
    }
  };
  
  // Récupérer le libellé du rôle en français
  const getRoleLabel = (role) => {
    switch (role) {
      case 'PLAYER':
        return 'Joueur';
      case 'COACH':
        return 'Coach';
      case 'ORGANIZER':
        return 'Organisateur';
      case 'ADMIN':
        return 'Administrateur';
      default:
        return role;
    }
  };
  
  // Marquer le message comme lu
  const handleMarkAsRead = async () => {
    if (!messageId || (message && message.isRead)) return;
    
    try {
      await MessageService.markAsRead(messageId);
      
      // Mettre à jour l'état local
      setMessage(prev => prev ? { ...prev, isRead: true, readAt: new Date().toISOString() } : null);
      
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
  };
  
  // Affichage pendant le chargement
  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      </Paper>
    );
  }
  
  // Affichage en cas d'erreur
  if (error) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box mb={2}>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={handleBack}
            variant="outlined"
          >
            Retour
          </Button>
        </Box>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Paper>
    );
  }
  
  // Affichage si le message n'existe pas
  if (!message) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box mb={2}>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={handleBack}
            variant="outlined"
          >
            Retour
          </Button>
        </Box>
        <Alert severity="warning" sx={{ mt: 2 }}>
          Message introuvable
        </Alert>
      </Paper>
    );
  }
  
  return (
    <Paper sx={{ p: 3 }}>
      {/* En-tête avec bouton de retour */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={handleBack}
          variant="outlined"
        >
          Retour
        </Button>
        
        <Box display="flex" gap={1}>
          {!message.isRead && (
            <Tooltip title="Marquer comme lu">
              <IconButton onClick={handleMarkAsRead} color="primary">
                <MarkEmailRead />
              </IconButton>
            </Tooltip>
          )}
          
          <Tooltip title="Répondre">
            <IconButton onClick={handleReply} color="primary">
              <Reply />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Supprimer">
            <IconButton onClick={handleDelete} color="error">
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Informations sur l'expéditeur */}
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar sx={{ mr: 2 }}>
          {message.senderName?.charAt(0).toUpperCase() || 'U'}
        </Avatar>
        
        <Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6">
              {message.senderName || 'Utilisateur'}
            </Typography>
            <Chip 
              size="small" 
              label={getRoleLabel(message.senderRole)} 
              color={getRoleBadgeColor(message.senderRole)}
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            Envoyé le {formatDate(message.sentAt)}
          </Typography>
          
          {message.readAt && (
            <Typography variant="caption" color="text.secondary">
              Lu le {formatDate(message.readAt)}
            </Typography>
          )}
        </Box>
      </Box>
      
      {/* Informations sur les destinataires */}
      <Box mb={2}>
        <Typography variant="subtitle2" gutterBottom>
          À:
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          {getCategoryIcon()}
          <Typography variant="body2">
            {getCategoryLabel()}
          </Typography>
          
          {message.recipientCategory === 'INDIVIDUAL' && message.recipientIds && message.recipientIds.length > 0 && (
            <Chip 
              size="small" 
              label={`${message.recipientIds.length} destinataire(s)`} 
              variant="outlined"
            />
          )}
          
          {message.relatedEntityType && message.relatedEntityId && (
            <Chip 
              size="small" 
              label={`${message.relatedEntityType} #${message.relatedEntityId}`} 
              color="info"
              variant="outlined"
            />
          )}
        </Box>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Contenu du message */}
      <Box sx={{ whiteSpace: 'pre-wrap', mb: 3 }}>
        <Typography variant="body1">
          {message.content}
        </Typography>
      </Box>
    </Paper>
  );
};

export default MessageViewer;