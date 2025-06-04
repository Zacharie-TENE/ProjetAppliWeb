import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import   * as  TeamService  from '@/services/team-service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Select, Input, Button, Card } from '@/components/ui';

/**
 * TeamForm component for creating and editing teams
 * @param {Object} props - Component props
 * @param {Object} props.initialData - Initial team data for editing (optional)
 * @param {Function} props.onSuccess - Callback function after successful submission
 * @param {Function} props.onCancel - Callback function for cancel button
 */
const TeamForm = ({ initialData = null, onSuccess, onCancel }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = !!initialData;
  const [logoPreview, setLogoPreview] = useState(initialData?.logo || null);
  const [logoFile, setLogoFile] = useState(null);
  
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: initialData || {
      name: '',
      description: '',
      category: 'SENIOR',
      coachId: '',
    }
  });

  // Set initial values if editing
  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach(key => {
        setValue(key, initialData[key]);
      });
    }
  }, [initialData, setValue]);

  // Mutation for creating/updating team
  const mutation = useMutation({
    mutationFn: (formData) => {
      const teamData = new FormData();
      
      // Append all form data
      Object.keys(formData).forEach(key => {
        if (key !== 'logo') {
          teamData.append(key, formData[key]);
        }
      });
      
      // Append logo file if exists
      if (logoFile) {
        teamData.append('logo', logoFile);
      }
      
      return isEditing 
        ? TeamService.updateTeam(initialData.id, teamData)
        : TeamService.createTeam(teamData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['teams']);
      toast.success(isEditing ? 'Équipe mise à jour avec succès!' : 'Équipe créée avec succès!');
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message || 'Une erreur est survenue'}`);
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">
        {isEditing ? 'Modifier l\'équipe' : 'Créer une nouvelle équipe'}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Logo Upload Section */}
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="mb-4 w-40 h-40 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
              {logoPreview ? (
                <Image 
                  src={logoPreview} 
                  alt="Logo prévisualisé" 
                  width={150} 
                  height={150}
                  className="object-cover"
                />
              ) : (
                <div className="text-center p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">Logo de l'équipe</p>
                </div>
              )}
            </div>
            
            <label className="w-full">
              <div className="bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg cursor-pointer transition-colors">
                {logoPreview ? 'Changer le logo' : 'Ajouter un logo'}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </label>
            
            {logoPreview && (
              <button
                type="button"
                onClick={() => {
                  setLogoPreview(null);
                  setLogoFile(null);
                }}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Supprimer le logo
              </button>
            )}
          </div>
          
          {/* Form Fields */}
          <div className="w-full md:w-2/3 space-y-4">
            <div>
              <Input
                label="Nom de l'équipe *"
                placeholder="Entrez le nom de l'équipe"
                {...register('name', { 
                  required: 'Le nom de l\'équipe est obligatoire',
                  minLength: { value: 2, message: 'Le nom doit contenir au moins 2 caractères' }
                })}
                error={errors.name?.message}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Description de l'équipe, histoire, objectifs..."
              />
            </div>
            
            <div>
              <Select
                label="Catégorie *"
                {...register('category', { required: 'La catégorie est obligatoire' })}
                options={[
                  { value: 'JUNIOR', label: 'Junior' },
                  { value: 'SENIOR', label: 'Senior' },
                  { value: 'VETERAN', label: 'Vétéran' }
                ]}
                error={errors.category?.message}
              />
            </div>
            
            <div>
              <Input
                label="ID du coach *"
                type="number"
                placeholder="Entrez l'ID du coach"
                {...register('coachId', { 
                  required: 'L\'ID du coach est obligatoire',
                  valueAsNumber: true 
                })}
                error={errors.coachId?.message}
              />
              <p className="text-xs text-gray-500 mt-1">Le coach doit être enregistré dans le système</p>
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-end mt-8">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="w-full md:w-auto"
          >
            Annuler
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            className="w-full md:w-auto bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Traitement en cours...
              </div>
            ) : (
              isEditing ? 'Mettre à jour l\'équipe' : 'Créer l\'équipe'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TeamForm;