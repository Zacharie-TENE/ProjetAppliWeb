'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AuthLayout({ children }) {
  const pathname = usePathname();
  
  // Déterminer quel onglet est actif
  const isLoginActive = pathname.includes('/login');
  const isRegisterActive = pathname.includes('/register');
  const isForgotPasswordActive = pathname.includes('/forgot-password');

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Partie gauche: image de fond et message d'accueil */}
      <div className="hidden md:flex md:w-1/2 bg-green-700 text-white p-8 flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-6">Bienvenue sur l'application de gestion sportive</h1>
          <p className="text-xl mb-4">
            Gérez vos compétitions, équipes, joueurs et matchs en toute simplicité
          </p>
          <p className="text-lg opacity-80">
            Une plateforme complète pour organisateurs, entraîneurs et joueurs de football
          </p>
        </div>
        
        <div className="relative h-64 md:h-80 lg:h-96 my-6">
          <Image 
            src="/globe.svg" 
            alt="Football illustration" 
            fill
            className="object-contain" 
            priority
          />
        </div>
        
        <div>
          <p className="text-sm opacity-70">
            © 2025 AppliWeb - Tous droits réservés
          </p>
        </div>
      </div>
      
      {/* Partie droite: contenu de la page d'authentification */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
          {/* Logo visible seulement sur mobile */}
          <div className="flex justify-center mb-8 md:hidden">
            <Image 
              src="/file.svg" 
              alt="Logo AppliWeb" 
              width={100} 
              height={100} 
              priority
            />
          </div>
          
          {/* Barre de navigation pour les différents formulaires d'authentification */}
          <div className="flex border-b border-gray-200">
            <Link
              href="/login"
              className={`w-1/3 py-4 px-6 text-center font-medium ${
                isLoginActive
                  ? 'text-green-800 border-b-2 border-green-800'
                  : 'text-gray-500 hover:text-green-800'
              }`}
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className={`w-1/3 py-4 px-6 text-center font-medium ${
                isRegisterActive
                  ? 'text-green-800 border-b-2 border-green-800'
                  : 'text-gray-500 hover:text-green-800'
              }`}
            >
              Inscription
            </Link>
            <Link
              href="/forgot-password"
              className={`w-1/3 py-4 px-6 text-center font-medium ${
                isForgotPasswordActive
                  ? 'text-green-800 border-b-2 border-green-800'
                  : 'text-gray-500 hover:text-green-800'
              }`}
            >
              Mot de passe
            </Link>
          </div>

          {/* Contenu du formulaire */}
          <div className="flex-1 flex items-center justify-center p-6 md:p-12">
            <div className="w-full max-w-md">
              {children}
            </div>
          </div>
          
          {/* Pied de page */}
          <div className="p-4 text-center text-gray-500 text-sm border-t border-gray-200">
            <p>&copy; {new Date().getFullYear()} SportApp - Tous droits réservés</p>
          </div>
        </div>
      </div>
    </div>
  );
}