'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthContext, USER_ROLES } from '../context/AuthContext';

/**
 * Hook personnalisé pour gérer les contrôles d'accès basés sur les rôles
 * 
 * @returns {Object} Objet contenant les informations d'accès utilisateur et les fonctions de vérification
 */
export const useRoleAccess = () => {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Vérifier si l'utilisateur a accès en fonction de son rôle
  const hasAccess = (allowedRoles = []) => {
    if (!user) return false;
    
    // Si aucun rôle n'est spécifié, on considère que tous les utilisateurs authentifiés ont accès
    if (allowedRoles.length === 0) return true;
    
    // Vérifier si le rôle de l'utilisateur est dans la liste des rôles autorisés
    return allowedRoles.includes(user.role);
  };

  // Vérifier si l'utilisateur peut accéder à une route spécifique
  const checkRouteAccess = (route) => {
    // Routes accessibles à tous
    const publicRoutes = [
      '/', 
      '/competitions', 
      '/teams', 
      '/players', 
      '/matches', 
      '/media',
      '/auth/login',
      '/auth/register',
      '/auth/forgot-password'
    ];
    
    // Si c'est une route publique, autoriser l'accès
    if (publicRoutes.some(publicRoute => route.startsWith(publicRoute))) {
      return true;
    }
    
    // Si l'utilisateur n'est pas connecté, refuser l'accès aux routes protégées
    if (!user) {
      return false;
    }
    
    // Routes spécifiques selon le rôle
    const roleRoutes = {
      [USER_ROLES.PLAYER]: ['/dashboard/profile', '/dashboard/messages', '/dashboard/notifications'],
      [USER_ROLES.COACH]: [
        '/dashboard/profile', 
        '/dashboard/messages', 
        '/dashboard/notifications',
        '/dashboard/coach'
      ],
      [USER_ROLES.ORGANIZER]: [
        '/dashboard/profile', 
        '/dashboard/messages', 
        '/dashboard/notifications',
        '/dashboard/organizer'
      ],
      [USER_ROLES.ADMIN]: ['/dashboard/admin', '/dashboard/profile', '/dashboard/messages', '/dashboard/notifications'],
    };
    
    // Vérifier si l'utilisateur a accès à la route en fonction de son rôle
    if (user.role && roleRoutes[user.role]) {
      return roleRoutes[user.role].some(roleRoute => route.startsWith(roleRoute));
    }
    
    return false;
  };

  // Rediriger l'utilisateur si la route actuelle n'est pas autorisée
  useEffect(() => {
    if (!isLoading) {
      const canAccess = checkRouteAccess(pathname);
      setIsAuthorized(canAccess);
      
      if (!canAccess) {
        // Rediriger en fonction de l'état d'authentification
        if (user) {
          // Utilisateur connecté mais pas autorisé
          router.push('/dashboard');
        } else {
          // Utilisateur non connecté
          router.push('/auth/login?returnUrl=' + encodeURIComponent(pathname));
        }
      }
    }
  }, [user, isLoading, pathname, router]);

  return {
    hasAccess,
    checkRouteAccess,
    isAuthorized,
    userRole: user?.role,
    userId: user?.id,
    isLoading
  };
};

export default useRoleAccess;