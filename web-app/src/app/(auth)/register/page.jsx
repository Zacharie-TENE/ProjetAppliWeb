'use client';

import { useState } from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import { USER_ROLES } from '@/context/AuthContext';

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState('USER');

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 text-center">Je souhaite m'inscrire en tant que :</p>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => handleRoleChange('USER')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedRole === 'USER'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Utilisateur
          </button>
          <button
            onClick={() => handleRoleChange('PLAYER')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedRole === 'PLAYER'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Joueur
          </button>
          <button
            onClick={() => handleRoleChange('COACH')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedRole === 'COACH'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Entraîneur
          </button>
          <button
            onClick={() => handleRoleChange('ORGANIZER')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedRole === 'ORGANIZER'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Organisateur
          </button>
        </div>
      </div>
      <RegisterForm userType={selectedRole} />
    </div>
  );
}