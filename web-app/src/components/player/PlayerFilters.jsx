import React from 'react';

const PlayerFilters = ({ filters, setFilters, resetFilters }) => {
  // Gérer le changement des filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const positionOptions = [
    { value: '', label: 'Toutes les positions' },
    { value: 'GOALKEEPER', label: 'Gardien de but' },
    { value: 'DEFENDER', label: 'Défenseur' },
    { value: 'MIDFIELDER', label: 'Milieu de terrain' },
    { value: 'FORWARD', label: 'Attaquant' }
  ];

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'STARTER', label: 'Titulaire' },
    { value: 'INJURED', label: 'Blessé' },
    { value: 'SUSPENDED', label: 'Suspendu' },
    { value: 'SUBSTITUTE', label: 'Remplacant' }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Filtres</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom du joueur</label>
          <input
            type="text"
            id="name"
            name="name"
            value={filters.name || ''}
            onChange={handleFilterChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Rechercher par nom"
          />
        </div>
        
        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Position</label>
          <select
            id="position"
            name="position"
            value={filters.position || ''}
            onChange={handleFilterChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {positionOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
          <select
            id="status"
            name="status"
            value={filters.status || ''}
            onChange={handleFilterChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">Équipe</label>
          <input
            type="text"
            id="teamName"
            name="teamName"
            value={filters.teamName || ''}
            onChange={handleFilterChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Nom de l'équipe"
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={resetFilters}
          className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-300 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Réinitialiser les filtres
        </button>
      </div>
    </div>
  );
};

export default PlayerFilters;