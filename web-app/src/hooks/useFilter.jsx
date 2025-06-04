'use client';

import { useState, useCallback, useContext } from 'react';
import { FilterContext } from '../context/FilterContext';

/**
 * Hook personnalisé pour gérer le filtrage des données
 * 
 * @param {Object} initialFilters - Filtres initiaux
 * @param {string} entityType - Type d'entité à filtrer (competitions, teams, players, matches, media)
 * @returns {Object} État et fonctions pour gérer les filtres
 */
export const useFilter = (initialFilters = {}, entityType = '') => {
  const [filters, setFilters] = useState(initialFilters);
  const [activeFilters, setActiveFilters] = useState({});
  
  // Utiliser le contexte de filtrage si disponible
  const filterContext = useContext(FilterContext);
  
  // Mettre à jour un filtre spécifique
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);
  
  // Mettre à jour plusieurs filtres à la fois
  const updateMultipleFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);
  
  // Appliquer les filtres actifs
  const applyFilters = useCallback((filtersToApply = null) => {
    // Si des filtres sont fournis, les utiliser, sinon utiliser les filtres d'état
    const filtersToActivate = filtersToApply || filters;
    
    // Ne garder que les filtres non vides
    const nonEmptyFilters = Object.entries(filtersToActivate).reduce((acc, [key, value]) => {
      // Ignorer les valeurs vides, null, undefined ou tableaux vides
      if (
        value === null || 
        value === undefined || 
        value === '' || 
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0)
      ) {
        return acc;
      }
      
      acc[key] = value;
      return acc;
    }, {});
    
    setActiveFilters(nonEmptyFilters);
    
    // Si le contexte de filtrage est disponible et qu'un type d'entité est fourni
    if (filterContext && entityType) {
      if (typeof filterContext.updateMultipleFilters === 'function') {
        filterContext.updateMultipleFilters(entityType, nonEmptyFilters);
      }
    }
    
    return nonEmptyFilters;
  }, [filters, filterContext, entityType]);
  
  // Réinitialiser tous les filtres
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setActiveFilters({});
    
    // Si le contexte de filtrage est disponible et qu'un type d'entité est fourni
    if (filterContext && entityType) {
      if (typeof filterContext.resetFilters === 'function') {
        filterContext.resetFilters(entityType);
      }
    }
  }, [initialFilters, filterContext, entityType]);
  
  // Appliquer les filtres à un tableau de données
  const filterData = useCallback((data) => {
    if (!data || !Array.isArray(data) || Object.keys(activeFilters).length === 0) {
      return data;
    }
    
    return data.filter(item => {
      // Vérifier que l'élément correspond à tous les filtres actifs
      return Object.entries(activeFilters).every(([key, filterValue]) => {
        // Si la clé n'existe pas dans l'élément, considérer que le filtre ne s'applique pas
        if (!(key in item)) {
          return true;
        }
        
        const itemValue = item[key];
        
        // Gérer les différents types de filtres
        if (Array.isArray(filterValue)) {
          // Si le filtre est un tableau, vérifier l'intersection
          return Array.isArray(itemValue) 
            ? itemValue.some(v => filterValue.includes(v))
            : filterValue.includes(itemValue);
        } else if (typeof filterValue === 'string') {
          // Si le filtre est une chaîne, faire une recherche insensible à la casse
          return typeof itemValue === 'string' && 
                 itemValue.toLowerCase().includes(filterValue.toLowerCase());
        } else if (filterValue instanceof Date) {
          // Si le filtre est une date, comparer les dates
          return itemValue instanceof Date && itemValue.getTime() === filterValue.getTime();
        } else if (typeof filterValue === 'object' && filterValue !== null) {
          // Si le filtre est un objet (pour les plages de dates ou autres plages)
          if ('from' in filterValue && 'to' in filterValue) {
            const itemDate = new Date(itemValue);
            const fromDate = new Date(filterValue.from);
            const toDate = new Date(filterValue.to);
            
            return !isNaN(itemDate) && !isNaN(fromDate) && !isNaN(toDate) &&
                   itemDate >= fromDate && itemDate <= toDate;
          }
        }
        
        // Comparaison par défaut
        return itemValue === filterValue;
      });
    });
  }, [activeFilters]);
  
  // Vérifier si des filtres sont actifs
  const hasActiveFilters = Object.keys(activeFilters).length > 0;
  
  return {
    filters,
    activeFilters,
    hasActiveFilters,
    updateFilter,
    updateMultipleFilters,
    applyFilters,
    resetFilters,
    filterData
  };
};

export default useFilter;