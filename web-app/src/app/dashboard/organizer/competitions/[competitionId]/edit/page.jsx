'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getCompetitionById, updateCompetition } from '@/services/competition-service';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function EditCompetitionPage() {
  const router = useRouter();
  const { competitionId } = useParams();
  const { user } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    category: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    location: '',
    maxTeams: 0,
  });

  useEffect(() => {
    if (!user || user.role !== 'ORGANIZER') {
      router.push('/dashboard');
      return;
    }

    fetchCompetitionData();
  }, [competitionId, user, router]);

  const fetchCompetitionData = async () => {
    try {
      setLoading(true);
      const competitionData = await getCompetitionById(competitionId);
      
      // Formater les dates pour les champs de type date
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };
      
      setFormData({
        name: competitionData.name || '',
        description: competitionData.description || '',
        type: competitionData.type || 'LEAGUE',
        category: competitionData.category || 'SENIOR',
        startDate: formatDate(competitionData.startDate),
        endDate: formatDate(competitionData.endDate),
        registrationDeadline: formatDate(competitionData.registrationDeadline),
        location: competitionData.location || '',
        maxTeams: competitionData.maxTeams || 12,
      });
      
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des données de la compétition:', err);
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
      setError('Vous devez être connecté en tant qu\'organisateur pour modifier une compétition');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Validation des dates
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const deadline = new Date(formData.registrationDeadline);
      
      if (deadline > start) {
        setError('La date limite d\'inscription doit être antérieure à la date de début');
        setIsSubmitting(false);
        return;
      }
      
      if (end < start) {
        setError('La date de fin doit être postérieure à la date de début');
        setIsSubmitting(false);
        return;
      }
      
      // Mise à jour de la compétition
      console.log('Données de la compétition à mettre à jour:', formData);
      await updateCompetition(user.id, competitionId, formData);
      
      setSuccess(true);
      setTimeout(() => {
        router.push(`/dashboard/organizer/competitions/${competitionId}`);
      }, 2000);
      
    } catch (err) {
      console.error('Erreur lors de la modification de la compétition:', err);
      setError('Impossible de modifier la compétition. Veuillez vérifier vos informations et réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Modifier la compétition</h1>
        <Button 
          onClick={() => router.push(`/dashboard/organizer/competitions/${competitionId}`)}
          className="bg-gray-600 hover:bg-gray-700"
        >
          Annuler
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
          message="Compétition modifiée avec succès! Redirection en cours..." 
          className="mb-6"
        />
      )}
      
      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nom de la compétition *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ex: Championnat Régional 2023"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de compétition *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="LEAGUE">Championnat</option>
                <option value="TOURNAMENT">Tournoi</option>
                <option value="CUP">Coupe</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="SENIOR">SENIOR</option>
                <option value="JUNIOR">JUNIOR</option>
                <option value="VETERAN">VETERAN</option>
              </select>
            </div>
            
            <Input
              label="Nombre maximum d'équipes"
              name="maxTeams"
              type="number"
              value={formData.maxTeams}
              onChange={handleNumberChange}
              min={2}
              max={100}
            />
            
            <Input
              label="Date de début *"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Date de fin *"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Date limite d'inscription *"
              name="registrationDeadline"
              type="date"
              value={formData.registrationDeadline}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Lieu *"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Ex: Complexe Sportif Municipal"
              className="md:col-span-2"
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
                placeholder="Décrivez votre compétition..."
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              type="button"
              onClick={() => router.push(`/dashboard/organizer/competitions/${competitionId}`)}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? <LoadingSpinner size="sm" /> : 'Enregistrer les modifications'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}