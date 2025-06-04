'use client';

import React, { createContext, useState, useCallback } from 'react';

// Structure initiale des filtres pour chaque entité
const initialFilters = {
  competitions: {
    status: [],
    category: [],
    organizerName: '',
    name: '',
    dateRange: { start: null, end: null },
    type: []
  },
  teams: {
    category: [],
    coachName: '',
    name: '',
    competitionId: null
  },
  players: {
    userName: '',
    firstName: '',
    lastName: '',
    teamId: null,
    competitionId: null,
    position: [],
    matchId: null
  },
  matches: {
    status: [],
    teamId: null,
    competitionId: null,
    dateRange: { start: null, end: null },
    title: ''
  },
  media: {
    teamId: null,
    type: [],
    competitionId: null,
    title: ''
  }
};

export const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  // State pour les filtres de chaque entité
  const [filters, setFilters] = useState({ ...initialFilters });
  
  // State pour garder trace de la pagination
  const [pagination, setPagination] = useState({
    competitions: { page: 1, perPage: 12 },
    teams: { page: 1, perPage: 12 },
    players: { page: 1, perPage: 12 },
    matches: { page: 1, perPage: 12 },
    media: { page: 1, perPage: 12 }
  });
  
  // State pour le tri
  const [sorting, setSorting] = useState({
    competitions: { field: 'createdAt', direction: 'desc' },
    teams: { field: 'name', direction: 'asc' },
    players: { field: 'lastName', direction: 'asc' },
    matches: { field: 'scheduledDateTime', direction: 'desc' },
    media: { field: 'uploadedAt', direction: 'desc' }
  });

  // Mettre à jour un filtre spécifique pour une entité
  const updateFilter = useCallback((entity, filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [entity]: {
        ...prevFilters[entity],
        [filterName]: value
      }
    }));
    
    // Réinitialiser la pagination à la première page lors d'un changement de filtre
    setPagination(prevPagination => ({
      ...prevPagination,
      [entity]: {
        ...prevPagination[entity],
        page: 1
      }
    }));
  }, []);

  // Mettre à jour plusieurs filtres à la fois pour une entité
  const updateMultipleFilters = useCallback((entity, newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [entity]: {
        ...prevFilters[entity],
        ...newFilters
      }
    }));
    
    // Réinitialiser la pagination à la première page lors d'un changement de filtre
    setPagination(prevPagination => ({
      ...prevPagination,
      [entity]: {
        ...prevPagination[entity],
        page: 1
      }
    }));
  }, []);

  // Réinitialiser tous les filtres pour une entité
  const resetFilters = useCallback((entity) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [entity]: { ...initialFilters[entity] }
    }));
    
    // Réinitialiser la pagination
    setPagination(prevPagination => ({
      ...prevPagination,
      [entity]: {
        ...prevPagination[entity],
        page: 1
      }
    }));
  }, []);

  // Mettre à jour la pagination
  const updatePagination = useCallback((entity, paginationData) => {
    setPagination(prevPagination => ({
      ...prevPagination,
      [entity]: {
        ...prevPagination[entity],
        ...paginationData
      }
    }));
  }, []);

  // Mettre à jour le tri
  const updateSorting = useCallback((entity, field, direction) => {
    setSorting(prevSorting => ({
      ...prevSorting,
      [entity]: {
        field,
        direction
      }
    }));
  }, []);

  // Construire les paramètres pour les requêtes API
  const buildQueryParams = useCallback((entity) => {
    const entityFilters = filters[entity];
    const entityPagination = pagination[entity];
    const entitySorting = sorting[entity];
    
    // Construire l'objet de base avec la pagination et le tri
    const params = {
      page: entityPagination.page,
      size: entityPagination.perPage,
      sort: `${entitySorting.field},${entitySorting.direction}`
    };
    
    // Ajouter les filtres non vides
    Object.entries(entityFilters).forEach(([key, value]) => {
      // Ignorer les valeurs vides, null, undefined ou tableaux vides
      if (
        value === null || 
        value === undefined || 
        value === '' || 
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0)
      ) {
        return;
      }
      
      // Pour les dates, convertir au format attendu par l'API
      if (key === 'dateRange') {
        if (value.start) {
          params.startDate = value.start.toISOString().split('T')[0];
        }
        if (value.end) {
          params.endDate = value.end.toISOString().split('T')[0];
        }
      } 
      // Pour les tableaux, joindre avec des virgules
      else if (Array.isArray(value)) {
        params[key] = value.join(',');
      } 
      // Pour les autres valeurs
      else {
        params[key] = value;
      }
    });
    
    return params;
  }, [filters, pagination, sorting]);

  const value = {
    filters,
    pagination,
    sorting,
    updateFilter,
    updateMultipleFilters,
    resetFilters,
    updatePagination,
    updateSorting,
    buildQueryParams
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};