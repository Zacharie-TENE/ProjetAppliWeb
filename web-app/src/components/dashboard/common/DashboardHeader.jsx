import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider,
  useTheme
} from '@mui/material';

/**
 * En-tête pour les pages du tableau de bord
 * 
 * @param {Object} props - Propriétés du composant
 * @param {string} props.title - Titre principal de la page
 * @param {string} props.description - Description ou sous-titre de la page
 * @param {React.ReactNode} props.icon - Icône à afficher à côté du titre
 * @param {React.ReactNode} props.actions - Actions/boutons à afficher dans l'en-tête
 * @param {boolean} props.withPaper - Indique si l'en-tête doit être encadré dans un Paper
 */
const DashboardHeader = ({ 
  title, 
  description, 
  icon, 
  actions,
  withPaper = true
}) => {
  const theme = useTheme();
  
  const content = (
    <Box sx={{ py: 3, px: withPaper ? 3 : 0 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: description ? 1 : 0
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {icon && (
            <Box 
              sx={{ 
                mr: 2, 
                display: 'flex', 
                alignItems: 'center',
                color: 'primary.main'
              }}
            >
              {icon}
            </Box>
          )}
          <Typography variant="h4" component="h1" fontWeight="bold">
            {title}
          </Typography>
        </Box>
        
        {actions && (
          <Box>
            {actions}
          </Box>
        )}
      </Box>
      
      {description && (
        <Typography variant="subtitle1" color="text.secondary">
          {description}
        </Typography>
      )}
      
      {withPaper && <Divider sx={{ mt: 2 }} />}
    </Box>
  );
  
  if (withPaper) {
    return (
      <Paper 
        elevation={0}
        sx={{ 
          mb: 3,
          borderBottom: `1px solid ${theme.palette.divider}` 
        }}
      >
        {content}
      </Paper>
    );
  }
  
  return content;
};

export default DashboardHeader;