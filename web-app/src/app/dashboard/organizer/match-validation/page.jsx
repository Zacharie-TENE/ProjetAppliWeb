'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { validateMatchSheet } from '@/services/match-service';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Table from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';

export default function MatchValidationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const matchId = searchParams.get('matchId');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', type: '' });
  const [pendingSheets, setPendingSheets] = useState([]);
  const [filteredSheets, setFilteredSheets] = useState([]);
  
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [validationStatus, setValidationStatus] = useState('APPROVED');
  const [comments, setComments] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [filters, setFilters] = useState({
    competition: '',
    team: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'ORGANIZER') {
      router.push('/dashboard');
      return;
    }

    fetchPendingSheets();
  }, [user, router]);

  useEffect(() => {
    applyFilters();
  }, [pendingSheets, filters]);

  const fetchPendingSheets = async () => {
    try {
      setLoading(true);
      // Dans une application réelle, nous ferions un appel API pour récupérer les feuilles en attente
      // Pour ce prototype, nous utilisons des données simulées
      
      // Simulation de données pour le développement
      const mockPendingSheets = [
        // Ces données seraient normalement récupérées depuis l'API
      ];
      
      setPendingSheets(mockPendingSheets);
      setFilteredSheets(mockPendingSheets);
      
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des feuilles de match:', err);
      setError('Impossible de récupérer les feuilles de match. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...pendingSheets];
    
    if (filters.competition) {
      filtered = filtered.filter(sheet => 
        sheet.competitionId === parseInt(filters.competition) ||
        sheet.competitionName.toLowerCase().includes(filters.competition.toLowerCase())
      );
    }
    
    if (filters.team) {
      filtered = filtered.filter(sheet => 
        sheet.teamName.toLowerCase().includes(filters.team.toLowerCase())
      );
    }
    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(sheet => 
        new Date(sheet.matchDateTime) >= fromDate
      );
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      // Ajuster la date de fin à 23:59:59
      toDate.setHours(23, 59, 59);
      filtered = filtered.filter(sheet => 
        new Date(sheet.matchDateTime) <= toDate
      );
    }
    
    setFilteredSheets(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenValidationModal = (sheet) => {
    setSelectedSheet(sheet);
    setValidationStatus('APPROVED');
    setComments('');
    setShowValidationModal(true);
  };

  const handleValidate = async () => {
    try {
      setIsProcessing(true);
      
      const validationDTO = {
        matchSheetId: selectedSheet.id,
        status: validationStatus
      };
      
      await validateMatchSheet(user.id, validationDTO, comments);
      
      setAlertInfo({
        show: true,
        message: `Feuille de match ${validationStatus === 'APPROVED' ? 'validée' : 'rejetée'} avec succès`,
        type: 'success'
      });
      
      // Mettre à jour les données locales
      setPendingSheets(prev => prev.filter(sheet => sheet.id !== selectedSheet.id));
      setShowValidationModal(false);
      
    } catch (err) {
      console.error('Erreur lors de la validation de la feuille de match:', err);
      setAlertInfo({
        show: true,
        message: 'Erreur lors de la validation de la feuille de match',
        type: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const columns = [
    { header: 'Match', accessor: 'matchTitle' },
    { header: 'Compétition', accessor: 'competitionName' },
    { header: 'Équipe', accessor: 'teamName' },
    { header: 'Date du match', accessor: 'matchDateTime', render: (value) => (
      <span>{new Date(value).toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</span>
    )},
    { header: 'Soumis le', accessor: 'submittedAt', render: (value) => (
      <span>{new Date(value).toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</span>
    )},
    { header: 'Actions', accessor: (row) => (
      <div className="flex space-x-2">
        <Button
          onClick={() => router.push(`/dashboard/organizer/match-validation/${row.id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1"
        >
          Consulter
        </Button>
        <Button
          onClick={() => handleOpenValidationModal(row)}
          className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1"
        >
          Valider
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Validation des feuilles de match</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Compétition"
              name="competition"
              value={filters.competition}
              onChange={handleFilterChange}
              placeholder="Nom ou ID de la compétition"
            />
            
            <Input
              label="Équipe"
              name="team"
              value={filters.team}
              onChange={handleFilterChange}
              placeholder="Nom de l'équipe"
            />
            
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
          <h2 className="text-lg font-semibold mb-4">Feuilles en attente de validation</h2>
          
          {filteredSheets.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-2">Aucune feuille de match en attente</p>
              <p className="text-sm text-gray-400">Toutes les feuilles ont été traitées</p>
            </div>
          ) : (
            <Table 
              columns={columns} 
              data={filteredSheets} 
              emptyMessage="Aucune feuille de match trouvée avec les filtres actuels"
            />
          )}
        </div>
      </Card>
      
      {/* Modal de validation */}
      <Modal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        title="Validation de la feuille de match"
      >
        {selectedSheet && (
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Match:</span> {selectedSheet.matchTitle}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Compétition:</span> {selectedSheet.competitionName}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Équipe:</span> {selectedSheet.teamName}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Date du match:</span> {
                  new Date(selectedSheet.matchDateTime).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                }
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Décision
              </label>
              <select
                value={validationStatus}
                onChange={(e) => setValidationStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="APPROVED">Approuver</option>
                <option value="REJECTED">Rejeter</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commentaires
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Commentaires sur la validation..."
              />
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button 
            onClick={() => setShowValidationModal(false)}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleValidate}
            className={`${validationStatus === 'APPROVED' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
            disabled={isProcessing}
          >
            {isProcessing ? <LoadingSpinner size="sm" /> : 
              validationStatus === 'APPROVED' ? 'Approuver' : 'Rejeter'}
          </Button>
        </div>
      </Modal>
    </div>
  );
} 