'use client';

import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

// Définition des couleurs principales disponibles
const primaryColors = [
  { name: 'Vert', value: 'green-800' },
  { name: 'Bleu', value: 'blue-800' },
  { name: 'Rouge', value: 'red-800' },
  { name: 'Violet', value: 'purple-800' },
  { name: 'Orange', value: 'orange-800' },
  { name: 'Indigo', value: 'indigo-800' },
];

export default function ThemeSettings() {
  const { theme, primaryColor, changePrimaryColor, changeTheme, availableThemes } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* En-tête du panneau de paramètres */}
      <div 
        className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Paramètres d'affichage</h3>
        <svg 
          className={`h-5 w-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
            clipRule="evenodd" 
          />
        </svg>
      </div>

      {/* Contenu des paramètres */}
      {isExpanded && (
        <div className="p-4">
          {/* Sélection du thème */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Thème
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {availableThemes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => changeTheme(t.id)}
                  className={`${
                    theme.id === t.id 
                      ? 'ring-2 ring-offset-2 ring-green-500 dark:ring-green-400' 
                      : 'border border-gray-300 dark:border-gray-600'
                  } py-2 px-3 rounded-md flex items-center justify-between`}
                >
                  <div className="flex items-center">
                    <span 
                      className={`inline-block w-4 h-4 rounded-full mr-2 ${
                        t.isDark ? 'bg-gray-900 border border-gray-400' : 'bg-white border border-gray-300'
                      }`}
                    />
                    <span className="text-sm">{t.name}</span>
                  </div>
                  {theme.id === t.id && (
                    <svg 
                      className="h-5 w-5 text-green-600 dark:text-green-400" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sélection de la couleur principale */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Couleur principale
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {primaryColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => changePrimaryColor(color.value)}
                  className={`${
                    primaryColor === color.value 
                      ? 'ring-2 ring-offset-2 ring-gray-500 dark:ring-gray-400' 
                      : ''
                  } rounded-full w-10 h-10 overflow-hidden`}
                  aria-label={`Choisir la couleur ${color.name}`}
                >
                  <span 
                    className={`block w-full h-full bg-${color.value} dark:bg-${color.value.replace('-800', '-700')}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Informations sur l'accessibilité */}
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            <p>
              Le thème « Contraste élevé » améliore la lisibilité pour les personnes ayant des difficultés visuelles.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}