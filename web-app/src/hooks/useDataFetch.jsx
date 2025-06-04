'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personnalisé pour gérer le chargement de données depuis une API
 * 
 * @param {Function} fetchFunction - Fonction pour récupérer les données
 * @param {Object} initialParams - Paramètres initiaux de la requête
 * @param {boolean} loadOnMount - Si les données doivent être chargées au montage du composant
 * @returns {Object} État et fonctions pour gérer le chargement des données
 */
export const useDataFetch = (fetchFunction, initialParams = {}, loadOnMount = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);
  
  // Fonction pour charger les données
  const fetchData = useCallback(async (customParams = null) => {
    // Si des paramètres personnalisés sont fournis, on les utilise
    // sinon on utilise les paramètres d'état
    const queryParams = customParams || params;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFunction(queryParams);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors du chargement des données');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, params]);
  
  // Fonction pour mettre à jour les paramètres et recharger les données
  const updateParams = useCallback((newParams) => {
    setParams(prev => ({
      ...prev,
      ...newParams
    }));
  }, []);
  
  // Fonction pour rafraîchir les données avec les paramètres actuels
  const refresh = useCallback(() => {
    return fetchData();
  }, [fetchData]);
  
  // Fonction pour réinitialiser les données et les paramètres
  const reset = useCallback(() => {
    setData(null);
    setParams(initialParams);
    setError(null);
  }, [initialParams]);
  
  // Charger les données au montage si loadOnMount est true
  useEffect(() => {
    if (loadOnMount) {
      fetchData();
    }
  }, [fetchData, loadOnMount]);
  
  // Recharger les données lorsque les paramètres changent
  useEffect(() => {
    if (loadOnMount) {
      fetchData();
    }
  }, [params, fetchData, loadOnMount]);
  
  return {
    data,
    loading,
    error,
    params,
    fetchData,
    updateParams,
    refresh,
    reset
  };
};

export default useDataFetch;