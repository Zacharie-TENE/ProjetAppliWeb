import React, { useState, useRef } from 'react';
import   * as MediaService from '@/services/media-service';

const MediaUploader = ({ onUploadSuccess, onCancel }) => {
  const [mediaData, setMediaData] = useState({
    title: '',
    description: '',
    mediaType: 'IMAGE', // Par défaut, le type est une image
    teamId: '',
    competitionId: '',
    matchId: '',
    tags: [],
    isPublic: true
  });
  
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef(null);
  
  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMediaData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Gérer la sélection d'un fichier
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    // Créer une URL pour la prévisualisation du fichier
    const previewUrl = URL.createObjectURL(selectedFile);
    setFilePreview(previewUrl);
    
    // Déterminer automatiquement le type de média
    if (selectedFile.type.startsWith('image/')) {
      setMediaData(prev => ({ ...prev, mediaType: 'IMAGE' }));
    } else if (selectedFile.type.startsWith('video/')) {
      setMediaData(prev => ({ ...prev, mediaType: 'VIDEO' }));
    } else {
      setMediaData(prev => ({ ...prev, mediaType: 'DOCUMENT' }));
    }
  };
  
  // Ajouter un tag
  const handleAddTag = () => {
    if (tagInput.trim() && !mediaData.tags.includes(tagInput.trim())) {
      setMediaData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };
  
  // Supprimer un tag
  const handleRemoveTag = (index) => {
    setMediaData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };
  
  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Veuillez sélectionner un fichier.');
      return;
    }
    
    if (!mediaData.title.trim()) {
      setError('Le titre est obligatoire.');
      return;
    }
    
    try {
      setError(null);
      setUploading(true);
      
      // Utiliser le service media pour télécharger le fichier
      const result = await MediaService.uploadMedia(mediaData, file);
      
      // Nettoyer l'URL de prévisualisation
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
      
      // Informer le composant parent que le téléchargement a réussi
      if (onUploadSuccess) {
        onUploadSuccess(result);
      }
      
      // Réinitialiser le formulaire
      setMediaData({
        title: '',
        description: '',
        mediaType: 'IMAGE',
        teamId: '',
        competitionId: '',
        matchId: '',
        tags: [],
        isPublic: true
      });
      setFile(null);
      setFilePreview(null);
      
    } catch (err) {
      setError(err.message || 'Une erreur s\'est produite lors du téléchargement du média.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Télécharger un nouveau média</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Zone de dépôt de fichier */}
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6 text-center cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {filePreview ? (
            <div className="space-y-4">
              {mediaData.mediaType === 'IMAGE' && (
                <img 
                  src={filePreview} 
                  alt="Aperçu" 
                  className="max-h-48 mx-auto rounded-md"
                />
              )}
              
              {mediaData.mediaType === 'VIDEO' && (
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center max-w-lg mx-auto">
                  <video 
                    src={filePreview} 
                    className="max-h-48 max-w-full mx-auto rounded-md" 
                    controls
                  />
                </div>
              )}
              
              {mediaData.mediaType === 'DOCUMENT' && (
                <div className="flex flex-col items-center">
                  <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  <p className="text-gray-700 mt-2">{file?.name}</p>
                </div>
              )}
              
              <p className="text-sm text-indigo-600">Cliquez pour changer de fichier</p>
            </div>
          ) : (
            <>
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                Cliquez pour sélectionner un fichier ou glissez-déposez
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, GIF, PDF, DOCX, MP4 jusqu'à 10MB
              </p>
            </>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
        </div>
        
        {/* Informations sur le média */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Titre <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={mediaData.title}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Titre du média"
            />
          </div>
          
          <div>
            <label htmlFor="mediaType" className="block text-sm font-medium text-gray-700 mb-1">
              Type de média
            </label>
            <select
              id="mediaType"
              name="mediaType"
              value={mediaData.mediaType}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="IMAGE">Image</option>
              <option value="VIDEO">Vidéo</option>
              <option value="DOCUMENT">Document</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={mediaData.description}
              onChange={handleChange}
              rows="3"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Description du média"
            />
          </div>
          
          <div>
            <label htmlFor="teamId" className="block text-sm font-medium text-gray-700 mb-1">
              Équipe (optionnel)
            </label>
            <select
              id="teamId"
              name="teamId"
              value={mediaData.teamId}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Sélectionner une équipe</option>
              {/* Options d'équipes à ajouter ici */}
            </select>
          </div>
          
          <div>
            <label htmlFor="competitionId" className="block text-sm font-medium text-gray-700 mb-1">
              Compétition (optionnel)
            </label>
            <select
              id="competitionId"
              name="competitionId"
              value={mediaData.competitionId}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Sélectionner une compétition</option>
              {/* Options de compétitions à ajouter ici */}
            </select>
          </div>
          
          <div>
            <label htmlFor="matchId" className="block text-sm font-medium text-gray-700 mb-1">
              Match (optionnel)
            </label>
            <select
              id="matchId"
              name="matchId"
              value={mediaData.matchId}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Sélectionner un match</option>
              {/* Options de matchs à ajouter ici */}
            </select>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="tagInput" className="block text-sm font-medium text-gray-700">
                Tags (optionnel)
              </label>
            </div>
            <div className="flex">
              <input
                type="text"
                id="tagInput"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="w-full rounded-l-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ajouter un tag"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-indigo-600 text-white px-4 rounded-r-md hover:bg-indigo-700"
              >
                +
              </button>
            </div>
            {mediaData.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {mediaData.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="ml-1.5 inline-flex text-indigo-500 hover:text-indigo-600"
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="md:col-span-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={mediaData.isPublic}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                Rendre ce média public
              </label>
            </div>
          </div>
        </div>
        
        {/* Boutons d'action */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={uploading}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Téléchargement...
              </>
            ) : 'Télécharger'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MediaUploader;