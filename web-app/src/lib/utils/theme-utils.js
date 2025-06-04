'use client';

/**
 * Convertit une clé de couleur du thème en une classe Tailwind CSS
 * @param {string} colorKey - Clé de couleur (par exemple "primary", "secondary")
 * @param {string} type - Type de classe (par exemple "bg", "text", "border")
 * @param {Object} theme - Objet du thème actuel
 * @returns {string} - Classe Tailwind CSS
 */
export const getThemeClass = (colorKey, type, theme) => {
  if (!theme || !theme.colors || !theme.colors[colorKey]) {
    return '';
  }
  
  return `${type}-${theme.colors[colorKey]}`;
};

/**
 * Génère les classes CSS pour un composant en fonction du thème
 * @param {Object} options - Options pour générer les classes
 * @param {Object} theme - Objet du thème actuel
 * @returns {string} - Classes CSS
 */
export const getComponentClasses = (options, theme) => {
  const { 
    variant = 'primary', 
    size = 'md',
    className = ''
  } = options;
  
  // Classes de base qui s'appliquent à tous les variants
  const baseClasses = 'rounded-md font-medium focus:outline-none transition-colors';
  
  // Classes spécifiques selon la taille
  const sizeClasses = {
    sm: 'py-1 px-2 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg'
  };
  
  // Classes spécifiques selon le variant et le thème
  const variantClasses = {
    primary: `${getThemeClass('primary', 'bg', theme)} ${getThemeClass('text', 'text', theme === 'dark' ? 'white' : 'white')} hover:${getThemeClass('primary', 'bg', theme).replace('800', '700')}`,
    secondary: `${getThemeClass('secondary', 'bg', theme)} ${getThemeClass('text', 'text', theme === 'dark' ? 'white' : 'white')} hover:${getThemeClass('secondary', 'bg', theme).replace('600', '500')}`,
    outline: `border ${getThemeClass('primary', 'border', theme)} ${getThemeClass('primary', 'text', theme)} hover:${getThemeClass('primary', 'bg', theme)} hover:text-white`,
    ghost: `${getThemeClass('primary', 'text', theme)} hover:${getThemeClass('primary', 'bg', theme)} hover:bg-opacity-10`
  };

  return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
};

/**
 * Utilitaire pour obtenir les classes d'un bouton en fonction du thème
 */
export const getButtonClasses = (options, theme) => {
  return getComponentClasses(options, theme);
};

/**
 * Utilitaire pour obtenir les classes d'une carte en fonction du thème
 */
export const getCardClasses = (options, theme) => {
  const { className = '' } = options;
  
  const baseClasses = 'rounded-lg shadow-sm overflow-hidden';
  const themeClasses = theme?.isDark 
    ? 'bg-gray-800 text-white border border-gray-700' 
    : 'bg-white text-gray-800 border border-gray-200';
  
  return `${baseClasses} ${themeClasses} ${className}`;
};