import React, { useState, useEffect } from 'react';
import CompetitionCard from './CompetitionCard';
import CompetitionFilters from './CompetitionFilters';
import * as CompetitionService from '@/services/competition-service';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

import { usePagination } from '@/hooks/usePagination';

const CompetitionList = ({ isUserView = true, initialFilters = {} }) => {
  // États pour les compétitions et le chargement
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  // Utilisation du hook de pagination
  const { currentPage, itemsPerPage, totalPages, setTotalItems, handlePageChange } = usePagination({
    initialItemsPerPage: 9,
    initialPage: 1,
  });

  // Charger les compétitions
  const fetchCompetitions = async () => {
    setLoading(true);
    try {
      const competitionsData = await CompetitionService.getAllCompetitions(filters);
      // S'assurer que nous travaillons avec un tableau
      const competitionsArray = competitionsData || [];
      setCompetitions(competitionsArray);
      setTotalItems(competitionsArray.length); // Pour la pagination
      setError(null);
    } catch (err) {
      setError('Impossible de charger les compétitions. Veuillez réessayer plus tard.');
      setCompetitions([]);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour charger les compétitions lors du montage
  // et lorsque les filtres ou la pagination changent
  useEffect(() => {
    fetchCompetitions();
  }, [filters, currentPage, itemsPerPage]);

  // Gérer le changement de filtres
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Calculer les compétitions à afficher pour la page actuelle
  const paginatedCompetitions = competitions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Afficher un message de chargement
  if (loading) {
    return (
      <div className="w-full">
        <CompetitionFilters onFilterChange={handleFilterChange} />
          <LoadingSpinner />;
      </div>
    );
  }

  // Afficher un message d'erreur
  if (error) {
    return (
      <div className="w-full">
        <CompetitionFilters onFilterChange={handleFilterChange} />
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md my-4">
          <p>{error}</p>
          <button 
            onClick={fetchCompetitions} 
            className="mt-2 text-sm font-medium text-red-700 underline"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Afficher un message si aucune compétition n'est trouvée
  if (competitions.length === 0) {
    return (
      <div className="w-full">
        <CompetitionFilters onFilterChange={handleFilterChange} />
        <div className="bg-gray-50 border border-gray-200 text-gray-600 px-6 py-8 rounded-md text-center my-4">
          <h3 className="text-lg font-medium mb-2">Aucune compétition trouvée</h3>
          <p className="text-gray-500">
            Aucune compétition ne correspond à vos critères de recherche. Essayez d'ajuster vos filtres.
          </p>
        </div>
      </div>
    );
  }

  // Rendu principal
  return (
    <div className="w-full">
      <CompetitionFilters onFilterChange={handleFilterChange} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
        {paginatedCompetitions.map((competition) => (
          <CompetitionCard 
            key={competition.id} 
            competition={competition}
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
                    ? 'bg-blue-600 text-white'
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

export default CompetitionList;