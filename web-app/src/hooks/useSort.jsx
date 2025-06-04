'use client';

import { useState, useCallback, useMemo } from 'react';

/**
 * Hook personnalisé pour gérer le tri des données
 * 
 * @param {Object} initialConfig - Configuration initiale du tri
 * @param {string} initialConfig.field - Champ à trier initialement
 * @param {string} initialConfig.direction - Direction du tri ('asc' ou 'desc')
 * @returns {Object} État et fonctions pour gérer le tri
 */
export const useSort = (initialConfig = { field: null, direction: 'asc' }) => {
  const [sortConfig, setSortConfig] = useState(initialConfig);
  
  // Fonction pour définir le champ de tri
  const sortBy = useCallback((field) => {
    setSortConfig(prevConfig => {
      // Si on clique sur le même champ, inverser la direction
      if (prevConfig.field === field) {
        return {
          field,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      
      // Sinon, trier par le nouveau champ en ordre ascendant
      return {
        field,
        direction: 'asc'
      };
    });
  }, []);
  
  // Fonction pour définir la direction du tri
  const setSortDirection = useCallback((direction) => {
    setSortConfig(prevConfig => ({
      ...prevConfig,
      direction
    }));
  }, []);
  
  // Fonction pour réinitialiser le tri
  const resetSort = useCallback(() => {
    setSortConfig(initialConfig);
  }, [initialConfig]);
  
  // Fonction pour trier un tableau de données
  const sortData = useCallback((data) => {
    if (!data || !Array.isArray(data) || !sortConfig.field) {
      return data;
    }
    
    return [...data].sort((a, b) => {
      // Extraire les valeurs à comparer
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];
      
      // Gestion des valeurs null ou undefined
      if (aValue === null || aValue === undefined) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (bValue === null || bValue === undefined) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      
      // Comparaison selon le type de données
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortConfig.direction === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }
      
      // Comparaison numérique par défaut
      return sortConfig.direction === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    });
  }, [sortConfig]);
  
  // Générer les accessoires pour l'affichage des en-têtes de colonne triables
  const getSortProps = useCallback((field) => {
    return {
      onClick: () => sortBy(field),
      'aria-sort': sortConfig.field === field 
        ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') 
        : 'none',
      className: `${sortConfig.field === field ? 'sorted' : ''} ${
        sortConfig.field === field 
          ? (sortConfig.direction === 'asc' ? 'sorted-asc' : 'sorted-desc') 
          : ''
      }`
    };
  }, [sortConfig, sortBy]);
  
  // Vérifier si un champ est actuellement trié
  const isSorted = useCallback((field) => {
    return sortConfig.field === field;
  }, [sortConfig]);
  
  // Obtenir la direction de tri pour un champ donné
  const getSortDirection = useCallback((field) => {
    return sortConfig.field === field ? sortConfig.direction : null;
  }, [sortConfig]);
  
  return {
    sortConfig,
    sortBy,
    setSortDirection,
    resetSort,
    sortData,
    getSortProps,
    isSorted,
    getSortDirection
  };
};

export default useSort;