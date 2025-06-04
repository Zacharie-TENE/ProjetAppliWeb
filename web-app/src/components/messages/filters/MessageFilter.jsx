import React, { useState, useCallback, useMemo } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Paper, 
  FormControl, 
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  IconButton,
  Typography
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useAuth } from '../../../hooks/useAuth';

/**
 * Composant de filtrage des messages simplifié
 * Regroupe les messages par expéditeur plutôt que par catégorie
 * 
 * @param {Object} props - Propriétés du composant
 * @param {boolean} props.isInbox - Indique si on est dans la boîte de réception (true) ou dans les messages envoyés (false)
 * @param {Function} props.onFilterChange - Fonction appelée lorsque les filtres changent
 * @param {Object} props.currentFilters - Filtres actuellement appliqués
 */
const MessageFilter = ({ isInbox = true, onFilterChange, currentFilters = {} }) => {
  const { user, userRoles } = useAuth();
  
  // États pour les filtres
  const [activeView, setActiveView] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [senderType, setSenderType] = useState('all');
  const [activeFilters, setActiveFilters] = useState([]);
  
  // Options de vue principale pour les messages
  const viewOptions = useMemo(() => {
    const options = [
      { value: 'all', label: 'Tous les messages' },
      { value: 'unread', label: 'Non lus' }
    ];
    
    // Si l'utilisateur est un joueur
    if (user && user.role === userRoles.PLAYER) {
      options.push(
        { value: 'coach', label: 'De mon coach' },
        { value: 'team', label: 'De mon équipe' },
        { value: 'platform', label: 'De la plateforme' }
      );
    } 
    // Si l'utilisateur est un coach
    else if (user && user.role === userRoles.COACH) {
      options.push(
        { value: 'players', label: 'De mes joueurs' },
        { value: 'coaches', label: 'D\'autres coachs' },
        { value: 'organizers', label: 'Des organisateurs' },
        { value: 'platform', label: 'De la plateforme' }
      );
    }
    // Si l'utilisateur est un organisateur
    else if (user && user.role === userRoles.ORGANIZER) {
      options.push(
        { value: 'coaches', label: 'Des coachs' },
        { value: 'organizers', label: 'D\'autres organisateurs' },
        { value: 'platform', label: 'De la plateforme' }
      );
    }
    
    return options;
  }, [user, userRoles]);
  
  // Options pour le type d'expéditeur/destinataire
  const typeOptions = useMemo(() => {
    if (!isInbox) {
      return [
        { value: 'all', label: 'Tous les types' },
        { value: 'individual', label: 'Messages individuels' },
        { value: 'group', label: 'Messages de groupe' },
        { value: 'broadcast', label: 'Diffusions' }
      ];
    }
    
    return [
      { value: 'all', label: 'Tous les types' },
      { value: 'individual', label: 'Messages individuels' },
      { value: 'team', label: 'Messages d\'équipe' },
      { value: 'broadcast', label: 'Diffusions' },
      { value: 'system', label: 'Administration' }
    ];
  }, [isInbox]);
  
  // Fonction pour mapper les filtres de vue en filtres API
  const mapViewToApiFilters = useCallback((view) => {
    const filters = {};
    
    switch (view) {
      case 'unread':
        filters.isRead = false;
        break;
      case 'coach':
        filters.senderRole = 'COACH';
        break;
      case 'team':
        // Filtrer les messages de l'équipe en excluant explicitement les messages d'admin
        filters.senderEntityType = 'TEAM';
        filters.excludeSenderRoles = ['ADMIN']; // Exclure les messages d'admin
        break;
      case 'players':
        filters.senderRole = 'PLAYER';
        break;
      case 'coaches':
        filters.senderRole = 'COACH';
        break;
      case 'organizers':
        filters.senderRole = 'ORGANIZER';
        break;
      case 'platform':
        // Filtrer les messages administrateurs
        filters.senderRoles = ['ADMIN'];
        break;
      default:
        // Pas de filtre spécifique pour 'all'
        break;
    }
    
    return filters;
  }, []);
  
  // Fonction pour mapper le type d'expéditeur en filtres API
  const mapTypeToApiFilters = useCallback((type) => {
    const filters = {};
    
    switch (type) {
      case 'individual':
        filters.recipientCategory = 'INDIVIDUAL';
        break;
      case 'team':
        filters.recipientCategory = 'TEAM';
        break;
      case 'group':
        // Pour les messages envoyés à un groupe (équipe, tous les coachs, etc.)
        filters.isGroupMessage = true;
        break;
      case 'broadcast':
        // Pour les messages de diffusion (à tous les coachs d'une compétition, etc.)
        filters.isBroadcast = true;
        break;
      case 'system':
        // Inclure les messages d'administration
        filters.senderRoles = ['ADMIN'];
        break;
      default:
        // Pas de filtre spécifique pour 'all'
        break;
    }
    
    return filters;
  }, []);
  
  // Gérer le changement de vue
  const handleViewChange = (event, newView) => {
    setActiveView(newView);
    
    // Mettre à jour les filtres actifs
    const updatedFilters = activeFilters.filter(filter => filter.type !== 'view');
    if (newView !== 'all') {
      const viewLabel = viewOptions.find(option => option.value === newView)?.label || '';
      updatedFilters.push({ type: 'view', value: newView, label: viewLabel });
    }
    setActiveFilters(updatedFilters);
    
    // Appliquer les nouveaux filtres
    applyFilters(newView, senderType, searchTerm);
  };
  
  // Gérer le changement de type d'expéditeur
  const handleTypeChange = (event) => {
    const newType = event.target.value;
    setSenderType(newType);
    
    // Mettre à jour les filtres actifs
    const updatedFilters = activeFilters.filter(filter => filter.type !== 'type');
    if (newType !== 'all') {
      const typeLabel = typeOptions.find(option => option.value === newType)?.label || '';
      updatedFilters.push({ type: 'type', value: newType, label: typeLabel });
    }
    setActiveFilters(updatedFilters);
    
    // Appliquer les nouveaux filtres
    applyFilters(activeView, newType, searchTerm);
  };
  
  // Gérer la recherche
  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      const newSearchTerm = event.target.value.trim();
      setSearchTerm(newSearchTerm);
      
      // Mettre à jour les filtres actifs
      const updatedFilters = activeFilters.filter(filter => filter.type !== 'search');
      if (newSearchTerm) {
        updatedFilters.push({ type: 'search', value: newSearchTerm, label: `Recherche: "${newSearchTerm}"` });
      }
      setActiveFilters(updatedFilters);
      
      // Appliquer les nouveaux filtres
      applyFilters(activeView, senderType, newSearchTerm);
    }
  };
  
  // Effacer la recherche
  const handleClearSearch = () => {
    setSearchTerm('');
    
    // Mettre à jour les filtres actifs
    const updatedFilters = activeFilters.filter(filter => filter.type !== 'search');
    setActiveFilters(updatedFilters);
    
    // Appliquer les nouveaux filtres
    applyFilters(activeView, senderType, '');
  };
  
  // Supprimer un filtre actif
  const handleRemoveFilter = (filterToRemove) => {
    // Retirer le filtre de la liste des filtres actifs
    const updatedFilters = activeFilters.filter(filter => 
      !(filter.type === filterToRemove.type && filter.value === filterToRemove.value)
    );
    setActiveFilters(updatedFilters);
    
    // Mettre à jour les états correspondants
    if (filterToRemove.type === 'view') {
      setActiveView('all');
    } else if (filterToRemove.type === 'type') {
      setSenderType('all');
    } else if (filterToRemove.type === 'search') {
      setSearchTerm('');
    }
    
    // Appliquer les nouveaux filtres
    const newView = filterToRemove.type === 'view' ? 'all' : activeView;
    const newType = filterToRemove.type === 'type' ? 'all' : senderType;
    const newSearchTerm = filterToRemove.type === 'search' ? '' : searchTerm;
    
    applyFilters(newView, newType, newSearchTerm);
  };
  
  // Appliquer tous les filtres
  const applyFilters = (view, type, search) => {
    // Combiner tous les filtres
    const viewFilters = mapViewToApiFilters(view);
    const typeFilters = mapTypeToApiFilters(type);
    const searchFilter = search ? { searchTerm: search } : {};
    
    // Notifier le parent du changement de filtres
    if (onFilterChange) {
      onFilterChange({
        ...viewFilters,
        ...typeFilters,
        ...searchFilter
      });
    }
  };
  
  return (
    <Box sx={{ mb: 3 }}>
      {/* Onglets principaux */}
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={activeView}
          onChange={handleViewChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {viewOptions.map(option => (
            <Tab key={option.value} label={option.label} value={option.value} />
          ))}
        </Tabs>
      </Paper>
      
      {/* Filtres supplémentaires */}
      <Box sx={{ display: 'flex', mb: 2, gap: 2, flexWrap: 'wrap' }}>
        {/* Filtre par type de message */}
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="message-type-label">Type de message</InputLabel>
          <Select
            labelId="message-type-label"
            value={senderType}
            onChange={handleTypeChange}
            label="Type de message"
          >
            {typeOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {/* Recherche */}
        <TextField
          size="small"
          placeholder="Rechercher dans les messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleSearch}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClearSearch}
                  edge="end"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>
      
      {/* Affichage des filtres actifs */}
      {activeFilters.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
          <Box display="flex" alignItems="center">
            <FilterIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2" fontWeight="medium">Filtres actifs:</Typography>
          </Box>
          {activeFilters.map((filter, index) => (
            <Chip 
              key={`${filter.type}-${index}`}
              label={filter.label}
              onDelete={() => handleRemoveFilter(filter)}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default React.memo(MessageFilter);