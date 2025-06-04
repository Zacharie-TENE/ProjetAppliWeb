'use client';

import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { FilterProvider } from '@/context/FilterContext';

export default function ClientLayout({ children }) {
  // État pour gérer l'écran de chargement initial
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulation d'un chargement initial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-800 to-green-600">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-14 h-14 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="mt-4 text-white font-medium text-xl">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <ThemeProvider>
          <NotificationProvider>
            <FilterProvider>
              {children}
            </FilterProvider>
          </NotificationProvider>
      
      </ThemeProvider>
    </AuthProvider>
  );
}