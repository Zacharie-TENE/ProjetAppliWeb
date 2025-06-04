'use client';

import React, { forwardRef, useState } from 'react';

/**
 * Composant Input hautement personnalisable
 * 
 * @param {string} type - Type de l'input ('text', 'email', 'password', etc.)
 * @param {string} variant - 'default', 'outlined', 'filled'
 * @param {string} size - 'sm', 'md', 'lg'
 * @param {boolean} fullWidth - Si l'input doit prendre toute la largeur disponible
 * @param {string} className - Classes CSS supplémentaires
 */
const Input = forwardRef(({
  id,
  name,
  type = 'text',
  label = '',
  placeholder = '',
  variant = 'default',
  size = 'md',
  fullWidth = true,
  error = '',
  helperText = '',
  icon = null,
  iconPosition = 'left',
  clearable = false,
  disabled = false,
  readOnly = false,
  required = false,
  className = '',
  onChange,
  onClear,
  onFocus,
  onBlur,
  value,
  defaultValue,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [innerValue, setInnerValue] = useState(defaultValue || '');
  
  // Gérer la valeur contrôlée et non contrôlée
  const inputValue = value !== undefined ? value : innerValue;
  const hasValue = !!inputValue;
  
  // Classes de base
  const baseClasses = 'transition-all duration-200 appearance-none focus:outline-none';
  
  // Variants
  const variantClasses = {
    default: 'border border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 rounded-md bg-white dark:bg-gray-800',
    outlined: 'border-2 border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 rounded-md bg-transparent',
    filled: 'border-b-2 border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 bg-gray-100 dark:bg-gray-900 rounded-t-md',
  };
  
  // Tailles
  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'text-lg px-4 py-2.5',
  };
  
  // États
  const stateClasses = {
    disabled: 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-900',
    error: 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400',
    icon: 'pl-10',
  };
  
  // Largeur
  const widthClasses = {
    full: 'w-full',
    auto: 'w-auto',
  };
  
  // Compilation des classes
  const inputClasses = [
    baseClasses,
    variantClasses[variant] || variantClasses.default,
    sizeClasses[size] || sizeClasses.md,
    disabled ? stateClasses.disabled : '',
    error ? stateClasses.error : '',
    icon && iconPosition === 'left' ? stateClasses.icon : '',
    fullWidth ? widthClasses.full : widthClasses.auto,
    className,
  ].join(' ');
  
  // Gérer le changement
  const handleChange = (e) => {
    const newValue = e.target.value;
    if (value === undefined) {
      setInnerValue(newValue);
    }
    onChange && onChange(e);
  };
  
  // Gérer le focus
  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus && onFocus(e);
  };
  
  // Gérer la perte de focus
  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur && onBlur(e);
  };
  
  // Gérer l'effacement
  const handleClear = () => {
    if (value === undefined) {
      setInnerValue('');
    }
    onClear && onClear();
  };
  
  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      {/* Label d'input si présent */}
      {label && (
        <label 
          htmlFor={id} 
          className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}`}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* Icône à gauche */}
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{icon}</span>
          </div>
        )}
        
        {/* Input */}
        <input
          ref={ref}
          id={id}
          name={name}
          type={type}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          {...props}
        />
        
        {/* Bouton d'effacement */}
        {clearable && hasValue && !disabled && !readOnly && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            onClick={handleClear}
            aria-label="Effacer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        
        {/* Icône à droite */}
        {icon && iconPosition === 'right' && !clearable && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{icon}</span>
          </div>
        )}
      </div>
      
      {/* Message d'erreur */}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      
      {/* Texte d'aide */}
      {!error && helperText && (
        <p id={`${id}-helper`} className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;