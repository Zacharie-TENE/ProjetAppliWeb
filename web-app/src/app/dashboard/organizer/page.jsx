'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getCompetitionsByOrganizer } from '@/services/competition-service';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';

export default function OrganizerDashboardPage() {
  const [stats, setStats] = useState({
    upcomingCompetitions: 0,
    ongoingCompetitions: 0,
    completedCompetitions: 0,
    pendingRequests: 0,
    pendingMatchSheets: 0,
    upcomingMatches: 0
  });
  const [recentCompetitions, setRecentCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'ORGANIZER') {
      router.push('/dashboard');
      return;
    }

    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les compétitions de l'organisateur
      const competitionsData = await getCompetitionsByOrganizer(user.id);
      
      // Calculer les statistiques
      const upcoming = competitionsData?.upcomingCompetitions?.length || 0;
      const ongoing = competitionsData?.ongoingCompetitions?.length || 0;
      const completed = competitionsData?.completedCompetitions?.length || 0;
      
      // Compter les demandes en attente et les feuilles de match à valider
      let pendingRequests = 0;
      let pendingMatchSheets = 0;
      let upcomingMatches = 0;
      
      // Analyser les compétitions en cours pour obtenir plus de statistiques
      const ongoingComps = competitionsData?.ongoingCompetitions || [];
      ongoingComps.forEach(comp => {
        if (comp.pendingRequests) pendingRequests += comp.pendingRequests;
        if (comp.pendingMatchSheets) pendingMatchSheets += comp.pendingMatchSheets;
        if (comp.upcomingMatches) upcomingMatches += comp.upcomingMatches;
      });
      
      setStats({
        upcomingCompetitions: upcoming,
        ongoingCompetitions: ongoing,
        completedCompetitions: completed,
        pendingRequests,
        pendingMatchSheets,
        upcomingMatches
      });
      
      // Récupérer les compétitions récentes (combinaison de en cours et à venir)
      const allRecentCompetitions = [
        ...(competitionsData?.ongoingCompetitions || []),
        ...(competitionsData?.upcomingCompetitions || [])
      ].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)).slice(0, 3);
      
      setRecentCompetitions(allRecentCompetitions);
      
      setError(null);
    } catch (err) {
     // console.error('Erreur lors de la récupération des données du tableau de bord:', err);
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
      <h1 className="text-2xl font-bold mb-8">Tableau de bord Organisateur</h1>
      
      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="p-6 text-center">
            <h2 className="text-lg font-semibold mb-2">Compétitions</h2>
            <div className="flex justify-between my-4">
              <div>
                <p className="text-xs text-gray-500">À venir</p>
                <p className="text-2xl font-bold text-blue-600">{stats.upcomingCompetitions}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">En cours</p>
                <p className="text-2xl font-bold text-green-600">{stats.ongoingCompetitions}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Terminées</p>
                <p className="text-2xl font-bold text-gray-600">{stats.completedCompetitions}</p>
              </div>
            </div>
            <Button 
              onClick={() => router.push('/dashboard/organizer/competitions')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Gérer les compétitions
            </Button>
          </div>
        </Card>
        
        <Card>
          <div className="p-6 text-center">
            <h2 className="text-lg font-semibold mb-4">Validations en attente</h2>
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-xs text-gray-500">Demandes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Feuilles de match</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingMatchSheets}</p>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={() => router.push('/dashboard/organizer/requests')}
                className="w-full bg-yellow-600 hover:bg-yellow-700"
              >
                Traiter les demandes
              </Button>
              <Button 
                onClick={() => router.push('/dashboard/organizer/match-validation')}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Valider les feuilles
              </Button>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-6 text-center">
            <h2 className="text-lg font-semibold mb-4">Matchs à venir</h2>
            <p className="text-4xl font-bold text-purple-600 mb-4">{stats.upcomingMatches}</p>
            <Button 
              onClick={() => router.push('/dashboard/organizer/matches')}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Gérer les matchs
            </Button>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Compétitions récentes</h2>
            {recentCompetitions.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-4">Vous n'avez pas encore créé de compétition</p>
                <Button 
                  onClick={() => router.push('/dashboard/organizer/competitions/create')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Créer votre première compétition
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCompetitions.map(competition => (
                  <div key={competition.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <h3 className="font-medium">{competition.name}</h3>
                      <div className="flex space-x-2 text-sm">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          competition.status === 'UPCOMING' ? 'bg-yellow-100 text-yellow-800' :
                          competition.status === 'REGISTRATION' ? 'bg-blue-100 text-blue-800' :
                          competition.status === 'IN_PROGRESS' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {competition.status === 'UPCOMING' ? 'À venir' :
                           competition.status === 'REGISTRATION' ? 'Inscriptions' :
                           competition.status === 'IN_PROGRESS' ? 'En cours' :
                           competition.status === 'COMPLETED' ? 'Terminée' : competition.status}
                        </span>
                        <span className="text-gray-600">{competition.registeredTeams || 0} équipes</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => router.push(`/dashboard/organizer/competitions/${competition.id}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1"
                    >
                      Détails
                    </Button>
                  </div>
                ))}
                <div className="text-center pt-2">
                  <Button 
                    onClick={() => router.push('/dashboard/organizer/competitions')}
                    className="bg-gray-600 hover:bg-gray-700"
                  >
                    Voir toutes les compétitions
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
                onClick={() => router.push('/dashboard/organizer/competitions/create')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Créer une compétition
              </Button>
              <Button 
                onClick={() => router.push('/dashboard/organizer/matches/schedule')}
                className="bg-green-600 hover:bg-green-700"
              >
                Programmer un match
              </Button>
              <Button 
                onClick={() => router.push('/dashboard/organizer/match-validation')}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Valider feuilles de match
              </Button>
              <Button 
                onClick={() => router.push('/dashboard/organizer/requests')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Gérer les demandes
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 