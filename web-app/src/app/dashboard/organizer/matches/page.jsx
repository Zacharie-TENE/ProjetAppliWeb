'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getCompetitionsByOrganizer } from '@/services/competition-service';
import { getMatchesByCompetitionId } from '@/services/match-service';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Table from '@/components/ui/Table';

export default function OrganizerMatchesPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', type: '' });
  
  const [filters, setFilters] = useState({
    status: '',
    team: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'ORGANIZER') {
      router.push('/dashboard');
      return;
    }

    fetchCompetitions();
  }, [user, router]);

  useEffect(() => {
    if (selectedCompetition) {
      fetchMatchesForCompetition(selectedCompetition.id);
    }
  }, [selectedCompetition]);

  useEffect(() => {
    applyFilters();
  }, [matches, filters]);

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const response = await getCompetitionsByOrganizer(user.id);
      setCompetitions(response.competitions || []);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des compétitions:', err);
    //  setError('Impossible de récupérer vos compétitions. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchesForCompetition = async (competitionId) => {
    try {
      setLoading(true);
      const matchesData = await getMatchesByCompetitionId(competitionId);
      setMatches(matchesData || []);
      setFilteredMatches(matchesData || []);
      setError(null);
    } catch (err) {
      //console.error('Erreur lors de la récupération des matchs:', err);
      setError('Impossible de récupérer les matchs pour cette compétition. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompetitionSelect = (competition) => {
    setSelectedCompetition(competition);
  };

  const applyFilters = () => {
    let filtered = [...matches];
    
    if (filters.status) {
      filtered = filtered.filter(match => match.status === filters.status);
    }
    
    if (filters.team) {
      filtered = filtered.filter(match => {
        const homeTeam = match.participants?.find(p => p.role === 'HOME')?.teamName;
        const awayTeam = match.participants?.find(p => p.role === 'AWAY')?.teamName;
        
        return (
          homeTeam?.toLowerCase().includes(filters.team.toLowerCase()) ||
          awayTeam?.toLowerCase().includes(filters.team.toLowerCase())
        );
      });
    }
    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(match => 
        match.scheduledDateTime && new Date(match.scheduledDateTime) >= fromDate
      );
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      // Ajuster la date de fin à 23:59:59
      toDate.setHours(23, 59, 59);
      filtered = filtered.filter(match => 
        match.scheduledDateTime && new Date(match.scheduledDateTime) <= toDate
      );
    }
    
    setFilteredMatches(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'SCHEDULED': 'Planifié',
      'IN_PROGRESS': 'En cours',
      'COMPLETED': 'Terminé',
      'POSTPONED': 'Reporté',
      'CANCELLED': 'Annulé'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-purple-100 text-purple-800';
      case 'POSTPONED': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const matchColumns = [
    { header: 'Match', accessor: 'title' },
    { header: 'Date', accessor: (row) => {
      if (!row.scheduledDateTime) return 'Non planifié';
      return new Date(row.scheduledDateTime).toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }},
    { header: 'Équipes', accessor: (row) => {
      const home = row.participants?.find(p => p.role === 'HOME')?.teamName || 'TBD';
      const away = row.participants?.find(p => p.role === 'AWAY')?.teamName || 'TBD';
      return `${home} vs ${away}`;
    }},
    { header: 'Score', accessor: (row) => {
      if (row.status !== 'COMPLETED' && row.status !== 'IN_PROGRESS') return '-';
      return `${row.homeTeamScore || 0} - ${row.awayTeamScore || 0}`;
    }},
    { header: 'Statut', accessor: 'status', render: (value) => (
      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(value)}`}>
        {getStatusLabel(value)}
      </span>
    )},
    { header: 'Actions', accessor: (row) => (
      <div className="flex space-x-2">
        <Button
          onClick={() => router.push(`/dashboard/organizer/matches/${row.id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1"
        >
          Détails
        </Button>
        {row.status === 'COMPLETED' && row.matchSheetStatus !== 'VALIDATED' && (
          <Button
            onClick={() => router.push(`/dashboard/organizer/match-validation?matchId=${row.id}`)}
            className="bg-orange-600 hover:bg-orange-700 text-xs px-2 py-1"
          >
            Valider
          </Button>
        )}
      </div>
    )}
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Afficher la liste des compétitions si aucune n'est sélectionnée
  if (!selectedCompetition) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-6">Gestion des matchs</h1>
          <h2 className="text-xl font-semibold mb-4">Sélectionnez une compétition</h2>
        </div>
        
        {error && (
          <Alert 
            type="error" 
            message={error} 
            onClose={() => setError(null)}
            className="mb-6"
          />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitions.length === 0 ? (
            <div className="col-span-3 bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-4">Vous n'avez pas encore créé de compétition</p>
              <Button 
                onClick={() => router.push('/dashboard/organizer/competitions/create')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Créer une compétition
              </Button>
            </div>
          ) : (
            competitions.map(competition => (
              <Card key={competition.id} className="hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{competition.name}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{competition.description || 'Aucune description'}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs 
                      ${competition.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                      competition.status === 'UPCOMING' ? 'bg-blue-100 text-blue-800' :
                      competition.status === 'COMPLETED' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'}`}>
                      {competition.status}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      {competition.registeredTeams}/{competition.maxTeams} équipes
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {competition.totalMatches} matchs ({competition.completedMatches} terminés)
                    </div>
                    <Button 
                      onClick={() => handleCompetitionSelect(competition)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Voir les matchs
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  }

  // Afficher les matchs de la compétition sélectionnée
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button 
          onClick={() => setSelectedCompetition(null)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Retour aux compétitions
        </button>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">{selectedCompetition.name}</h1>
          <p className="text-gray-600">Gestion des matchs</p>
        </div>
        <Button 
          onClick={() => router.push(`/dashboard/organizer/matches/schedule?competitionId=${selectedCompetition.id}`)}
          className="bg-purple-600 hover:bg-purple-700"
          disabled={selectedCompetition.status === 'COMPLETED'}
        >
          Programmer un match
        </Button>
      </div>
      
      {alertInfo.show && (
        <Alert 
          type={alertInfo.type} 
          message={alertInfo.message} 
          onClose={() => setAlertInfo({ ...alertInfo, show: false })}
          className="mb-6"
        />
      )}
      
      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}
      
      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Filtres</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Équipe"
              name="team"
              value={filters.team}
              onChange={handleFilterChange}
              placeholder="Nom de l'équipe"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous les statuts</option>
                <option value="SCHEDULED">Planifié</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="COMPLETED">Terminé</option>
                <option value="POSTPONED">Reporté</option>
                <option value="CANCELLED">Annulé</option>
              </select>
            </div>
            
            <Input
              label="Date de début"
              name="dateFrom"
              type="date"
              value={filters.dateFrom}
              onChange={handleFilterChange}
            />
            
            <Input
              label="Date de fin"
              name="dateTo"
              type="date"
              value={filters.dateTo}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Liste des matchs ({filteredMatches.length})</h2>
          
          {filteredMatches.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-4">Aucun match trouvé pour cette compétition</p>
              {selectedCompetition.status !== 'COMPLETED' && (
                <Button 
                  onClick={() => router.push(`/dashboard/organizer/matches/schedule?competitionId=${selectedCompetition.id}`)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Programmer un match
                </Button>
              )}
            </div>
          ) : (
            <Table 
              columns={matchColumns} 
              data={filteredMatches}
              pagination={{ itemsPerPage: 10 }}
              emptyState={<div className="text-center py-4 text-gray-500">Aucun match trouvé</div>}
            />
          )}
        </div>
      </Card>
    </div>
  );
}