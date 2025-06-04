'use client';

import React from 'react';

/**
 * Composant Button hautement personnalisable
 * 
 * @param {string} variant - 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'outlined'
 * @param {string} size - 'xs', 'sm', 'md', 'lg', 'xl'
 * @param {boolean} fullWidth - Si le bouton doit prendre toute la largeur disponible
 * @param {boolean} rounded - Si le bouton doit avoir des coins arrondis
 * @param {string} className - Classes CSS supplémentaires
 */
export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  icon = null,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  rounded = false,
  className = '',
  onClick,
  ...props
}) {
  // Définition des classes de base
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Variants
  const variantClasses = {
    primary: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-400',
    info: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400',
    outlined: 'bg-transparent border border-current hover:bg-gray-50 text-green-600 dark:hover:bg-gray-800',
    text: 'bg-transparent hover:bg-gray-100 text-gray-700 dark:text-gray-200 dark:hover:bg-gray-800',
  };
  
  // Tailles
  const sizeClasses = {
    xs: 'text-xs px-2.5 py-1.5',
    sm: 'text-sm px-3 py-2',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
    xl: 'text-lg px-6 py-3',
  };
  
  // Gestion des états
  const stateClasses = {
    disabled: 'opacity-50 cursor-not-allowed',
    loading: 'relative !text-transparent',
  };
  
  // Classes additionnelles
  const additionalClasses = {
    fullWidth: 'w-full',
    rounded: 'rounded-full',
    default: 'rounded-md',
  };
  
  // Compilation des classes
  const buttonClasses = [
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size] || sizeClasses.md,
    disabled || loading ? stateClasses.disabled : '',
    loading ? stateClasses.loading : '',
    fullWidth ? additionalClasses.fullWidth : '',
    rounded ? additionalClasses.rounded : additionalClasses.default,
    className,
  ].join(' ');
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={disabled || loading ? undefined : onClick}
      {...props}
    >
      {/* Icône à gauche */}
      {icon && iconPosition === 'left' && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      
      {/* Contenu du bouton */}
      {children}
      
      {/* Icône à droite */}
      {icon && iconPosition === 'right' && !loading && (
        <span className="ml-2">{icon}</span>
      )}
      
      {/* Indicateur de chargement */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
    </button>
  );
}