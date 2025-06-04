import React, { useState, useEffect } from 'react';
import   * as TeamService from '@/services/team-service';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const TeamHeader = ({ teamId }) => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les données de l'équipe
  const fetchTeamData = async () => {
    if (!teamId) return;
    
    setLoading(true);
    try {
      const data = await TeamService.getTeamById(teamId);
      setTeam(data);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les données de l\'équipe');
    } finally {
      setLoading(false);
    }
  };

  // Effet pour charger les données au montage
  useEffect(() => {
    fetchTeamData();
  }, [teamId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !team) {
    return (
      <div className="bg-red-100 p-6 text-red-700">
        <p>Erreur lors du chargement des données de l'équipe</p>
        <button 
          onClick={fetchTeamData}
          className="text-sm text-red-700 underline mt-2"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-700 to-green-900 p-6 text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{team.name}</h1>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full bg-white/20">
              {team.category}
            </span>
          </div>
          <p className="text-sm opacity-90">
            Coach: <span className="font-semibold">{team.coachName}</span>
          </p>
        </div>
        {team.logo && (
          <div className="mt-4 md:mt-0">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src={team.logo} 
                alt={`Logo ${team.name}`} 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamHeader;