import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-green-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Page introuvable
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/" 
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium rounded-md px-6 py-3 transition-colors"
          >
            Retour à l'accueil
          </Link>
          
          <div className="mt-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Si vous pensez qu'il s'agit d'une erreur, veuillez contacter le support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}