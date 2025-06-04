'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getMatchSheetsByCoach } from '@/services/match-service';
import { getAllCoachTeams } from '@/services/team-service';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Table from '@/components/ui/Table';
import Input from '@/components/ui/Input';

export default function CoachMatchesPage() {
  const [matchSheets, setMatchSheets] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    teamId: '',
    status: '',
    search: ''
  });
  
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'COACH') {
      router.push('/dashboard');
      return;
    }

    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les équipes du coach
      const teamsData = await getAllCoachTeams(user.id);
      setTeams(teamsData || []);
      
      // Récupérer les feuilles de match du coach
      const matchSheetsData = await getMatchSheetsByCoach(user.id);
      setMatchSheets(matchSheetsData?.matchSheets || []);
      
      setError(null);
    } catch (err) {
      //console.error('Erreur lors de la récupération des données:', err);
      setError('Impossible de récupérer les feuilles de match. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredMatchSheets = matchSheets.filter(sheet => {
    const teamMatch = !filters.teamId || sheet.teamId.toString() === filters.teamId;
    const statusMatch = !filters.status || sheet.status === filters.status;
    const searchMatch = !filters.search || 
      sheet.matchTitle.toLowerCase().includes(filters.search.toLowerCase()) ||
      sheet.competitionName.toLowerCase().includes(filters.search.toLowerCase());
    
    return teamMatch && statusMatch && searchMatch;
  });

  const getStatusLabel = (status) => {
    const statusMap = {
      'ONGOING': 'Brouillon',
      'UNVALIDATED': 'Non validée',
      'SUBMITTED': 'Soumise',
      'VALIDATED': 'Approuvée',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ONGOING': return 'bg-yellow-100 text-yellow-800';
      case 'UNVALIDATED': return 'bg-red-100 text-red-800';
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800';
      case 'VALIDATED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    { header: 'Match', accessor: 'matchTitle' },
    { header: 'Compétition', accessor: 'competitionName' },
    { header: 'Équipe', accessor: 'teamName' },
    { 
      header: 'Date', 
      accessor: 'matchDateTime',
      cell: ({ row }) => {
        if (!row.matchDateTime) return 'Non spécifiée';
        return new Date(row.matchDateTime).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    },
    { 
      header: 'Statut', 
      accessor: 'status',
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(row.status)}`}>
          {getStatusLabel(row.status)}
        </span>
      )
    },
      { 
        header: 'Actions', 
        accessor: 'id', 
        cell: ({ row }) => (
<div className="flex space-x-2">
        <Button
          onClick={() => router.push(`/dashboard/coach/matches/${row.id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1"
        >
          {row.status === 'UNVALIDATED' || row.status === "ONGOING" || row.status === "SUBMITTED"  ? 'Éditer' : 'Voir'}
        </Button>
      </div>
        )
      }

  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Gestion des Feuilles de Match</h1>

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Rechercher"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Rechercher un match..."
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Équipe
              </label>
              <select
                name="teamId"
                value={filters.teamId}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Toutes les équipes</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>
            
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
                <option value="ONGOING">Brouillon</option>
                <option value="UNVALIDATED">Rejété</option>
                <option value="SUBMITTED">Soumise</option>
                <option value="VALIDATED">Approuvée</option>
        
              </select>
            </div>
          </div>
        </div>
      </Card>

      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Feuilles de match ({filteredMatchSheets.length})</h2>
          
          {/* Statistiques des feuilles de match */}
          <div className="flex space-x-4">
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-300 mr-2"></span>
              <span className="text-sm text-gray-600">
                A completer: {matchSheets.filter(sheet => sheet.status === 'ONGOING').length}
              </span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-300 mr-2"></span>
              <span className="text-sm text-gray-600">
                Soumise: {matchSheets.filter(sheet => sheet.status === 'SUBMITTED').length}
              </span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-green-300 mr-2"></span>
              <span className="text-sm text-gray-600">
                Approuvée: {matchSheets.filter(sheet => sheet.status === 'VALIDATED').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <div className="p-6">
          {filteredMatchSheets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-2">Aucune feuille de match ne correspond à vos critères.</p>
              <p className="text-gray-600">Les feuilles de match sont créées automatiquement lorsque votre équipe est programmée pour un match.</p>
            </div>
          ) : (
            <Table 
              columns={columns} 
              data={filteredMatchSheets}
              pagination={{ itemsPerPage: 10 }}
            />
          )}
        </div>
      </Card>
    </div>
  );
} 