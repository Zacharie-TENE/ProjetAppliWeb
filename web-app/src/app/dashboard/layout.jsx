'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getNavigationLinks } from '@/components/utils/navigationLinks';
import Image from 'next/image';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useTheme } from '@/hooks/useTheme';
import { getIcon} from '@/components/ui/Icon';

export default function DashboardLayout({ children }) {
  const { user, isLoading, logout, hasRole, userRoles } = useAuth();
  const { theme } = useTheme();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [links, setLinks] = useState([]);
  
  // Protection du layout contre les accès non authentifiés
  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = '/login';
    }
  }, [user, isLoading]);

  // Effet pour charger les liens de navigation une seule fois
  useEffect(() => {
    if (user) {
      // Obtenir les liens en fonction des rôles de l'utilisateur
      const navLinks = getNavigationLinks(user, hasRole, userRoles);
      setLinks(navLinks);
    }
  }, [user, hasRole, userRoles]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-800 to-green-600">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-14 h-14 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="mt-4 text-white font-medium text-xl">Chargement...</p>
        </div>
      </div>
    );
  }

  // Déterminer les classes CSS en fonction du thème
  const sidebarClasses = theme.isDark 
    ? "hidden md:flex flex-col w-64 bg-gray-900 text-white" 
    : "hidden md:flex flex-col w-64 bg-green-800 text-white";
  
  const sidebarBorderClass = theme.isDark 
    ? "border-gray-800" 
    : "border-green-700";
  
  const sidebarHoverClass = theme.isDark 
    ? "hover:bg-gray-800" 
    : "hover:bg-green-700";
  
  const activeNavClass = theme.isDark 
    ? "bg-gray-700 text-white font-semibold" 
    : "bg-white text-green-800 font-semibold";

  return (
    <div className={`flex h-screen ${theme.isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
      {/* Sidebar - Version Desktop */}
      <div className={sidebarClasses}>
        <div className={`p-4 flex items-center justify-center border-b ${sidebarBorderClass}`}>
          <div className={`${theme.isDark ? 'bg-gray-800' : 'bg-white'} p-2 rounded-full`}>
            <svg className={`w-8 h-8 ${theme.isDark ? 'text-white' : 'text-green-800'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="ml-3 text-xl font-bold">SportApp</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {links.map((link) => (
              <Link
                href={link.href}
                key={link.name}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                  pathname.startsWith(link.href)
                    ? activeNavClass
                    : `text-white ${sidebarHoverClass}`
                }`}
              >
                {getIcon(link.icon)}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        </nav>
        
        <div className={`p-4 border-t ${sidebarBorderClass}`}>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
              {user.profilePicture ? (
                <Image 
                  src={user.profilePicture} 
                  alt={user.firstName} 
                  width={40} 
                  height={40} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-green-600 text-white text-lg font-bold">
                  {user.firstName?.charAt(0) || user.userName?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-green-300">{user.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className={`mt-3 w-full flex items-center justify-center space-x-2 p-2 rounded-lg ${theme.isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-green-700 hover:bg-green-600'} transition-colors duration-200`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Header et contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`${theme.isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} shadow-sm z-10`}>
          <div className="flex items-center justify-between p-4">
            {/* Bouton du menu mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              )}
            </button>

            {/* Logo sur mobile */}
            <div className="md:hidden flex items-center">
              <div className={`${theme.isDark ? 'bg-white' : 'bg-green-800'} p-1 rounded-full mr-2`}>
                <svg className={`w-6 h-6 ${theme.isDark ? 'text-gray-900' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-lg font-bold">SportApp</span>
            </div>

            {/* Boutons d'action */}
            <div className="flex items-center space-x-4">
              {/* Sélecteur de thème */}
        
              <ThemeToggle className="hidden md:block" />
              {/* Notifications */}
              {(hasRole(userRoles.PLAYER) || hasRole(userRoles.COACH) || hasRole(userRoles.ORGANIZER) || hasRole(userRoles.ADMIN)) && (
                <Link href="/dashboard/notifications" className={`${theme.isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-green-800'}`}>
                  <div className="relative">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                    </svg>
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">5</span>
                  </div>
                </Link>
              )}

           

              {/* Profil sur mobile */}
              <div className="md:hidden">
                <button className="flex items-center space-x-2 focus:outline-none">
                  <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
                    {user.profilePicture ? (
                      <Image 
                        src={user.profilePicture} 
                        alt={user.firstName} 
                        width={32} 
                        height={32} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-green-600 text-white text-sm font-bold">
                        {user.firstName?.charAt(0) || user.userName?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                </button>
              </div>
              
              {/* Thème sur mobile */}
              <div className="md:hidden">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className={`md:hidden ${theme.isDark ? 'bg-gray-900' : 'bg-green-800'} text-white absolute inset-x-0 top-16 z-20 h-screen`}>
            <nav className="p-4">
              <div className="space-y-2">
                {links.map((link) => (
                  <Link
                    href={link.href}
                    key={link.name}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                      pathname.startsWith(link.href)
                        ? theme.isDark ? 'bg-gray-700 text-white font-semibold' : 'bg-white text-green-800 font-semibold'
                        : `text-white ${theme.isDark ? 'hover:bg-gray-800' : 'hover:bg-green-700'}`
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {getIcon(link.icon)}
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>
              <div className={`mt-6 pt-6 border-t ${theme.isDark ? 'border-gray-800' : 'border-green-700'}`}>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                    {user.profilePicture ? (
                      <Image 
                        src={user.profilePicture} 
                        alt={user.firstName} 
                        width={40} 
                        height={40} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-green-600 text-white text-lg font-bold">
                        {user.firstName?.charAt(0) || user.userName?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                    <p className={`text-xs ${theme.isDark ? 'text-gray-400' : 'text-green-300'}`}>{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className={`mt-3 w-full flex items-center justify-center space-x-2 p-2 rounded-lg ${theme.isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-green-700 hover:bg-green-600'} transition-colors duration-200`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  <span>Déconnexion</span>
                </button>
              </div>
            </nav>
          </div>
        )}

        {/* Contenu principal */}
        <main className={`flex-1 overflow-y-auto p-4 ${theme.isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className={`${theme.isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-sm p-5`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}