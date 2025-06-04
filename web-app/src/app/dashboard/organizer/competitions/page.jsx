'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getCompetitionsByOrganizer, deleteCompetition } from '@/services/competition-service';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Table from '@/components/ui/Table';

export default function OrganizerCompetitionsPage() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', type: '' });
  const [activeTab, setActiveTab] = useState('ongoing');
  const [filters, setFilters] = useState({
    name: '',
    category: ''
  });
  
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'ORGANIZER') {
      router.push('/dashboard');
      return;
    }

    fetchCompetitions();
  }, [user, router]);

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const competitionsData = await getCompetitionsByOrganizer(user.id);
      // Stocker la liste plate des compétitions
      setCompetitions(competitionsData.competitions || []);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des compétitions:', err);
      setError('Impossible de récupérer vos compétitions. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompetition = async (competitionId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette compétition ? Cette action est irréversible.')) {
      try {
        await deleteCompetition(user.id, competitionId);
        setAlertInfo({
          show: true,
          message: 'Compétition supprimée avec succès',
          type: 'success'
        });
        fetchCompetitions();
      } catch (err) {
        console.error('Erreur lors de la suppression de la compétition:', err);
        setAlertInfo({
          show: true,
          message: 'Erreur lors de la suppression de la compétition',
          type: 'error'
        });
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const getFilteredCompetitions = () => {
    const statusFilters = {
      'upcoming': ['UPCOMING', 'REGISTRATION'],
      'ongoing': ['IN_PROGRESS'],
      'completed': ['COMPLETED', 'CANCELLED']
    };
    
    // Filtrer les compétitions en fonction de l'onglet actif
    const competitionsFilteredByStatus = competitions.filter(
      competition => statusFilters[activeTab]?.includes(competition.status)
    );
    
    // Appliquer les filtres de recherche
    return competitionsFilteredByStatus.filter(competition => {
      const nameMatch = competition.name.toLowerCase().includes(filters.name.toLowerCase());
      const categoryMatch = !filters.category || competition.category === filters.category;
      
      return nameMatch && categoryMatch;
    });
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'UPCOMING': 'À venir',
      'REGISTRATION': 'Inscriptions ouvertes',
      'IN_PROGRESS': 'En cours',
      'COMPLETED': 'Terminée',
      'CANCELLED': 'Annulée'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'UPCOMING': return 'bg-yellow-100 text-yellow-800';
      case 'REGISTRATION': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    { header: 'Nom', accessor: 'name' },
    { header: 'Catégorie', accessor: 'category' },
    { header: 'Type', accessor: 'competitionType' },
    { 
      header: 'Statut', 
      accessor: 'status', 
      cell: ({ value }) => (
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(value)}`}>
          {getStatusLabel(value)}
        </span>
      )
    },
    { 
      header: 'Équipes', 
      accessor: 'registeredTeams',
      cell: ({ row }) => (
        <span>{row.registeredTeams || 0} / {row.maxTeams || 'N/A'}</span>
      )
    },
    { 
      header: 'Période', 
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
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            onClick={() => router.push(`/dashboard/organizer/competitions/${row.id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1"
          >
            Détails
          </Button>
          <Button
            onClick={() => router.push(`/dashboard/organizer/competitions/${row.id}/edit`)}
            className="bg-gray-600 hover:bg-gray-700 text-xs px-2 py-1"
          >
            Modifier
          </Button>
          {(row.status === 'UPCOMING' || row.status === 'REGISTRATION') && (
            <Button
              onClick={() => handleDeleteCompetition(row.id)}
              className="bg-red-600 hover:bg-red-700 text-xs px-2 py-1"
            >
              Supprimer
            </Button>
          )}
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

  const filteredCompetitions = getFilteredCompetitions();
  
  // Calculer le nombre de compétitions par statut
  const upcomingCount = competitions.filter(comp => ['UPCOMING', 'REGISTRATION'].includes(comp.status)).length;
  const ongoingCount = competitions.filter(comp => comp.status === 'IN_PROGRESS').length;
  const completedCount = competitions.filter(comp => ['COMPLETED', 'CANCELLED'].includes(comp.status)).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Gestion des Compétitions</h1>
        <Button 
          onClick={() => router.push('/dashboard/organizer/competitions/create')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Créer une compétition
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Rechercher par nom"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Rechercher une compétition..."
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Toutes les catégories</option>
                <option value="SENIOR">Senior</option>
                <option value="JUNIOR">Junior</option>
                <option value="CADET">Cadet</option>
                <option value="MINIME">Minime</option>
                <option value="BENJAMIN">Benjamin</option>
                <option value="POUSSIN">Poussin</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upcoming'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              À venir ({upcomingCount})
            </button>
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'ongoing'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              En cours ({ongoingCount})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'completed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Terminées ({completedCount})
            </button>
          </nav>
        </div>
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            {activeTab === 'upcoming' && 'Compétitions à venir'}
            {activeTab === 'ongoing' && 'Compétitions en cours'}
            {activeTab === 'completed' && 'Compétitions terminées'}
            {' '}({filteredCompetitions.length})
          </h2>
          
          {filteredCompetitions.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600 mb-4">
                {activeTab === 'upcoming' && "Vous n'avez pas de compétition à venir"}
                {activeTab === 'ongoing' && "Vous n'avez pas de compétition en cours"}
                {activeTab === 'completed' && "Vous n'avez pas de compétition terminée"}
              </p>
              {activeTab === 'upcoming' && (
                <Button 
                  onClick={() => router.push('/dashboard/organizer/competitions/create')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Créer une compétition
                </Button>
              )}
            </div>
          ) : (
            <Table 
              columns={columns} 
              data={filteredCompetitions}
              pagination={{ itemsPerPage: 10 }}
            />
          )}
        </div>
      </Card>
    </div>
  );
}