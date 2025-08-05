import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FavoriteItem {
  id: string;
  type: 'psalm' | 'prayer' | 'kathisma';
  title: string;
  subtitle?: string;
  route: string;
  addedAt: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => Promise<void>;
  removeFromFavorites: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
  getFavoritesByType: (type: FavoriteItem['type']) => FavoriteItem[];
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = '@psalter_favorites';

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Load favorites on app start
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        // Validate the data structure
        if (Array.isArray(parsedFavorites)) {
          setFavorites(parsedFavorites);
        } else {
          console.warn('Invalid favorites data structure, resetting to empty array');
          setFavorites([]);
        }
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      // Reset to empty array on error
      setFavorites([]);
    }
  };

  const saveFavorites = async (newFavorites: FavoriteItem[]) => {
    try {
      // Validate data before saving
      if (!Array.isArray(newFavorites)) {
        console.error('Invalid favorites data: not an array');
        return;
      }

      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
      // Don't update state if save failed
    }
  };

  const addToFavorites = async (item: FavoriteItem) => {
    try {
      // Validate item structure
      if (!item.id || !item.type || !item.title) {
        console.error('Invalid favorite item structure:', item);
        return;
      }

      // Check if item already exists
      if (favorites.some(fav => fav.id === item.id)) {
        console.warn('Item already in favorites:', item.id);
        return;
      }

      const newFavorites = [...favorites, { ...item, addedAt: new Date().toISOString() }];
      await saveFavorites(newFavorites);
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const removeFromFavorites = async (id: string) => {
    try {
      if (!id) {
        console.error('Invalid id for removing from favorites');
        return;
      }

      const newFavorites = favorites.filter(item => item.id !== id);
      await saveFavorites(newFavorites);
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const isFavorite = (id: string) => {
    return favorites.some(item => item.id === id);
  };

  const getFavoritesByType = (type: FavoriteItem['type']) => {
    return favorites.filter(item => item.type === type);
  };

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoritesByType,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}