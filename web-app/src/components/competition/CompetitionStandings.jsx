import React, { useState, useEffect } from 'react';
import * as CompetitionService from '@/services/competition-service';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const CompetitionStandings = ({ competitionId }) => {
  // États pour les données et le chargement
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger le classement
  const fetchStandings = async () => {
    setLoading(true);
    try {
      const data = await CompetitionService.getCompetitionStandings(competitionId);
      setStandings(data);
      setError(null);
    } catch (err) {
      setError('Impossible de charger le classement. Veuillez réessayer plus tard.');
      setStandings([]);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour charger le classement au montage
  useEffect(() => {
    if (competitionId) {
      fetchStandings();
    }
  }, [competitionId]);

  // Fonction pour déterminer la couleur de fond selon la position
  const getRowClass = (position) => {
    // Les 3 premières positions ont des couleurs différentes
    if (position === 1) return 'bg-green-50';
    if (position === 2) return 'bg-blue-50';
    if (position === 3) return 'bg-indigo-50';
    return position % 2 === 0 ? 'bg-gray-50' : 'bg-white';
  };

  // Fonction pour afficher les derniers résultats de l'équipe
  const renderForm = (form) => {
    if (!form) return null;
    
    const results = form.split('-');
    
    return (
      <div className="flex space-x-1">
        {results.map((result, index) => {
          let bgColor = 'bg-gray-200';
          let textColor = 'text-gray-700';
          
          if (result === 'W') {
            bgColor = 'bg-green-200';
            textColor = 'text-green-800';
          } else if (result === 'L') {
            bgColor = 'bg-red-200';
            textColor = 'text-red-800';
          } else if (result === 'D') {
            bgColor = 'bg-yellow-200';
            textColor = 'text-yellow-800';
          }
          
          return (
            <span 
              key={index} 
              className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${bgColor} ${textColor} text-xs font-medium`}
            >
              {result}
            </span>
          );
        })}
      </div>
    );
  };

  // Afficher un message de chargement
  if (loading) {
    return <LoadingSpinner />;
  }

  // Afficher un message d'erreur
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>{error}</p>
        <button 
          onClick={fetchStandings} 
          className="mt-2 text-sm font-medium text-red-700 underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Si pas de données
  if (standings.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-600 px-6 py-8 rounded-md text-center">
        <h3 className="text-lg font-medium mb-2">Classement non disponible</h3>
        <p className="text-gray-500">
          Le classement n'est pas encore disponible pour cette compétition.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 overflow-hidden rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pos
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Équipe
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              MJ
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              V
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              N
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              D
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              BP
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              BC
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Diff
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pts
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Forme
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {standings.map((team) => (
            <tr key={team.id} className={getRowClass(team.position)}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {team.position}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{team.teamName}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {team.matchesPlayed}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {team.wins}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {team.draws}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {team.losses}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {team.goalsFor}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {team.goalsAgainst}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                team.goalDifference > 0 
                  ? 'text-green-600' 
                  : team.goalDifference < 0 
                    ? 'text-red-600' 
                    : 'text-gray-500'
              }`}>
                {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                {team.points}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {renderForm(team.form)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Légende */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 px-2">
        <div className="flex items-center space-x-2">
          <span className="inline-block h-4 w-4 bg-green-50 rounded"></span>
          <span className="text-xs text-gray-600">Champion</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-200 text-green-800 text-xs font-medium">W</span>
          <span className="text-xs text-gray-600">Victoire</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-yellow-200 text-yellow-800 text-xs font-medium">D</span>
          <span className="text-xs text-gray-600">Match nul</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-block h-4 w-4 bg-blue-50 rounded"></span>
          <span className="text-xs text-gray-600">2ème place</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-200 text-red-800 text-xs font-medium">L</span>
          <span className="text-xs text-gray-600">Défaite</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-block h-4 w-4 bg-indigo-50 rounded"></span>
          <span className="text-xs text-gray-600">3ème place</span>
        </div>
      </div>
    </div>
  );
};

export default CompetitionStandings;