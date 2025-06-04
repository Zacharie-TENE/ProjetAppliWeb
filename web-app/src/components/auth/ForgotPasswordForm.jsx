'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UserForm from './UserForm';
import  AuthService from '@/services/auth-service';
import { useNotification } from '@/hooks/useNotification';

/**
 * Formulaire de récupération de mot de passe
 */
const ForgotPasswordForm = () => {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // Champs du formulaire de récupération de mot de passe
  const forgotPasswordFields = [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Entrez votre email',
      required: true,
      autoComplete: 'email'
    }
  ];

  // Gestion de la soumission du formulaire
  const handleForgotPassword = async (formData) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await AuthService.forgotPassword(formData.email);
      
      if (response) {
        setEmailSent(true);
        
        // Afficher une notification de succès
        showNotification && showNotification({
          type: 'success',
          title: 'Email envoyé',
          message: 'Les instructions de réinitialisation ont été envoyées à votre adresse email.'
        });
      } else {
        setError('Une erreur est survenue lors de l\'envoi de l\'email.');
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Pied de page du formulaire avec lien vers connexion
  const formFooter = (
    <p>
      Vous vous souvenez de votre mot de passe ?{' '}
      <Link 
        href="/login" 
        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium"
      >
        Connectez-vous
      </Link>
    </p>
  );

  // Si l'email a été envoyé, afficher un message de confirmation
  if (emailSent) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Vérifiez votre email</h2>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>Un email de récupération a été envoyé à l'adresse que vous avez fournie.</p>
          <p className="mt-2">Suivez les instructions dans l'email pour réinitialiser votre mot de passe.</p>
        </div>
        <div className="mt-6 text-center">
          <Link 
            href="/login" 
            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium"
          >
            Retour à la page de connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <UserForm
      title="Récupération de mot de passe"
      fields={forgotPasswordFields}
      submitText="Envoyer le lien de récupération"
      onSubmit={handleForgotPassword}
      isLoading={isLoading}
      error={error}
      footer={formFooter}
    />
  );
};

export default ForgotPasswordForm;