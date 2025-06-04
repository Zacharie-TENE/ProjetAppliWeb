import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  FormHelperText,
  CircularProgress,
  Alert,
  Autocomplete,
  Chip,
  Paper
} from '@mui/material';
import { 
  Send, 
  Close,
  Group,
  Person,
  MeetingRoom
} from '@mui/icons-material';
import { sendMessage } from '../../services/message-service';
import { getTeamsByPlayer, getAllCoachTeams } from '../../services/team-service';
import { getCompetitionsByUserId } from '../../services/competition-service';
import { getAllUsers } from '../../services/user-service';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';

/**
 * Formulaire de composition de message
 * 
 * @param {Object} props - Propriétés du composant
 * @param {Function} props.onClose - Fonction appelée quand l'utilisateur ferme le formulaire
 * @param {Function} props.onSend - Fonction appelée quand le message est envoyé avec succès
 * @param {Object} props.initialData - Données initiales pour préremplir le formulaire (réponse à un message)
 */
const MessageComposer = ({ 
  onClose, 
  onSend,
  initialData = {}
}) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    content: '',
    recipientCategory: initialData.recipientCategory || 'INDIVIDUAL',
    recipientIds: initialData.recipientIds || [],
    relatedEntityId: initialData.relatedEntityId || '',
    relatedEntityType: initialData.relatedEntityType || ''
  });
  
  // Options disponibles
  const [recipientCategories, setRecipientCategories] = useState([]);
  const [potentialRecipients, setPotentialRecipients] = useState([]);
  const [teams, setTeams] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  
  // Erreurs de validation
  const [formErrors, setFormErrors] = useState({});
  
  // Chargement des données initiales
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        // Définir les catégories de destinataires disponibles selon le rôle
        const availableCategories = getAvailableCategoriesForRole(user.role);
        setRecipientCategories(availableCategories);
        
        // Charger les destinataires potentiels pour les messages individuels
        if (formData.recipientCategory === 'INDIVIDUAL') {
          await loadPotentialRecipients();
        }
        
        // Charger les équipes si l'utilisateur est un joueur ou un coach
        if (user.role === 'PLAYER') {
          const teamsResponse = await getTeamsByPlayer(user.id);
          setTeams(teamsResponse || []);
        } else if (user.role === 'COACH') {
          const teamsResponse = await getAllCoachTeams(user.id);
          setTeams(teamsResponse || []);
        }
        
        // Charger les compétitions si l'utilisateur est un organisateur
        if (user.role === 'ORGANIZER') {
          const competitionsResponse = await getCompetitionsByUserId(user.id);
          setCompetitions(competitionsResponse || []);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données initiales:', err);
        setError(err.message || 'Une erreur est survenue lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, [user.role]);
  
  // Définir les catégories disponibles selon le rôle
  const getAvailableCategoriesForRole = (userRole) => {
    switch (userRole) {
      case 'PLAYER':
        return ['INDIVIDUAL', 'TEAM'];
      case 'COACH':
        return ['INDIVIDUAL', 'TEAM', 'TEAM_WITH_COACH'];
      case 'ORGANIZER':
        return ['INDIVIDUAL', 'TEAM', 'TEAM_WITH_COACH', 'ALL_COACHES', 'ALL_PLAYERS', 'COMPETITION_COACHES', 'GLOBAL'];
      default:
        return ['INDIVIDUAL'];
    }
  };
  
  // Charger les destinataires potentiels en fonction de la catégorie sélectionnée
  const loadPotentialRecipients = async (filters = {}) => {
    try {
      if (formData.recipientCategory === 'TEAM' || formData.recipientCategory === 'TEAM_WITH_COACH') {
        return;
      }
      
      if (formData.recipientCategory === 'INDIVIDUAL') {
        // Récupérer tous les utilisateurs et filtrer selon le rôle
        const allUsers = await getAllUsers();
        let filteredUsers = [];
        
        if (user.role === 'PLAYER') {
          // Un joueur peut envoyer à un coach ou un organisateur
          filteredUsers = allUsers.filter(u => u.role === 'COACH' || u.role === 'ORGANIZER');
        } else if (user.role === 'COACH') {
          // Un coach peut envoyer à un joueur ou un organisateur
          filteredUsers = allUsers.filter(u => u.role === 'PLAYER' || u.role === 'ORGANIZER');
        } else if (user.role === 'ORGANIZER') {
          // Un organisateur peut envoyer à un coach ou un joueur
          filteredUsers = allUsers.filter(u => u.role === 'COACH' || u.role === 'PLAYER');
        }
        
        // Filtrer par recherche si nécessaire
        if (filters.search) {
          filteredUsers = filteredUsers.filter(u => 
            u.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            u.email.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        
        setPotentialRecipients(filteredUsers);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des destinataires:', err);
    }
  };
  
  // Gestion du changement de catégorie de destinataire
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setFormData(prev => ({
      ...prev,
      recipientCategory: category,
      // Réinitialiser les autres champs selon la catégorie
      recipientIds: [],
      relatedEntityId: '',
      relatedEntityType: category === 'TEAM' || category === 'TEAM_WITH_COACH' 
        ? 'TEAM' 
        : category === 'COMPETITION_COACHES' 
          ? 'COMPETITION' 
          : ''
    }));
    
    // Recharger les destinataires si nécessaire
    if (category === 'INDIVIDUAL') {
      loadPotentialRecipients();
    }
    
    // Réinitialiser les erreurs
    setFormErrors({});
  };
  
  // Gestion du changement des destinataires individuels
  const handleRecipientsChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      recipientIds: newValue.map(recipient => recipient.id)
    }));
    
    // Réinitialiser l'erreur de destinataire
    setFormErrors(prev => ({ ...prev, recipientIds: '' }));
  };
  
  // Gestion du changement d'équipe
  const handleTeamChange = (event) => {
    const teamId = event.target.value;
    setFormData(prev => ({
      ...prev,
      relatedEntityId: teamId,
      relatedEntityType: 'TEAM'
    }));
    
    // Réinitialiser l'erreur d'équipe
    setFormErrors(prev => ({ ...prev, relatedEntityId: '' }));
  };
  
  // Gestion du changement de compétition
  const handleCompetitionChange = (event) => {
    const competitionId = event.target.value;
    setFormData(prev => ({
      ...prev,
      relatedEntityId: competitionId,
      relatedEntityType: 'COMPETITION'
    }));
    
    // Réinitialiser l'erreur de compétition
    setFormErrors(prev => ({ ...prev, relatedEntityId: '' }));
  };
  
  // Gestion du changement de contenu
  const handleContentChange = (event) => {
    setFormData(prev => ({
      ...prev,
      content: event.target.value
    }));
    
    // Réinitialiser l'erreur de contenu
    setFormErrors(prev => ({ ...prev, content: '' }));
  };
  
  // Validation du formulaire
  const validateForm = () => {
    const errors = {};
    
    // Validation du contenu
    if (!formData.content.trim()) {
      errors.content = 'Le contenu du message est requis';
    }
    
    // Validation selon la catégorie de destinataire
    if (formData.recipientCategory === 'INDIVIDUAL' && formData.recipientIds.length === 0) {
      errors.recipientIds = 'Veuillez sélectionner au moins un destinataire';
    }
    
    if ((formData.recipientCategory === 'TEAM' || formData.recipientCategory === 'TEAM_WITH_COACH') && !formData.relatedEntityId) {
      errors.relatedEntityId = 'Veuillez sélectionner une équipe';
    }
    
    if (formData.recipientCategory === 'COMPETITION_COACHES' && !formData.relatedEntityId) {
      errors.relatedEntityId = 'Veuillez sélectionner une compétition';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Envoi du message
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validation du formulaire
    if (!validateForm()) {
      return;
    }
    
    setSendingMessage(true);
    try {
      // Préparation des données du message
      const messageData = {
        content: formData.content,
        recipientCategory: formData.recipientCategory,
        recipientIds: formData.recipientCategory === 'INDIVIDUAL' ? formData.recipientIds : [],
        relatedEntityId: ['TEAM', 'TEAM_WITH_COACH', 'COMPETITION_COACHES'].includes(formData.recipientCategory) 
          ? formData.relatedEntityId 
          : null,
        relatedEntityType: formData.relatedEntityType
      };
      
      // Envoi du message
      const response = await sendMessage(messageData);
      
      // Notification de succès
      showNotification({
        type: 'success',
        message: 'Votre message a été envoyé avec succès'
      });
      
      // Appel de la fonction de callback
      if (onSend) {
        onSend(response);
      }
      
      // Fermeture du formulaire
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'envoi du message');
      
      showNotification({
        type: 'error',
        message: err.message || 'Une erreur est survenue lors de l\'envoi du message'
      });
    } finally {
      setSendingMessage(false);
    }
  };
  
  // Recherche de destinataires
  const handleRecipientSearch = (event, searchValue) => {
    if (searchValue && searchValue.length > 2) {
      loadPotentialRecipients({ search: searchValue });
    }
  };
  
  // Rendu conditionnel de la sélection du destinataire selon la catégorie
  const renderRecipientSelector = () => {
    const { recipientCategory } = formData;
    
    if (recipientCategory === 'INDIVIDUAL') {
      return (
        <Autocomplete
          multiple
          id="recipients"
          options={potentialRecipients}
          getOptionLabel={(option) => `${option.name} (${option.role})`}
          onChange={handleRecipientsChange}
          onInputChange={handleRecipientSearch}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={option.id}
                label={`${option.name} (${option.role})`}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Destinataires"
              placeholder="Rechercher un destinataire..."
              error={!!formErrors.recipientIds}
              helperText={formErrors.recipientIds}
              fullWidth
            />
          )}
        />
      );
    }
    
    if (recipientCategory === 'TEAM' || recipientCategory === 'TEAM_WITH_COACH') {
      return (
        <FormControl fullWidth error={!!formErrors.relatedEntityId}>
          <InputLabel id="team-select-label">Équipe</InputLabel>
          <Select
            labelId="team-select-label"
            id="team-select"
            value={formData.relatedEntityId}
            onChange={handleTeamChange}
            label="Équipe"
            startAdornment={<Group sx={{ mr: 1 }} />}
          >
            {teams.map(team => (
              <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
            ))}
          </Select>
          {formErrors.relatedEntityId && (
            <FormHelperText>{formErrors.relatedEntityId}</FormHelperText>
          )}
        </FormControl>
      );
    }
    
    if (recipientCategory === 'COMPETITION_COACHES') {
      return (
        <FormControl fullWidth error={!!formErrors.relatedEntityId}>
          <InputLabel id="competition-select-label">Compétition</InputLabel>
          <Select
            labelId="competition-select-label"
            id="competition-select"
            value={formData.relatedEntityId}
            onChange={handleCompetitionChange}
            label="Compétition"
          >
            {competitions.map(competition => (
              <MenuItem key={competition.id} value={competition.id}>{competition.name}</MenuItem>
            ))}
          </Select>
          {formErrors.relatedEntityId && (
            <FormHelperText>{formErrors.relatedEntityId}</FormHelperText>
          )}
        </FormControl>
      );
    }
    
    // Pour les autres catégories (ALL_COACHES, ALL_PLAYERS, etc.), pas de sélection spécifique
    return null;
  };
  
  // Rendu de l'affichage des destinataires
  const renderRecipientDisplay = () => {
    const { recipientCategory, relatedEntityId } = formData;
    
    if (recipientCategory === 'INDIVIDUAL' && formData.recipientIds.length > 0) {
      return (
        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
          {potentialRecipients
            .filter(recipient => formData.recipientIds.includes(recipient.id))
            .map(recipient => (
              <Chip
                key={recipient.id}
                icon={<Person />}
                label={`${recipient.name} (${recipient.role})`}
                color="primary"
                variant="outlined"
              />
            ))
          }
        </Box>
      );
    }
    
    if ((recipientCategory === 'TEAM' || recipientCategory === 'TEAM_WITH_COACH') && relatedEntityId) {
      const team = teams.find(t => t.id === Number(relatedEntityId));
      if (team) {
        return (
          <Box mt={1}>
            <Chip
              icon={recipientCategory === 'TEAM' ? <Group /> : <MeetingRoom />}
              label={`${team.name} (${recipientCategory === 'TEAM' ? 'Joueurs' : 'Joueurs et coach'})`}
              color="primary"
              variant="outlined"
            />
          </Box>
        );
      }
    }
    
    if (recipientCategory === 'COMPETITION_COACHES' && relatedEntityId) {
      const competition = competitions.find(c => c.id === Number(relatedEntityId));
      if (competition) {
        return (
          <Box mt={1}>
            <Chip
              label={`Coachs de la compétition: ${competition.name}`}
              color="primary"
              variant="outlined"
            />
          </Box>
        );
      }
    }
    
    if (recipientCategory === 'ALL_COACHES') {
      return (
        <Box mt={1}>
          <Chip
            label="Tous les coachs"
            color="primary"
            variant="outlined"
          />
        </Box>
      );
    }
    
    if (recipientCategory === 'ALL_PLAYERS') {
      return (
        <Box mt={1}>
          <Chip
            label="Tous les joueurs"
            color="primary"
            variant="outlined"
          />
        </Box>
      );
    }
    
    if (recipientCategory === 'ALL_ORGANIZERS') {
      return (
        <Box mt={1}>
          <Chip
            label="Tous les organisateurs"
            color="primary"
            variant="outlined"
          />
        </Box>
      );
    }
    
    if (recipientCategory === 'GLOBAL') {
      return (
        <Box mt={1}>
          <Chip
            label="Message global (tout le monde)"
            color="primary"
            variant="outlined"
          />
        </Box>
      );
    }
    
    return null;
  };
  
  // Récupérer l'icône de catégorie
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'INDIVIDUAL':
        return <Person />;
      case 'TEAM':
      case 'TEAM_WITH_COACH':
        return <Group />;
      default:
        return null;
    }
  };
  
  // Si les données sont en cours de chargement
  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="center" alignItems="center" height="300px">
          <CircularProgress />
        </Box>
      </Paper>
    );
  }
  
  return (
    <Paper sx={{ p: 3 }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Typography variant="h6" gutterBottom>
          Nouveau message
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box mb={3}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="category-select-label">Catégorie de destinataire</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={formData.recipientCategory}
              onChange={handleCategoryChange}
              label="Catégorie de destinataire"
            >
              {recipientCategories.map(category => (
                <MenuItem key={category} value={category} sx={{ display: 'flex', alignItems: 'center' }}>
                  {getCategoryIcon(category)}
                  <Box ml={1}>
                    {category === 'INDIVIDUAL' && 'Message individuel'}
                    {category === 'TEAM' && 'Équipe (joueurs)'}
                    {category === 'TEAM_WITH_COACH' && 'Équipe et coach'}
                    {category === 'ALL_PLAYERS' && 'Tous les joueurs'}
                    {category === 'ALL_COACHES' && 'Tous les coachs'}
                    {category === 'ALL_ORGANIZERS' && 'Tous les organisateurs'}
                    {category === 'COMPETITION_COACHES' && 'Coachs de compétition'}
                    {category === 'GLOBAL' && 'Message global (tout le monde)'}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {renderRecipientSelector()}
          {renderRecipientDisplay()}
        </Box>
        
        <TextField
          id="message-content"
          label="Message"
          multiline
          rows={6}
          value={formData.content}
          onChange={handleContentChange}
          error={!!formErrors.content}
          helperText={formErrors.content}
          fullWidth
          required
          sx={{ mb: 3 }}
        />
        
        <Box display="flex" justifyContent="flex-end" gap={1}>
          <Button 
            onClick={onClose}
            variant="outlined" 
            startIcon={<Close />}
            disabled={sendingMessage}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            startIcon={<Send />}
            disabled={sendingMessage}
          >
            {sendingMessage ? <CircularProgress size={24} /> : 'Envoyer'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default MessageComposer;