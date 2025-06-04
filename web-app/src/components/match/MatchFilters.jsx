import React, { useState, useEffect } from 'react';
import * as CompetitionService from '@/services/competition-service';
import * as  TeamService from '@/services/team-service';

const MatchFilters = ({ onFilterChange, initialFilters = {} }) => {
  // États pour les filtres
  const [filters, setFilters] = useState({
    status: '',
    competitionId: '',

    teamId: '',
    teamName: '',
    startDate: '',
    endDate: '',
    title: '',
    ...initialFilters
  });

  // États pour les options des listes déroulantes
  const [competitions, setCompetitions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger les compétitions et équipes pour les filtres
  useEffect(() => {
    const fetchFilterData = async () => {
      setLoading(true);
      try {
        // Charger les compétitions
        const competitionsResponse = await CompetitionService.getAllCompetitions();
        setCompetitions(competitionsResponse|| []);
        
        // Charger les équipes
        const teamsResponse = await TeamService.getAllTeams();
        setTeams(teamsResponse || []);
      } catch (error) {
        setCompetitions([]);
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFilterData();
  }, []);

  // Mettre à jour les filtres et notifier le parent
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = {
      ...filters,
      [name]: value
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  // Réinitialiser tous les filtres
  const handleReset = () => {
    const resetFilters = {
      status: '',
      competitionId: '',
      teamId: '',
      teamName: '',
      startDate: '',
      endDate: '',
      title: ''
    };
    
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <h2 className="text-lg font-medium text-gray-800 mb-4">Filtrer les matchs</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="">Tous les statuts</option>
            <option value="SCHEDULED">Programmé</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="COMPLETED">Terminé</option>
            <option value="POSTPONED">Reporté</option>
            <option value="CANCELLED">Annulé</option>
          </select>
        </div>

        {/* Filtre par compétition */}
        <div>
          <label htmlFor="competitionId" className="block text-sm font-medium text-gray-700 mb-1">
            Compétition
          </label>
          <select
            id="competitionId"
            name="competitionId"
            value={filters.competitionId}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="">Toutes les compétitions</option>
            {competitions.map(competition => (
              <option key={competition.id} value={competition.id}>
                {competition.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre par équipe (ID) */}
        <div>
          <label htmlFor="teamId" className="block text-sm font-medium text-gray-700 mb-1">
            Équipe
          </label>
          <select
            id="teamId"
            name="teamId"
            value={filters.teamId}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="">Toutes les équipes</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre par nom d'équipe (texte) */}
        <div>
          <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">
            Recherche par nom d'équipe
          </label>
          <input
            type="text"
            id="teamName"
            name="teamName"
            value={filters.teamName}
            onChange={handleFilterChange}
            placeholder="Nom de l'équipe"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        {/* Filtre par titre de match */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Recherche par titre
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={filters.title}
            onChange={handleFilterChange}
            placeholder="Titre du match"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        {/* Filtre par date de début */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
           Date de debut 
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        {/* Filtre par date de fin */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            Date de fin
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Bouton de réinitialisation */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Réinitialiser les filtres
        </button>
      </div>
    </div>
  );
};

export default MatchFilters;