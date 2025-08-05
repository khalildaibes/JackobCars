"use client";

import { useState, useEffect } from 'react';

interface FirstVisitState {
  isFirstVisit: boolean;
  isLoading: boolean;
}

export const useFirstVisit = (): FirstVisitState & {
  markAsVisited: () => void;
} => {
  const [state, setState] = useState<FirstVisitState>({
    isFirstVisit: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check if running in browser environment
    if (typeof window === 'undefined') {
      setState({ isFirstVisit: false, isLoading: false });
      return;
    }

    try {
      const hasVisited = localStorage.getItem('has-visited-site');
      const isFirstVisit = !hasVisited;
      
      setState({
        isFirstVisit,
        isLoading: false,
      });
    } catch (error) {
      // If localStorage is not available, treat as not first visit
      console.warn('localStorage not available:', error);
      setState({
        isFirstVisit: false,
        isLoading: false,
      });
    }
  }, []);

  const markAsVisited = () => {
    try {
      localStorage.setItem('has-visited-site', 'true');
      setState(prev => ({
        ...prev,
        isFirstVisit: false,
      }));
    } catch (error) {
      console.warn('Could not save to localStorage:', error);
    }
  };

  return {
    ...state,
    markAsVisited,
  };
};