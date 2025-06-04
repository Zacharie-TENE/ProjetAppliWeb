'use client';

import { useState } from 'react';
import Link from 'next/link';

/**
 * Composant de base pour les formulaires d'authentification
 */
const UserForm = ({ 
  title, 
  fields, 
  submitText, 
  onSubmit, 
  isLoading, 
  error, 
  footer,
  successMessage 
}) => {
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Réinitialiser l'erreur pour ce champ si l'utilisateur commence à le modifier
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validation du formulaire avant soumission
  const validateForm = () => {
    let isValid = true;
    const errors = {};

    // Vérifier chaque champ obligatoire
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        errors[field.name] = `${field.label} est requis`;
        isValid = false;
      }

      // Validation spécifique selon le type de champ
      if (field.name === 'email' && formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Format d\'email invalide';
        isValid = false;
      }

      if (field.name === 'password' && formData.password && formData.password.length < 6) {
        errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        isValid = false;
      }

      if (field.name === 'confirmPassword' && formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Les mots de passe ne correspondent pas';
        isValid = false;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">{title}</h2>
      
      {/* Message de succès */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      {/* Message d'erreur global */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-1">
            <label 
              htmlFor={field.name} 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            
            <input
              type={field.type || 'text'}
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              placeholder={field.placeholder}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring 
                ${formErrors[field.name] ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 
                'border-gray-300 focus:border-green-500 focus:ring-green-200'}
                dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
              disabled={isLoading}
              autoComplete={field.autoComplete}
            />
            
            {formErrors[field.name] && (
              <p className="text-red-500 text-xs mt-1">{formErrors[field.name]}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md 
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Chargement...' : submitText}
        </button>
      </form>
      
      {footer && (
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          {footer}
        </div>
      )}
    </div>
  );
};

export default UserForm;