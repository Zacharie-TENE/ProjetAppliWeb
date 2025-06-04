'use client';

import { createContext, useState, useEffect } from 'react';

// Définition des thèmes disponibles
const themes = {
  light: {
    id: 'light',
    name: 'Clair',
    colors: {
      primary: 'green-800',
      secondary: 'green-600',
      accent: 'yellow-500',
      background: 'white',
      card: 'white',
      text: 'gray-800',
      border: 'gray-200',
      error: 'red-600',
      success: 'green-600',
      warning: 'yellow-500',
    },
    isDark: false,
  },
  dark: {
    id: 'dark',
    name: 'Sombre',
    colors: {
      primary: 'green-600',
      secondary: 'green-500',
      accent: 'yellow-400',
      background: 'gray-900',
      card: 'gray-800',
      text: 'gray-100',
      border: 'gray-700',
      error: 'red-500',
      success: 'green-500',
      warning: 'yellow-400',
    },
    isDark: true,
  },
  highContrast: {
    id: 'highContrast',
    name: 'Contraste élevé',
    colors: {
      primary: 'yellow-400',
      secondary: 'yellow-300',
      accent: 'blue-400',
      background: 'black',
      card: 'gray-900',
      text: 'white',
      border: 'yellow-400',
      error: 'red-400',
      success: 'green-400',
      warning: 'yellow-300',
    },
    isDark: true,
  },
};

// Création du contexte de thème
export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // État pour stocker le thème actuel
  const [currentTheme, setCurrentTheme] = useState(themes.light);
  
  // État pour stocker la couleur principale personnalisée
  const [primaryColor, setPrimaryColor] = useState('green-800');
  
  // État pour stocker si le thème est chargé depuis les préférences
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger les préférences de thème au démarrage
  useEffect(() => {
    // Récupérer le thème depuis le localStorage
    const savedTheme = localStorage.getItem('theme');
    const savedPrimaryColor = localStorage.getItem('primaryColor');
    
    // Vérifier les préférences système
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      // Si un thème est sauvegardé, l'utiliser
      setCurrentTheme(themes[savedTheme] || themes.light);
    } else if (prefersDarkMode) {
      // Sinon, utiliser le thème sombre si l'utilisateur préfère le mode sombre
      setCurrentTheme(themes.dark);
    }
    
    // Si une couleur principale est sauvegardée, l'utiliser
    if (savedPrimaryColor) {
      setPrimaryColor(savedPrimaryColor);
    }
    
    setIsLoaded(true);
  }, []);

  // Sauvegarder les changements de thème dans le localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('theme', currentTheme.id);
      localStorage.setItem('primaryColor', primaryColor);
      
      // Appliquer la classe de thème au document HTML
      if (currentTheme.isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [currentTheme, primaryColor, isLoaded]);

  // Fonction pour changer de thème
  const changeTheme = (themeId) => {
    if (themes[themeId]) {
      setCurrentTheme(themes[themeId]);
    }
  };

  // Fonction pour changer la couleur principale
  const changePrimaryColor = (color) => {
    setPrimaryColor(color);
  };

  // Fonction pour basculer entre les thèmes clair et sombre
  const toggleTheme = () => {
    setCurrentTheme(prevTheme => 
      prevTheme.isDark ? themes.light : themes.dark
    );
  };

  // Valeurs exposées par le contexte
  const value = {
    theme: currentTheme,
    primaryColor,
    changeTheme,
    changePrimaryColor,
    toggleTheme,
    availableThemes: Object.values(themes),
    isLoaded,
  };

  // Rendu du provider avec le contexte
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};