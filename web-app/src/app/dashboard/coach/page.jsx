'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getAllCoachTeams } from '@/services/team-service';
import { getPlayersByCoach } from '@/services/player-service';
import { getMatchSheetsByCoach } from '@/services/match-service';
import { getCompetitionRequestsByCoach } from '@/services/competition-service';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';

export default function CoachDashboardPage() {
  const [stats, setStats] = useState({
    teamsCount: 0,
    playersCount: 0,
    pendingMatchSheets: 0,
    pendingRequests: 0
  });
  const [recentTeams, setRecentTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'COACH') {
      router.push('/dashboard');
      return;
    }

    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les équipes du coach
      const teamsData = await getAllCoachTeams(user.id);
      const teams = teamsData || [];
      
      // Récupérer les joueurs du coach
      const playersData = await getPlayersByCoach(user.id);
      const players = playersData || [];
      
      // Récupérer les feuilles de match
      const matchSheetsData = await getMatchSheetsByCoach(user.id);
      const matchSheets = matchSheetsData?.matchSheets || [];
      const pendingMatchSheets = matchSheets.filter(sheet => sheet.status === 'DRAFT' || sheet.status === 'UNVALIDATED').length;
      
      // Récupérer les demandes de compétitions
      const requestsData = await getCompetitionRequestsByCoach(user.id);
      const pendingRequests = (requestsData || []).filter(request => request.requestStatus === 'PENDING').length;
      
      // Mettre à jour les statistiques
      setStats({
        teamsCount: teams.length,
        playersCount: players.length,
        pendingMatchSheets,
        pendingRequests
      });
      
      // Récupérer les équipes récentes (triées par date de création)
      const sortedTeams = [...teams].sort((a, b) => 
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      ).slice(0, 3);
      setRecentTeams(sortedTeams);
      
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des données du tableau de bord:', err);
      setError('Impossible de récupérer les données du tableau de bord. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
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
      <h1 className="text-2xl font-bold mb-8">Tableau de bord Coach</h1>
      
      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="p-6 text-center">
            <h2 className="text-lg font-semibold mb-4">Équipes</h2>
            <p className="text-4xl font-bold text-blue-600 mb-4">{stats.teamsCount}</p>
            <Button 
              onClick={() => router.push('/dashboard/coach/teams')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Gérer les équipes
            </Button>
          </div>
        </Card>
        
        <Card>
          <div className="p-6 text-center">
            <h2 className="text-lg font-semibold mb-4">Joueurs</h2>
            <p className="text-4xl font-bold text-green-600 mb-4">{stats.playersCount}</p>
            <Button 
              onClick={() => router.push('/dashboard/coach/players')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Gérer les joueurs
            </Button>
          </div>
        </Card>
        
        <Card>
          <div className="p-6 text-center">
            <h2 className="text-lg font-semibold mb-4">Feuilles de match</h2>
            <div className="mb-4">
              <p className="text-4xl font-bold text-orange-600">{stats.pendingMatchSheets}</p>
              <p className="text-sm text-gray-600">en attente</p>
            </div>
            <Button 
              onClick={() => router.push('/dashboard/coach/matches')}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              Gérer les matchs
            </Button>
          </div>
        </Card>
        
        <Card>
          <div className="p-6 text-center">
            <h2 className="text-lg font-semibold mb-4">Demandes</h2>
            <div className="mb-4">
              <p className="text-4xl font-bold text-purple-600">{stats.pendingRequests}</p>
              <p className="text-sm text-gray-600">en attente</p>
            </div>
            <Button 
              onClick={() => router.push('/dashboard/coach/competitions')}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Gérer les compétitions
            </Button>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Équipes récentes</h2>
            {recentTeams.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-4">Vous n'avez pas encore créé d'équipe</p>
                <Button 
                  onClick={() => router.push('/dashboard/coach/teams/create')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Créer votre première équipe
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTeams.map(team => (
                  <div key={team.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="flex items-center">
                      {team.logo ? (
                        <img 
                          src={team.logo} 
                          alt={`Logo ${team.name}`} 
                          className="w-10 h-10 rounded-full mr-3 object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <span className="text-sm font-bold text-gray-500">{team.name.charAt(0)}</span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium">{team.name}</h3>
                        <p className="text-sm text-gray-600">{team.playerCount || 0} joueurs</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => router.push(`/dashboard/coach/teams/${team.id}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1"
                    >
                      Détails
                    </Button>
                  </div>
                ))}
                <div className="text-center pt-2">
                  <Button 
                    onClick={() => router.push('/dashboard/coach/teams')}
                    className="bg-gray-600 hover:bg-gray-700"
                  >
                    Voir toutes les équipes
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => router.push('/dashboard/coach/teams/create')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Créer une équipe
              </Button>
              <Button 
                onClick={() => router.push('/dashboard/coach/players/register')}
                className="bg-green-600 hover:bg-green-700"
              >
                Enregistrer un joueur
              </Button>
              <Button 
                onClick={() => router.push('/dashboard/coach/matches')}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Gérer les feuilles de match
              </Button>
              <Button 
                onClick={() => router.push('/dashboard/coach/competitions')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                S'inscrire à une compétition
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 