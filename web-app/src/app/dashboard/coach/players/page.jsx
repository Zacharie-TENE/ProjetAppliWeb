'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getPlayersByCoach, removePlayer } from '@/services/player-service';
import { getAllCoachTeams } from '@/services/team-service';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Table from '@/components/ui/Table';

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', type: '' });
  const [filters, setFilters] = useState({
    name: '',
    teamId: ''
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

      // Récupérer tous les joueurs du coach
      const playersData = await getPlayersByCoach(user.id);
      setPlayers(playersData || []);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des données:', err);
      setError('Impossible de récupérer vos joueurs. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePlayer = async (playerId, teamId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce joueur ? Cette action est irréversible.')) {
      try {
        await removePlayer(user.id, playerId, teamId);
        setAlertInfo({
          show: true,
          message: 'Joueur supprimé avec succès',
          type: 'success'
        });
        fetchData();
      } catch (err) {
        console.error('Erreur lors de la suppression du joueur:', err);
        setAlertInfo({
          show: true,
          message: 'Erreur lors de la suppression du joueur',
          type: 'error'
        });
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredPlayers = players.filter(player => {
    const nameMatch = `${player.firstName} ${player.lastName}`.toLowerCase().includes(filters.name.toLowerCase());
    const teamMatch = filters.teamId ? player.teamId === parseInt(filters.teamId) : true;
    return nameMatch && teamMatch;
  });


  const columns = [
  { header: 'Nom', accessor: (row) => `${row.firstName} ${row.lastName}` },
  { header: 'Équipe', accessor: 'teamName' },
  { header: 'Position', accessor: 'position' },
  { header: 'Licence', accessor: 'licenseNumber' },
  { header: 'Email', accessor: 'email' },
  { header: 'Téléphone', accessor: 'phone' },
  { 
    header: 'Actions', 
    accessor: 'id', // Utilisez un champ simple comme accessor
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button
          onClick={() => router.push(`/players/${row.id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1"
        >
          Détails
        </Button>
        <Button
          onClick={() => router.push(`/dashboard/coach/players/${row.id}/edit`)}
          className="bg-gray-600 hover:bg-gray-700 text-xs px-2 py-1"
        >
          Modifier
        </Button>
        <Button
          onClick={() => handleRemovePlayer(row.id, row.teamId)}
          className="bg-red-600 hover:bg-red-700 text-xs px-2 py-1"
        >
          Supprimer
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Gestion des Joueurs</h1>
        <Button 
          onClick={() => router.push('/dashboard/coach/players/register')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Enregistrer un joueur
        </Button>

         <Button
          onClick={() => router.push(`/dashboard/coach/players/transfer`)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Effectuer un transfert de joueur
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
              placeholder="Rechercher un joueur..."
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
          </div>
        </div>
      </Card>

      {players.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">Vous n'avez pas encore de joueurs enregistrés</p>
          <Button 
            onClick={() => router.push('/dashboard/coach/players/register')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Enregistrer votre premier joueur
          </Button>
        </div>
      ) : (
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Liste des joueurs ({filteredPlayers.length})</h2>
            <Table 
              columns={columns} 
              data={filteredPlayers}
              pagination={{ itemsPerPage: 10 }}
            />
          </div>
        </Card>
      )}
    </div>
  );
} 