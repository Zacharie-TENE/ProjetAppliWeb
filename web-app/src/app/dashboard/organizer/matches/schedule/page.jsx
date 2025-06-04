'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getCompetitionById } from '@/services/competition-service';
import { scheduleMatch } from '@/services/match-service';
import { getCompetitionTeamsByOrganizer } from '@/services/team-service';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ScheduleMatchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const competitionIdParam = searchParams.get('competitionId');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    competitionId: competitionIdParam || '',
    scheduledDateTime: '',
    location: '',
    homeTeamId: '',
    awayTeamId: '',
    round: 1,
    description: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'ORGANIZER') {
      router.push('/dashboard');
      return;
    }

    if (competitionIdParam) {
      fetchCompetitionData(competitionIdParam);
    }
  }, [user, router, competitionIdParam]);

  const fetchCompetitionData = async (competitionId) => {
    try {
      setLoading(true);
      const competitionData = await getCompetitionById(competitionId);
      setCompetition(competitionData);
      
      // Récupérer les équipes inscrites à cette compétition
      try {
        const teamsData = await getCompetitionTeamsByOrganizer(user.id, competitionId);
        console.log(teamsData)
        setTeams(teamsData || []);
      } catch (teamsError) {
        console.warn('Erreur lors de la récupération des équipes:', teamsError);
        setTeams([]);
      }
      
      setFormData(prev => ({
        ...prev,
        competitionId,
        location: competitionData.location || prev.location
      }));
      
    } catch (err) {
      //console.error('Erreur lors de la récupération des données de la compétition:', err);
      setError('Impossible de récupérer les données de la compétition. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || user.role !== 'ORGANIZER') {
      setError('Vous devez être connecté en tant qu\'organisateur pour programmer un match');
      return;
    }
    
    if (formData.homeTeamId === formData.awayTeamId) {
      setError('Les équipes à domicile et à l\'extérieur doivent être différentes');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Construction du DTO pour la création du match
      const matchDTO = {
        title: formData.title,
        competitionId: parseInt(formData.competitionId),
        scheduledDateTime: formData.scheduledDateTime,
        location: formData.location,
        round: formData.round,
        description: formData.description,
        participants: [
          {
            teamId: parseInt(formData.homeTeamId),
            role: 'HOME'
          },
          {
            teamId: parseInt(formData.awayTeamId),
            role: 'AWAY'
          }
        ]
      };
      
      // Appel à l'API pour créer le match
      const result = await scheduleMatch(user.id, matchDTO);
      
      setSuccess(true);
      setTimeout(() => {
        router.push(`/dashboard/organizer/matches/${result.id}`);
      }, 2000);
      
    } catch (err) {
      console.error('Erreur lors de la programmation du match:', err);
      setError('Impossible de programmer le match. Veuillez vérifier vos informations et réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompetitionChange = async (e) => {
    const competitionId = e.target.value;
    setFormData(prev => ({ ...prev, competitionId }));
    
    if (competitionId) {
      fetchCompetitionData(competitionId);
    } else {
      setCompetition(null);
      setTeams([]);
    }
  };

  if (!user || user.role !== 'ORGANIZER') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert 
          type="error" 
          message="Vous n'êtes pas autorisé à accéder à cette page." 
          onClose={() => router.push('/dashboard')}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Programmer un match</h1>
        <Button 
          onClick={() => router.back()}
          className="bg-gray-600 hover:bg-gray-700"
        >
          Retour
        </Button>
      </div>
      
      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}
      
      {success && (
        <Alert 
          type="success" 
          message="Match programmé avec succès! Redirection en cours..." 
          className="mb-6"
        />
      )}
      
      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compétition *
              </label>
              <select
                name="competitionId"
                value={formData.competitionId}
                onChange={handleCompetitionChange}
                required
                disabled={!!competitionIdParam}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner une compétition</option>
                {/* Dans une vraie application, cette liste serait remplie dynamiquement */}
                {competition && (
                  <option value={competition.id}>{competition.name}</option>
                )}
              </select>
            </div>
            
            <Input
              label="Titre du match *"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Ex: Equipe A vs Equipe B - 1/4 de finale"
              className="md:col-span-2"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Équipe à domicile *
              </label>
              <select
                name="homeTeamId"
                value={formData.homeTeamId}
                onChange={handleChange}
                required
                disabled={loading || teams.length === 0}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  {teams.length === 0 ? 'Aucune équipe disponible' : 'Sélectionner une équipe'}
                </option>
                {teams.map(team => (
                  <option key={`home-${team.id}`} value={team.id}>{team.name}</option>
                ))}
              </select>
              {teams.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Aucune équipe inscrite à cette compétition
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Équipe à l'extérieur *
              </label>
              <select
                name="awayTeamId"
                value={formData.awayTeamId}
                onChange={handleChange}
                required
                disabled={loading || teams.length === 0}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner une équipe</option>
                {teams.map(team => (
                  <option key={`away-${team.id}`} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>
            
            <Input
              label="Date et heure *"
              name="scheduledDateTime"
              type="datetime-local"
              value={formData.scheduledDateTime}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Lieu *"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Ex: Stade Municipal"
            />
            
            <Input
              label="Tour / Journée"
              name="round"
              type="number"
              value={formData.round}
              onChange={handleNumberChange}
              min={1}
              placeholder="Ex: 1"
            />
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Informations supplémentaires sur le match..."
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              type="button"
              onClick={() => router.back()}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? <LoadingSpinner size="sm" /> : 'Programmer le match'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 