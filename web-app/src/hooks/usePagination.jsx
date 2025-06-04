'use client';

import { useState, useCallback, useMemo } from 'react';

/**
 * Hook personnalisé pour gérer la pagination
 * 
 * @param {Object} options - Options de configuration
 * @param {number} options.initialPage - Page initiale (défaut: 1)
 * @param {number} options.initialItemsPerPage - Nombre d'éléments par page (défaut: 10)
 * @param {number} options.initialTotalItems - Nombre total d'éléments (défaut: 0)
 * @returns {Object} État et fonctions pour gérer la pagination
 */
export const usePagination = ({
  initialPage = 1,
  initialItemsPerPage = 10,
  initialTotalItems = 0
} = {}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [totalItems, setTotalItems] = useState(initialTotalItems);
  
  // Calculer le nombre total de pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);
  
  // Calculer l'index du premier élément de la page actuelle
  const firstItemIndex = useMemo(() => {
    return (currentPage - 1) * itemsPerPage;
  }, [currentPage, itemsPerPage]);
  
  // Calculer l'index du dernier élément de la page actuelle
  const lastItemIndex = useMemo(() => {
    return Math.min(firstItemIndex + itemsPerPage - 1, totalItems - 1);
  }, [firstItemIndex, itemsPerPage, totalItems]);
  
  // Générer un tableau d'objets de pagination pour afficher une navigation par pages
  const paginationItems = useMemo(() => {
    const maxPagesToShow = 5; // Nombre de boutons de page à afficher
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // Ajuster si on atteint les limites
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => ({
        page: startPage + i,
        isCurrent: startPage + i === currentPage
      })
    );
  }, [currentPage, totalPages]);
  
  // Fonction pour aller à une page spécifique
  const handlePageChange = useCallback((page) => {
    // Vérifier que la page est valide
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);
  
  // Fonction pour aller à la page suivante
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);
  
  // Fonction pour aller à la page précédente
  const previousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);
  
  // Fonction pour aller à la première page
  const firstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);
  
  // Fonction pour aller à la dernière page
  const lastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);
  
  // Fonction pour changer le nombre d'éléments par page
  const changeItemsPerPage = useCallback((newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    // Recalculer la page courante pour maintenir approximativement la même position
    const newPage = Math.floor((firstItemIndex / newItemsPerPage) + 1);
    setCurrentPage(Math.min(newPage, Math.ceil(totalItems / newItemsPerPage)));
  }, [firstItemIndex, totalItems]);
  
  // Appliquer la pagination à un tableau de données
  const paginateData = useCallback((data) => {
    if (!data) return [];
    return data.slice(firstItemIndex, firstItemIndex + itemsPerPage);
  }, [firstItemIndex, itemsPerPage]);
  
  return {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalItems,
    setTotalItems,
    totalPages,
    firstItemIndex,
    lastItemIndex,
    paginationItems,
    handlePageChange,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    changeItemsPerPage,
    paginateData
  };
};

export default usePagination;