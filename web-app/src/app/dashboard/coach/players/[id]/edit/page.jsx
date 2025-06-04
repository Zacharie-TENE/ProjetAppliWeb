'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { getPlayerById, updatePlayer } from '@/services/player-service';
import { getTeamById } from '@/services/team-service';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Adaptateur pour Input compatible avec React Hook Form
function FormInput({ name, label, register, rules, errors, ...rest }) {
  if (!register || !name) {
    console.error("FormInput requires register and name props");
    return null;
  }
  
  const { ref, ...inputProps } = register(name, rules || {});
  
  return (
    <Input
      {...rest}
      name={name}
      label={label}
      error={errors[name]?.message}
      // Transmission de la ref à Input (forwardRef est nécessaire dans Input)
      ref={ref}
      // Passe les props générées par register directement à Input
      {...inputProps}
    />
  );
}

const PlayerStatus = {
  STARTER: 'Titulaire',
  SUBSTITUTE: 'Remplaçant',
};
  
// Positions des joueurs
const PlayerPosition = {
  GOALKEEPER: 'Gardien de but',
  DEFENDER: 'Défenseur',
  MIDFIELDER: 'Milieu de terrain',
  FORWARD: 'Attaquant',
};

export default function EditPlayerPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [teamName, setTeamName] = useState('');
  
  const { register, handleSubmit, setValue, formState: { errors }, watch, reset } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      licenseNumber: '',
      dateOfBirth: '',
      position: '',
      status: 'ACTIVE',
      password: '',
      confirmPassword: '',
      userName: ''
    }
  });

  // Observer pour le mot de passe
  const password = watch('password');

  useEffect(() => {
    if (!user || user.role !== 'COACH') {
      router.push('/dashboard');
      return;
    }

    const fetchPlayerData = async () => {
      try {
        setLoading(true);
        const playerData = await getPlayerById(id);
        
        if (!playerData) {
          setError('Joueur non trouvé');
          return;
        }

        // Remplir le formulaire avec les données du joueur
        setValue('firstName', playerData.firstName);
        setValue('lastName', playerData.lastName);
        setValue('email', playerData.email);
        setValue('phone', playerData.phone || '');
        setValue('address', playerData.address || '');
        setValue('licenseNumber', playerData.licenseNumber || '');
        setValue('dateOfBirth', playerData.dateOfBirth ? new Date(playerData.dateOfBirth).toISOString().split('T')[0] : '');
        setValue('position', playerData.position || '');
        setValue('status', playerData.status || 'ACTIVE');
        setValue('userName', playerData.userName || '');

        // Récupérer et définir le nom de l'équipe (juste pour affichage)
        if (playerData.teamId) {
          try {
            const teamData = await getTeamById(playerData.teamId);
            setTeamName(teamData ? teamData.name : 'Équipe inconnue');
          } catch (err) {
            console.error('Erreur lors de la récupération de l\'équipe:', err);
            setTeamName('Équipe inconnue');
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des données du joueur:', err);
        setError('Impossible de charger les informations du joueur. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [id, user, router, setValue]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(false);
      
      // Préparer les données à envoyer
      const playerData = {
        ...data,
        id: parseInt(id),
        role: 'PLAYER' // Le rôle par défaut est PLAYER
      };
      
      // Supprimer confirmPassword car ce n'est pas un champ à envoyer à l'API
      delete playerData.confirmPassword;
      
      // Si le mot de passe est vide, ne pas l'envoyer
      if (!playerData.password) {
        delete playerData.password;
      }

      // Appel à l'API
      await updatePlayer(playerData);
      setSuccess(true);
      
      // Redirection après 2 secondes
      setTimeout(() => {
        router.push('/dashboard/coach/players');
      }, 2000);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du joueur:', err);
      setError('Une erreur est survenue lors de la mise à jour du joueur. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
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
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.push('/dashboard/coach/players')}
          className="mr-4 text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Retour
        </button>
        <h1 className="text-2xl font-bold">Modifier le joueur</h1>
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
          message="Joueur mis à jour avec succès. Redirection en cours..." 
          className="mb-6"
        />
      )}

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations personnelles */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Informations personnelles</h2>
              
              <FormInput
                label="Prénom *"
                name="firstName"
                register={register}
                errors={errors}
                rules={{ 
                  required: "Le prénom est requis",
                  maxLength: { value: 50, message: "Le prénom ne peut pas dépasser 50 caractères" }
                }}
              />
              
              <FormInput
                label="Nom *"
                name="lastName"
                register={register}
                errors={errors}
                rules={{ 
                  required: "Le nom est requis",
                  maxLength: { value: 50, message: "Le nom ne peut pas dépasser 50 caractères" }
                }}
              />
              
              <FormInput
                label="Nom d'utilisateur"
                name="userName"
                register={register}
                errors={errors}
                rules={{ 
                  maxLength: { value: 50, message: "Le nom d'utilisateur ne peut pas dépasser 50 caractères" }
                }}
              />
              
              <FormInput
                label="Email *"
                type="email"
                name="email"
                register={register}
                errors={errors}
                rules={{ 
                  required: "L'email est requis",
                  pattern: { 
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                    message: "Format d'email invalide" 
                  }
                }}
              />
              
              <FormInput
                label="Téléphone"
                name="phone"
                register={register}
                errors={errors}
                rules={{ 
                  pattern: { 
                    value: /^[0-9+\s()-]{8,15}$/,
                    message: "Format de téléphone invalide" 
                  }
                }}
              />
              
              <FormInput
                label="Adresse"
                name="address"
                register={register}
                errors={errors}
              />
            </div>

            {/* Informations sportives */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Informations sportives</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Équipe (non modifiable)
                </label>
                <input 
                  type="text" 
                  value={teamName} 
                  disabled 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              
              <FormInput
                label="Numéro de licence *"
                name="licenseNumber"
                register={register}
                errors={errors}
                rules={{ 
                  required: "Le numéro de licence est requis" 
                }}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de naissance
                </label>
                <input 
                  type="date" 
                  {...register("dateOfBirth")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position *
                </label>
                <select 
                  {...register("position", { required: "La position est requise" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner une position</option>
                  {Object.entries(PlayerPosition).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                {errors.position && (
                  <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select 
                  {...register("status")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(PlayerStatus).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Mot de passe */}
          <div className="pt-4 border-t">
            <h2 className="text-xl font-semibold mb-4">Changer le mot de passe (optionnel)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                type="password"
                label="Nouveau mot de passe"
                name="password"
                register={register}
                errors={errors}
                rules={{ 
                  minLength: { 
                    value: 8, 
                    message: "Le mot de passe doit contenir au moins 8 caractères" 
                  }
                }}
              />
              
              <FormInput
                type="password"
                label="Confirmer le mot de passe"
                name="confirmPassword"
                register={register}
                errors={errors}
                rules={{ 
                  validate: value => value === password || "Les mots de passe ne correspondent pas"
                }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Laissez vide pour conserver le mot de passe actuel
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button
              type="button"
              onClick={() => router.push('/dashboard/coach/players')}
              className="bg-gray-500 hover:bg-gray-600"
              disabled={submitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              loading={submitting}
            >
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}