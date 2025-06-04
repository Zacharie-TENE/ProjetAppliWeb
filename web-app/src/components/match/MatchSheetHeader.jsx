import React from 'react';
import Link from 'next/link';

// Composant pour l'affichage de la section d'en-tête d'une feuille de match
const MatchSheetHeader = ({ 
  match, 
  matchSheet, 
  formattedDateTime, 
  matchId, 
  opponentName, 
  opponentId, 
  isUserView 
}) => {
  const isHomeTeam = matchSheet.teamRole === 'HOME';
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Feuille de match : {matchSheet.teamName}
          </h1>
          <p className="text-gray-600">{match.title}</p>
          <p className="text-sm text-gray-500">{formattedDateTime}</p>
          <p className="text-sm text-gray-500">{match.competitionName}</p>
          {match.location && <p className="text-sm text-gray-500">Lieu : {match.location}</p>}
        </div>
        
        <Link
          href={isUserView ? `/matches/${matchId}` : `/dashboard/matches/${matchId}`}
          className="text-green-600 hover:text-green-800 text-sm font-medium"
        >
          Retour au match
        </Link>
      </div>
      
      {/* Score */}
      <div className="flex items-center justify-center my-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between w-full max-w-md">
          <div className="text-center">
            <Link
              href={isUserView ? `/teams/${matchSheet.teamId}` : `/dashboard/teams/${matchSheet.teamId}`}
              className="font-bold text-lg text-gray-800 hover:text-green-600"
            >
              {matchSheet.teamName}
            </Link>
            <div className="mt-2 text-3xl font-bold">{matchSheet.teamScore}</div>
          </div>
          
          <div className="text-xl font-bold text-gray-500">-</div>
          
          <div className="text-center">
            <Link
              href={isUserView ? `/teams/${opponentId}` : `/dashboard/teams/${opponentId}`}
              className="font-bold text-lg text-gray-800 hover:text-green-600"
            >
              {opponentName}
            </Link>
            <div className="mt-2 text-3xl font-bold">{matchSheet.opponentScore}</div>
          </div>
        </div>
      </div>
      
      {/* Formation et commentaires */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {matchSheet.strategy && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Formation tactique</h3>
            <p className="text-gray-700 font-medium bg-gray-50 p-2 rounded">{matchSheet.strategy}</p>
          </div>
        )}
        
        {matchSheet.coachComments && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Commentaires du coach</h3>
            <p className="text-gray-600 bg-gray-50 p-2 rounded">{matchSheet.coachComments}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchSheetHeader;