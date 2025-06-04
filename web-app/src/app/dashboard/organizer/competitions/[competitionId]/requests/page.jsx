'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams    } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getCompetitionById, processCompetitionRequest, getRequestsByCompetitionId } from '@/services/competition-service';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Table from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';

export default function CompetitionRequestsPage() {
  const router = useRouter();
  const { competitionId } = useParams();
  const { user } = useAuth();
  
  const [competition, setCompetition] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', type: '' });
  
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [reasonText, setReasonText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'ORGANIZER') {
      router.push('/dashboard');
      return;
    }

    fetchData();
  }, [competitionId, user, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Récupérer les détails de la compétition
      const competitionData = await getCompetitionById(competitionId);
      setCompetition(competitionData);
      
      // Récupérer les demandes pour cette compétition
      const requestsData = await getRequestsByCompetitionId(user.id, competitionId);
      console.log('Demandes récupérées:', requestsData);
      setRequests(requestsData || []);
      
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des données:', err);
      setError('Impossible de récupérer les données. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setReasonText('');
    setShowActionModal(true);
  };

  const handleProcessRequest = async () => {
    if (!reasonText) {
      setAlertInfo({
        show: true,
        message: 'Veuillez fournir une raison pour votre décision',
        type: 'error'
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      
      const approved = actionType === 'approve';
      
      await processCompetitionRequest(
        user.id,
        selectedRequest.id,
        approved,
        reasonText
      );
      
      setAlertInfo({
        show: true,
        message: `Demande ${approved ? 'approuvée' : 'refusée'} avec succès`,
        type: 'success'
      });
      
      // Mettre à jour les données locales
      setRequests(prev => prev.filter(req => req.id !== selectedRequest.id));
      setShowActionModal(false);
      
      // Rafraîchir les données
      fetchData();
      
    } catch (err) {
      console.error('Erreur lors du traitement de la demande:', err);
      setAlertInfo({
        show: true,
        message: 'Erreur lors du traitement de la demande',
        type: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getRequestTypeLabel = (type) => {
    return type === 'REGISTRATION' ? 'Inscription' : 
           type === 'WITHDRAWAL' ? 'Retrait' : type;
  };

  const getRequestStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const requestColumns = [
    { header: 'Équipe', accessor: 'teamName' },
    { header: 'Type', accessor: 'requestType', cell: ({ value }) => (
      <span>{getRequestTypeLabel(value)}</span>
    )},
    { header: 'Statut', accessor: 'requestStatus', cell: ({ value }) => (
      <span className={`px-2 py-1 rounded-full text-xs ${getRequestStatusColor(value)}`}>
        {value === 'PENDING' ? 'En attente' :
         value === 'APPROVED' ? 'Approuvée' :
         value === 'REJECTED' ? 'Refusée' : value}
      </span>
    )},
    { header: 'Date', accessor: 'createdAt', cell: ({ value }) => (
      <span>{new Date(value).toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</span>
    )},
    { header: 'Raison', accessor: 'reason', cell: ({ value }) => (
      <div className="max-w-xs truncate" title={value}>{value}</div>
    )},
    { header: 'Actions', accessor: 'requestStatus', cell: ({ row }) => (
      row.requestStatus === 'PENDING' ? (
        <div className="flex space-x-2">
          <Button
            onClick={() => handleOpenModal(row, 'approve')}
            className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1"
          >
            Approuver
          </Button>
          <Button
            onClick={() => handleOpenModal(row, 'reject')}
            className="bg-red-600 hover:bg-red-700 text-xs px-2 py-1"
          >
            Refuser
          </Button>
        </div>
      ) : (
        <span className="text-sm text-gray-500">Traité</span>
      )
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
          <h1 className="text-2xl font-bold mb-1">Demandes d'inscription</h1>
          <p className="text-gray-600">Compétition: {competition.name}</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => router.push(`/dashboard/organizer/competitions/${competitionId}`)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Retour aux détails
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
      
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Liste des demandes</h2>
          
          {requests.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-2">Aucune demande en attente pour cette compétition</p>
              <p className="text-sm text-gray-400">Les demandes d'inscription et de retrait apparaîtront ici</p>
            </div>
          ) : (
            <Table 
              columns={requestColumns} 
              data={requests} 
              emptyState={<div className="text-center py-4 text-gray-500">Aucune demande trouvée</div>}
            />
          )}
        </div>
      </Card>
      
      {/* Modal pour approuver/refuser une demande */}
      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title={actionType === 'approve' ? 'Approuver la demande' : 'Refuser la demande'}
      >
        {selectedRequest && (
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Type:</span> {getRequestTypeLabel(selectedRequest.type)}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Équipe:</span> {selectedRequest.teamName}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Coach:</span> {selectedRequest.coachName}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Raison de la demande:</span> {selectedRequest.reason}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raison de votre décision
              </label>
              <textarea
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Expliquez votre décision..."
              />
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button 
            onClick={() => setShowActionModal(false)}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleProcessRequest}
            className={`${actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
            disabled={isProcessing}
          >
            {isProcessing ? <LoadingSpinner size="sm" /> : 
              actionType === 'approve' ? 'Approuver' : 'Refuser'}
          </Button>
        </div>
      </Modal>
    </div>
  );
} 