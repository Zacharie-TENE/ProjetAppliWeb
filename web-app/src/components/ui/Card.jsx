'use client';

import React from 'react';

/**
 * Composant Card hautement personnalisable
 * 
 * @param {string} variant - 'default', 'outlined', 'elevated'
 * @param {boolean} hover - Si la carte doit avoir un effet de survol
 * @param {boolean} clickable - Si la carte est cliquable
 * @param {boolean} fullWidth - Si la carte doit prendre toute la largeur disponible
 * @param {string} className - Classes CSS supplémentaires
 */
export default function Card({
  children,
  variant = 'default',
  hover = false,
  clickable = false,
  fullWidth = true,
  rounded = 'md',
  padding = 'default',
  withHeader = false,
  withFooter = false,
  header = null,
  footer = null,
  className = '',
  onClick,
  ...props
}) {
  // Classes de base
  const baseClasses = 'overflow-hidden transition-all duration-200';
  
  // Variants
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 shadow',
    outlined: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 shadow-md',
    flat: 'bg-gray-50 dark:bg-gray-900',
  };
  
  // Options de rayon des coins
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };
  
  // Options de padding
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    default: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };
  
  // États
  const stateClasses = {
    hover: 'hover:shadow-lg dark:hover:shadow-gray-800/20',
    clickable: 'cursor-pointer',
  };
  
  // Largeur
  const widthClasses = {
    full: 'w-full',
    auto: 'w-auto',
  };
  
  // Compilation des classes
  const cardClasses = [
    baseClasses,
    variantClasses[variant] || variantClasses.default,
    roundedClasses[rounded] || roundedClasses.md,
    !withHeader && !withFooter ? paddingClasses[padding] || paddingClasses.default : 'p-0',
    hover ? stateClasses.hover : '',
    clickable ? stateClasses.clickable : '',
    fullWidth ? widthClasses.full : widthClasses.auto,
    className,
  ].join(' ');
  
  // Classe pour le contenu principal
  const contentClasses = [
    withHeader || withFooter ? paddingClasses[padding] || paddingClasses.default : '',
  ].join(' ');
  
  return (
    <div
      className={cardClasses}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      {...props}
    >
      {/* En-tête de la carte si présent */}
      {withHeader && header && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          {header}
        </div>
      )}
      
      {/* Contenu principal de la carte */}
      <div className={contentClasses}>
        {children}
      </div>
      
      {/* Pied de la carte si présent */}
      {withFooter && footer && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          {footer}
        </div>
      )}
    </div>
  );
}