'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import * as Matchservice from '@/services/match-service';
import * as CompetitionService from '@/services/competition-service';
import * as TeamService from '@/services/team-service';
import * as PlayerService from '@/services/player-service';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Composant CardInfo simple
const CardInfo = ({ title, count, icon, href }) => (
  <Link href={href} className="block">
    <div className="bg-white rounded-lg shadow-sm border p-5 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
          <p className="text-2xl font-bold mt-1">{count}</p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  </Link>
);

// Composant MatchItem simplifié
const MatchItem = ({ match }) => (
  <Link href={`/dashboard/matches/${match.id}`}>
    <div className="bg-white rounded-lg border p-4 hover:shadow-sm">
      <div className="flex justify-between">
        <div>
          <p className="font-medium">{match.homeTeamName} vs {match.awayTeamName}</p>
          <p className="text-sm text-gray-500">{match.competitionName}</p>
        </div>
        <div className="text-sm">
          {new Date(match.scheduledDateTime).toLocaleDateString()}
        </div>
      </div>
    </div>
  </Link>
);

export default function DashboardPage() {
  const { user } = useAuth();
  const { hasAccess } = useRoleAccess();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    competitions: 0,
    teams: 0, 
    players: 0,
    matches: 0
  });
  const [recentMatches, setRecentMatches] = useState([]);

  // Charger les données de base
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Récupérer les stats de base
        const competitionsResponse = await CompetitionService.getAllCompetitions();
        const teamsResponse = await TeamService.getAllTeams();
        const playersResponse = await PlayerService.getAllPlayers();
        const matchesResponse = await Matchservice.getAllMatches();
        
        // Récupérer quelques matchs récents
        const upcomingMatches = await Matchservice.getAllMatches({ 
          status: 'SCHEDULED',
          limit: 5
        });

        setStats({
          competitions: competitionsResponse.total || 0,
          teams: teamsResponse.total || 0,
          players: playersResponse.total || 0,
          matches: matchesResponse.total || 0
        });
        
        setRecentMatches(upcomingMatches.data || []);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des données", err);
        setError("Impossible de charger les données. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
      
      {/* Message de bienvenue simple */}
      {user && (
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <h2 className="text-lg font-medium">
            Bienvenue, {user.firstName || user.userName}
          </h2>
        </div>
      )}

      {/* Cartes d'information principales
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <CardInfo 
          title="Compétitions" 
          count={stats.competitions} 
          icon="🏆" 
          href="/competitions" 
        />
        <CardInfo 
          title="Équipes" 
          count={stats.teams} 
          icon="👥" 
          href="/teams" 
        />
        <CardInfo 
          title="Joueurs" 
          count={stats.players} 
          icon="👤" 
          href="/players" 
        />
        <CardInfo 
          title="Matchs" 
          count={stats.matches} 
          icon="⚽" 
          href="/matches" 
        />
      </div> */}



      {/* Actions rapides simplifiées */}
      {hasAccess(['COACH', 'ORGANIZER', 'ADMIN']) && (
     
        <div className="bg-white rounded-lg shadow-sm border p-4">
        
          <h2 className="text-lg font-medium mb-4">Actions rapides</h2>
          <div className="flex flex-wrap gap-3">
            {hasAccess(['COACH']) && (
              <Link href="/dashboard/coach/teams" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Gérer mes équipes
              </Link>
            )}
            {hasAccess(['ORGANIZER']) && (
              <Link href="/dashboard/organizer/competitions/create" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                Créer une compétition
              </Link>
            )}
            {hasAccess(['ADMIN']) && (
              <Link href="/dashboard/admin/users" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
                Gérer les utilisateurs
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}