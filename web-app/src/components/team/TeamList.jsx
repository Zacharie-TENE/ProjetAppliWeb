import React, { useState, useEffect } from 'react';
import TeamCard from './TeamCard';
import TeamFilters from './TeamFilters';
import   * as  TeamService from '@/services/team-service';
import { usePagination } from '@/hooks/usePagination';

const TeamList = ({ isUserView = true, initialFilters = {}, coachId = null , competitionId=null}) => {
  // États pour les équipes et le chargement
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  // Utilisation du hook de pagination
  const { currentPage, itemsPerPage, totalPages, setTotalItems, handlePageChange } = usePagination({
    initialItemsPerPage: 9,
    initialPage: 1,
  });

  // Charger les équipes
  const fetchTeams = async () => {
    setLoading(true);
    try {
      let response;
      if(competitionId) {

        response = await TeamService.getTeamsByCompetition(competitionId, filters);
        
      }
      else if (coachId) {
        // Si un ID de coach est fourni, charger les équipes de ce coach
        response = await TeamService.getTeamsByCoach(coachId, filters);
      } else {
        // Sinon, charger toutes les équipes avec les filtres
        response = await TeamService.getAllTeams(filters);
      }
      // S'assurer que nous travaillons avec un tableau
      const teamsArray = response || [];
      setTeams(teamsArray);
      setTotalItems(teamsArray.length); // Pour la pagination
      setError(null);
    } catch (err) {
      setError('Impossible de charger les équipes. Veuillez réessayer plus tard.');
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour charger les équipes lors du montage
  // et lorsque les filtres ou la pagination changent
  useEffect(() => {
    fetchTeams();
  }, [filters, currentPage, itemsPerPage,competitionId, coachId]);

  // Gérer le changement de filtres
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Calculer les équipes à afficher pour la page actuelle
  const paginatedTeams = teams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Afficher un message de chargement
  if (loading && !paginatedTeams.length) {
    return (
      <div className="w-full">
        <TeamFilters onFilterChange={handleFilterChange} />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Afficher un message d'erreur
  if (error) {
    return (
      <div className="w-full">
        <TeamFilters onFilterChange={handleFilterChange} />
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md my-4">
          <p>{error}</p>
          <button 
            onClick={fetchTeams} 
            className="mt-2 text-sm font-medium text-red-700 underline"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Afficher un message si aucune équipe n'est trouvée
  if (teams.length === 0) {
    return (
      <div className="w-full">
        <TeamFilters onFilterChange={handleFilterChange} />
        <div className="bg-gray-50 border border-gray-200 text-gray-600 px-6 py-8 rounded-md text-center my-4">
          <h3 className="text-lg font-medium mb-2">Aucune équipe trouvée</h3>
          <p className="text-gray-500">
            Aucune équipe ne correspond à vos critères de recherche. Essayez d'ajuster vos filtres.
          </p>
        </div>
      </div>
    );
  }

  // Rendu principal
  return (
    <div className="w-full">
      <TeamFilters onFilterChange={handleFilterChange} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
        {paginatedTeams.map((team) => (
          <TeamCard 
            key={team.id} 
            team={team}
            isUserView={isUserView}
          />
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 mb-4">
          <nav className="flex items-center">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 mx-1 rounded-md ${
                currentPage === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Précédent
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 mx-1 rounded-md ${
                  currentPage === index + 1
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 mx-1 rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Suivant
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default TeamList;