'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getAllCompetitions, getCompetitionRequestsByCoach } from '@/services/competition-service';
import { getAllCoachTeams } from '@/services/team-service';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Table from '@/components/ui/Table';
import Input from '@/components/ui/Input';

export default function CoachCompetitionsPage() {
  const searchParams = useSearchParams();
  const initialTeamId = searchParams.get('teamId') || '';
  
  const [competitionsData, setCompetitionsData] = useState([]);
  const [requestsData, setRequestsData] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('competitions');
  const [filters, setFilters] = useState({
    name: '',
    status: '',
    teamId: initialTeamId
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
      
      // Récupérer toutes les compétitions
      const competitions = await getAllCompetitions();
      setCompetitionsData(competitions || []);
      
      // Récupérer les demandes d'inscription/retrait du coach
      const requests = await getCompetitionRequestsByCoach(user.id);
      setRequestsData(requests || []);
      
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des données:', err);
      setError('Impossible de récupérer les données. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredCompetitions = competitionsData.filter(competition => {
    const nameMatch = competition.name.toLowerCase().includes(filters.name.toLowerCase());
    const statusMatch = !filters.status || competition.status === filters.status;
    return nameMatch && statusMatch;
  });

  const filteredRequests = requestsData.filter(request => {
    const teamMatch = !filters.teamId || request.teamId.toString() === filters.teamId;
    return teamMatch;
  });

  const handleRegisterClick = (competitionId) => {
    if (!filters.teamId) {
      setError('Veuillez sélectionner une équipe avant de vous inscrire à une compétition.');
      return;
    }
    router.push(`/dashboard/coach/competitions/register?competitionId=${competitionId}&teamId=${filters.teamId}`);
  };

  const handleWithdrawClick = (competitionId) => {
    if (!filters.teamId) {
      setError('Veuillez sélectionner une équipe avant de vous retirer d\'une compétition.');
      return;
    }
    router.push(`/dashboard/coach/competitions/withdraw?competitionId=${competitionId}&teamId=${filters.teamId}`);
  };


const competitionColumns = [
  { header: 'Nom', accessor: 'name' },
  { header: 'Catégorie', accessor: 'category' },
  { header: 'Type', accessor: 'type' },
  { 
    header: 'Statut', 
    accessor: 'status',
    cell: ({ value }) => {
      let color = '';
      switch (value) {
        case 'UPCOMING': color = 'bg-yellow-100 text-yellow-800'; break;
        case 'REGISTRATION': color = 'bg-blue-100 text-blue-800'; break;
        case 'IN_PROGRESS': color = 'bg-green-100 text-green-800'; break;
        case 'COMPLETED': color = 'bg-gray-100 text-gray-800'; break;
        case 'CANCELLED': color = 'bg-red-100 text-red-800'; break;
        default: color = 'bg-gray-100 text-gray-800';
      }
      
      const statusText = {
        'UPCOMING': 'A venir',
        'REGISTRATION': 'Inscriptions ouvertes',
        'IN_PROGRESS': 'En cours',
        'COMPLETED': 'Terminée',
        'CANCELLED': 'Annulée'
      }[value] || value;
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${color}`}>
          {statusText}
        </span>
      );
    }
  },
  { 
    header: 'Date', 
    accessor: 'startDate',
    cell: ({ row }) => {
      if (!row.startDate) return 'Non spécifiée';
      const start = new Date(row.startDate).toLocaleDateString('fr-FR');
      const end = row.endDate ? new Date(row.endDate).toLocaleDateString('fr-FR') : 'N/A';
      return `${start} - ${end}`;
    }
  },
  { 
    header: 'Actions',
    accessor: 'id',
    cell: ({ row }) => {
      // Ne pas montrer les options d'inscription pour les compétitions terminées ou annulées
      if (row.status !== 'REGISTRATION') {
        return (
          <Button
            onClick={() => router.push(`/competitions/${row.id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1"
          >
            Détails
          </Button>
        );
      }
      
      // Vérifier si l'équipe sélectionnée est déjà inscrite à cette compétition
      const teamRequest = requestsData.find(req => 
        req.competitionId === row.id && 
        req.teamId.toString() === filters.teamId &&
        req.requestType === 'REGISTRATION' &&
        req.requestStatus !== 'REJECTED'
      );
      console.log('Team Request:', teamRequest);
      return (
        <div className="flex space-x-2">
          <Button
            onClick={() => router.push(`/competitions/${row.id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1"
          >
            Détails
          </Button>
          {(row.status === 'REGISTRATION' ) && !teamRequest && (
            <Button
              onClick={() => handleRegisterClick(row.id)}
              className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1"
              disabled={!filters.teamId}
            >
              Inscrire
            </Button>
          )}
          {teamRequest && teamRequest.requestStatus === 'APPROVED' && (
            <Button
              onClick={() => handleWithdrawClick(row.id)}
              className="bg-red-600 hover:bg-red-700 text-xs px-2 py-1"
            >
              Retirer
            </Button>
          )}
          {teamRequest && teamRequest.requestStatus === 'PENDING' && (
            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded flex items-center">
              En attente
            </span>
          )}
        </div>
      );
    }
  }
];
  const requestColumns = [
    { header: 'Équipe', accessor: 'teamName' },
    { header: 'Compétition', accessor: 'competitionName' },
    { header: 'Type', accessor: 'requestType', cell: ({ value }) => {
      return value === 'REGISTRATION' ? 'Inscription' : 'Retrait';
    }},
    { header: 'Statut', accessor: 'requestStatus', cell: ({ value }) => {
      let color = '';
      switch (value) {
        case 'PENDING': color = 'bg-yellow-100 text-yellow-800'; break;
        case 'APPROVED': color = 'bg-green-100 text-green-800'; break;
        case 'REJECTED': color = 'bg-red-100 text-red-800'; break;
        default: color = 'bg-gray-100 text-gray-800';
      }
      
      const statusText = {
        'PENDING': 'En attente',
        'APPROVED': 'Approuvée',
        'REJECTED': 'Rejetée'
      }[value] || value;
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${color}`}>
          {statusText}
        </span>
      );
    }},
        { header: 'Raison', accessor: 'reason', cell: ({ value }) => (
      <div className="max-w-xs truncate" title={value}>{value}</div>
    )},
      { 
        header: 'Date', 
        accessor: 'id', // Utilisez un champ simple comme accessor
        cell: ({ row }) => new Date(row.createdAt).toLocaleDateString('fr-FR')
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
      <h1 className="text-2xl font-bold mb-8">Gestion des Compétitions</h1>

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
              label="Rechercher par nom"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Rechercher une compétition..."
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
                <option value="UPCOMING">À venir</option>
                <option value="REGISTRATION">Inscriptions ouvertes</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="COMPLETED">Terminées</option>
              </select>
            </div>
            
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
          </div>
        </div>
      </Card>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('competitions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'competitions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Compétitions disponibles
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'requests'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mes demandes
              {requestsData.filter(r => r.requestStatus === 'PENDING').length > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {requestsData.filter(r => r.requestStatus === 'PENDING' || r.requestStatus==='REJECTED').length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'competitions' && (
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Liste des compétitions ({filteredCompetitions.length})</h2>
            {filteredCompetitions.length === 0 ? (
              <p className="text-center py-8 text-gray-600">Aucune compétition ne correspond à vos critères de recherche.</p>
            ) : (
              <Table 
                columns={competitionColumns} 
                data={filteredCompetitions}
                pagination={{ itemsPerPage: 10 }}
              />
            )}
          </div>
        </Card>
      )}

      {activeTab === 'requests' && (
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Mes demandes d'inscription/retrait ({filteredRequests.length})</h2>
            {filteredRequests.length === 0 ? (
              <p className="text-center py-8 text-gray-600">
                {filters.teamId 
                  ? `Aucune demande pour l'équipe sélectionnée.` 
                  : `Vous n'avez pas encore fait de demande d'inscription ou de retrait.`}
              </p>
            ) : (
              <Table 
                columns={requestColumns} 
                data={filteredRequests}
                pagination={{ itemsPerPage: 10 }}
              />
            )}
          </div>
        </Card>
      )}
    </div>
  );
} 