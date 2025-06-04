'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getCompetitionById } from '@/services/competition-service';
import { getPlayersByCompetition, updatePlayerPerformance } from '@/services/player-service';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Table from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';

export default function CompetitionPlayersPage() {
  const router = useRouter();
  const { competitionId } = useParams();
  const { user } = useAuth();
  
  const [competition, setCompetition] = useState(null);
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', type: '' });
  
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [performanceData, setPerformanceData] = useState({
    totalGoals: 0,
    totalAssists: 0,
    totalYellowCards: 0,
    totalRedCards: 0,
    totalMinutesPlayed: 0,
    rating: 0,
    notes: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [filters, setFilters] = useState({
    name: '',
    team: '',
    position: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'ORGANIZER') {
      router.push('/dashboard');
      return;
    }

    fetchData();
  }, [competitionId, user, router]);

  useEffect(() => {
    applyFilters();
  }, [players, filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Récupérer les détails de la compétition
      const competitionData = await getCompetitionById(competitionId);
      setCompetition(competitionData);
      
      // Récupérer les joueurs et leurs performances dans cette compétition
      const playersData = await getPlayersByCompetition(competitionId);
      setPlayers(playersData || []);
      setFilteredPlayers(playersData || []);
      
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des données:', err);
      setError('Impossible de récupérer les données. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...players];
    
    if (filters.name) {
      filtered = filtered.filter(player => 
        (player.firstName + ' ' + player.lastName).toLowerCase().includes(filters.name.toLowerCase()) ||
        player.playerName?.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    
    if (filters.team) {
      filtered = filtered.filter(player => 
        player.teamName?.toLowerCase().includes(filters.team.toLowerCase())
      );
    }
    
    if (filters.position) {
      filtered = filtered.filter(player => player.position === filters.position);
    }
    
    setFilteredPlayers(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenPerformanceModal = (player) => {
    setSelectedPlayer(player);
    
    // Initialiser le formulaire avec les données existantes du joueur
    setPerformanceData({
      totalGoals: player.totalGoals || 0,
      totalAssists: player.totalAssists || 0,
      totalYellowCards: player.totalYellowCards || 0,
      totalRedCards: player.totalRedCards || 0,
      totalMinutesPlayed: player.totalMinutesPlayed || 0,
      rating: player.rating || 0,
      notes: player.notes || ''
    });
    
    setShowPerformanceModal(true);
  };

  const handlePerformanceChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'rating') {
      // Limiter la note entre 0 et 10
      const ratingValue = parseFloat(value);
      if (ratingValue >= 0 && ratingValue <= 10) {
        setPerformanceData(prev => ({ ...prev, [name]: ratingValue }));
      }
    } else if (name === 'notes') {
      setPerformanceData(prev => ({ ...prev, [name]: value }));
    } else {
      // Pour les champs numériques
      const numValue = parseInt(value, 10);
      if (numValue >= 0) {
        setPerformanceData(prev => ({ ...prev, [name]: numValue }));
      }
    }
  };

  const handleUpdatePerformance = async () => {
    try {
      setIsUpdating(true);
      
      const performanceUpdateDTO = {
        ...performanceData,
        playerId: selectedPlayer.id,
        competitionId: parseInt(competitionId)
      };
      
      await updatePlayerPerformance(user.id, performanceUpdateDTO);
      
      setAlertInfo({
        show: true,
        message: 'Performances du joueur mises à jour avec succès',
        type: 'success'
      });
      
      // Mettre à jour les données locales
      setPlayers(prev => prev.map(player => {
        if (player.id === selectedPlayer.id) {
          return { ...player, ...performanceData };
        }
        return player;
      }));
      
      setShowPerformanceModal(false);
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour des performances:', err);
      setAlertInfo({
        show: true,
        message: 'Erreur lors de la mise à jour des performances',
        type: 'error'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getPositionLabel = (position) => {
    const positionMap = {
      'GOALKEEPER': 'Gardien',
      'DEFENDER': 'Défenseur',
      'MIDFIELDER': 'Milieu',
      'FORWARD': 'Attaquant'
    };
    return positionMap[position] || position;
  };

  const playerColumns = [
    { header: 'Joueur', accessor: (row) => {
      return row.playerName || `${row.firstName} ${row.lastName}`;
    }},
    { header: 'Équipe', accessor: 'teamName' },
    { header: 'Position', accessor: 'position', render: (value) => (
      <span>{getPositionLabel(value)}</span>
    )},
    { header: 'Buts', accessor: (row) => row.totalGoals || 0 },
    { header: 'Passes D.', accessor: (row) => row.totalAssists || 0 },
    { header: 'Cartons J/R', accessor: (row) => `${row.totalYellowCards || 0} / ${row.totalRedCards || 0}` },
    { header: 'Minutes', accessor: (row) => row.totalMinutesPlayed || 0 },
    { header: 'Note', accessor: (row) => (row.rating ? row.rating.toFixed(1) : '-') + '/10' },
    { header: 'Actions', accessor: (row) => (
      <Button
        onClick={() => handleOpenPerformanceModal(row)}
        className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1"
      >
        Modifier
      </Button>
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
          <h1 className="text-2xl font-bold mb-1">Performances des joueurs</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Rechercher par nom"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Nom du joueur..."
            />
            
            <Input
              label="Équipe"
              name="team"
              value={filters.team}
              onChange={handleFilterChange}
              placeholder="Nom de l'équipe..."
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <select
                name="position"
                value={filters.position}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Toutes les positions</option>
                <option value="GOALKEEPER">Gardien</option>
                <option value="DEFENDER">Défenseur</option>
                <option value="MIDFIELDER">Milieu</option>
                <option value="FORWARD">Attaquant</option>
              </select>
            </div>
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Joueurs ({filteredPlayers.length})</h2>
          
          {filteredPlayers.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-2">Aucun joueur trouvé dans cette compétition</p>
              <p className="text-sm text-gray-400">Les joueurs apparaîtront ici une fois les équipes inscrites</p>
            </div>
          ) : (
            <Table 
              columns={playerColumns} 
              data={filteredPlayers} 
             emptyState={<div className="text-center py-4 text-gray-500">Aucun joueur trouvé</div>}
            />
          )}
        </div>
      </Card>
      
      {/* Modal pour modifier les performances */}
      <Modal
        isOpen={showPerformanceModal}
        onClose={() => setShowPerformanceModal(false)}
        title="Modifier les performances du joueur"
      >
        {selectedPlayer && (
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Joueur:</span> {selectedPlayer.playerName || `${selectedPlayer.firstName} ${selectedPlayer.lastName}`}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Équipe:</span> {selectedPlayer.teamName}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Position:</span> {getPositionLabel(selectedPlayer.position)}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Buts marqués"
                name="totalGoals"
                type="number"
                value={performanceData.totalGoals}
                onChange={handlePerformanceChange}
                min={0}
              />
              
              <Input
                label="Passes décisives"
                name="totalAssists"
                type="number"
                value={performanceData.totalAssists}
                onChange={handlePerformanceChange}
                min={0}
              />
              
              <Input
                label="Cartons jaunes"
                name="totalYellowCards"
                type="number"
                value={performanceData.totalYellowCards}
                onChange={handlePerformanceChange}
                min={0}
              />
              
              <Input
                label="Cartons rouges"
                name="totalRedCards"
                type="number"
                value={performanceData.totalRedCards}
                onChange={handlePerformanceChange}
                min={0}
              />
              
              <Input
                label="Minutes jouées"
                name="totalMinutesPlayed"
                type="number"
                value={performanceData.totalMinutesPlayed}
                onChange={handlePerformanceChange}
                min={0}
              />
              
              <Input
                label="Note (0-10)"
                name="rating"
                type="number"
                value={performanceData.rating}
                onChange={handlePerformanceChange}
                step="0.1"
                min={0}
                max={10}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes / Commentaires
              </label>
              <textarea
                name="notes"
                value={performanceData.notes}
                onChange={handlePerformanceChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Observations sur les performances du joueur..."
              />
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button 
            onClick={() => setShowPerformanceModal(false)}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleUpdatePerformance}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isUpdating}
          >
            {isUpdating ? <LoadingSpinner size="sm" /> : 'Enregistrer'}
          </Button>
        </div>
      </Modal>
    </div>
  );
} 