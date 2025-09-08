import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import MenuItem from '@/types/MenuItem';
import { API_BASE_URL } from '@/lib/constants';

interface FavoritesContextType {
  favorites: MenuItem[];
  offeredThisWeek: MenuItem[];
  refreshFavorites: () => void;
  refreshOfferedThisWeek: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function useFavoritesContext() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error(
      'useFavoritesContext must be used within an FavoritesProvider'
    );
  }
  return context;
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<MenuItem[]>([]);
  const [offeredThisWeek, setOfferedThisWeek] = useState<MenuItem[]>([]);

  const refreshFavorites = () => {
    setFavorites(
      JSON.parse(localStorage.getItem('aggiemenus.favoriteItems') || '[]')
    );
  };

  const refreshOfferedThisWeek = async () => {
    const response = await fetch(`${API_BASE_URL}/offered_this_week`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        item_names: favorites.map((favorite) => favorite.name),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch favorites offered this week');
    }

    const data = await response.json();
    setOfferedThisWeek(data.menu_items);
  };

  useEffect(refreshFavorites, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        offeredThisWeek,
        refreshFavorites,
        refreshOfferedThisWeek,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
