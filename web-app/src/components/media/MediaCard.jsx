import React from 'react';
import Link from 'next/link';
import { mediaType } from '@/lib/utils/enums';

const MediaCard = ({ media }) => {
  // Obtenir le type de média traduit
  const getMediaTypeLabel = (type) => {
    const mediaTypes = {
      [mediaType.IMAGE]: 'Image',
      [mediaType.VIDEO]: 'Vidéo',
      [mediaType.DOCUMENT]: 'Document'
    };
    return mediaTypes[type] || type;
  };
  
  // Obtenir la couleur de badge pour le type de média
  const getMediaTypeColor = (type) => {
    const mediaTypeColors = {
      [mediaType.IMAGE]: 'bg-blue-100 text-blue-800',
      [mediaType.VIDEO]: 'bg-purple-100 text-purple-800',
      [mediaType.DOCUMENT]: 'bg-gray-100 text-gray-800'
    };
    return mediaTypeColors[type] || 'bg-gray-100 text-gray-800';
  };
  
  // Générer la vignette appropriée selon le type de média
  const renderMediaThumbnail = (media) => {
    if (media.mediaType === mediaType.IMAGE) {
      return (
        <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100">
          <img 
            src={media.url} 
            alt={media.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/globe.svg'; // Image de fallback
            }}
          />
        </div>
      );
    }
    
    if (media.mediaType ===  mediaType.VIDEO) {
      return (
        <div className="relative aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
          <div className="absolute inset-0 opacity-60 bg-gradient-to-b from-transparent to-black rounded-lg"></div>
          <svg className="w-16 h-16 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }
    
    if (media.mediaType ===  mediaType.DOCUMENT) {
      return (
        <div className="relative aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
          <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }
    
    return (
      <div className="relative aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
        <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {renderMediaThumbnail(media)}
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800 text-lg truncate">{media.title}</h3>
          <span className={`px-2 py-1 text-xs rounded-full ${getMediaTypeColor(media.mediaType)}`}>
            {getMediaTypeLabel(media.mediaType)}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{media.description}</p>
        
        <div className="space-y-2 text-sm text-gray-500">
          {media.uploaderName && (
            <div className="flex items-start">
              <span className="w-20 flex-shrink-0">Publié par:</span>
              <span className="ml-2">{media.uploaderName}</span>
            </div>
          )}
          
          {media.teamName && (
            <div className="flex items-start">
              <span className="w-20 flex-shrink-0">Équipe:</span>
              <Link href={`/teams/${media.teamId}`} className="ml-2 text-indigo-600 hover:underline">
                {media.teamName}
              </Link>
            </div>
          )}
          
          {media.competitionName && (
            <div className="flex items-start">
              <span className="w-20 flex-shrink-0">Compétition:</span>
              <Link href={`/competitions/${media.competitionId}`} className="ml-2 text-indigo-600 hover:underline">
                {media.competitionName}
              </Link>
            </div>
          )}
          
          {media.matchTitle && (
            <div className="flex items-start">
              <span className="w-20 flex-shrink-0">Match:</span>
              <Link href={`/matches/${media.matchId}`} className="ml-2 text-indigo-600 hover:underline">
                {media.matchTitle}
              </Link>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {new Date(media.uploadedAt).toLocaleDateString('fr-FR')}
          </span>
          
          <a 
            href={media.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Voir
          </a>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;