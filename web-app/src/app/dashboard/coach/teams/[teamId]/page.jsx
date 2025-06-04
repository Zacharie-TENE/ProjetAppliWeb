'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getTeamById } from '@/services/team-service';
import { getPlayersByTeam, removePlayer } from '@/services/player-service';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Table from '@/components/ui/Table';

export default function TeamDetailsPage() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', type: '' });
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'COACH') {
      router.push('/dashboard');
      return;
    }

    fetchTeamDetails();
  }, [user, router, teamId]);

  const fetchTeamDetails = async () => {
    try {
      setLoading(true);
      // Récupérer les détails de l'équipe
      const teamData = await getTeamById(teamId);
      setTeam(teamData);

      // Récupérer les joueurs de l'équipe
      const playersData = await getPlayersByTeam(teamId, user.id);
      setPlayers(playersData || []);
      setError(null);
    } catch (err) {
    //  console.error('Erreur lors de la récupération des détails de l\'équipe:', err);
      setError('Impossible de récupérer les détails de l\'équipe. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePlayer = async (playerId) => {
    if (window.confirm('Êtes-vous sûr de vouloir retirer ce joueur de l\'équipe ?')) {
      try {
        await removePlayer(user.id, playerId);
        setAlertInfo({
          show: true,
          message: 'Joueur retiré avec succès',
          type: 'success'
        });
        // Rafraîchir la liste des joueurs
        fetchTeamDetails();
      } catch (err) {
//console.error('Erreur lors du retrait du joueur:', err);
        setAlertInfo({
          show: true,
          message: 'Erreur lors du retrait du joueur',
          type: 'error'
        });
      }
    }
  };

  if (loading) {
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
    { header: 'Date de naissance', accessor: (row) => {
      if (!row.dateOfBirth) return 'Non spécifiée';
      return new Date(row.dateOfBirth).toLocaleDateString('fr-FR');
    }},
    { header: 'Email', accessor: 'email' },
    { header: 'Téléphone', accessor: 'phone' },
    { 
      header: 'Actions', 
      accessor: 'id',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            onClick={() => router.push(`/players/${row.id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1"
          >
            Détails
          </Button>
          <Button
            onClick={() => handleRemovePlayer(row.id)}
            className="bg-red-600 hover:bg-red-700 text-xs px-2 py-1"
          >
            Retirer
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button 
          onClick={() => router.push('/dashboard/coach/teams')}
          className="mr-4 bg-gray-600 hover:bg-gray-700"
        >
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Détails de l'équipe</h1>
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

      {team && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1">
            <div className="p-6">
              <div className="flex flex-col items-center mb-6">
                {team.logo ? (
                  <img 
                    src={team.logo} 
                    alt={`Logo ${team.name}`} 
                    className="w-32 h-32 rounded-full mb-4 object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                    <span className="text-4xl font-bold text-gray-500">{team.name.charAt(0)}</span>
                  </div>
                )}
                <h2 className="text-xl font-bold text-center">{team.name}</h2>
                <p className="text-sm text-gray-600">{team.category}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-md font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{team.description || 'Aucune description'}</p>
              </div>

              <div className="flex flex-col space-y-2 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Joueurs</span>
                  <span className="font-semibold">{team.playerCount || players.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Compétitions</span>
                  <span className="font-semibold">{team.competitionCount || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Créée le</span>
                  <span className="font-semibold">
                    {team.createdAt ? new Date(team.createdAt).toLocaleDateString('fr-FR') : 'Non spécifiée'}
                  </span>
                </div>
              </div>

              <div className="flex justify-center space-x-3">
                <Button
                  onClick={() => router.push(`/dashboard/coach/teams/${team.id}/edit`)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Modifier
                </Button>
                <Button
                  onClick={() => router.push(`/dashboard/coach/competitions?teamId=${team.id}`)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Compétitions
                </Button>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Joueurs de l'équipe</h3>
                <Button
                  onClick={() => router.push(`/dashboard/coach/players/register?teamId=${team.id}`)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Ajouter un joueur
                </Button>
              </div>

              {players.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Aucun joueur dans cette équipe</p>
                  <Button 
                    onClick={() => router.push(`/dashboard/coach/players/register?teamId=${team.id}`)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Ajouter votre premier joueur
                  </Button>
                </div>
              ) : (
                <Table 
                  columns={columns} 
                  data={players}
                  pagination={{ itemsPerPage: 10 }}
                />
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
