'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getMatchById, updateMatchStatus, updateMatchScore, updateMatchInfo } from '@/services/match-service';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';

export default function MatchDetailsPage() {
  const router = useRouter();
  const { matchId } = useParams();
  const { user } = useAuth();
  
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', type: '' });
  
  // Modals
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Form states
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [editFormData, setEditFormData] = useState({
    title: '',
    scheduledDateTime: '',
    location: '',
    round: 1,
    description: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'ORGANIZER') {
      router.push('/dashboard');
      return;
    }

    fetchMatchData();
  }, [matchId, user, router]);

  const fetchMatchData = async () => {
    try {
      setLoading(true);
      const matchData = await getMatchById(matchId);
      setMatch(matchData);
      
      // Initialiser les états de formulaire avec les données du match
      if (matchData) {
        setNewStatus(matchData.status);
        setHomeScore(matchData.homeTeamScore || 0);
        setAwayScore(matchData.awayTeamScore || 0);
        
        // Formater la date pour le champ datetime-local
        const formatDateTime = (dateString) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toISOString().slice(0, 16); // format YYYY-MM-DDTHH:MM
        };
        
        setEditFormData({
          title: matchData.title || '',
          scheduledDateTime: formatDateTime(matchData.scheduledDateTime),
          location: matchData.location || '',
          round: matchData.round || 1,
          description: matchData.description || ''
        });
      }
      
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des données du match:', err);
      setError('Impossible de récupérer les données du match. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      setAlertInfo({
        show: true,
        message: 'Veuillez sélectionner un statut',
        type: 'error'
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      
      const statusUpdateDTO = {
        matchId: parseInt(matchId),
        newStatus,
        updateReason: statusReason
      };
      
      await updateMatchStatus(user.id, statusUpdateDTO);
      
      setAlertInfo({
        show: true,
        message: 'Statut du match mis à jour avec succès',
        type: 'success'
      });
      
      // Mettre à jour les données locales
      setMatch(prev => ({ ...prev, status: newStatus }));
      setShowStatusModal(false);
      
      // Rafraîchir les données
      fetchMatchData();
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      setAlertInfo({
        show: true,
        message: 'Erreur lors de la mise à jour du statut',
        type: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateScore = async () => {
    try {
      setIsProcessing(true);
      
      const scoreUpdateDTO = {
        matchId: parseInt(matchId),
        homeScore: parseInt(homeScore),
        awayScore: parseInt(awayScore)
      };
      
      await updateMatchScore(user.id, scoreUpdateDTO);
      
      setAlertInfo({
        show: true,
        message: 'Score du match mis à jour avec succès',
        type: 'success'
      });
      
      // Mettre à jour les données locales
      setMatch(prev => ({ 
        ...prev, 
        homeTeamScore: parseInt(homeScore),
        awayTeamScore: parseInt(awayScore)
      }));
      setShowScoreModal(false);
      
      // Rafraîchir les données
      fetchMatchData();
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour du score:', err);
      setAlertInfo({
        show: true,
        message: 'Erreur lors de la mise à jour du score',
        type: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateMatchInfo = async () => {
    try {
      setIsProcessing(true);
      
      await updateMatchInfo(user.id, matchId, editFormData);
      
      setAlertInfo({
        show: true,
        message: 'Informations du match mises à jour avec succès',
        type: 'success'
      });
      
      // Mettre à jour les données locales
      setMatch(prev => ({ ...prev, ...editFormData }));
      setShowEditModal(false);
      
      // Rafraîchir les données
      fetchMatchData();
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour des informations:', err);
      setAlertInfo({
        show: true,
        message: 'Erreur lors de la mise à jour des informations',
        type: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditNumberChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: parseInt(value, 10) }));
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert 
          type="error" 
          message="Match non trouvé." 
          onClose={() => router.push('/dashboard/organizer/matches')}
        />
      </div>
    );
  }

  // Trouver les équipes participantes
  const homeTeam = match.participants?.find(p => p.role === 'HOME');
  const awayTeam = match.participants?.find(p => p.role === 'AWAY');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">{match.title}</h1>
          <p className="text-gray-600">Compétition: {match.competitionName}</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => router.push(`/dashboard/organizer/competitions/${match.competitionId}`)}
            className="bg-blue-600 hover:bg-blue-700"
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Détails du match</h2>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(match.status)}`}>
                {getStatusLabel(match.status)}
              </span>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center">
                <div className="text-center flex-1">
                  <p className="font-semibold text-lg">{homeTeam?.teamName || 'Équipe à domicile'}</p>
                  <p className="text-sm text-gray-500">Domicile</p>
                </div>
                
                <div className="text-center px-6">
                  {match.status === 'COMPLETED' || match.status === 'IN_PROGRESS' ? (
                    <div className="font-bold text-2xl">
                      {match.homeTeamScore || 0} - {match.awayTeamScore || 0}
                    </div>
                  ) : (
                    <div className="text-xl">VS</div>
                  )}
                  {match.status !== 'COMPLETED' && match.status !== 'CANCELLED' && (
                    <Button 
                      onClick={() => setShowScoreModal(true)}
                      className="mt-2 bg-purple-600 hover:bg-purple-700 text-xs px-2 py-1"
                    >
                      Mise à jour du score
                    </Button>
                  )}
                </div>
                
                <div className="text-center flex-1">
                  <p className="font-semibold text-lg">{awayTeam?.teamName || 'Équipe à l\'extérieur'}</p>
                  <p className="text-sm text-gray-500">Extérieur</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Date et heure</p>
                <p className="font-medium">
                  {match.scheduledDateTime ? 
                    new Date(match.scheduledDateTime).toLocaleString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 
                    'Non défini'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Lieu</p>
                <p className="font-medium">{match.location || 'Non spécifié'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tour / Journée</p>
                <p className="font-medium">{match.round || 'Non spécifié'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type de compétition</p>
                <p className="font-medium">{match.competitionType || 'Non spécifié'}</p>
              </div>
            </div>
            
            {match.description && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Description</p>
                <p className="text-sm">{match.description}</p>
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
              
              {match.status !== 'COMPLETED' && match.status !== 'CANCELLED' && (
                <Button 
                  onClick={() => setShowScoreModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 w-full"
                >
                  Mettre à jour le score
                </Button>
              )}
              
              <Button 
                onClick={() => setShowEditModal(true)}
                className="bg-green-600 hover:bg-green-700 w-full"
              >
                Modifier les informations
              </Button>
              
              {match.status === 'COMPLETED' && (
                <Button 
                  onClick={() => router.push(`/dashboard/organizer/match-validation?matchId=${matchId}`)}
                  className="bg-orange-600 hover:bg-orange-700 w-full"
                >
                  Valider les feuilles de match
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
      
      {/* Modal pour changer le statut */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Changer le statut du match"
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
              <option value="SCHEDULED">Planifié</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="COMPLETED">Terminé</option>
              <option value="POSTPONED">Reporté</option>
              <option value="CANCELLED">Annulé</option>
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
            disabled={isProcessing}
          >
            {isProcessing ? <LoadingSpinner size="sm" /> : 'Mettre à jour'}
          </Button>
        </div>
      </Modal>
      
      {/* Modal pour mettre à jour le score */}
      <Modal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        title="Mettre à jour le score"
      >
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {homeTeam?.teamName || 'Équipe à domicile'}
              </label>
              <Input
                type="number"
                value={homeScore}
                onChange={(e) => setHomeScore(e.target.value)}
                min={0}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {awayTeam?.teamName || 'Équipe à l\'extérieur'}
              </label>
              <Input
                type="number"
                value={awayScore}
                onChange={(e) => setAwayScore(e.target.value)}
                min={0}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button 
            onClick={() => setShowScoreModal(false)}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleUpdateScore}
            className="bg-purple-600 hover:bg-purple-700"
            disabled={isProcessing}
          >
            {isProcessing ? <LoadingSpinner size="sm" /> : 'Mettre à jour'}
          </Button>
        </div>
      </Modal>
      
      {/* Modal pour modifier les informations du match */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Modifier les informations du match"
      >
        <div className="space-y-4 py-4">
          <Input
            label="Titre du match"
            name="title"
            value={editFormData.title}
            onChange={handleEditFormChange}
            required
          />
          
          <Input
            label="Date et heure"
            name="scheduledDateTime"
            type="datetime-local"
            value={editFormData.scheduledDateTime}
            onChange={handleEditFormChange}
            required
          />
          
          <Input
            label="Lieu"
            name="location"
            value={editFormData.location}
            onChange={handleEditFormChange}
            required
          />
          
          <Input
            label="Tour / Journée"
            name="round"
            type="number"
            value={editFormData.round}
            onChange={handleEditNumberChange}
            min={1}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={editFormData.description}
              onChange={handleEditFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Description optionnelle..."
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button 
            onClick={() => setShowEditModal(false)}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleUpdateMatchInfo}
            className="bg-green-600 hover:bg-green-700"
            disabled={isProcessing}
          >
            {isProcessing ? <LoadingSpinner size="sm" /> : 'Enregistrer'}
          </Button>
        </div>
      </Modal>
    </div>
  );
} 