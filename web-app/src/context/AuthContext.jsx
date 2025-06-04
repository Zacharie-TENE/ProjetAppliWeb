'use client';

import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Types d'utilisateurs disponibles dans l'application
export const USER_ROLES = {
  USER: 'USER',
  PLAYER: 'PLAYER',
  COACH: 'COACH',
  ADMIN: 'ADMIN',
  ORGANIZER: 'ORGANIZER',
};

// Création du contexte d'authentification
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fonction pour vérifier la validité du token auprès du backend
  const verifyToken = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/verify-token', {
         method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
         body: token,
      });
      
      return response.ok;
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      return false;
    }
  };

  // Fonction de déconnexion standardisée
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  // Vérification de l'authentification au chargement du composant
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Vérifier si un token existe dans le localStorage
        const token = localStorage.getItem('authToken');
        
        if (token) {
          // // D'abord vérifier si le token est valide auprès du backend
          // const isValid = await verifyToken(token);
          
          // if (!isValid) {
          //   console.log('Token invalide ou expiré, déconnexion...');
          //   handleLogout();
          //   return;
          // }
          
          // Si le token est valide, récupérer les informations de l'utilisateur
          const userStr = localStorage.getItem('user');
          if (userStr) {
            try {
              const userData = JSON.parse(userStr);
              setUser(userData);
            } catch (e) {
              console.error('Erreur lors du parsing de l\'utilisateur:', e);
              handleLogout();
            }
          } else {
            // Si pas d'utilisateur en localStorage mais token valide, récupérer les infos
            try {
              const response = await fetch('/api/auth/me', {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                // Stocker l'utilisateur dans localStorage pour les prochaines vérifications
                localStorage.setItem('user', JSON.stringify(userData));
              } else {
                // Si la réponse n'est pas OK, le token est probablement invalide
                handleLogout();
              }
            } catch (error) {
              console.error('Erreur lors de la récupération des données utilisateur:', error);
              handleLogout();
            }
          }
        }
      } catch (err) {
        console.error('Erreur auth:', err);
        setError('Impossible de vérifier votre authentification.');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fonction de connexion
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Appel à l'API de connexion
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        
        return { success: true };
      } else {
        setError(data.message || 'Échec de la connexion. Vérifiez vos identifiants.');
        return { success: false, error: data.message };
      }
    } catch (err) {
      setError('Une erreur s\'est produite. Veuillez réessayer.');
      return { success: false, error: 'Une erreur s\'est produite. Veuillez réessayer.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    handleLogout();
  };

  // Reste du code inchangé...
    // Fonction d'inscription
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirection vers la page de connexion après une inscription réussie
        router.push('/login');
        return { success: true };
      } else {
        setError(data.message || 'Échec de l\'inscription. Veuillez réessayer.');
        return { success: false, error: data.message };
      }
    } catch (err) {
      setError('Une erreur s\'est produite. Veuillez réessayer.');
      return { success: false, error: 'Une erreur s\'est produite. Veuillez réessayer.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour récupérer le mot de passe
  const forgotPassword = async (email) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: 'Instructions envoyées à votre email.' };
      } else {
        setError(data.message || 'Échec de la demande. Veuillez réessayer.');
        return { success: false, error: data.message };
      }
    } catch (err) {
      setError('Une erreur s\'est produite. Veuillez réessayer.');
      return { success: false, error: 'Une erreur s\'est produite. Veuillez réessayer.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (requiredRole) => {
    if (!user) return false;
    return user.role === requiredRole;
  };

  // Fonction pour vérifier si l'utilisateur a l'un des rôles spécifiés
  const hasAnyRole = (requiredRoles) => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };
  
  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    register,
    forgotPassword,
    hasRole,
    hasAnyRole,
    userRoles: USER_ROLES,
    // Ajouter une fonction qui peut être utilisée partout dans l'app pour vérifier la validité du token
    checkTokenValidity: async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        handleLogout();
        return false;
      }
      const isValid = await verifyToken(token);
      if (!isValid) {
        handleLogout();
        return false;
      }
      return true;
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};