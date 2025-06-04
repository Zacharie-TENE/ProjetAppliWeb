'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme, changeTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Ferme le menu si l'utilisateur clique en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    // N'ajouter l'écouteur que lorsque le menu est ouvert
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]); // Dépendance à isOpen pour n'attacher l'écouteur que lorsque le menu est ouvert
    
  // Fonction pour gérer le clic sur un thème
  const handleThemeChange = (themeId) => {
    changeTheme(themeId);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Bouton de bascule principal (toggle) */}
      <button
        onClick={() => toggleTheme()}
        className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        aria-label="Basculer entre thème clair et sombre"
      >
        {theme.isDark ? (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-yellow-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
            />
          </svg>
        ) : (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-gray-700" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
            />
          </svg>
        )}
      </button>

      {/* Bouton pour ouvrir le menu des thèmes */}
      {/* <button
        onClick={() => setIsOpen(!isOpen)}
        className="ml-1 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        aria-label="Choisir un thème"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </button> */}

      {/* Menu déroulant des thèmes */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-30 border border-gray-200 dark:border-gray-700">
          <div className="py-1">
            {availableThemes.map((t) => (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className={`${
                  theme.id === t.id ? 'bg-green-100 dark:bg-green-900' : ''
                } w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-800 flex items-center`}
              >
                <span 
                  className={`inline-block w-3 h-3 rounded-full mr-2 ${
                    t.isDark ? 'bg-gray-900 border border-gray-400' : 'bg-white border border-gray-300'
                  }`}
                />
                {t.name}
                {theme.id === t.id && (
                  <svg 
                    className="ml-auto h-4 w-4 text-green-600 dark:text-green-400" 
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
      )}
    </div>
  );
}