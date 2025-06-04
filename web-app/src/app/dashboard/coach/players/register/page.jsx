'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { registerPlayer } from '@/services/player-service';
import { getAllCoachTeams } from '@/services/team-service';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function RegisterPlayerPage() {
  const searchParams = useSearchParams();
  const initialTeamId = searchParams.get('teamId') || '';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userName: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    role: 'PLAYER',
    status: 'STARTER',
    profilePicture: '',
    licenseNumber: '',
    dateOfBirth: '',
    position: 'MIDFIELDER',
    teamId: initialTeamId
  });
  
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
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
      setInitialLoading(true);
      const teamsData = await getAllCoachTeams(user.id);
      setTeams(teamsData || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des équipes:', err);
      setError('Impossible de récupérer vos équipes. Veuillez réessayer plus tard.');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.teamId) {
      setError('Veuillez sélectionner une équipe pour le joueur.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const playerDTO = { ...formData };
      await registerPlayer(user.id, formData.teamId, playerDTO);
      router.push(`/dashboard/coach/teams/${formData.teamId}`);
    } catch (err) {
      //console.error('Erreur lors de l\'enregistrement du joueur:', err);
      setError('Impossible d\'enregistrer le joueur. Veuillez vérifier les informations et réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
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
          onClick={() => router.back()}
          className="mr-4 bg-gray-600 hover:bg-gray-700"
        >
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Enregistrer un nouveau joueur</h1>
      </div>

      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      <Card className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Équipe</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Équipe du joueur *
              </label>
              <select
                name="teamId"
                value={formData.teamId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionnez une équipe</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Informations personnelles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Prénom *"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Input
                label="Nom *"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <Input
                label="Email *"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                label="Mot de passe *"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Input
                label="Nom d'utilisateur *"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                required
              />
              <Input
                label="Téléphone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <Input
                label="Adresse"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
              <Input
                label="URL Photo de profil"
                name="profilePicture"
                value={formData.profilePicture}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Informations sportives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Numéro de licence *"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position *
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="GOALKEEPER">Gardien de but</option>
                  <option value="DEFENDER">Défenseur</option>
                  <option value="MIDFIELDER">Milieu de terrain</option>
                  <option value="FORWARD">Attaquant</option>
                </select>
              </div>
              <Input
                label="Date de naissance *"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-600 hover:bg-gray-700 mr-4"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Enregistrer le joueur'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 