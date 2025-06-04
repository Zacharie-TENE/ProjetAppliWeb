'use client';

import React, { useState } from 'react';

/**
 * Composant Table hautement personnalisable
 * 
 * @param {Array} columns - Colonnes du tableau avec des propriétés comme 'header', 'accessor', 'cell', etc.
 * @param {Array} data - Données à afficher dans le tableau
 * @param {boolean} striped - Si les lignes doivent être alternées
 * @param {boolean} hoverable - Si les lignes doivent avoir un effet de survol
 * @param {boolean} bordered - Si le tableau doit avoir des bordures
 * @param {string} size - 'sm', 'md', 'lg'
 * @param {boolean} sortable - Si le tableau doit être triable
 * @param {boolean} pagination - Si la pagination doit être activée
 * @param {number} defaultPageSize - Taille de page par défaut
 * @param {string} className - Classes CSS supplémentaires
 */
export default function Table({
  columns = [],
  data = [],
  striped = true,
  hoverable = true,
  bordered = false,
  size = 'md',
  sortable = false,
  pagination = false,
  defaultPageSize = 10,
  emptyState = <div className="text-center py-4 text-gray-500 dark:text-gray-400">Aucune donnée disponible</div>,
  onRowClick,
  className = '',
  ...props
}) {
  // État pour le tri
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  
  // Tri des données
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key || !sortable) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      // Gestion des valeurs nulles ou undefined
      if (aValue === null || aValue === undefined) return sortConfig.direction === 'asc' ? -1 : 1;
      if (bValue === null || bValue === undefined) return sortConfig.direction === 'asc' ? 1 : -1;
      
      // Gestion des types de données
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortConfig.direction === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    });
  }, [data, sortConfig, sortable]);
  
  // Gestion de la pagination
  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, pagination, currentPage, pageSize]);
  
  // Nombre total de pages
  const totalPages = React.useMemo(() => {
    if (!pagination) return 1;
    return Math.ceil(sortedData.length / pageSize);
  }, [sortedData, pagination, pageSize]);
  
  // Gestionnaire de tri
  const handleSort = (accessor) => {
    if (!sortable) return;
    
    setSortConfig((prevSortConfig) => {
      if (prevSortConfig.key === accessor) {
        return {
          key: accessor,
          direction: prevSortConfig.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key: accessor, direction: 'asc' };
    });
  };
  
  // Définition des classes de taille
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  // Classes pour les cellules d'en-tête
  const getHeaderCellClasses = (column) => {
    return [
      'px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300',
      sortable && column.sortable !== false ? 'cursor-pointer select-none' : '',
      bordered ? 'border border-gray-200 dark:border-gray-700' : '',
    ].filter(Boolean).join(' ');
  };
  
  // Classes pour les cellules de données
  const getDataCellClasses = (index) => {
    return [
      'px-4 py-3',
      bordered ? 'border border-gray-200 dark:border-gray-700' : '',
      striped && index % 2 === 1 ? 'bg-gray-50 dark:bg-gray-800' : '',
    ].filter(Boolean).join(' ');
  };
  
  // Classes pour les lignes
  const getRowClasses = (index) => {
    return [
      onRowClick ? 'cursor-pointer' : '',
      hoverable ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : '',
      striped && index % 2 === 1 ? 'bg-gray-50 dark:bg-gray-800' : '',
    ].filter(Boolean).join(' ');
  };
  
  // Composant d'indicateur de tri
  const SortIndicator = ({ column }) => {
    if (!sortable || column.sortable === false) return null;
    
    const isSorted = sortConfig.key === column.accessor;
    
    return (
      <span className="ml-1 inline-block">
        {isSorted ? (
          sortConfig.direction === 'asc' ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          )
        ) : (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        )}
      </span>
    );
  };
  
  // Afficher l'état vide si aucune donnée
  if (data.length === 0) {
    return (
      <div className={`rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 ${className}`}>
        {emptyState}
      </div>
    );
  }
  
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table 
        className={`w-full ${sizeClasses[size] || sizeClasses.md} ${bordered ? 'border-collapse' : 'border-separate border-spacing-0'}`}
        {...props}
      >
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index} 
                onClick={() => column.sortable !== false && handleSort(column.accessor)}
                className={getHeaderCellClasses(column)}
                style={{ width: column.width || 'auto' }}
              >
                <div className="flex items-center">
                  {column.header}
                  {sortable && column.sortable !== false && <SortIndicator column={column} />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className={getRowClasses(rowIndex)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((column, colIndex) => (
                <td 
                  key={colIndex} 
                  className={getDataCellClasses(rowIndex)}
                >
                  {column.cell 
                    ? column.cell({ value: row[column.accessor], row, column }) 
                    : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Affichage de {(currentPage - 1) * pageSize + 1} à {Math.min(currentPage * pageSize, sortedData.length)} sur {sortedData.length} entrées
            </span>
            <select
              className="ml-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm py-1 px-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size} par page
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                currentPage === 1 
                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Logique pour afficher les bonnes pages lorsqu'il y a beaucoup de pages
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === pageNum
                        ? 'bg-green-600 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                currentPage === totalPages 
                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}