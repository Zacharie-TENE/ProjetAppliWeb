import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Matchservice from '@/services/match-service';
import * as CompetitionService from '@/services/competition-service';
import   * as TeamService from '@/services/team-service';
import { useNotification } from '@/hooks/useNotification';

const MatchForm = ({ matchId = null, competitionId = null }) => {
  const router = useRouter();
  const { showNotification } = useNotification();
  
  // États pour les données du formulaire
  const [match, setMatch] = useState({
    title: '',
    competitionId: competitionId || '',
    homeTeamId: '',
    awayTeamId: '',
    scheduledDateTime: '',
    location: '',
    status: 'SCHEDULED',
    round: '',
    phase: '',
    homeTeamScore: 0,
    awayTeamScore: 0
  });
  
  // États pour les options des listes déroulantes
  const [competitions, setCompetitions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  // Charger les données initiales (compétitions, équipes)
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Charger les compétitions
        const competitionsResponse = await CompetitionService.getAllCompetitions();
        setCompetitions(competitionsResponse.data || []);
        
        // Charger les équipes
        const teamsResponse = await TeamService.getAllTeams();
        setTeams(teamsResponse.data || []);
        
        // Si on est en mode édition, charger les données du match
        if (matchId) {
          setIsEdit(true);
          const matchData = await Matchservice.getMatchById(matchId);
          
          // Formater la date pour l'input datetime-local
          const dateObj = matchData.scheduledDateTime 
            ? new Date(matchData.scheduledDateTime)
            : null;
          
          const formattedDate = dateObj 
            ? `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}T${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`
            : '';
          
          setMatch({
            ...matchData,
            scheduledDateTime: formattedDate,
            competitionId: matchData.competitionId || competitionId || '',
            homeTeamScore: matchData.homeTeamScore || 0,
            awayTeamScore: matchData.awayTeamScore || 0
          });
        } else if (competitionId) {
          // Si on crée un match pour une compétition spécifique
          setMatch(prev => ({
            ...prev,
            competitionId
          }));
        }
      } catch (error) {
        showNotification('Erreur lors du chargement des données', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, [matchId, competitionId]);

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMatch(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur pour ce champ s'il y en a une
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Valider le formulaire
  const validateForm = () => {
    const errors = {};
    
    if (!match.title.trim()) {
      errors.title = 'Le titre du match est requis';
    }
    
    if (!match.competitionId) {
      errors.competitionId = 'La compétition est requise';
    }
    
    if (!match.homeTeamId) {
      errors.homeTeamId = 'L\'équipe à domicile est requise';
    }
    
    if (!match.awayTeamId) {
      errors.awayTeamId = 'L\'équipe à l\'extérieur est requise';
    }
    
    if (match.homeTeamId && match.awayTeamId && match.homeTeamId === match.awayTeamId) {
      errors.awayTeamId = 'Les équipes à domicile et à l\'extérieur doivent être différentes';
    }
    
    if (!match.scheduledDateTime) {
      errors.scheduledDateTime = 'La date et l\'heure du match sont requises';
    }
    
    if (!match.status) {
      errors.status = 'Le statut du match est requis';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotification('Veuillez corriger les erreurs du formulaire', 'error');
      return;
    }
    
    setLoading(true);
    try {
      if (isEdit) {
        // Mettre à jour un match existant
        await Matchservice.updateMatch(matchId, match);
        showNotification('Match mis à jour avec succès', 'success');
      } else {
        // Créer un nouveau match
        await Matchservice.createMatch(match);
        showNotification('Match créé avec succès', 'success');
      }
      
      // Rediriger vers la page appropriée
      if (competitionId) {
        router.push(`/dashboard/organizer/competitions/${competitionId}/matches`);
      } else {
        router.push('/dashboard/organizer/matches');
      }
    } catch (error) {
      showNotification(
        `Erreur lors de la ${isEdit ? 'mise à jour' : 'création'} du match`,
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  // Annuler et retourner à la page précédente
  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? 'Modifier le match' : 'Créer un nouveau match'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titre du match */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Titre du match <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={match.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              formErrors.title ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-1 focus:ring-green-500`}
            placeholder="Ex: FC Barcelona vs Real Madrid"
          />
          {formErrors.title && (
            <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
          )}
        </div>
        
        {/* Compétition */}
        <div>
          <label htmlFor="competitionId" className="block text-sm font-medium text-gray-700 mb-1">
            Compétition <span className="text-red-500">*</span>
          </label>
          <select
            id="competitionId"
            name="competitionId"
            value={match.competitionId}
            onChange={handleChange}
            disabled={!!competitionId}
            className={`w-full px-3 py-2 border ${
              formErrors.competitionId ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 ${
              competitionId ? 'bg-gray-100' : ''
            }`}
          >
            <option value="">Sélectionner une compétition</option>
            {competitions.map(competition => (
              <option key={competition.id} value={competition.id}>
                {competition.name}
              </option>
            ))}
          </select>
          {formErrors.competitionId && (
            <p className="mt-1 text-sm text-red-500">{formErrors.competitionId}</p>
          )}
        </div>
        
        {/* Équipes (domicile et extérieur) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="homeTeamId" className="block text-sm font-medium text-gray-700 mb-1">
              Équipe à domicile <span className="text-red-500">*</span>
            </label>
            <select
              id="homeTeamId"
              name="homeTeamId"
              value={match.homeTeamId}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                formErrors.homeTeamId ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-1 focus:ring-green-500`}
            >
              <option value="">Sélectionner l'équipe à domicile</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            {formErrors.homeTeamId && (
              <p className="mt-1 text-sm text-red-500">{formErrors.homeTeamId}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="awayTeamId" className="block text-sm font-medium text-gray-700 mb-1">
              Équipe à l'extérieur <span className="text-red-500">*</span>
            </label>
            <select
              id="awayTeamId"
              name="awayTeamId"
              value={match.awayTeamId}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                formErrors.awayTeamId ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-1 focus:ring-green-500`}
            >
              <option value="">Sélectionner l'équipe à l'extérieur</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            {formErrors.awayTeamId && (
              <p className="mt-1 text-sm text-red-500">{formErrors.awayTeamId}</p>
            )}
          </div>
        </div>
        
        {/* Date/heure et lieu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="scheduledDateTime" className="block text-sm font-medium text-gray-700 mb-1">
              Date et heure <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              id="scheduledDateTime"
              name="scheduledDateTime"
              value={match.scheduledDateTime}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                formErrors.scheduledDateTime ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-1 focus:ring-green-500`}
            />
            {formErrors.scheduledDateTime && (
              <p className="mt-1 text-sm text-red-500">{formErrors.scheduledDateTime}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Lieu
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={match.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Ex: Stade de France"
            />
          </div>
        </div>
        
        {/* Statut et détails supplémentaires */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Statut <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={match.status}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                formErrors.status ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-1 focus:ring-green-500`}
            >
              <option value="SCHEDULED">Programmé</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="COMPLETED">Terminé</option>
              <option value="POSTPONED">Reporté</option>
              <option value="CANCELLED">Annulé</option>
            </select>
            {formErrors.status && (
              <p className="mt-1 text-sm text-red-500">{formErrors.status}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="round" className="block text-sm font-medium text-gray-700 mb-1">
              Tour / Journée
            </label>
            <input
              type="text"
              id="round"
              name="round"
              value={match.round}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Ex: Journée 5, Quart de finale"
            />
          </div>
          
          <div>
            <label htmlFor="phase" className="block text-sm font-medium text-gray-700 mb-1">
              Phase
            </label>
            <input
              type="text"
              id="phase"
              name="phase"
              value={match.phase}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Ex: Phase de groupes, Phase finale"
            />
          </div>
        </div>
        
        {/* Score (visible seulement si le statut est 'EN COURS' ou 'TERMINÉ') */}
        {(match.status === 'IN_PROGRESS' || match.status === 'COMPLETED') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="homeTeamScore" className="block text-sm font-medium text-gray-700 mb-1">
                Score de l'équipe à domicile
              </label>
              <input
                type="number"
                id="homeTeamScore"
                name="homeTeamScore"
                value={match.homeTeamScore}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="awayTeamScore" className="block text-sm font-medium text-gray-700 mb-1">
                Score de l'équipe à l'extérieur
              </label>
              <input
                type="number"
                id="awayTeamScore"
                name="awayTeamScore"
                value={match.awayTeamScore}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>
        )}
        
        {/* Boutons de soumission et d'annulation */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin mr-2">&#9696;</span>
                {isEdit ? 'Mise à jour...' : 'Création...'}
              </>
            ) : (
              isEdit ? 'Mettre à jour' : 'Créer'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MatchForm;