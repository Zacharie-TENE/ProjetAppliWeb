'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getAllCoachTeams, deleteTeam } from '@/services/team-service';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
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

    fetchTeams();
  }, [user, router]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await getAllCoachTeams(user.id);
      setTeams(response || []);
      setError(null);
    } catch (err) {
      //console.error('Erreur lors de la récupération des équipes:', err);
      setError('Impossible de récupérer vos équipes. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette équipe ? Cette action est irréversible.')) {
      try {
        await deleteTeam(user.id, teamId);
        setAlertInfo({
          show: true,
          message: 'Équipe supprimée avec succès',
          type: 'success'
        });
        fetchTeams();
      } catch (err) {
       // console.error('Erreur lors de la suppression de l\'équipe:', err);
        setAlertInfo({
          show: true,
          message: 'Erreur lors de la suppression de l\'équipe',
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Gestion des Équipes</h1>
        <Button 
          onClick={() => router.push('/dashboard/coach/teams/create')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Créer une équipe
        </Button>
      </div>

      {alertInfo.show && (
        <Alert 
          type={alertInfo.type} 
          message={alertInfo.message} 
          onClose={() => setAlertInfo({ ...alertInfo, show: false })}
        />
      )}

      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)}
        />
      )}

      {teams.length === 0 && !loading && !error ? (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">Vous n'avez pas encore créé d'équipe</p>
          <Button 
            onClick={() => router.push('/dashboard/coach/teams/create')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Créer votre première équipe
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card key={team.id} className="overflow-hidden">
              <div className="p-5">
                <div className="flex items-center mb-4">
                  {team.logo ? (
                    <img 
                      src={team.logo} 
                      alt={`Logo ${team.name}`} 
                      className="w-16 h-16 rounded-full mr-4 object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                      <span className="text-xl font-bold text-gray-500">{team.name.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{team.name}</h3>
                    <p className="text-sm text-gray-600">{team.category}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-2 line-clamp-2">{team.description || 'Aucune description'}</p>
                  <div className="flex space-x-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">{team.playerCount || 0}</span> joueurs
                    </div>
                    <div>
                      <span className="font-medium">{team.competitionCount || 0}</span> compétitions
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-4">
                  <Button
                    onClick={() => router.push(`/dashboard/coach/teams/${team.id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-sm px-3 py-1"
                  >
                    Détails
                  </Button>
                  <div className="space-x-2">
                    <Button
                      onClick={() => router.push(`/dashboard/coach/teams/${team.id}/edit`)}
                      className="bg-gray-600 hover:bg-gray-700 text-sm px-3 py-1"
                    >
                      Modifier
                    </Button>
                    <Button
                      onClick={() => handleDeleteTeam(team.id)}
                      className="bg-red-600 hover:bg-red-700 text-sm px-3 py-1"
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
