import React, { useState } from 'react';
import { PlayerPosition, PlayerStatus } from '@/lib/utils/enums';

const MatchSheetFilter = ({ players, onFilterChange }) => {
  const [filters, setFilters] = useState({
    position: '',
    status: '',
    minGoals: '',
    hasCards: false,
    search: ''
  });

  const handleFilterChange = (field, value) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
    
    // Appliquer les filtres et retourner les joueurs filtrés
    const filteredPlayers = applyFilters(players, updatedFilters);
    onFilterChange(filteredPlayers);
  };

  const applyFilters = (players, currentFilters) => {
    return players.filter(player => {
      // Filtre par position
      if (currentFilters.position && player.position !== currentFilters.position && 
          player.positionPlayed !== currentFilters.position) {
        return false;
      }
      
      // Filtre par statut
      if (currentFilters.status && player.playerStatus !== currentFilters.status) {
        return false;
      }
      
      // Filtre par nombre de buts
      if (currentFilters.minGoals && (!player.goalsScored || player.goalsScored < parseInt(currentFilters.minGoals))) {
        return false;
      }
      
      // Filtre par cartons
      if (currentFilters.hasCards && 
          (!player.yellowCards || player.yellowCards === 0) && 
          (!player.redCards || player.redCards === 0)) {
        return false;
      }
      
      // Filtre par recherche textuelle (nom du joueur)
      if (currentFilters.search && 
          !player.playerName.toLowerCase().includes(currentFilters.search.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  };
  
  const resetFilters = () => {
    const resetState = {
      position: '',
      status: '',
      minGoals: '',
      hasCards: false,
      search: ''
    };
    setFilters(resetState);
    onFilterChange(players);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-3">Filtrer les joueurs</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Filtre par recherche */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Rechercher un joueur
          </label>
          <input
            type="text"
            id="search"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="Nom du joueur..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
        
        {/* Filtre par position */}
        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
            Position
          </label>
          <select
            id="position"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            value={filters.position}
            onChange={(e) => handleFilterChange('position', e.target.value)}
          >
            <option value="">Toutes</option>
            <option value={PlayerPosition.GOALKEEPER}>Gardien</option>
            <option value={PlayerPosition.DEFENDER}>Défenseur</option>
            <option value={PlayerPosition.MIDFIELDER}>Milieu</option>
            <option value={PlayerPosition.FORWARD}>Attaquant</option>
          </select>
        </div>
        
        {/* Filtre par statut */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Statut
          </label>
          <select
            id="status"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">Tous</option>
            <option value={PlayerStatus.STARTER}>Titulaire</option>
            <option value={PlayerStatus.SUBSTITUTE}>Remplaçant</option>
            <option value={PlayerStatus.NOT_PLAYED}>Non joué</option>
            <option value={PlayerStatus.INJURED}>Blessé</option>
            <option value={PlayerStatus.EXPELLED}>Expulsé</option>
            <option value={PlayerStatus.RESERVE}>Réserve</option>
          </select>
        </div>
        
        {/* Filtre par buts */}
        <div>
          <label htmlFor="minGoals" className="block text-sm font-medium text-gray-700 mb-1">
            Buts minimum
          </label>
          <input
            type="number"
            id="minGoals"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            min="0"
            value={filters.minGoals}
            onChange={(e) => handleFilterChange('minGoals', e.target.value)}
          />
        </div>
        
        {/* Filtre par cartons */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasCards"
            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            checked={filters.hasCards}
            onChange={(e) => handleFilterChange('hasCards', e.target.checked)}
          />
          <label htmlFor="hasCards" className="ml-2 block text-sm text-gray-700">
            Avec cartons
          </label>
          
          <button
            type="button"
            onClick={resetFilters}
            className="ml-auto px-3 py-1 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchSheetFilter;