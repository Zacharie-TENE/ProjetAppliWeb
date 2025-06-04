import React, { useState, useEffect } from 'react';
import TeamList from '../team/TeamList';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import Button from '@/components/ui/Button';


const CompetitionTeamList = ({ competitionId, isUserView = true }) => {
  const { hasAccess, userRole } = useRoleAccess();
  const isOrganizer = hasAccess(['ORGANIZER', 'ADMIN']);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
      
        
        {isOrganizer && !isUserView && (
          <Button 
            href={`/dashboard/organizer/competitions/${competitionId}/teams/add`}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-3 rounded-md"
          >
            Ajouter des équipes
          </Button>
        )}
      </div>
      
      {/* Liste des équipes */}
    
        <TeamList 
          isUserView={isUserView}
          competitionId={competitionId}
        />
      
    </div>
  );
};

export default CompetitionTeamList;