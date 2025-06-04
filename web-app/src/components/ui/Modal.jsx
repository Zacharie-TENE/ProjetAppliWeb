'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * Composant Modal hautement personnalisable
 * 
 * @param {boolean} isOpen - État d'ouverture de la modal
 * @param {function} onClose - Fonction appelée à la fermeture
 * @param {string} size - 'sm', 'md', 'lg', 'xl', 'full'
 * @param {boolean} closeOnEsc - Fermer la modal avec la touche Echap
 * @param {boolean} closeOnOutsideClick - Fermer la modal en cliquant à l'extérieur
 * @param {string} className - Classes CSS supplémentaires
 */
export default function Modal({
  isOpen,
  onClose,
  title = '',
  size = 'md',
  closeOnEsc = true,
  closeOnOutsideClick = true,
  disableScroll = true,
  centered = false,
  showCloseButton = true,
  children,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  footer = null,
  ...props
}) {
  const modalRef = useRef(null);
  
  // Gestionnaire d'échap
  useEffect(() => {
    const handleEsc = (e) => {
      if (isOpen && closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, closeOnEsc, onClose]);
  
  // Gestion du scroll du body
  useEffect(() => {
    if (disableScroll) {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, disableScroll]);
  
  // Clique à l'extérieur
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target) && closeOnOutsideClick) {
      onClose();
    }
  };
  
  // Tailles de la modal
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full m-4',
  };
  
  if (!isOpen) return null;
  
  // Utilisation du portail pour rendre la modal au niveau du body
  return createPortal(
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex"
      onClick={handleOutsideClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div className={`relative ${centered ? 'm-auto' : 'mt-16 mb-8 mx-auto'} w-full ${sizeClasses[size] || sizeClasses.md} ${className}`}>
        <div 
          ref={modalRef} 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
          {...props}
        >
          {/* En-tête de la modal */}
          {(title || showCloseButton) && (
            <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center ${headerClassName}`}>
              {title && (
                <h3 id="modal-title" className="text-lg font-medium text-gray-900 dark:text-white">
                  {title}
                </h3>
              )}
              
              {showCloseButton && (
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
                  onClick={onClose}
                  aria-label="Fermer"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
          
          {/* Corps de la modal */}
          <div className={`px-6 py-4 ${bodyClassName}`}>
            {children}
          </div>
          
          {/* Pied de page de la modal si présent */}
          {footer && (
            <div className={`px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 ${footerClassName}`}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}