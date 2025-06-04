'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getAllCoachTeams, transferPlayer } from '@/services/team-service';
import { getPlayersByTeam } from '@/services/player-service';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Table from '@/components/ui/Table';

export default function TransferPlayerPage() {
  const searchParams = useSearchParams();
  const initialTeamId = searchParams.get('teamId') || '';
  const initialPlayerId = searchParams.get('playerId') || '';
  
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [sourceTeamId, setSourceTeamId] = useState(initialTeamId);
  const [targetTeamId, setTargetTeamId] = useState('');
  const [loading, setLoading] = useState(true);
  const [transferLoading, setTransferLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'COACH') {
      router.push('/dashboard');
      return;
    }

    fetchTeams();
  }, [user, router]);

  useEffect(() => {
    if (sourceTeamId) {
      fetchPlayers(sourceTeamId);
    } else {
      setPlayers([]);
      setSelectedPlayer(null);
    }
  }, [sourceTeamId]);

  useEffect(() => {
    if (initialPlayerId && players.length > 0) {
      const player = players.find(p => p.id.toString() === initialPlayerId);
      if (player) {
        setSelectedPlayer(player);
      }
    }
  }, [initialPlayerId, players]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const teamsData = await getAllCoachTeams(user.id);
      setTeams(teamsData || []);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des équipes:', err);
      setError('Impossible de récupérer vos équipes. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayers = async (teamId) => {
    try {
      setLoading(true);
      const playersData = await getPlayersByTeam(teamId, user.id);
      setPlayers(playersData || []);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des joueurs:', err);
      setError('Impossible de récupérer les joueurs. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleSourceTeamChange = (e) => {
    setSourceTeamId(e.target.value);
    setSelectedPlayer(null);
  };

  const handleTargetTeamChange = (e) => {
    setTargetTeamId(e.target.value);
  };

  const handleSelectPlayer = (player) => {
    setSelectedPlayer(player === selectedPlayer ? null : player);
  };

  const handleTransfer = async () => {
    if (!sourceTeamId || !targetTeamId || !selectedPlayer) {
      setError('Veuillez sélectionner une équipe source, une équipe cible et un joueur.');
      return;
    }

    if (sourceTeamId === targetTeamId) {
      setError('Les équipes source et cible doivent être différentes.');
      return;
    }

    try {
      setTransferLoading(true);
      setError(null);
      
      await transferPlayer(user.id, sourceTeamId, targetTeamId, selectedPlayer.id);
      
      setSuccessMessage(`${selectedPlayer.firstName} ${selectedPlayer.lastName} a été transféré avec succès.`);
      setSelectedPlayer(null);
      
      // Rafraîchir la liste des joueurs après le transfert
      await fetchPlayers(sourceTeamId);
    } catch (err) {
      console.error('Erreur lors du transfert du joueur:', err);
      setError('Impossible de transférer le joueur. Veuillez réessayer plus tard.');
    } finally {
      setTransferLoading(false);
    }
  };

  if (loading && teams.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const columns = [
    { header: 'Nom', accessor: (row) => `${row.firstName} ${row.lastName}` },
    { header: 'Position', accessor: 'position' },
    { header: 'Licence', accessor: 'licenseNumber' },
    { header: 'Email', accessor: 'email' },

    { 
        header: 'Actions', 
        accessor: 'id', // Utilisez un champ simple comme accessor
        cell: ({ row }) => (
          <div className="flex space-x-2">
               <Button
        onClick={() => handleSelectPlayer(row)}
        className={`text-xs px-2 py-1 ${selectedPlayer && selectedPlayer.id === row.id ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {selectedPlayer && selectedPlayer.id === row.id ? 'Sélectionné' : 'Sélectionner'}
      </Button>
          </div>
        )
      }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button 
          onClick={() => router.back()}
          className="mr-4 bg-gray-600 hover:bg-gray-700"
        >
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Transfert de joueur</h1>
      </div>

      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      {successMessage && (
        <Alert 
          type="success" 
          message={successMessage} 
          onClose={() => setSuccessMessage(null)}
          className="mb-6"
        />
      )}

      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-6">Sélection des équipes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Équipe source
              </label>
              <select
                value={sourceTeamId}
                onChange={handleSourceTeamChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionnez l'équipe source</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Équipe cible
              </label>
              <select
                value={targetTeamId}
                onChange={handleTargetTeamChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionnez l'équipe cible</option>
                {teams
                  .filter(team => team.id !== parseInt(sourceTeamId))
                  .map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))
                }
              </select>
            </div>
          </div>
          
          {sourceTeamId && targetTeamId && selectedPlayer && (
            <div className="bg-blue-50 p-4 rounded-md mb-6">
              <h3 className="font-medium mb-2">Résumé du transfert</h3>
              <p>
                Transférer <span className="font-semibold">{selectedPlayer.firstName} {selectedPlayer.lastName}</span> de{' '}
                <span className="font-semibold">{teams.find(t => t.id.toString() === sourceTeamId)?.name}</span> vers{' '}
                <span className="font-semibold">{teams.find(t => t.id.toString() === targetTeamId)?.name}</span>
              </p>
              <div className="mt-4">
                <Button
                  onClick={handleTransfer}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={transferLoading}
                >
                  {transferLoading ? <LoadingSpinner size="sm" /> : 'Confirmer le transfert'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {sourceTeamId ? (
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Sélectionner un joueur de l'équipe {teams.find(t => t.id.toString() === sourceTeamId)?.name}
            </h2>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : players.length === 0 ? (
              <p className="text-center py-8 text-gray-600">Aucun joueur dans cette équipe</p>
            ) : (
              <Table 
                columns={columns} 
                data={players}
                pagination={{ itemsPerPage: 10 }}
              />
            )}
          </div>
        </Card>
      ) : (
        <Card>
          <div className="p-6 text-center">
            <p className="text-gray-600">Veuillez sélectionner une équipe source pour voir les joueurs disponibles.</p>
          </div>
        </Card>
      )}
    </div>
  );
} 