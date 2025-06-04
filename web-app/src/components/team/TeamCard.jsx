import React from 'react';
import Link from 'next/link';

const TeamCard = ({ team }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="bg-gradient-to-r from-green-600 to-green-800 p-4 text-white">
        <h3 className="font-bold text-xl">{team.name}</h3>
        <p className="text-sm opacity-90">Coach: {team.coachName}</p>
      </div>
      
      <div className="p-4 space-y-4">
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {team.category}
          </span>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Joueurs:</span>
            <span className="font-medium">{team.playerCount || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Compétitions:</span>
            <span className="font-medium">{team.competitionCount || 0}</span>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-100">
          <Link 
            href={`/teams/${team.id}`}
            className="block w-full text-center px-4 py-2 bg-green-100 text-green-700 rounded-md font-medium hover:bg-green-200 transition-colors"
          >
            Voir l'équipe
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;