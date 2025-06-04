import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import  * as  Matchservice from '@/services/match-service';
import MatchSheetViewer from './MatchSheetViewer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useRoleAccess } from '@/hooks/useRoleAccess';

const MatchSheetTab = ({ matchId, match, isUserView = true }) => {
  const [matchSheets, setMatchSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeamSheet, setSelectedTeamSheet] = useState(null);
  
  // Vérifier les permissions de l'utilisateur
  const { hasAccess } = useRoleAccess();
  const isOrganizer = hasAccess(['ORGANIZER', 'ADMIN']);

  // Charger les feuilles de match
  const fetchMatchSheets = async () => {
   

    if (!matchId ) {
      setLoading(false);
      return;
    }
     console.log('Fetching match sheets...');
    setLoading(true);
    try {
      const sheetsResponse = await Matchservice.getMatchSheetByMatchId(matchId);
         console.log (sheetsResponse || 'Feuilles de match non trouvées');
         console.log('Feuilles de match:', match.matchSheetStatus);
      setMatchSheets(sheetsResponse || []);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les feuilles de match. Veuillez réessayer plus tard.');
      setMatchSheets([]);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour charger les données au montage
  useEffect(() => {
    fetchMatchSheets();
  }, [matchId]);

  // Sélectionner une feuille de match d'équipe pour l'affichage
  const handleSelectTeamSheet = (teamId) => {
    setSelectedTeamSheet(teamId);
  };

  // Afficher un message de chargement
  if (loading) {
    return <LoadingSpinner />;
  }

  // Afficher un message d'erreur
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md my-4">
        <p>{error}</p>
        <button 
          onClick={fetchMatchSheets} 
          className="mt-2 text-sm font-medium text-red-700 underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div>
      {match.matchSheetStatus === 'VALIDATED'  ? (
     
        matchSheets.length > -1? (
          <div className="space-y-6">
            {/* Sélecteur d'équipe si aucune équipe n'est sélectionnée */}
            {!selectedTeamSheet && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Feuilles de match disponibles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchSheets.map(sheet => (
                    <button
                      key={sheet.id}
                      onClick={() => handleSelectTeamSheet(sheet.teamId)}
                      className="bg-white p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-md transition-all text-left"
                    >
                      <h4 className="font-medium text-lg mb-2">{sheet.teamName}</h4>
                      <p className="text-gray-600 text-sm">
                        {sheet.teamRole === 'HOME' ? 'Équipe à domicile' : 'Équipe à l\'extérieur'}
                      </p>
                      <div className="mt-3 text-green-600 font-medium text-sm">
                        Voir la feuille de match
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Afficher la feuille de match sélectionnée */}
            {selectedTeamSheet && (
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <button
                    onClick={() => setSelectedTeamSheet(null)}
                    className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Retour à la liste des équipes
                  </button>
                </div>
                <MatchSheetViewer matchId={matchId} teamId={selectedTeamSheet} isUserView={isUserView} />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">Les feuilles de match sont validées mais n'ont pas pu être chargées. Veuillez réessayer plus tard.</p>
            <button 
              onClick={fetchMatchSheets} 
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Recharger
            </button>
          </div>
        )
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 text-yellow-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-1">Les feuilles de match sont en attente de validation par l'organisateur.</p>
          <p className="text-gray-500 text-sm mb-4">Elles seront disponibles une fois validées.</p>
          {isOrganizer && !isUserView && (
            <Link 
              href={`/dashboard/organizer/matches/${match.id}/validate`}
              className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Valider la feuille de match
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default MatchSheetTab;