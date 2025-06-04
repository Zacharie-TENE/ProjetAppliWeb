'use client';

import { useState, useEffect } from 'react';
import { useRouter,useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getMatchSheet, updateMatchSheet } from '@/services/match-service';
import { getPlayersByTeam } from '@/services/player-service';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Table from '@/components/ui/Table';
import Input from '@/components/ui/Input';

export default function MatchSheetDetailPage() {
  const { matchSheetId } = useParams();
  const [matchSheet, setMatchSheet] = useState(null);
  const [playerSelections, setPlayerSelections] = useState([]);
  const [strategy, setStrategy] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'COACH') {
      router.push('/dashboard');
      return;
    }

    fetchMatchSheetData();
  }, [user, router, matchSheetId]);

  const fetchMatchSheetData = async () => {
    try {
      setLoading(true);
      const data = await getMatchSheet(user.id, matchSheetId);
      setMatchSheet(data);
      
      // Check if we have player selections from the server
      if (data.playerParticipations && data.playerParticipations.length > 0) {
        setPlayerSelections(data.playerParticipations);
      } else if (data.teamId) {
        // If no player selections and we have a team ID, fetch players from the team
        try {
          const teamPlayers = await getPlayersByTeam(data.teamId, user.id);
          // Create player participation objects for each team player
          const playerParticipations = teamPlayers.map(player => ({
            playerId: player.id,
            playerName: `${player.firstName} ${player.lastName}`,
            matchSheetId: matchSheetId,
            status: '', // Empty initially, coach will select STARTER or SUBSTITUTE
            position: '', // Empty initially, coach will select position
            shirtNumber: null, // Empty initially
            // Adding additional fields that might be used after the match
            goalsScored: 0,
            yellowCards: 0,
            redCards: 0,
            minutesPlayed: 0,
            substitutionInTime: null,
            substitutionOutTime: null
          }));
          
          setPlayerSelections(playerParticipations);
        } catch (playerErr) {
          console.error('Erreur lors de la récupération des joueurs de l\'équipe:', playerErr);
        }
      }
      
      setStrategy(data.strategy || '');
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération de la feuille de match:', err);
      setError('Impossible de récupérer les données de la feuille de match. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleStrategyChange = (e) => {
    setStrategy(e.target.value);
  };

  const handlePlayerStatusChange = (playerId, field, value) => {
    setPlayerSelections(prevSelections => {
      return prevSelections.map(player => {
        if (player.playerId === playerId) {
          // If field is 'status', map it to 'playerStatus' for backend compatibility
          if (field === 'status') {
            return { ...player, playerStatus: value, [field]: value };
          } else {
            return { ...player, [field]: value };
          }
        }
        return player;
      });
    });
  };

  // Vérifier si un numéro de maillot est déjà utilisé par un autre joueur
  const checkDuplicateShirtNumbers = (selections) => {
    // Récupérer tous les numéros de maillot renseignés
    const shirtNumbers = selections
      .filter(player => player.shirtNumber)
      .map(player => player.shirtNumber);
    
    // Vérifier si des doublons existent
    const duplicates = shirtNumbers.filter((number, index) => shirtNumbers.indexOf(number) !== index);
    
    if (duplicates.length > 0) {
      return `Numéro(s) de maillot en double: ${[...new Set(duplicates)].join(', ')}. Chaque joueur doit avoir un numéro unique.`;
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Vérifier les doublons de numéros de maillot
    const duplicateError = checkDuplicateShirtNumbers(playerSelections);
    if (duplicateError) {
      setError(duplicateError);
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Préparer les données pour la mise à jour
      const updateData = {
        ...matchSheet,
        playerParticipations: playerSelections, // Use playerParticipations instead of playerSelections for the backend
        strategy
      };
      
      await updateMatchSheet(user.id, matchSheetId, updateData);
      setSuccess('Feuille de match mise à jour avec succès');
      
      // Rafraîchir les données après un petit délai pour permettre à la mise à jour d'être effectuée
      setTimeout(() => {
        fetchMatchSheetData();
      }, 500);
    } catch (err) {
      //console.error('Erreur lors de la mise à jour de la feuille de match:', err);
      setError('Impossible de mettre à jour la feuille de match. Veuillez réessayer plus tard.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitFinal = async () => {
    // Vérifier si tous les joueurs ont un statut et, si titulaires, ont un numéro de maillot
    const hasInvalidPlayers = playerSelections.some(player => {
      const playerStatus = player.playerStatus || player.status;
      return !playerStatus || (playerStatus === 'STARTER' && !player.shirtNumber);
    });

    if (hasInvalidPlayers) {
      setError('Tous les joueurs doivent avoir un statut. Les titulaires doivent avoir un numéro de maillot.');
      return;
    }

    // Vérifier les doublons de numéros de maillot
    const duplicateError = checkDuplicateShirtNumbers(playerSelections);
    if (duplicateError) {
      setError(duplicateError);
      return;
    }

    if (!strategy.trim()) {
      setError('Veuillez spécifier une stratégie pour le match.');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Préparer les données pour la soumission finale
      const updateData = {
        ...matchSheet,
        playerParticipations: playerSelections, // Use playerParticipations instead of playerSelections for the backend
        strategy,
        status: 'SUBMITTED'
      };
      
      await updateMatchSheet(user.id, matchSheetId, updateData);
      setSuccess('Feuille de match soumise avec succès');
      
      // Rafraîchir les données après un petit délai pour permettre à la mise à jour d'être effectuée
      setTimeout(() => {
        fetchMatchSheetData();
      }, 500);
    } catch (err) {
      console.error('Erreur lors de la soumission de la feuille de match:', err);
      setError('Impossible de soumettre la feuille de match. Veuillez réessayer plus tard.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'ONGOING': 'A completer',
      'UNVALIDATED': 'Non validée',
      'SUBMITTED': 'Soumise',
      'VALIDATED': 'Approuvée',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ONGOING': return 'bg-yellow-100 text-yellow-800';
      case 'UNVALIDATED': return 'bg-red-100 text-red-800';
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800';
      case 'VALIDATED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isEditable = matchSheet?.status === 'DRAFT' || matchSheet?.status === 'UNVALIDATED';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!matchSheet) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button 
            onClick={() => router.push('/dashboard/coach/matches')}
            className="mr-4 bg-gray-600 hover:bg-gray-700"
          >
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Feuille de match</h1>
        </div>
        
        <Card>
          <div className="p-6 text-center">
            <p className="text-gray-600">La feuille de match n'a pas été trouvée ou vous n'avez pas les droits pour y accéder.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button 
          onClick={() => router.push('/dashboard/coach/matches')}
          className="mr-4 bg-gray-600 hover:bg-gray-700"
        >
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Feuille de match</h1>
      </div>

      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      {success && (
        <Alert 
          type="success" 
          message={success} 
          onClose={() => setSuccess(null)}
          className="mb-6"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">{matchSheet.matchTitle}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium mb-2">Informations du match</h3>
                <dl className="space-y-2">
                  <div className="flex">
                    <dt className="w-1/3 text-gray-500">Compétition:</dt>
                    <dd className="w-2/3 font-medium">{matchSheet.competitionName}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-1/3 text-gray-500">Date:</dt>
                    <dd className="w-2/3 font-medium">
                      {matchSheet.matchDateTime ? new Date(matchSheet.matchDateTime).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Non spécifiée'}
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="w-1/3 text-gray-500">Lieu:</dt>
                    <dd className="w-2/3 font-medium">{matchSheet.venue || 'Non spécifié'}</dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-2">Équipe</h3>
                <dl className="space-y-2">
                  <div className="flex">
                    <dt className="w-1/3 text-gray-500">Nom:</dt>
                    <dd className="w-2/3 font-medium">{matchSheet.teamName}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-1/3 text-gray-500">Rôle:</dt>
                    <dd className="w-2/3 font-medium">{matchSheet.teamRole === 'HOME' ? 'Domicile' : 'Extérieur'}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-1/3 text-gray-500">Statut:</dt>
                    <dd className="w-2/3">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(matchSheet.status)}`}>
                        {getStatusLabel(matchSheet.status)}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-md font-medium mb-4">Échéance</h3>
            
            {matchSheet.submissionDeadline ? (
              <div className="mb-4">
                <p className="font-medium">
                  À soumettre avant le: {new Date(matchSheet.submissionDeadline).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                
                {new Date(matchSheet.submissionDeadline) < new Date() ? (
                  <p className="text-red-600 text-sm mt-1">La date limite est dépassée.</p>
                ) : (
                  <p className="text-green-600 text-sm mt-1">
                    Il vous reste {Math.ceil((new Date(matchSheet.submissionDeadline) - new Date()) / (1000 * 60 * 60 * 24))} jour(s).
                  </p>
                )}
              </div>
            ) : (
              <p className="mb-4">Aucune échéance spécifiée.</p>
            )}
            
            {isEditable ? (
              <div className="space-y-3">
                <Button
                  onClick={handleSubmitFinal}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={submitting}
                >
                  {submitting ? <LoadingSpinner size="sm" /> : 'Soumettre la feuille de match'}
                </Button>
                <p className="text-xs text-gray-500">
                  Une fois soumise, la feuille de match sera examinée par les organisateurs et ne pourra plus être modifiée.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-blue-600">
                  Cette feuille de match a déjà été soumise et ne peut plus être modifiée.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Stratégie d'équipe</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formation et stratégie
              </label>
              <textarea
                value={strategy}
                onChange={handleStrategyChange}
                rows="4"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isEditable ? 'bg-gray-100' : ''}`}
                placeholder="Ex: 4-4-2 avec pressing haut, jeu en contre-attaque..."
                disabled={!isEditable}
              ></textarea>
            </div>
            
            {isEditable && (
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={submitting}
                >
                  {submitting ? <LoadingSpinner size="sm" /> : 'Enregistrer'}
                </Button>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Sélection des joueurs</h2>
            
            {playerSelections.length === 0 ? (
              <p className="text-center py-8 text-gray-600">Aucun joueur disponible pour cette équipe.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joueur
                      </th>
               
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Position
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        N° Maillot
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {playerSelections.map((player) => (
                      <tr key={player.playerId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{player.playerName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={player.status || player.playerStatus || ''}
                            onChange={(e) => handlePlayerStatusChange(player.playerId, 'status', e.target.value)}
                            className={`w-full px-2 py-1 border border-gray-300 rounded-md text-sm ${!isEditable ? 'bg-gray-100' : ''}`}
                            disabled={!isEditable}
                          >
                            <option value="">Sélectionner...</option>
                            <option value="STARTER">Titulaire</option>
                            <option value="SUBSTITUTE">Remplaçant</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={player.position || ''}
                            onChange={(e) => handlePlayerStatusChange(player.playerId, 'position', e.target.value)}
                            className={`w-full px-2 py-1 border border-gray-300 rounded-md text-sm ${!isEditable ? 'bg-gray-100' : ''}`}
                            disabled={!isEditable}
                          >
                            <option value="">Sélectionner...</option>
                            <option value="GOALKEEPER">Gardien</option>
                            <option value="DEFENDER">Défenseur</option>
                            <option value="MIDFIELDER">Milieu</option>
                            <option value="FORWARD">Attaquant</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative">
                            <input
                              type="number"
                              min="1"
                              max="99"
                              value={player.shirtNumber || ''}
                              onChange={(e) => handlePlayerStatusChange(player.playerId, 'shirtNumber', e.target.value ? parseInt(e.target.value) : '')}
                              className={`w-20 px-2 py-1 border ${
                                // Vérifier si ce numéro est un doublon
                                player.shirtNumber && playerSelections.filter(p => p.shirtNumber === player.shirtNumber).length > 1 
                                  ? 'border-red-500 bg-red-50' 
                                  : 'border-gray-300'
                              } rounded-md text-sm ${!isEditable ? 'bg-gray-100' : ''}`}
                              disabled={!isEditable}
                            />
                            {player.shirtNumber && playerSelections.filter(p => p.shirtNumber === player.shirtNumber).length > 1 && (
                              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs" title="Numéro en double">!</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {isEditable && (
              <div className="flex justify-end mt-6">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={submitting}
                >
                  {submitting ? <LoadingSpinner size="sm" /> : 'Enregistrer'}
                </Button>
              </div>
            )}
          </div>
        </Card>
      </form>
    </div>
  );
}