import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';

// Composant qui affiche une carte pour une compétition
const CompetitionCard = ({ competition, isUserView = true }) => {

      // Formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
  };


  const formattedStartDate = formatDate(competition.startDate);
  const formattedEndDate = formatDate(competition.endDate);

  // Fonction pour obtenir la couleur du badge selon le statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'UPCOMING':
        return 'bg-blue-100 text-blue-800';
      case 'REGISTRATION':
          return 'bg-green-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Fonction pour traduire le statut en français
  const translateStatus = (status) => {
    switch (status) {
      case 'UPCOMING':
        return 'À venir';
      case 'REGISTRATION':
        return 'Inscription ouverte';
      case 'IN_PROGRESS':
        return 'En cours';
      case 'COMPLETED':
        return 'Terminée';
      case 'CANCELLED':
        return 'Annulée';
      default:
        return status;
    }
  };

  // Détermine le URL pour le lien "Voir plus"
  const detailUrl = isUserView 
    ? `/dashboard/competitions/${competition.id}` 
    : `/(public)/competitions/${competition.id}`;

  return (
<div 
  key={competition.id} 
  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
>
  <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white">
    <h3 className="font-bold text-xl">{competition.name}</h3>
    <p className="text-sm opacity-90">Organisé par {competition.organizerName}</p>
  </div>

  <div className="p-4 space-y-4">
    <div className="flex items-center justify-between">
      <span className="text-gray-600 text-sm">{competition.category}</span>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(competition.status)}`}>
        {translateStatus(competition.status)}
      </span>
    </div>

    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-500">Date de début:</span>
        <span className="font-medium">{formatDate(competition.startDate)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Date de fin:</span>
        <span className="font-medium">{formatDate(competition.endDate)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Équipes:</span>
        <span className="font-medium">{competition.registeredTeams}/{competition.maxTeams}</span>
      </div>
    </div>

    <div className="pt-4 border-t border-gray-100">
      <Link 
        href={`/competitions/${competition.id}`}
        className="block w-full text-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md font-medium hover:bg-blue-200 transition-colors"
      >
        Voir les détails
      </Link>
    </div>
  </div>
</div>

  );
};

export default CompetitionCard;