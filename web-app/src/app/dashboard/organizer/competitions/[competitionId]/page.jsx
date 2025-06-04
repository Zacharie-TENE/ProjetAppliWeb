'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getCompetitionById, updateCompetitionStatus } from '@/services/competition-service';
import { getMatchesByCompetitionId } from '@/services/match-service';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Table from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';

export default function CompetitionDetailsPage({ params }) {
  const router = useRouter();
  const { competitionId } = useParams();
  const { user } = useAuth();
  
  const [competition, setCompetition] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', type: '' });
  
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'ORGANIZER') {
      router.push('/dashboard');
      return;
    }

    fetchCompetitionData();
  }, [competitionId, user, router]);

  const fetchCompetitionData = async () => {
    try {
      setLoading(true);
      // Récupérer les détails de la compétition
      const competitionData = await getCompetitionById(competitionId);
      setCompetition(competitionData);
      
      // Récupérer les matchs de la compétition
      const matchesData = await getMatchesByCompetitionId(competitionId);
      setMatches(matchesData || []);
      
      setError(null);
    } catch (err) {
    //  console.error('Erreur lors de la récupération des données de la compétition:', err);
      setError('Impossible de récupérer les données de la compétition. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
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
      
      await updateCompetitionStatus(
        user.id, 
        { competitionId: parseInt(competitionId), newStatus }, 
        statusReason
      );
      
      setAlertInfo({
        show: true,
        message: 'Statut de la compétition mis à jour avec succès',
        type: 'success'
      });
      
      // Mettre à jour les données locales
      setCompetition(prev => ({ ...prev, status: newStatus }));
      setShowStatusModal(false);
      setNewStatus('');
      setStatusReason('');
      
      // Rafraîchir les données
      fetchCompetitionData();
      
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

  const matchColumns = [
    { header: 'Titre', accessor: 'title' },
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
    { header: 'Statut', accessor: 'status', render: (value) => {
      let color = 'bg-gray-100 text-gray-800';
      let label = value;
      
      switch (value) {
        case 'SCHEDULED': 
          color = 'bg-blue-100 text-blue-800';
          label = 'Planifié';
          break;
        case 'IN_PROGRESS': 
          color = 'bg-green-100 text-green-800';
          label = 'En cours';
          break;
        case 'COMPLETED': 
          color = 'bg-purple-100 text-purple-800';
          label = 'Terminé';
          break;
        case 'CANCELLED': 
          color = 'bg-red-100 text-red-800';
          label = 'Annulé';
          break;
        case 'POSTPONED': 
          color = 'bg-yellow-100 text-yellow-800';
          label = 'Reporté';
          break;
      }
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${color}`}>
          {label}
        </span>
      );
    }},
    { header: 'Score', accessor: (row) => {
      if (row.status !== 'COMPLETED' && row.status !== 'IN_PROGRESS') return '-';
      return `${row.homeTeamScore || 0} - ${row.awayTeamScore || 0}`;
    }},
    { header: 'Actions', accessor: (row) => (
      <div className="flex space-x-2">
        <Button
          onClick={() => router.push(`/dashboard/organizer/matches/${row.id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1"
        >
          Détails
        </Button>
        {row.status !== 'COMPLETED' && (
          <Button
            onClick={() => router.push(`/dashboard/organizer/matches/${row.id}/edit`)}
            className="bg-gray-600 hover:bg-gray-700 text-xs px-2 py-1"
          >
            Modifier
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
        <h1 className="text-2xl font-bold">{competition.name}</h1>
        <div className="flex space-x-2">
          <Button 
            onClick={() => router.push(`/dashboard/organizer/competitions/${competitionId}/edit`)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Modifier
          </Button>
          <Button 
            onClick={() => router.push('/dashboard/organizer/competitions')}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Retour à la liste
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Détails de la compétition</h2>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(competition.status)}`}>
                {getStatusLabel(competition.status)}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">{competition.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Catégorie</p>
                <p className="font-medium">{competition.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Lieu</p>
                <p className="font-medium">{competition.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Équipes inscrites</p>
                <p className="font-medium">{competition.registeredTeams || 0} / {competition.maxTeams || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date de début</p>
                <p className="font-medium">
                  {competition.startDate ? new Date(competition.startDate).toLocaleDateString('fr-FR') : 'Non définie'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date de fin</p>
                <p className="font-medium">
                  {competition.endDate ? new Date(competition.endDate).toLocaleDateString('fr-FR') : 'Non définie'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Limite d'inscription</p>
                <p className="font-medium">
                  {competition.registrationDeadline ? 
                    new Date(competition.registrationDeadline).toLocaleDateString('fr-FR') : 
                    'Non définie'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Créée le</p>
                <p className="font-medium">
                  {competition.createdAt ? 
                    new Date(competition.createdAt).toLocaleDateString('fr-FR') : 
                    'Non définie'}
                </p>
              </div>
            </div>
            
            {competition.description && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Description</p>
                <p className="text-sm">{competition.description}</p>
              </div>
            )}
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>
            <div className="flex flex-col space-y-3">
              <Button 
                onClick={() => setShowStatusModal(true)}
                className="bg-blue-600 hover:bg-blue-700 w-full"
              >
                Changer le statut
              </Button>
              
              <Button 
                onClick={() => router.push(`/dashboard/organizer/competitions/${competitionId}/teams`)}
                className="bg-green-600 hover:bg-green-700 w-full"
              >
                Gérer les équipes
              </Button>
              
              <Button 
                onClick={() => router.push(`/dashboard/organizer/competitions/${competitionId}/requests`)}
                className="bg-yellow-600 hover:bg-yellow-700 w-full"
              >
                Demandes d'inscription
              </Button>
              
              <Button 
                onClick={() => router.push(`/dashboard/organizer/matches/schedule?competitionId=${competitionId}`)}
                className="bg-purple-600 hover:bg-purple-700 w-full"
              >
                Programmer un match
              </Button>
            </div>
          </div>
        </Card>
      </div>
      
      <Card className="mb-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Matchs</h2>
            <Button 
              onClick={() => router.push(`/dashboard/organizer/matches/schedule?competitionId=${competitionId}`)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Programmer un match
            </Button>
          </div>
          
          {matches.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Aucun match programmé pour cette compétition</p>
              <Button 
                onClick={() => router.push(`/dashboard/organizer/matches/schedule?competitionId=${competitionId}`)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Programmer votre premier match
              </Button>
            </div>
          ) : (
            <Table 
              columns={matchColumns} 
              data={matches} 
              emptyState={<div className="text-center py-4 text-gray-500">Aucun match programmé</div>}
            />
          )}
        </div>
      </Card>
      
      {/* Modal pour changer le statut */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Changer le statut de la compétition"
      >
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nouveau statut
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionnez un statut</option>
              <option value="UPCOMING">À venir</option>
              <option value="REGISTRATION">Inscriptions ouvertes</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="COMPLETED">Terminée</option>
              <option value="CANCELLED">Annulée</option>
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