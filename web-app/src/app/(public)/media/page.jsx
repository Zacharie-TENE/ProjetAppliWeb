'use client';

import React from 'react';
import MediaList from '@/components/media/MediaList';

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-800 to-blue-900 p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-white mb-4">Médiathèque</h1>
        <p className="text-indigo-100 text-lg">
          Découvrez les photos, vidéos et documents des équipes et compétitions.
        </p>
      </div>

      {/* Liste des médias avec filtres intégrés */}
      <MediaList />
    </div>
  );
}