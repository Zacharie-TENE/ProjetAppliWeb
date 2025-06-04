import React from 'react';
import Link from 'next/link';

const PlayerCard = ({ player, isUserView = true }) => {
  // Fonction pour obtenir le libellé de la position
  const getPositionLabel = (position) => {
    const positions = {
      'GOALKEEPER': 'Gardien de but',
      'DEFENDER': 'Défenseur',
      'MIDFIELDER': 'Milieu de terrain',
      'FORWARD': 'Attaquant'
    };
    return positions[position] || position;
  };
  
  // Fonction pour obtenir la couleur de badge du statut
  const getStatusColor = (status) => {
    const statusColors = {
      'STARTER': 'bg-green-100 text-green-800',
      'INJURED': 'bg-red-100 text-red-800',
      'SUSPENDED': 'bg-yellow-100 text-yellow-800',
      'SUSPENDED': 'bg-gray-100 text-gray-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };
  
  // Fonction pour obtenir le libellé du statut
  const getStatusLabel = (status) => {
    const statuses = {
      'STARTER': 'Titulaire',
      'SUBSTITUTE': 'Remplaçant',
      'INJURED': 'Blessé',
      'SUSPENDED': 'Suspendu',
    };
    return statuses[status] || status;
  };

    // Fonction pour calculer l'âge à partir de la date de naissance
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Calculer l'âge du joueur
  const playerAge = calculateAge(player.dateOfBirth);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-gray-800 text-lg">
            {isUserView ? (
              <Link href={`/players/${player.id}`} className="hover:text-indigo-600">
                {player.firstName} {player.lastName}
              </Link>
            ) : (
              <Link href={`/dashboard/coach/players/${player.id}`} className="hover:text-indigo-600">
                {player.firstName} {player.lastName}
              </Link>
            )}
          </h3>
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(player.status)}`}>
            {getStatusLabel(player.status)}
          </span>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <span className="w-24 flex-shrink-0 font-medium">Position:</span>
            <span>{getPositionLabel(player.position)}</span>
          </div>
          
          {player.number && (
            <div className="flex items-center">
              <span className="w-24 flex-shrink-0 font-medium">Numéro:</span>
              <span>#{player.number}</span>
            </div>
          )}
          
          {player.age && (
            <div className="flex items-center">
              <span className="w-24 flex-shrink-0 font-medium">Âge:</span>
              <span>{playerAge} ans</span>
            </div>
          )}
          
          {player.teamName && (
            <div className="flex items-center">
              <span className="w-24 flex-shrink-0 font-medium">Équipe:</span>
              {isUserView ? (
                <Link href={`/teams/${player.teamId}`} className="text-indigo-600 hover:underline">
                  {player.teamName}
                </Link>
              ) : (
                <Link href={`/dashboard/coach/teams/${player.teamId}`} className="text-indigo-600 hover:underline">
                  {player.teamName}
                </Link>
              )}
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500">
            <span className="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
              {player.matchesPlayed || 0} matchs
            </span>
            <span className="mx-2">•</span>
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {player.goals || 0} buts
            </span>
            <span className="mx-2">•</span>
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {player.assists || 0} passes
            </span>
          </div>
          
          {/* Bouton pour voir les détails */}
          {isUserView ? (
            <Link 
              href={`/players/${player.id}`}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              Voir profil
              <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <Link 
              href={`/dashboard/coach/players/${player.id}`}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              Gérer
              <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;