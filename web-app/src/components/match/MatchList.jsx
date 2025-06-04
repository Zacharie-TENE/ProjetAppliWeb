import React, { useState, useEffect } from 'react';
import MatchCard from './MatchCard';
import MatchFilters from './MatchFilters';
import * as Matchservice from '@/services/match-service';
import { usePagination } from '@/hooks/usePagination';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import Link from 'next/link';

const MatchList = ({ isUserView = true, initialFilters = {}, teamId = null, competitionId = null }) => {
  // États pour les matchs et le chargement
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  
  // Vérifier si l'utilisateur est un organisateur
  const { hasAccess } = useRoleAccess();
  const isOrganizer = hasAccess(['ORGANIZER', 'ADMIN']);

  // Utilisation du hook de pagination
  const { currentPage, itemsPerPage, totalPages, setTotalItems, handlePageChange } = usePagination({
    initialItemsPerPage: 9,
    initialPage: 1,
  });

  // Charger les matchs
  const fetchMatches = async () => {
    setLoading(true);
    try {
      let response;
      
      // Récupérer les matchs selon le contexte
      if (competitionId) {
        // Matchs d'une compétition spécifique
        response = await Matchservice.getMatchesByCompetitionId(competitionId, filters);
      } else if (teamId) {
        // Matchs d'une équipe spécifique
        response = await Matchservice.getMatchesByTeamId(teamId, filters);
      } else {
        // Tous les matchs
        response = await Matchservice.getAllMatches(filters);
      }
      
    
      // S'assurer que nous travaillons avec un tableau
      const matchesArray = response|| [];
      setMatches(matchesArray);
      setTotalItems(matchesArray.length); // Pour la pagination
      setError(null);
    } catch (err) {
      setError('Impossible de charger les matchs. Veuillez réessayer plus tard.');
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour charger les matchs lors du montage
  // et lorsque les filtres ou la pagination changent
  useEffect(() => {
    fetchMatches();
  }, [filters, currentPage, itemsPerPage, competitionId, teamId]);

  // Gérer le changement de filtres
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Calculer les matchs à afficher pour la page actuelle
  const paginatedMatches = matches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Afficher un message de chargement
  if (loading && !paginatedMatches.length) {
    return (
      <div className="w-full">
        <MatchFilters onFilterChange={handleFilterChange} initialFilters={filters} />
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
        <MatchFilters onFilterChange={handleFilterChange} initialFilters={filters} />
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md my-4">
          <p>{error}</p>
          <button 
            onClick={fetchMatches} 
            className="mt-2 text-sm font-medium text-red-700 underline"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Afficher un message si aucun match n'est trouvé
  if (matches.length === 0) {
    return (
      <div className="w-full">
        <MatchFilters onFilterChange={handleFilterChange} initialFilters={filters} />
        <div className="bg-gray-50 border border-gray-200 text-gray-600 px-6 py-8 rounded-md text-center my-4">
          <h3 className="text-lg font-medium mb-2">Aucun match trouvé</h3>
          <p className="text-gray-500">
            Aucun match ne correspond à vos critères de recherche. Essayez d'ajuster vos filtres.
          </p>
        </div>
      </div>
    );
  }

  // Rendu principal
  return (
    <div className="w-full">
      {/* Afficher les filtres seulement si pas dans un composant de liste spécifique */}
      {(!teamId && !competitionId) && <MatchFilters onFilterChange={handleFilterChange} initialFilters={filters} />}
      
      {/* Bouton pour créer un nouveau match (organisateurs seulement) */}
      {isOrganizer && !isUserView && (
        <div className="mb-6 flex justify-end">
          <Link 
            href={competitionId ? `/dashboard/organizer/competitions/${competitionId}/matches/create` : "/dashboard/organizer/matches/create"}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Programmer un match
          </Link>
        </div>
      )}
      
      {/* Liste des matchs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
        {paginatedMatches.map((match) => (
          <MatchCard 
            key={match.id} 
            match={match}
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
            
            {Array.from({ length: totalPages }, (_, index) => (
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

export default MatchList;