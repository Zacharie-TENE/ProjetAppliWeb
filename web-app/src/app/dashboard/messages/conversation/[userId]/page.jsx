'use client';

import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Box, 
  Typography, 
  Button, 
  Divider, 
  CircularProgress, 
  Alert,
  Modal,
  Chip,
  Avatar
} from '@mui/material';
import { ArrowBack, Send, Person } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import MessageCard from '@/components/messages/MessageCard';
import MessageComposer from '@/components/messages/MessageComposer';
import DashboardHeader from '@/components/dashboard/common/DashboardHeader';
import { useNotification } from '@/hooks/useNotification';
import { useAuth } from '@/hooks/useAuth';
import MessageService from '@/services/message-service';

export default function ConversationPage({ params }) {
  const router = useRouter();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const userId = params.userId;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [recipient, setRecipient] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);
  
  // Charger les messages de la conversation
  useEffect(() => {
    const fetchConversation = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        // Récupérer l'historique de conversation
        const conversationData = await MessageService.getConversationHistory(userId);
        setMessages(conversationData.messages || []);
        
        // Récupérer les infos sur le destinataire
        // Pour simplifier, on pourrait récupérer ces infos depuis le premier message reçu
        if (conversationData.messages && conversationData.messages.length > 0) {
          const firstMessage = conversationData.messages.find(m => m.senderId === Number(userId));
          if (firstMessage) {
            setRecipient({
              id: firstMessage.senderId,
              name: firstMessage.senderName,
              role: firstMessage.senderRole
            });
          } else {
            // Si aucun message reçu, chercher dans les messages envoyés
            const sentMessage = conversationData.messages.find(m => 
              m.recipientCategory === 'INDIVIDUAL' && 
              m.recipientIds.includes(Number(userId))
            );
            
            if (sentMessage && sentMessage.recipientName) {
              setRecipient({
                id: Number(userId),
                name: sentMessage.recipientName,
                role: sentMessage.recipientRole || 'Utilisateur'
              });
            }
          }
        }
      } catch (err) {
        console.error('Erreur lors du chargement de la conversation:', err);
        setError(err.message || 'Une erreur est survenue lors du chargement de la conversation');
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversation();
  }, [userId]);
  
  // Formatter les dates en français
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy à HH:mm', { locale: fr });
  };
  
  // Retour à la page de messagerie
  const handleBack = () => {
    router.push('/dashboard/messages');
  };
  
  // Ouvrir le formulaire de réponse
  const handleReply = () => {
    setComposeOpen(true);
  };
  
  // Fermer le formulaire de réponse
  const handleComposeClose = () => {
    setComposeOpen(false);
  };
  
  // Gestion de l'envoi réussi d'un message
  const handleMessageSent = (message) => {
    showNotification({
      type: 'success',
      message: 'Message envoyé avec succès'
    });
    setComposeOpen(false);
    
    // Ajouter le message à la conversation
    setMessages(prev => [...prev, message]);
  };
  
  // Marquer un message comme lu
  const handleMarkAsRead = async (messageId) => {
    try {
      await MessageService.markAsRead(messageId);
      
      // Mettre à jour l'état local
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
  };
  
  // Supprimer un message
  const handleDelete = async (messageId) => {
    try {
      await MessageService.deleteMessage(messageId);
      
      // Mettre à jour l'état local
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
  
  if (loading) {
    return (
      <>
        <DashboardHeader 
          title="Conversation" 
          description="Chargement de la conversation"
          actions={
            <Button 
              variant="outlined" 
              startIcon={<ArrowBack />} 
              onClick={handleBack}
            >
              Retour à la messagerie
            </Button>
          }
        />
        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
              <CircularProgress />
            </Box>
          </Paper>
        </Container>
      </>
    );
  }
  
  if (error) {
    return (
      <>
        <DashboardHeader 
          title="Conversation" 
          description="Erreur de chargement"
          actions={
            <Button 
              variant="outlined" 
              startIcon={<ArrowBack />} 
              onClick={handleBack}
            >
              Retour à la messagerie
            </Button>
          }
        />
        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          </Paper>
        </Container>
      </>
    );
  }
  
  return (
    <>
      <DashboardHeader 
        title={`Conversation avec ${recipient?.name || 'Utilisateur'}`}
        description={recipient ? `${getRoleLabel(recipient.role)}` : 'Échange de messages'}
        icon={<Person />}
        actions={
          <Box display="flex" gap={1}>
            <Button 
              variant="outlined" 
              startIcon={<ArrowBack />} 
              onClick={handleBack}
            >
              Retour à la messagerie
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<Send />} 
              onClick={handleReply}
            >
              Répondre
            </Button>
          </Box>
        }
      />
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar sx={{ mr: 2 }}>
              {recipient?.name?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {recipient?.name || 'Utilisateur'}
              </Typography>
              {recipient?.role && (
                <Chip 
                  size="small" 
                  label={getRoleLabel(recipient.role)} 
                  color={getRoleBadgeColor(recipient.role)}
                />
              )}
            </Box>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          {messages.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              Aucun message échangé avec cet utilisateur.
            </Alert>
          ) : (
            <Box>
              {messages.map(message => (
                <Box 
                  key={message.id}
                  sx={{ 
                    display: 'flex', 
                    justifyContent: message.senderId === user?.id ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  <Box 
                    sx={{ 
                      maxWidth: '75%',
                      backgroundColor: message.senderId === user?.id ? 'primary.light' : 'grey.100',
                      borderRadius: 2,
                      p: 2
                    }}
                  >
                    <Typography variant="body1">
                      {message.content}
                    </Typography>
                    <Box 
                      display="flex" 
                      justifyContent="space-between" 
                      alignItems="center"
                      mt={1}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(message.sentAt)}
                      </Typography>
                      {message.isRead && message.senderId === user?.id && (
                        <Typography variant="caption" color="text.secondary">
                          Lu {message.readAt ? formatDate(message.readAt) : ''}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
          
          <Box display="flex" justifyContent="center" mt={3}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<Send />} 
              onClick={handleReply}
            >
              Répondre
            </Button>
          </Box>
        </Paper>
      </Container>
      
      {/* Modal pour composer une réponse */}
      <Modal
        open={composeOpen}
        onClose={handleComposeClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: '80%', 
          maxWidth: 800, 
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <MessageComposer 
            onClose={handleComposeClose}
            onSend={handleMessageSent}
            initialData={{
              recipientCategory: 'INDIVIDUAL',
              recipientIds: [recipient?.id]
            }}
          />
        </Box>
      </Modal>
    </>
  );
}