'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import TeamDetails from '@/components/team/TeamDetails';

export default function TeamDetailsPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('info');

  // Fonction pour gérer le changement d'onglet
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
 <>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Détails de l'équipe</h1>
        <TeamDetails 
          teamId={id}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onViewAllPlayers={() => handleTabChange('players')} 
          onViewAllMatches={() => handleTabChange('matches')} 
        />

        </>
    
  );
}