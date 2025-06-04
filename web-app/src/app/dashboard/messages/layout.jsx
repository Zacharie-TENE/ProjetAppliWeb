'use client';

import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function MessagesLayout({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  // Vérifier que l'utilisateur est authentifié
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=' + encodeURIComponent(pathname));
    }
  }, [user, isLoading, router, pathname]);
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        Chargement...
      </Box>
    );
  }
  
  if (!user) {
    return null;
  }
  
  return children;
}