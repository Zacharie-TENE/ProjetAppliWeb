'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PlayerDetails from '@/components/player/PlayerDetails';


export default function PlayerDetailsPage() {
  const { id } = useParams();


  return (
    <div className="space-y-8">
      {/* En-tête et détails du joueur */}
      <PlayerDetails playerId={id} isUserView={true} />
    
    </div>
  );
}