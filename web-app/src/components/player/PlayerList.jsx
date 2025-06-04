import React, { useState, useEffect } from 'react';
import PlayerCard from './PlayerCard';
import PlayerFilters from './PlayerFilters';
import   * as PlayerService from '@/services/player-service';
import { usePagination } from '@/hooks/usePagination';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import Link from 'next/link';

const PlayerList = ({ isUserView = true, initialFilters = {}, teamId = null }) => {
  // États pour les joueurs et le chargement
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  
  // Vérifier si l'utilisateur est un coach
  const { hasAccess } = useRoleAccess();
  const isCoach = hasAccess(['COACH', 'ADMIN']);

  // Utilisation du hook de pagination
  const { currentPage, itemsPerPage, totalPages, setTotalItems, handlePageChange } = usePagination({
    initialItemsPerPage: 12,
    initialPage: 1,
  });

  // Charger les joueurs
  const fetchPlayers = async () => {
    setLoading(true);
    try {
      let response;
      
      // Récupérer les joueurs selon le contexte
      if (teamId) {
        // Joueurs d'une équipe spécifique
        response = await PlayerService.getPlayersByTeam(teamId, filters);
      } else {
        // Tous les joueurs
        response = await PlayerService.getAllPlayers(filters);
      }
      
      // S'assurer que nous travaillons avec un tableau
      const playersArray = response || [];
      setPlayers(playersArray);
      setTotalItems(playersArray.length); // Pour la pagination
      setError(null);
    } catch (err) {
      setError('Impossible de charger les joueurs. Veuillez réessayer plus tard.');
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour charger les joueurs lors du montage
  // et lorsque les filtres ou la pagination changent
  useEffect(() => {
    fetchPlayers();
  }, [filters, currentPage, itemsPerPage, teamId]);

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  // Calculer les joueurs à afficher pour la page actuelle
  const paginatedPlayers = players.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Afficher un message de chargement
  if (loading && !paginatedPlayers.length) {
    return (
      <div className="w-full">
        <PlayerFilters 
          filters={filters} 
          setFilters={setFilters} 
          resetFilters={resetFilters}
        />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  // Afficher un message d'erreur
  if (error) {
    return (
      <div className="w-full">
        <PlayerFilters 
          filters={filters} 
          setFilters={setFilters} 
          resetFilters={resetFilters}
        />
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md my-4">
          <p>{error}</p>
          <button 
            onClick={fetchPlayers} 
            className="mt-2 text-sm font-medium text-red-700 underline"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Afficher un message si aucun joueur n'est trouvé
  if (players.length === 0) {
    return (
      <div className="w-full">
        <PlayerFilters 
          filters={filters} 
          setFilters={setFilters} 
          resetFilters={resetFilters}
        />
        <div className="bg-gray-50 border border-gray-200 text-gray-600 px-6 py-8 rounded-md text-center my-4">
          <h3 className="text-lg font-medium mb-2">Aucun joueur trouvé</h3>
          <p className="text-gray-500">
            Aucun joueur ne correspond à vos critères de recherche. Essayez d'ajuster vos filtres.
          </p>
        </div>
      </div>
    );
  }

  // Rendu principal
  return (
    <div className="w-full">
      <PlayerFilters 
        filters={filters} 
        setFilters={setFilters} 
        resetFilters={resetFilters}
      />
      
      {/* Bouton pour ajouter un nouveau joueur (coachs seulement) */}
      {isCoach && !isUserView && (
        <div className="mb-6 flex justify-end">
          <Link 
            href={teamId ? `/dashboard/coach/teams/${teamId}/players/create` : "/dashboard/coach/players/create"}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Ajouter un joueur
          </Link>
        </div>
      )}
      
      {/* En-tête de la liste */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Joueurs ({players.length})
        </h2>
      </div>
      
      {/* Liste des joueurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
        {paginatedPlayers.map((player) => (
          <PlayerCard 
            key={player.id} 
            player={player}
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
                    ? 'bg-indigo-600 text-white'
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

export default PlayerList;