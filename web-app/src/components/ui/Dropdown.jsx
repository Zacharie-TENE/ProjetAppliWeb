'use client';

import React, { useState, useRef, useEffect } from 'react';

/**
 * Composant Dropdown hautement personnalisable
 * 
 * @param {ReactNode} trigger - Élément déclencheur du dropdown
 * @param {Array} items - Éléments du menu déroulant
 * @param {string} placement - Positionnement du menu ('bottom-start', 'bottom-end', 'top-start', 'top-end')
 * @param {boolean} withDivider - Ajouter des séparateurs entre les éléments
 * @param {string} className - Classes CSS supplémentaires
 */
export default function Dropdown({
  trigger,
  items = [],
  placement = 'bottom-start',
  withDivider = false,
  className = '',
  menuClassName = '',
  itemClassName = '',
  disabled = false,
  onSelect,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Fermer le dropdown lors d'un clic en dehors
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);
  
  // Fermer avec la touche Echap
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);
  
  // Toggle du dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };
  
  // Fermer le dropdown après sélection
  const handleSelect = (item, index) => {
    if (item.onClick) {
      item.onClick();
    }
    
    if (onSelect) {
      onSelect(item, index);
    }
    
    if (!item.keepOpen) {
      setIsOpen(false);
    }
  };
  
  // Placement du menu déroulant
  const placementClasses = {
    'bottom-start': 'top-full left-0',
    'bottom-end': 'top-full right-0',
    'top-start': 'bottom-full left-0',
    'top-end': 'bottom-full right-0',
  };
  
  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`} {...props}>
      {/* Élément déclencheur */}
      <div 
        className={disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} 
        onClick={toggleDropdown}
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>
      
      {/* Menu déroulant */}
      {isOpen && (
        <div 
          className={`absolute z-10 mt-1 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none ${placementClasses[placement] || placementClasses['bottom-start']} ${menuClassName}`}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1">
            {items.map((item, index) => (
              <React.Fragment key={index}>
                {item.divider ? (
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                ) : (
                  <div
                    className={`${
                      item.disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
                    } px-4 py-2 text-sm text-gray-700 dark:text-gray-300 ${item.className || ''} ${itemClassName}`}
                    onClick={() => !item.disabled && handleSelect(item, index)}
                    role="menuitem"
                  >
                    <div className="flex items-center">
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.label}
                    </div>
                  </div>
                )}
                {withDivider && index < items.length - 1 && !item.divider && !items[index + 1].divider && (
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}