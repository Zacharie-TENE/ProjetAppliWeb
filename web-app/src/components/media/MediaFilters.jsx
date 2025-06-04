import React from 'react';

const MediaFilters = ({ filters, setFilters, resetFilters }) => {
  // Gérer le changement des filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Filtres</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
          <input
            type="text"
            id="title"
            name="title"
            value={filters.title}
            onChange={handleFilterChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Rechercher par titre"
          />
        </div>
        
        <div>
          <label htmlFor="mediaType" className="block text-sm font-medium text-gray-700 mb-1">Type de média</label>
          <select
            id="mediaType"
            name="mediaType"
            value={filters.mediaType}
            onChange={handleFilterChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tous les types</option>
            <option value="IMAGE">Image</option>
            <option value="VIDEO">Vidéo</option>
            <option value="DOCUMENT">Document</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">Équipe</label>
          <input
            type="text"
            id="teamName"
            name="teamName"
            value={filters.teamName}
            onChange={handleFilterChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Nom de l'équipe"
          />
        </div>
        
        <div>
          <label htmlFor="competitionName" className="block text-sm font-medium text-gray-700 mb-1">Compétition</label>
          <input
            type="text"
            id="competitionName"
            name="competitionName"
            value={filters.competitionName}
            onChange={handleFilterChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Nom de la compétition"
          />
        </div>
        
        <div>
          <label htmlFor="uploaderName" className="block text-sm font-medium text-gray-700 mb-1">Publié par</label>
          <input
            type="text"
            id="uploaderName"
            name="uploaderName"
            value={filters.uploaderName}
            onChange={handleFilterChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Nom de l'auteur"
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

export default MediaFilters;