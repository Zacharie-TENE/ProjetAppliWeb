import React, { useState, useEffect } from 'react';
import MediaCard from './MediaCard';
import MediaFilters from './MediaFilters';
import   * as  MediaService from '@/services/media-service';

const MediaList = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalItems, setTotalItems] = useState(0);
  
  // État des filtres
  const [filters, setFilters] = useState({
    title: '',
    mediaType: '',
    competitionName: '',
    teamName: '',
    uploaderName: ''
  });

  // Chargement des médias
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const result = await MediaService.getAllMedia(filters);
        setMedia(result || []);
        setTotalItems(result.total || 0);
        setError(null);
      } catch (err) {
        setError('Impossible de charger les médias. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [filters, currentPage, itemsPerPage]);

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      title: '',
      mediaType: '',
      competitionName: '',
      teamName: '',
      uploaderName: ''
    });
    setCurrentPage(1);
  };

  // Gestion du changement de page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Obtenir les médias pour la page courante
  const paginatedMedia = media.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Section des filtres */}
      <MediaFilters 
        filters={filters} 
        setFilters={setFilters} 
        resetFilters={resetFilters} 
      />

      {/* Section des résultats */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Médias ({totalItems})</h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p>{error}</p>
            <button 
              onClick={() => handlePageChange(1)}

              className="mt-2 text-sm font-medium text-red-700 underline"
            >
              Réessayer
            </button>
          </div>
        ) : media.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 text-gray-600 px-6 py-8 rounded-md text-center">
            <h3 className="text-lg font-medium mb-2">Aucun média trouvé</h3>
            <p className="text-gray-500">
              Aucun média ne correspond à vos critères de recherche. Essayez d'ajuster vos filtres.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedMedia.map(item => (
                <MediaCard key={item.id} media={item} />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
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
          </>
        )}
      </div>
    </div>
  );
};

export default MediaList;