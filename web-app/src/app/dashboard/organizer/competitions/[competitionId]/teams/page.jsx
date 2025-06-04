'use client';

import { useState, useEffect } from 'react';
import { useRouter ,useParams} from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getCompetitionById } from '@/services/competition-service';
import { updateTeamCompetitionStatus } from '@/services/competition-service';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Table from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';

export default function CompetitionTeamsPage() {
  const router = useRouter();
  const { competitionId } = useParams();
  const { user } = useAuth();
  
  const [competition, setCompetition] = useState(null);
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', type: '' });
  
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  const [filters, setFilters] = useState({
    name: '',
    status: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'ORGANIZER') {
      router.push('/dashboard');
      return;
    }

    fetchCompetitionData();
  }, [competitionId, user, router]);

  useEffect(() => {
    applyFilters();
  }, [teams, filters]);

  const fetchCompetitionData = async () => {
    try {
      setLoading(true);
      // Récupérer les détails de la compétition
      const competitionData = await getCompetitionById(competitionId);
      setCompetition(competitionData);
      
      // Récupérer les équipes inscrites (normalement incluses dans l'objet competition)
      if (competitionData.teams) {
        setTeams(competitionData.teams);
        setFilteredTeams(competitionData.teams);
      } else {
        // Simuler des données pour le développement
        setTeams([]);
        setFilteredTeams([]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des données:', err);
      setError('Impossible de récupérer les données de la compétition et des équipes. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...teams];
    
    if (filters.name) {
      filtered = filtered.filter(team => 
        team.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    
    if (filters.status) {
      filtered = filtered.filter(team => team.status === filters.status);
    }
    
    setFilteredTeams(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenStatusModal = (team) => {
    setSelectedTeam(team);
    setNewStatus(team.status || 'ACTIVE');
    setStatusReason('');
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!newStatus || !statusReason) {
      setAlertInfo({
        show: true,
        message: 'Veuillez sélectionner un statut et fournir une raison',
        type: 'error'
      });
      return;
    }
    
    try {
      setIsUpdatingStatus(true);
      
      const statusUpdateDTO = {
        competitionId: parseInt(competitionId),
        teamId: selectedTeam.id,
        newStatus
      };
      
      await updateTeamCompetitionStatus(user.id, statusUpdateDTO, statusReason);
      
      setAlertInfo({
        show: true,
        message: 'Statut de l\'équipe mis à jour avec succès',
        type: 'success'
      });
      
      // Mettre à jour les données locales
      setTeams(prev => prev.map(team => {
        if (team.id === selectedTeam.id) {
          return { ...team, status: newStatus };
        }
        return team;
      }));
      
      setShowStatusModal(false);
      setNewStatus('');
      setStatusReason('');
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      setAlertInfo({
        show: true,
        message: 'Erreur lors de la mise à jour du statut',
        type: 'error'
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'ACTIVE': 'Actif',
      'SUSPENDED': 'Suspendu',
      'DISQUALIFIED': 'Disqualifié',
      'PENDING': 'En attente'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'SUSPENDED': return 'bg-yellow-100 text-yellow-800';
      case 'DISQUALIFIED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const teamColumns = [
    { header: 'Équipe', accessor: 'name' },
    { header: 'Coach', accessor: 'coachName' },
    { header: 'Joueurs', accessor: (row) => `${row.playerCount || 0}` },
    { header: 'Statut', accessor: 'status', render: (value) => (
      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(value)}`}>
        {getStatusLabel(value)}
      </span>
    )},
    { header: 'Actions', accessor: (row) => (
      <div className="flex space-x-2">
        <Button
          onClick={() => router.push(`/dashboard/organizer/competitions/${competitionId}/teams/${row.id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1"
        >
          Détails
        </Button>
        <Button
          onClick={() => handleOpenStatusModal(row)}
          className="bg-yellow-600 hover:bg-yellow-700 text-xs px-2 py-1"
        >
          Changer statut
        </Button>
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

  if (!competition) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert 
          type="error" 
          message="Compétition non trouvée." 
          onClose={() => router.push('/dashboard/organizer/competitions')}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Gestion des équipes</h1>
          <p className="text-gray-600">Compétition: {competition.name}</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => router.push(`/dashboard/organizer/competitions/${competitionId}`)}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Retour à la compétition
          </Button>
        </div>
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
              placeholder="Nom de l'équipe..."
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
                <option value="ACTIVE">Actif</option>
                <option value="SUSPENDED">Suspendu</option>
                <option value="DISQUALIFIED">Disqualifié</option>
                <option value="PENDING">En attente</option>
              </select>
            </div>
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Équipes participantes ({filteredTeams.length})</h2>
          
          {filteredTeams.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-2">Aucune équipe inscrite à cette compétition</p>
              <p className="text-sm text-gray-400">Les équipes apparaîtront ici une fois inscrites</p>
            </div>
          ) : (
            <Table 
              columns={teamColumns} 
              data={filteredTeams} 
             emptyState={<div className="text-center py-4 text-gray-500">Aucune équipe trouvée avec les filtres actuels</div>}
            />
          )}
        </div>
      </Card>
      
      {/* Modal pour changer le statut */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Modifier le statut de l'équipe"
      >
        {selectedTeam && (
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Équipe:</span> {selectedTeam.name}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Coach:</span> {selectedTeam.coachName}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Statut actuel:</span>{' '}
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedTeam.status)}`}>
                  {getStatusLabel(selectedTeam.status)}
                </span>
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nouveau statut
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACTIVE">Actif</option>
                <option value="SUSPENDED">Suspendu</option>
                <option value="DISQUALIFIED">Disqualifié</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raison du changement
              </label>
              <textarea
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Expliquer la raison du changement de statut..."
              />
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button 
            onClick={() => setShowStatusModal(false)}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleUpdateStatus}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isUpdatingStatus}
          >
            {isUpdatingStatus ? <LoadingSpinner size="sm" /> : 'Mettre à jour'}
          </Button>
        </div>
      </Modal>
    </div>
  );
} 