import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import * as CompetitionService from '@/services/competition-service';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { useNotification } from '@/hooks/useNotification';

const CompetitionForm = ({ competitionId, onSuccess }) => {
  const router = useRouter();
  const { showNotification } = useNotification();
  
  // Vérifier les droits d'accès
  const { hasAccess, userRole, userId } = useRoleAccess();
  const canCreateOrEdit = hasAccess(['ORGANIZER', 'ADMIN']);
  
  // État du formulaire
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    type: 'TOURNAMENT', // Valeur par défaut
    status: 'UPCOMING', // Valeur par défaut
    startDate: '',
    endDate: '',
    location: '',
    maxTeams: 16, // Valeur par défaut
    organizerId: userId || '' // L'ID de l'utilisateur connecté s'il est organisateur
  });
  
  // États pour le chargement et les erreurs
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Charger les données de la compétition en mode édition
  useEffect(() => {
    if (competitionId) {
      setIsEditMode(true);
      fetchCompetition();
    }
  }, [competitionId]);
  
  // Fonction pour charger les données d'une compétition existante
  const fetchCompetition = async () => {
    setFetchLoading(true);
    try {
      const data = await CompetitionService.getCompetitionById(competitionId);
      
      // Formater les dates pour l'input type="date"
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };
      
      setFormData({
        name: data.name || '',
        description: data.description || '',
        category: data.category || '',
        type: data.type || 'TOURNAMENT',
        status: data.status || 'UPCOMING',
        startDate: formatDateForInput(data.startDate),
        endDate: formatDateForInput(data.endDate),
        location: data.location || '',
        maxTeams: data.maxTeams || 16,
        organizerId: data.organizerId || userId || ''
      });
      setApiError(null);
    } catch (err) {
    
      setApiError('Impossible de charger les détails de la compétition. Veuillez réessayer plus tard.');
    } finally {
      setFetchLoading(false);
    }
  };
  
  // Gestionnaire de changement pour les champs du formulaire
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Convertir en nombre pour les champs numériques
    const processedValue = type === 'number' ? Number(value) : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Effacer l'erreur pour ce champ si elle existe
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    
    // Vérification des champs obligatoires
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de la compétition est obligatoire';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'La catégorie est obligatoire';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'La date de début est obligatoire';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'La date de fin est obligatoire';
    }
    
    // Vérifier que la date de fin est après la date de début
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end < start) {
        newErrors.endDate = 'La date de fin doit être postérieure à la date de début';
      }
    }
    
    // Vérifier que le nombre maximum d'équipes est positif
    if (formData.maxTeams <= 0) {
      newErrors.maxTeams = 'Le nombre d\'équipes doit être supérieur à 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retourne true si pas d'erreurs
  };
  
  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Vérifier si l'utilisateur a les droits
    if (!canCreateOrEdit) {
      setApiError('Vous n\'avez pas les droits nécessaires pour cette action.');
      return;
    }
    
    // Valider le formulaire
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setApiError(null);
    
    try {
      // Créer ou mettre à jour la compétition
      if (isEditMode) {
        await CompetitionService.updateCompetition(competitionId, formData);
        showNotification({
          type: 'success',
          message: 'La compétition a été mise à jour avec succès',
        });
      } else {
        const newCompetition = await CompetitionService.createCompetition(formData);
        showNotification({
          type: 'success',
          message: 'La compétition a été créée avec succès',
        });
        
        // Rediriger vers la page de détails de la nouvelle compétition
        if (onSuccess) {
          onSuccess(newCompetition);
        } else {
          router.push(`/dashboard/organizer/competitions/${newCompetition.id}`);
        }
      }
    } catch (err) {
      setApiError('Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };
  
  // Si l'utilisateur n'a pas les droits
  if (!canCreateOrEdit) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>Vous n'avez pas les droits nécessaires pour gérer les compétitions.</p>
      </div>
    );
  }
  
  // Afficher un message de chargement lors de la récupération des données
  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {isEditMode ? 'Modifier la compétition' : 'Créer une nouvelle compétition'}
      </h2>
      
      {/* Message d'erreur global */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          <p>{apiError}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom de la compétition */}
          <div className="col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la compétition*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Nom de la compétition"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          
          {/* Description */}
          <div className="col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description de la compétition"
            ></textarea>
          </div>
          
          {/* Catégorie */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie*
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.category ? 'border-red-300' : 'border-gray-300'
              } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Ex: Senior, Junior, U19..."
            />
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>
          
          {/* Type de compétition */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Type de compétition*
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="LEAGUE">Ligue</option>
              <option value="TOURNAMENT">Tournoi</option>
              <option value="CUP">Coupe</option>
            </select>
          </div>
          
          {/* Statut */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Statut*
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="UPCOMING">À venir</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="COMPLETED">Terminée</option>
              <option value="CANCELLED">Annulée</option>
            </select>
          </div>
          
          {/* Date de début */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Date de début*
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.startDate ? 'border-red-300' : 'border-gray-300'
              } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
            )}
          </div>
          
          {/* Date de fin */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              Date de fin*
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.endDate ? 'border-red-300' : 'border-gray-300'
              } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
            )}
          </div>
          
          {/* Lieu */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Lieu
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Lieu de la compétition"
            />
          </div>
          
          {/* Nombre maximum d'équipes */}
          <div>
            <label htmlFor="maxTeams" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre maximum d'équipes*
            </label>
            <input
              type="number"
              id="maxTeams"
              name="maxTeams"
              value={formData.maxTeams}
              onChange={handleChange}
              min="2"
              className={`w-full rounded-md border ${
                errors.maxTeams ? 'border-red-300' : 'border-gray-300'
              } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.maxTeams && (
              <p className="mt-1 text-sm text-red-600">{errors.maxTeams}</p>
            )}
          </div>
        </div>
        
        {/* Note en bas du formulaire */}
        <p className="text-xs text-gray-500 mt-4 mb-6">
          * Champs obligatoires
        </p>
        
        {/* Boutons d'action */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md ${
              loading 
                ? 'opacity-70 cursor-not-allowed' 
                : 'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            }`}
          >
            {loading ? (
              <>
                <span className="inline-block mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></span>
                {isEditMode ? 'Mise à jour...' : 'Création...'}
              </>
            ) : (
              isEditMode ? 'Mettre à jour' : 'Créer la compétition'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompetitionForm;