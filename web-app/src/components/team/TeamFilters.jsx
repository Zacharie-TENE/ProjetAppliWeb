import React, { useState, useEffect } from 'react';
import { useFilter } from '@/hooks/useFilter';

const TeamFilters = ({ onFilterChange }) => {
  // État local pour les filtres
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    coachName: ''
  });

  // Utilisation du hook personnalisé de filtrage
  const { applyFilters, resetFilters } = useFilter();

  // Gestion des changements de filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setFilters({
      name: '',
      category: '',
      coachName: ''
    });
    resetFilters();
    if (onFilterChange) onFilterChange({});
  };

  // Appliquer les filtres
  const handleApplyFilters = () => {
    const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value) {
        acc[key] = value;
      }
      return acc;
    }, {});

    applyFilters(activeFilters);
    if (onFilterChange) onFilterChange(activeFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Filtrer les équipes
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom de l'équipe
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Rechercher par nom"
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes les catégories</option>
            <option value="JUNIOR">Junior</option>
            <option value="SENIOR">Senior</option>
            <option value="VETERAN">Vétéran</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="coachName" className="block text-sm font-medium text-gray-700 mb-1">
            Nom du coach
          </label>
          <input
            type="text"
            id="coachName"
            name="coachName"
            value={filters.coachName}
            onChange={handleFilterChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nom du coach"
          />
        </div>
      </div>
      
      {/* Boutons d'action */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={handleResetFilters}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Réinitialiser
        </button>
        <button
          onClick={handleApplyFilters}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Appliquer les filtres
        </button>
      </div>
    </div>
  );
};

export default TeamFilters;