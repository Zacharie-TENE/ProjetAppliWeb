'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import CompetitionDetails from '@/components/competition/CompetitionDetails';


export default function CompetitionDetailsPage() {
  const { id } = useParams();

  return (
    <div className="space-y-8">
      <CompetitionDetails competitionId={id} isUserView={true} />
    </div>
  );
}