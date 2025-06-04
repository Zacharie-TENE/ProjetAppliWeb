'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { createTeam } from '@/services/team-service';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function CreateTeamPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    category: 'SENIOR'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'COACH') {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const createTeamDTO = { ...formData };
      await createTeam(user.id, createTeamDTO);
      router.push('/dashboard/coach/teams');
    } catch (err) {
      console.error('Erreur lors de la création de l\'équipe:', err);
      setError('Impossible de créer l\'équipe. Veuillez vérifier les informations et réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button 
          onClick={() => router.push('/dashboard/coach/teams')}
          className="mr-4 bg-gray-600 hover:bg-gray-700"
        >
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Créer une nouvelle équipe</h1>
      </div>

      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <Input
              label="Nom de l'équipe"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Entrez le nom de l'équipe"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description de l'équipe (facultatif)"
            ></textarea>
          </div>

          <div className="mb-4">
            <Input
              label="URL du logo"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              placeholder="URL de l'image du logo (facultatif)"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="SENIOR">Senior</option>
              <option value="JUNIOR">Junior</option>
              <option value="CADET">Cadet</option>
              <option value="MINIME">Minime</option>
              <option value="BENJAMIN">Benjamin</option>
              <option value="POUSSIN">Poussin</option>
            </select>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => router.push('/dashboard/coach/teams')}
              className="bg-gray-600 hover:bg-gray-700 mr-4"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Créer l\'équipe'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
