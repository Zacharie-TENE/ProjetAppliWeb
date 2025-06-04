'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UserForm from './UserForm';
import AuthService from '@/services/auth-service';
import { useNotification } from '@/hooks/useNotification';

/**
 * Formulaire d'inscription utilisateur
 */
const RegisterForm = ({ userType = 'USER' }) => {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Champs du formulaire d'inscription
  const registerFields = [
    {
      name: 'userName',
      label: 'Nom d\'utilisateur',
      type: 'text',
      placeholder: 'Entrez votre nom d\'utilisateur',
      required: true,
      autoComplete: 'username'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Entrez votre email',
      required: true,
      autoComplete: 'email'
    },
    {
      name: 'firstName',
      label: 'Prénom',
      type: 'text',
      placeholder: 'Entrez votre prénom',
      required: true,
      autoComplete: 'given-name'
    },
    {
      name: 'lastName',
      label: 'Nom',
      type: 'text',
      placeholder: 'Entrez votre nom',
      required: true,
      autoComplete: 'family-name'
    },
    {
      name: 'phone',
      label: 'Téléphone',
      type: 'tel',
      placeholder: 'Entrez votre numéro de téléphone',
      required: false,
      autoComplete: 'tel'
    },
    // Champs supplémentaires en fonction du type d'utilisateur
    ...(userType === 'PLAYER' ? [
      {
        name: 'position',
        label: 'Position',
        type: 'select',
        placeholder: 'Sélectionnez votre position',
        required: true,
        options: [
          { value: 'GOALKEEPER', label: 'Gardien de but' },
          { value: 'DEFENDER', label: 'Défenseur' },
          { value: 'MIDFIELDER', label: 'Milieu de terrain' },
          { value: 'FORWARD', label: 'Attaquant' }
        ]
      },
      {
        name: 'licenseNumber',
        label: 'Numéro de licence',
        type: 'text',
        placeholder: 'Entrez votre numéro de licence',
        required: false
      }
    ] : []),
    ...(userType === 'COACH' ? [
      {
        name: 'licenseNumber',
        label: 'Numéro de licence',
        type: 'text',
        placeholder: 'Entrez votre numéro de licence',
        required: false
      },
      {
        name: 'yearsOfExperience',
        label: 'Années d\'expérience',
        type: 'number',
        placeholder: 'Entrez vos années d\'expérience',
        required: false
      }
    ] : []),
    ...(userType === 'ORGANIZER' ? [
      {
        name: 'organization',
        label: 'Organisation',
        type: 'text',
        placeholder: 'Nom de votre organisation',
        required: true
      }
    ] : []),
    {
      name: 'password',
      label: 'Mot de passe',
      type: 'password',
      placeholder: 'Créez un mot de passe',
      required: true,
      autoComplete: 'new-password'
    },
    {
      name: 'confirmPassword',
      label: 'Confirmer le mot de passe',
      type: 'password',
      placeholder: 'Confirmez votre mot de passe',
      required: true,
      autoComplete: 'new-password'
    }
  ];

  // Gestion de la soumission du formulaire
  const handleRegister = async (formData) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Ajouter le type d'utilisateur aux données
      const userData = {
        ...formData,
        role: userType,
      };
      
      // Supprimer le champ de confirmation du mot de passe avant d'envoyer
      if (userData.confirmPassword) {
        delete userData.confirmPassword;
      }
      
      const response = await AuthService.register(userData);
      
      if (response) {
        // Afficher une notification de succès
        showNotification && showNotification({
          type: 'success',
          title: 'Inscription réussie',
          message: 'Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.'
        });
        
        // Rediriger vers la page de connexion avec un paramètre indiquant le succès de l'inscription
        router.push('/login');
      } else {
        setError('Une erreur est survenue lors de l\'inscription.');
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Pied de page du formulaire avec lien vers connexion
  const formFooter = (
    <p>
      Vous avez déjà un compte ?{' '}
      <Link 
        href="/login" 
        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium"
      >
        Connectez-vous
      </Link>
    </p>
  );

  // Titre en fonction du type d'utilisateur
  const getTitle = () => {
    switch(userType) {
      case 'PLAYER': return 'Inscription - Joueur';
      case 'COACH': return 'Inscription - Entraîneur';
      case 'ORGANIZER': return 'Inscription - Organisateur';
      default: return 'Inscription';
    }
  };

  return (
    <UserForm
      title={getTitle()}
      fields={registerFields}
      submitText="S'inscrire"
      onSubmit={handleRegister}
      isLoading={isLoading}
      error={error}
      footer={formFooter}
    />
  );
};

export default RegisterForm;