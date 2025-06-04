'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProfileView from '@/components/dashboard/profile/ProfileView';
import ProfileForm from '@/components/dashboard/profile/ProfileForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-gray-600">Vous devez être connecté pour accéder à cette page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Mon profil</h1>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            isEditing 
              ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600' 
              : 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600'
          }`}
        >
          {isEditing ? 'Annuler' : 'Modifier mon profil'}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {isEditing ? (
          <ProfileForm 
            user={user} 
            onCancel={() => setIsEditing(false)}
            onSuccess={() => setIsEditing(false)}
          />
        ) : (
          <ProfileView user={user} />
        )}
      </div>
    </div>
  );
}