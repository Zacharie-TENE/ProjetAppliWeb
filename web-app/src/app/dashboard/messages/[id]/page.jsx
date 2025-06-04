'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Button, 
  Modal
} from '@mui/material';
import { ArrowBack, Reply } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import MessageViewer from '@/components/messages/MessageViewer';
import MessageComposer from '@/components/messages/MessageComposer';
import DashboardHeader from '@/components/dashboard/common/DashboardHeader';
import { useNotification } from '@/hooks/useNotification';

export default function MessageDetailsPage({ params }) {
  const router = useRouter();
  const { showNotification } = useNotification();
  const messageId = params.id;
  
  const [composeOpen, setComposeOpen] = useState(false);
  const [replyData, setReplyData] = useState({});
  
  // Navigation vers la page de messagerie principale
  const handleBack = () => {
    router.push('/dashboard/messages');
  };
  
  // Ouvrir le formulaire de réponse
  const handleReply = (initialData) => {
    setReplyData(initialData);
    setComposeOpen(true);
  };
  
  // Fermer le formulaire de réponse
  const handleComposeClose = () => {
    setComposeOpen(false);
  };
  
  // Gestion de l'envoi réussi d'un message
  const handleMessageSent = () => {
    showNotification({
      type: 'success',
      message: 'Réponse envoyée avec succès'
    });
    setComposeOpen(false);
  };
  
  // Gestion de la suppression d'un message
  const handleDelete = () => {
    showNotification({
      type: 'success',
      message: 'Message supprimé avec succès'
    });
    router.push('/dashboard/messages');
  };
  
  return (
    <>
      <DashboardHeader 
        title="Détails du message" 
        description="Visualisation d'un message"
        icon={<Reply />}
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
        <MessageViewer 
          messageId={messageId}
          onBack={handleBack}
          onReply={handleReply}
          onDelete={handleDelete}
        />
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
            initialData={replyData}
          />
        </Box>
      </Modal>
    </>
  );
}