'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { USER_ROLES } from '@/context/AuthContext';
import { useParams } from 'next/navigation';
import { Card, CardContent, Typography, Box, Chip, Avatar, Button, Grid, Divider, Container, CircularProgress } from '@mui/material';
import { Email, Phone, Sports, LocationOn, WorkOutline, CalendarToday, Groups } from '@mui/icons-material';
import  UserService  from '@/services/user-service';
import * as TeamService from '@/services/team-service';
import * as CompetitionService from '@/services/competition-service';

//lorsqu'il clique sur voir le profil d'un utilisateur  (coach , ou organisateur )
//les informations publiques de l'utilisateur sont affichées
const PublicProfilePage = () => {
  const router = useRouter();
  const userId = useParams().id;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState([]);
  const [competitions, setCompetitions] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Appel au service utilisateur pour récupérer les données
        const userData = await UserService.getUserById(userId);
        
        // Vérifier si l'utilisateur existe
        if (!userData) {
          
          setError("Profil non trouvé");
          return;
        }
        
        // Vérifier si c'est un coach ou un organisateur (seuls ces profils sont accessibles publiquement)
        if (userData.role !== USER_ROLES.COACH && userData.role !== USER_ROLES.ORGANIZER) {
          setError("Ce profil n'est pas accessible publiquement");
          return;
        }
        
        setUser(userData);
        
        // Charger les données supplémentaires selon le rôle
        if (userData.role === USER_ROLES.COACH) {
          // Récupérer les équipes du coach depuis l'API
          const coachTeams = await TeamService.getTeamsByCoach(userId);
          setTeams(coachTeams);
        } else if (userData.role === USER_ROLES.ORGANIZER) {
          // Récupérer les compétitions de l'organisateur depuis l'API
          const organizerCompetitions = await CompetitionService.getCompetitionsByUserId(userId);
          setCompetitions(organizerCompetitions);
        }
      } catch (err) {
        setError("Une erreur est survenue lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [userId]);
  
  // Format date to show in a readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'Non renseigné';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, minHeight: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, minHeight: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Typography variant="h5" color="error" gutterBottom>{error}</Typography>
        <Button variant="contained" color="primary" onClick={() => router.push('/')}>
          Retour à l'accueil
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={4}>
            {/* Photo de profil et informations de base */}
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar 
                sx={{ width: 180, height: 180, mb: 2 }}
                src={user.profilePicture || undefined}
                alt={`${user.firstName} ${user.lastName}`}
              >
                {user.firstName?.charAt(0) || user.userName?.charAt(0) || 'U'}
              </Avatar>
              
              <Chip 
                label={user.role === USER_ROLES.COACH ? 'Entraîneur' : 'Organisateur'} 
                color={user.role === USER_ROLES.COACH ? 'success' : 'warning'}
                sx={{ mb: 2 }}
              />
              
              <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                {user.firstName} {user.lastName}
              </Typography>
              
              <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mb: 2 }}>
                @{user.userName}
              </Typography>
              
              {user.organization && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <WorkOutline fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">{user.organization}</Typography>
                </Box>
              )}
              
              {user.address && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">{user.address}</Typography>
                </Box>
              )}
              
              {user.contactDetails && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Email fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">{user.contactDetails}</Typography>
                </Box>
              )}
              
              {user.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Phone fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">{user.phone}</Typography>
                </Box>
              )}
              
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Membre depuis {formatDate(user.createdAt)}
              </Typography>
            </Grid>
            
            {/* Biographie et informations détaillées */}
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>Biographie</Typography>
              <Typography variant="body1">
                {user.biography || "Aucune biographie disponible."}
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                {user.role === USER_ROLES.COACH ? 'Informations d\'entraîneur' : 'Informations d\'organisateur'}
              </Typography>
              
              <Grid container spacing={2}>
                {user.role === USER_ROLES.COACH && (
                  <>
                    {user.licenseNumber && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary">Numéro de licence</Typography>
                        <Typography variant="body1">{user.licenseNumber}</Typography>
                      </Grid>
                    )}
                    
                    {user.yearsOfExperience !== undefined && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary">Années d'expérience</Typography>
                        <Typography variant="body1">{user.yearsOfExperience} ans</Typography>
                      </Grid>
                    )}
                    
                    {user.specialization && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary">Spécialisation</Typography>
                        <Typography variant="body1">{user.specialization}</Typography>
                      </Grid>
                    )}
                    
                    {user.numberOfTeams !== undefined && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary">Nombre d'équipes</Typography>
                        <Typography variant="body1">{user.numberOfTeams} équipes</Typography>
                      </Grid>
                    )}
                  </>
                )}
                
                {user.role === USER_ROLES.ORGANIZER && (
                  <>
                    {user.organization && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary">Organisation</Typography>
                        <Typography variant="body1">{user.organization}</Typography>
                      </Grid>
                    )}
                    
                    {user.activeCompetitionsCount !== undefined && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary">Compétitions actives</Typography>
                        <Typography variant="body1">{user.activeCompetitionsCount} compétitions</Typography>
                      </Grid>
                    )}
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Section des équipes (pour les coachs) */}
      {user.role === USER_ROLES.COACH && teams.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Groups color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Équipes</Typography>
            </Box>
            
            <Grid container spacing={2}>
              {teams.map(team => (
                <Grid item xs={12} sm={6} md={4} key={team.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">{team.name}</Typography>
                      <Typography variant="body2" color="textSecondary">{team.category}</Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip 
                          label={`${team.players} joueurs`} 
                          size="small" 
                          variant="outlined" 
                          sx={{ mr: 1, mb: 1 }} 
                        />
                        <Chip 
                          label={`${team.competitions} compétitions`} 
                          size="small" 
                          variant="outlined" 
                          sx={{ mb: 1 }} 
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
      
      {/* Section des compétitions (pour les organisateurs) */}
      {user.role === USER_ROLES.ORGANIZER && competitions.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Sports color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Compétitions</Typography>
            </Box>
            
            <Grid container spacing={2}>
              {competitions.map(competition => (
                <Grid item xs={12} sm={6} key={competition.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">{competition.name}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">
                          {formatDate(competition.startDate)} - {formatDate(competition.endDate)}
                        </Typography>
                        <Chip 
                          label={competition.status === 'REGISTRATION' ? 'Inscription ouverte' : competition.status === 'COMPLETED' ? 'Terminée' : competition.status === 'CANCELED' ? 'Annulée' : 'En cours'} 
                          size="small" 
                          color={competition.status === 'REGISTRATION' ? 'success' : competition.status === 'COMPLETED' ? 'default' : 'primary'}
                        />
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Chip 
                          label={`${competition.teams} équipes`} 
                          size="small" 
                          variant="outlined" 
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={() => router.push('/')}
        >
          Retour à l'accueil
        </Button>
      </Box>
    </Container>
  );
};

export default PublicProfilePage;