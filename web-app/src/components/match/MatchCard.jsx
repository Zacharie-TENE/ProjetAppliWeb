import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const MatchCard = ({ match, isUserView = true }) => {
  // Déterminer le statut du match pour l'affichage
  const getStatusDisplay = () => {
    const statusMap = {
      'SCHEDULED': { text: 'Programmé', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
      'IN_PROGRESS': { text: 'En cours', bgColor: 'bg-green-100', textColor: 'text-green-800' },
      'COMPLETED': { text: 'Terminé', bgColor: 'bg-purple-100', textColor: 'text-purple-800' },
      'POSTPONED': { text: 'Reporté', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
      'CANCELLED': { text: 'Annulé', bgColor: 'bg-red-100', textColor: 'text-red-800' }
    };
    
    const statusInfo = statusMap[match.status] || { text: match.status, bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
        {statusInfo.text}
      </span>
    );
  };

  // Formatter la date et l'heure
  const formattedDateTime = match.scheduledDateTime
    ? format(new Date(match.scheduledDateTime), 'dd MMM yyyy - HH:mm', { locale: fr })
    : 'Date non définie';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-800 text-lg">{match.title}</h3>
          {getStatusDisplay()}
        </div>
        
        <div className="text-sm text-gray-600 mb-3">
          <div className="flex items-center mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formattedDateTime}</span>
          </div>
          <div className="flex items-center truncate text-xs text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>{match.competitionName}</span>
            {match.round && <span className="ml-1">- {match.round}</span>}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-center w-full">
            <Link 
              href={isUserView ? `/teams/${match.homeTeamId}` : `/dashboard/teams/${match.homeTeamId}`} 
              className="text-right mx-2 text-sm font-medium hover:text-green-600 transition-colors truncate max-w-[30%]"
            >
              {match.homeTeamName}
            </Link>
            
            <div className={`mx-2 px-3 py-1 rounded text-sm font-bold transition-colors ${
              match.status === 'COMPLETED' || match.status === 'IN_PROGRESS'
                ? 'bg-gray-200 text-gray-800'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {match.status === 'COMPLETED' || match.status === 'IN_PROGRESS'
                ? `${match.homeTeamScore ?? 0} - ${match.awayTeamScore ?? 0}`
                : 'VS'}
            </div>
            
            <Link 
              href={isUserView ? `/teams/${match.awayTeamId}` : `/dashboard/teams/${match.awayTeamId}`} 
              className="text-left mx-2 text-sm font-medium hover:text-green-600 transition-colors truncate max-w-[30%]"
            >
              {match.awayTeamName}
            </Link>
          </div>
        </div>
        
        <div className="flex justify-center mt-4">
          <Link
            href={isUserView ? `/matches/${match.id}` : `/dashboard/matches/${match.id}`}
            className="text-green-600 hover:text-green-800 hover:underline text-sm font-medium transition-colors"
          >
            Voir les détails
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;