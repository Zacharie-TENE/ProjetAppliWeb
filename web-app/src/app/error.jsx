'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';

export default function Error({ error, reset }) {
  const { theme } = useTheme();
  
  useEffect(() => {
    // Vous pouvez éventuellement enregistrer l'erreur dans un service d'analyse ou de journalisation
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-red-600 mb-4">Oups!</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Une erreur s'est produite
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Nous rencontrons un problème technique. 
          {process.env.NODE_ENV === 'development' && (
            <span className="block mt-2 text-red-500 font-mono text-sm">
              {error.message || "Erreur inattendue"}
            </span>
          )}
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => reset()}
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium rounded-md px-6 py-3 transition-colors mr-4"
          >
            Réessayer
          </button>
          
          <Link 
            href="/" 
            className="inline-block bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-md px-6 py-3 transition-colors"
          >
            Retour à l'accueil
          </Link>
          
          <div className="mt-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Si le problème persiste, veuillez contacter notre support technique.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}