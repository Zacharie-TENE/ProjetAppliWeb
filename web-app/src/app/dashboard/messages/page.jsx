'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Tabs, 
  Tab, 
  Paper,
  Fab,
  Modal,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Inbox as InboxIcon, Send as SendIcon } from '@mui/icons-material';
import MessageList from '@/components/messages/MessageList';
import MessageComposer from '@/components/messages/MessageComposer';
import DashboardHeader from '@/components/dashboard/common/DashboardHeader';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';
import * as MessageService from '@/services/message-service';
import { countUnreadMessages } from '@/utils/messageUtils';

const MessagesPage = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState(0);
  const [composeOpen, setComposeOpen] = useState(false);
  const [initialMessageData, setInitialMessageData] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Récupérer le nombre de messages non lus en utilisant les fonctions existantes
  useEffect(() => {
    let isMounted = true;
    const fetchUnreadCount = async () => {
      try {
        // Utiliser getInboxMessages avec le filtre isRead: false pour compter les messages non lus
        const response = await MessageService.getInboxMessages({ 
          isRead: false
        });
        if (isMounted && response) {
          // Adapter selon le format de réponse du backend
          let count = 0;
          if (response.total !== undefined) {
            // Structure paginée
            count = response.total;
          } else if (response.id) {
            // MessageDTO unique non lu
            count = response.isRead ? 0 : 1;
          } else if (Array.isArray(response)) {
            // Tableau de MessageDTO
            count = response.filter(msg => !msg.isRead).length;
          }
          setUnreadCount(count);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du nombre de messages non lus:', error);
        // En cas d'erreur, mettre le compteur à 0
        if (isMounted) {
          setUnreadCount(0);
        }
      }
    };
    
    fetchUnreadCount();
    
    // Mettre à jour le compteur toutes les 5 minutes au lieu de chaque minute pour réduire la charge
    const interval = setInterval(fetchUnreadCount, 300000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);
  
  // Mémoiser les filtres pour éviter les re-render inutiles
  const inboxFilters = useMemo(() => ({}), []);
  const sentFilters = useMemo(() => ({}), []);
  
  // Gestion du changement d'onglet
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Ouvrir le formulaire de composition
  const handleComposeOpen = (initialData = {}) => {
    setInitialMessageData(initialData);
    setComposeOpen(true);
  };
  
  // Fermer le formulaire de composition
  const handleComposeClose = () => {
    setComposeOpen(false);
    setInitialMessageData({});
  };
  
  // Gestion de l'envoi réussi d'un message
  const handleMessageSent = async () => {
    showNotification({
      type: 'success',
      message: 'Message envoyé avec succès'
    });
    
    // Rafraîchir le nombre de messages non lus après l'envoi
    try {
      const response = await MessageService.getInboxMessages({ 
        isRead: false
      });
      if (response) {
        // Adapter selon le format de réponse du backend
        let count = 0;
        if (response.total !== undefined) {
          // Structure paginée
          count = response.total;
        } else if (response.id) {
          // MessageDTO unique non lu
          count = response.isRead ? 0 : 1;
        } else if (Array.isArray(response)) {
          // Tableau de MessageDTO
          count = response.filter(msg => !msg.isRead).length;
        }
        setUnreadCount(count);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du compteur de messages non lus:', error);
    }
  };
  
  return (
    <>
      <DashboardHeader 
        title="Messagerie" 
        description="Gérez vos messages et communiquez avec les autres utilisateurs"
        icon={<InboxIcon />}
      />
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="fullWidth"
            >
              <Tab 
                label={
                  <Box display="flex" alignItems="center">
                    <InboxIcon sx={{ mr: 1 }} />
                    <Typography>Boîte de réception</Typography>
                    {unreadCount > 0 && (
                      <Box
                        sx={{
                          ml: 1,
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Box>
                    )}
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box display="flex" alignItems="center">
                    <SendIcon sx={{ mr: 1 }} />
                    <Typography>Messages envoyés</Typography>
                  </Box>
                } 
              />
            </Tabs>
          </Box>
          
          <Box sx={{ mt: 2 }}>
            {/* Utilisation du lazy loading - ne charger que la liste active */}
            {activeTab === 0 ? (
              <MessageList 
                key="inbox"
                isInbox={true} 
                onComposeClick={handleComposeOpen}
                filters={inboxFilters}
              />
            ) : (
              <MessageList 
                key="sent"
                isInbox={false} 
                onComposeClick={handleComposeOpen}
                filters={sentFilters}
              />
            )}
          </Box>
        </Paper>
      </Container>
      
      {/* Bouton flottant pour composer un nouveau message */}
      <Fab 
        color="primary" 
        aria-label="Nouveau message" 
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => handleComposeOpen()}
      >
        <AddIcon />
      </Fab>
      
      {/* Modal pour composer un message */}
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
          overflow: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 1
        }}>
          <MessageComposer 
            onClose={handleComposeClose}
            onSend={handleMessageSent}
            initialData={initialMessageData}
          />
        </Box>
      </Modal>
    </>
  );
};

export default MessagesPage;