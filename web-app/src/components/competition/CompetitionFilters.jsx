import React, { useState, useEffect } from 'react';
import { useFilter } from '@/hooks/useFilter';

const CompetitionFilters = ({ onFilterChange }) => {
  // État local pour les filtres
  const [filters, setFilters] = useState({
    status: '',
    name: '',
    organizerName: '',
    category: '',
    dateRange: {
      from: '',
      to: ''
    }
  });

  // Utilisation du hook personnalisé de filtrage
  const { applyFilters, resetFilters } = useFilter();

  // Gestion des changements de filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('dateRange')) {
      const dateKey = name.split('.')[1];
      setFilters(prev => ({
        ...prev,
        dateRange: {
          ...prev.dateRange,
          [dateKey]: value
        }
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setFilters({
      status: '',
      name: '',
      organizer: '',
      category: '',
      dateRange: {
        from: '',
        to: ''
      }
    });
    resetFilters();
    if (onFilterChange) onFilterChange({});
  };

  // Appliquer les filtres
  const handleApplyFilters = () => {
    const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      // Pour le dateRange, vérifier si les deux dates sont définies et les formater
      if (key === 'dateRange') {
        if (value.from && value.to) {

          acc["startDate"] = new Date(`${value.from}T00:00:00`).toISOString();
          acc["endDate"] = new Date(`${value.to}T23:59:59`).toISOString();
        }
      } 
      // Pour les autres filtres, les ajouter seulement s'ils ne sont pas vides
      else if (value) {
        acc[key] = value;
      }
      return acc;
    }, {});

    applyFilters(activeFilters);
    if (onFilterChange) onFilterChange(activeFilters);
  };

  useEffect(() => {
    // Optionnel: appliquer automatiquement les filtres
    // lorsque certains filtres changent
  }, [filters.status]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Filtrer les compétitions
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Filtre par statut */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Statut
          </label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les statuts</option>
            <option value="UPCOMING">À venir</option>
            <option value="REGISTRATION">Inscription ouverte</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="COMPLETED">Terminées</option>
            <option value="CANCELLED">Annulées</option>
          </select>
        </div>
        
        {/* Filtre par nom */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom de la compétition
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            placeholder="Rechercher par nom"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Filtre par organisateur */}
        <div>
          <label htmlFor="organizer" className="block text-sm font-medium text-gray-700 mb-1">
            Organisateur
          </label>
          <input
            type="text"
            id="organizer"
            name="organizer"
            value={filters.organizerName}
            onChange={handleFilterChange}
            placeholder="Nom de l'organisateur"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Filtre par catégorie */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={filters.category}
              onChange={(e) => {
                const { name, value } = e.target;
                handleFilterChange({ target: { name, value: value.toUpperCase() } });
              }}
              placeholder="SENIOR, JUNIOR, VETERAN"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Filtre par date de début */}
        <div>
          <label htmlFor="dateRange.from" className="block text-sm font-medium text-gray-700 mb-1">
            Date de début
          </label>
          <input
            type="date"
            id="dateRange.from"
            name="dateRange.from"
            value={filters.dateRange.from}
            onChange={handleFilterChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Filtre par date de fin */}
        <div>
          <label htmlFor="dateRange.to" className="block text-sm font-medium text-gray-700 mb-1">
            Date de fin
          </label>
          <input
            type="date"
            id="dateRange.to"
            name="dateRange.to"
            value={filters.dateRange.to}
            onChange={handleFilterChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Appliquer les filtres
        </button>
      </div>
    </div>
  );
};

export default CompetitionFilters;