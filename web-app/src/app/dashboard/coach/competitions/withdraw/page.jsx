'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { requestTeamWithdrawal } from '@/services/competition-service';
import { getCompetitionById } from '@/services/competition-service';
import { getTeamById } from '@/services/team-service';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function WithdrawCompetitionPage() {
  const searchParams = useSearchParams();
  const competitionId = searchParams.get('competitionId');
  const teamId = searchParams.get('teamId');
  
  const [competition, setCompetition] = useState(null);
  const [team, setTeam] = useState(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'COACH') {
      router.push('/dashboard');
      return;
    }

    if (!competitionId || !teamId) {
      setError('Information manquante. Veuillez spécifier une compétition et une équipe.');
      setLoading(false);
      return;
    }

    fetchData();
  }, [user, router, competitionId, teamId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les détails de la compétition
      const competitionData = await getCompetitionById(competitionId);
      setCompetition(competitionData);
      
      // Récupérer les détails de l'équipe
      const teamData = await getTeamById(teamId);
      setTeam(teamData);
      
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des données:', err);
      setError('Impossible de récupérer les données. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      setError('Veuillez fournir une raison pour cette demande de retrait.');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      await requestTeamWithdrawal(user.id, teamId, competitionId, reason);
      
      // Rediriger vers la page des compétitions avec un message de succès
      router.push(`/dashboard/coach/competitions?success=withdrawal&teamId=${teamId}`);
    } catch (err) {
      console.error('Erreur lors de la demande de retrait:', err);
      setError('Impossible de soumettre la demande de retrait. Veuillez réessayer plus tard.');
    } finally {
      setSubmitting(false);
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
      <div className="flex items-center mb-8">
        <Button 
          onClick={() => router.push('/dashboard/coach/competitions')}
          className="mr-4 bg-gray-600 hover:bg-gray-700"
        >
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Retrait d'une compétition</h1>
      </div>

      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      {!competition || !team ? (
        <Card>
          <div className="p-6 text-center">
            <p className="text-gray-600">Informations non disponibles. Veuillez retourner à la liste des compétitions.</p>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Informations sur la compétition</h2>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nom</dt>
                    <dd className="text-base text-gray-900">{competition.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Catégorie</dt>
                    <dd className="text-base text-gray-900">{competition.category}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                    <dd className="text-base text-gray-900">{competition.type}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Statut</dt>
                    <dd className="text-base text-gray-900">{competition.status}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Période</dt>
                    <dd className="text-base text-gray-900">
                      {competition.startDate && competition.endDate ? (
                        `${new Date(competition.startDate).toLocaleDateString('fr-FR')} - ${new Date(competition.endDate).toLocaleDateString('fr-FR')}`
                      ) : 'Non spécifiée'}
                    </dd>
                  </div>
                </dl>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Informations sur l'équipe</h2>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nom</dt>
                    <dd className="text-base text-gray-900">{team.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Catégorie</dt>
                    <dd className="text-base text-gray-900">{team.category}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nombre de joueurs</dt>
                    <dd className="text-base text-gray-900">{team.playerCount || 0}</dd>
                  </div>
                </dl>
              </div>
            </Card>
          </div>

          <Card>
            <form onSubmit={handleSubmit} className="p-6">
              <h2 className="text-lg font-semibold mb-4">Formulaire de retrait</h2>
              
              <div className="mb-6 p-4 bg-red-50 rounded-md">
                <h3 className="text-sm font-medium text-red-800 mb-2">Attention</h3>
                <p className="text-sm text-red-700">
                  Le retrait de votre équipe de cette compétition peut entraîner des conséquences sur le calendrier des matchs 
                  et peut être soumis à des pénalités selon les règlements de la compétition.
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Raison du retrait *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows="4"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Veuillez expliquer en détail la raison pour laquelle vous souhaitez retirer votre équipe de cette compétition..."
                ></textarea>
              </div>
              
              <div className="mb-4 p-4 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  Votre demande de retrait sera envoyée aux organisateurs de la compétition pour validation. 
                  Vous recevrez une notification lorsque votre demande aura été traitée.
                </p>
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => router.push('/dashboard/coach/competitions')}
                  className="bg-gray-600 hover:bg-gray-700 mr-4"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700"
                  disabled={submitting}
                >
                  {submitting ? <LoadingSpinner size="sm" /> : 'Confirmer le retrait'}
                </Button>
              </div>
            </form>
          </Card>
        </>
      )}
    </div>
  );
} 