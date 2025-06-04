'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import MatchDetails from '@/components/match/MatchDetails';

export default function MatchDetailPage() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="text-sm breadcrumbs">
        <ul className="flex items-center space-x-2 text-gray-500">
          <li>
            <Link href="/matches" className="hover:text-green-600">
              Matchs
            </Link>
          </li>
          <li className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mx-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <span className="text-gray-800">Détails du match</span>
          </li>
        </ul>
      </div>

      {/* Composant MatchDetails qui gère toute la logique et l'affichage */}
      <MatchDetails matchId={id} isUserView={true} />
    </div>
  );
}