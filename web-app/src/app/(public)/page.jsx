"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import * as Matchservice from '@/services/match-service';
import * as CompetitionService from '@/services/competition-service';

export default function HomePage() {
  // États pour stocker les données
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [featuredCompetitions, setFeaturedCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupérer les données au chargement de la page
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les matchs à venir (les 3 prochains)
        const matchResponse = await Matchservice.getAllMatches({ 
          status: 'SCHEDULED',
          // Trier par date pour avoir les prochains matchs
          limit: 3
        });
        
        // Récupérer les compétitions à la une (3 premières)
        const competitionResponse = await CompetitionService.getAllCompetitions({
          limit: 3
        });
        
        // Formater les données des matchs pour l'affichage
        const formattedMatches = (matchResponse || []).slice(0, 3).map(match => ({
          id: match.id,
          title: match.title || `${match.homeTeamName} vs. ${match.awayTeamName}`,
          date: new Date(match.scheduledDateTime).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
          competition: match.competitionName
        }));
        
        // Formater les données des compétitions pour l'affichage
        const formattedCompetitions = (competitionResponse || []).slice(0, 3).map(comp => ({
          id: comp.id,
          name: comp.name,
          teams: comp.teamsCount || 0,
          matches: comp.matchesCount || 0,
          status: comp.status
        }));
        
        setUpcomingMatches(formattedMatches);
        setFeaturedCompetitions(formattedCompetitions);
      } catch (error) {
  
       
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative">
        <div className="bg-gradient-to-r from-blue-900 to-green-800 h-[500px] rounded-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
          <div className="absolute inset-0 flex items-center z-20">
            <div className="container mx-auto px-6">
              <div className="max-w-2xl text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Gérez vos compétitions de football comme un pro</h1>
                <p className="text-lg md:text-xl mb-8">
                  Une plateforme complète pour organiser, suivre et analyser vos compétitions, équipes, joueurs et matchs.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link 
                    href="/register" 
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-center"
                  >
                    Inscrivez-vous gratuitement
                  </Link>
                  <Link 
                    href="/competitions" 
                    className="px-6 py-3 bg-white text-blue-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-center"
                  >
                    Voir les compétitions
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 w-1/2 h-full hidden md:block">
            <Image 
              src="/football-hero.jpg" 
              alt="Football management" 
              width={800} 
              height={500}
              className="object-cover h-full w-full"
              // onError={(e) => {
              //   e.target.onerror = null;
              //   e.target.src = '/globe.svg'; // Fallback image if the primary one fails to load
              // }}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Tout ce dont vous avez besoin pour gérer vos équipes et compétitions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Organisez des compétitions</h3>
            <p className="text-gray-600">
              Créez et gérez vos compétitions de football avec un suivi en temps réel des résultats, des classements et des statistiques.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Gérez vos équipes</h3>
            <p className="text-gray-600">
              Constituez vos équipes, suivez les performances individuelles et collectives, et optimisez vos stratégies de jeu.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Planifiez vos matchs</h3>
            <p className="text-gray-600">
              Programmez vos matchs, enregistrez les résultats, et analysez les performances à l'aide de feuilles de match détaillées.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Matches Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Prochains matchs</h2>
            <Link href="/matches" className="text-blue-600 hover:text-blue-800 font-medium">
              Voir tous les matchs &rarr;
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingMatches.map(match => (
              <div key={match.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-blue-700 to-green-700 text-white p-4">
                  <h3 className="font-bold text-lg">{match.title}</h3>
                  <p className="text-sm opacity-90">{match.competition}</p>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-600">{match.date}</p>
                    </div>
                    <Link 
                      href={`/matches/${match.id}`}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors"
                    >
                      Détails
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Competitions */}
      <section className="container mx-auto px-6 mb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Compétitions à la une</h2>
          <Link href="/competitions" className="text-blue-600 hover:text-blue-800 font-medium">
            Toutes les compétitions &rarr;
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCompetitions.map(competition => (
            <div key={competition.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">{competition.name}</h3>
                <div className="flex space-x-4 mb-4">
                  <div className="text-gray-600">
                    <span className="font-semibold">{competition.teams}</span> équipes
                  </div>
                  <div className="text-gray-600">
                    <span className="font-semibold">{competition.matches}</span> matchs
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    competition.status === 'IN_PROGRESS' 
                      ? 'bg-green-100 text-green-800' 
                      : competition.status === 'UPCOMING' 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {competition.status === 'IN_PROGRESS' 
                      ? 'En cours' 
                      : competition.status === 'UPCOMING' 
                        ? 'À venir'
                        : 'Terminé'}
                  </span>
                  
                  <Link 
                    href={`/competitions/${competition.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Voir les détails
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-900 to-green-800 py-16 rounded-xl">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Prêt à rejoindre notre communauté ?</h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
            Inscrivez-vous dès aujourd'hui et commencez à gérer vos compétitions de football comme un professionnel.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/register" 
              className="px-8 py-4 bg-white text-blue-900 font-bold rounded-lg hover:bg-gray-100 transition-colors text-center text-lg"
            >
              S'inscrire gratuitement
            </Link>
            <Link 
              href="/login" 
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors text-center text-lg"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}