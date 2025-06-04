'use client';

import React from 'react';
import { Container, Paper, Box, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import MessageComposer from '@/components/messages/MessageComposer';
import DashboardHeader from '@/components/dashboard/common/DashboardHeader';
import { useNotification } from '@/hooks/useNotification';

export default function ComposeMessagePage() {
  const router = useRouter();
  const { showNotification } = useNotification();
  
  // Retour à la page de messagerie
  const handleBack = () => {
    router.push('/dashboard/messages');
  };
  
  // Gestion de l'envoi réussi d'un message
  const handleMessageSent = () => {
    showNotification({
      type: 'success',
      message: 'Message envoyé avec succès'
    });
    router.push('/dashboard/messages');
  };
  
  return (
    <>
      <DashboardHeader 
        title="Nouveau message" 
        description="Envoyez un message selon votre rôle dans la plateforme"
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
        <MessageComposer 
          onClose={handleBack}
          onSend={handleMessageSent}
        />
      </Container>
    </>
  );
}