'use client';

import React from 'react';
import CompetitionList from '@/components/competition/CompetitionList';

export default function CompetitionsPage() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Compétitions</h1>
        
        <CompetitionList isUserView={true} />
      </div>
    </div>
  );
}