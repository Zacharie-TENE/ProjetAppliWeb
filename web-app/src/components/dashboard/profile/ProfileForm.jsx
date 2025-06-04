'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';
import { USER_ROLES } from '@/context/AuthContext';
import AuthService from '@/services/auth-service';

const ProfileForm = ({ user, onCancel, onSuccess }) => {
  const { setUser } = useAuth();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(user?.profilePicture || null);

  // Régler les champs du formulaire selon le type d'utilisateur
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      // Champs communs à tous les utilisateurs
      email: user?.email || '',
      userName: user?.userName || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      address: user?.address || '',
      contactDetails: user?.contactDetails || '',
      
      // Champs spécifiques par type d'utilisateur
      // Coach
      licenseNumber: user?.licenseNumber || '',
      yearsOfExperience: user?.yearsOfExperience || '',
      numberOfTeams: user?.numberOfTeams || '',
      specialization: user?.specialization || '',
      organization: user?.organization || '',
      
      // Organizer
      
      // Joueur
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      
      // Mot de passe (optionnel lors de la mise à jour)
      password: '',
      confirmPassword: ''
    }
  });

  // Traitement de l'image de profil
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Soumettre le formulaire
  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      // Ne pas envoyer le mot de passe s'il est vide
      if (!data.password) {
        delete data.password;
        delete data.confirmPassword;
      } else if (data.password !== data.confirmPassword) {
        showNotification({
          type: 'error',
          title: 'Erreur',
          message: 'Les mots de passe ne correspondent pas.'
        });
        setIsLoading(false);
        return;
      }
      
      // Supprimer confirmPassword avant d'envoyer
      delete data.confirmPassword;
      
      // Préparer les données à envoyer selon le type d'utilisateur
      let profileData = {
        id: user.id,
        ...data
      };
      
      // Pour le développement/simulation, filtrer les champs pertinents selon le rôle
      if (user.role === USER_ROLES.COACH) {
        // Garder uniquement les champs du CoachDTO
        profileData = {
          id: user.id,
          email: data.email,
          userName: data.userName,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          licenseNumber: data.licenseNumber,
          yearsOfExperience: data.yearsOfExperience ? parseInt(data.yearsOfExperience) : null,
          numberOfTeams: data.numberOfTeams ? parseInt(data.numberOfTeams) : null,
          address: data.address,
          contactDetails: data.contactDetails,
          specialization: data.specialization,
          organization: data.organization,
          ...(data.password && { password: data.password })
        };
      } else if (user.role === USER_ROLES.ORGANIZER) {
        // Garder uniquement les champs du OrganizerDTO
        profileData = {
          id: user.id,
          email: data.email,
          userName: data.userName,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          organization: data.organization,
          address: data.address,
          contactDetails: data.contactDetails,
          ...(data.password && { password: data.password })
        };
      } else if (user.role === USER_ROLES.ADMIN) {
        // Garder uniquement les champs du AdminDTO
        profileData = {
          id: user.id,
          email: data.email,
          userName: data.userName,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          contactDetails: data.contactDetails,
          ...(data.password && { password: data.password })
        };
      } else {
        // USER et PLAYER utilisent le profileToUpdateDTO
        profileData = {
          id: user.id,
          email: data.email,
          userName: data.userName,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          dateOfBirth: data.dateOfBirth || null,
          ...(data.password && { password: data.password })
        };
      }
      
      // Simuler la mise à jour du profil
      // En production, cela serait un appel API
      setTimeout(() => {
        // Mise à jour du context user avec les nouvelles données
        const updatedUser = {
          ...user,
          ...profileData,
          // Garder certains champs qui ne doivent pas être écrasés
          profilePicture: profileImagePreview || user.profilePicture
        };
        
        // Mettre à jour le localStorage pour simuler la persistance
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Mettre à jour le context
        setUser(updatedUser);
        
        // Notification de succès
        showNotification({
          type: 'success',
          title: 'Succès',
          message: 'Votre profil a été mis à jour avec succès.'
        });
        
        // Callback de succès
        if (onSuccess) onSuccess();
        
        setIsLoading(false);
      }, 1000);
      
      // Pour un environnement de production:
      // const response = await AuthService.updateProfile(profileData);
      // if (response && response.success) {
      //   // Mise à jour du context user
      //   setUser(response.user);
      //   showNotification({
      //     type: 'success',
      //     title: 'Succès',
      //     message: 'Votre profil a été mis à jour avec succès.'
      //   });
      //   if (onSuccess) onSuccess();
      // }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Une erreur est survenue. Veuillez réessayer.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
      <div className="mb-8">
        <div className="flex flex-col items-center mb-4">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mb-3">
            {profileImagePreview ? (
              <Image 
                src={profileImagePreview} 
                alt="Aperçu" 
                width={128} 
                height={128} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/globe.svg';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-green-600 text-white text-4xl font-bold">
                {user.firstName?.charAt(0) || user.userName?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          
          <label className="block text-center">
            <span className="sr-only">Changer la photo</span>
            <span className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md cursor-pointer hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 text-sm">
              Changer la photo
            </span>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Champs communs à tous les utilisateurs */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Prénom
          </label>
          <input
            type="text"
            {...register('firstName', { required: 'Le prénom est requis' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nom
          </label>
          <input
            type="text"
            {...register('lastName', { required: 'Le nom est requis' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nom d'utilisateur
          </label>
          <input
            type="text"
            {...register('userName', { required: 'Le nom d\'utilisateur est requis' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.userName && (
            <p className="mt-1 text-sm text-red-600">{errors.userName.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            {...register('email', { 
              required: 'L\'email est requis',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Format d\'email invalide'
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Téléphone
          </label>
          <input
            type="tel"
            {...register('phone')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Adresse
          </label>
          <input
            type="text"
            {...register('address')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        
        {/* Champs spécifiques selon le rôle */}
        {(user.role === USER_ROLES.PLAYER) && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date de naissance
            </label>
            <input
              type="date"
              {...register('dateOfBirth')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        )}
        
        {user.role === USER_ROLES.COACH && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Numéro de licence
              </label>
              <input
                type="text"
                {...register('licenseNumber')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Années d'expérience
              </label>
              <input
                type="number"
                {...register('yearsOfExperience')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre d'équipes
              </label>
              <input
                type="number"
                {...register('numberOfTeams')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Spécialisation
              </label>
              <input
                type="text"
                {...register('specialization')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </>
        )}
        
        {(user.role === USER_ROLES.COACH || user.role === USER_ROLES.ORGANIZER) && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Organisation
            </label>
            <input
              type="text"
              {...register('organization')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        )}
        
        {(user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.COACH || user.role === USER_ROLES.ORGANIZER) && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Coordonnées
            </label>
            <input
              type="text"
              {...register('contactDetails')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        )}
        
        {/* Champs de mot de passe (optionnels) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nouveau mot de passe (optionnel)
          </label>
          <input
            type="password"
            {...register('password')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <p className="mt-1 text-xs text-gray-500">Laissez vide pour conserver le mot de passe actuel</p>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            {...register('confirmPassword')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>
      
      <div className="mt-8 flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          disabled={isLoading}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;