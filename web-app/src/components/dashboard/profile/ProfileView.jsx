'use client';

import { useState } from 'react';
import Image from 'next/image';
import { USER_ROLES } from '@/context/AuthContext';

const ProfileView = ({ user }) => {
  if (!user) return null;
  
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

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Photo de profil */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mx-auto md:mx-0">
            {user.profilePicture ? (
              <Image 
                src={user.profilePicture} 
                alt={`${user.firstName} ${user.lastName}`} 
                width={128} 
                height={128} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/globe.svg'; // Image de secours si l'URL est invalide
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-green-600 text-white text-4xl font-bold">
                {user.firstName?.charAt(0) || user.userName?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <div className="mt-2 text-center md:text-left">
            <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-full">
              {user.role === USER_ROLES.ADMIN ? 'Administrateur' : 
               user.role === USER_ROLES.COACH ? 'Entraîneur' : 
               user.role === USER_ROLES.ORGANIZER ? 'Organisateur' : 
               user.role === USER_ROLES.PLAYER ? 'Joueur' : 'Utilisateur'}
            </span>
          </div>
        </div>
        
        {/* Informations principales */}
        <div className="flex-grow">
          <h2 className="text-xl font-bold mb-4">{user.firstName} {user.lastName}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Nom d'utilisateur</p>
              <p className="font-medium">{user.userName || 'Non renseigné'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Téléphone</p>
              <p className="font-medium">{user.phone || 'Non renseigné'}</p>
            </div>
            
            {user.dateOfBirth && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date de naissance</p>
                <p className="font-medium">{formatDate(user.dateOfBirth)}</p>
              </div>
            )}
            
            {user.address && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Adresse</p>
                <p className="font-medium">{user.address}</p>
              </div>
            )}
            
            {user.contactDetails && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Coordonnées</p>
                <p className="font-medium">{user.contactDetails}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Section spécifique selon le rôle */}
      {(user.role === USER_ROLES.COACH || user.role === USER_ROLES.PLAYER || user.role === USER_ROLES.ORGANIZER) && (
        <div className="mt-8 border-t pt-6 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">
            {user.role === USER_ROLES.COACH ? 'Informations d\'entraîneur' : 
             user.role === USER_ROLES.PLAYER ? 'Informations de joueur' : 
             'Informations d\'organisateur'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            {/* Champs spécifiques pour les COACH */}
            {user.role === USER_ROLES.COACH && (
              <>
                {user.licenseNumber && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Numéro de licence</p>
                    <p className="font-medium">{user.licenseNumber}</p>
                  </div>
                )}
                
                {user.yearsOfExperience !== undefined && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Années d'expérience</p>
                    <p className="font-medium">{user.yearsOfExperience}</p>
                  </div>
                )}
                
                {user.numberOfTeams !== undefined && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Nombre d'équipes</p>
                    <p className="font-medium">{user.numberOfTeams}</p>
                  </div>
                )}
                
                {user.specialization && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Spécialisation</p>
                    <p className="font-medium">{user.specialization}</p>
                  </div>
                )}
                
                {user.organization && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Organisation</p>
                    <p className="font-medium">{user.organization}</p>
                  </div>
                )}
              </>
            )}
            
            {/* Champs spécifiques pour les PLAYER */}
            {user.role === USER_ROLES.PLAYER && (
              <>
                {user.licenseNumber && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Numéro de licence</p>
                    <p className="font-medium">{user.licenseNumber}</p>
                  </div>
                )}
                
                {user.position && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Position</p>
                    <p className="font-medium">{user.position}</p>
                  </div>
                )}
                
                {user.teamName && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Équipe</p>
                    <p className="font-medium">{user.teamName}</p>
                  </div>
                )}
              </>
            )}
            
            {/* Champs spécifiques pour les ORGANIZER */}
            {user.role === USER_ROLES.ORGANIZER && (
              <>
                {user.organization && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Organisation</p>
                    <p className="font-medium">{user.organization}</p>
                  </div>
                )}
                
                {user.activeCompetitionsCount !== undefined && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Compétitions actives</p>
                    <p className="font-medium">{user.activeCompetitionsCount}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Date de création du compte */}
      {user.createdAt && (
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Membre depuis: {formatDate(user.createdAt)}
        </div>
      )}
    </div>
  );
};

export default ProfileView;