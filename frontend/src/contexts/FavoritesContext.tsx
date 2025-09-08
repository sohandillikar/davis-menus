import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import MenuItem from '@/types/MenuItem';
import { API_BASE_URL } from '@/lib/constants';
import * as utils from '@/lib/utils';

interface FavoritesContextType {
  favorites: MenuItem[];
  refreshFavorites: () => void;
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

  const refreshFavorites = () => setFavorites(utils.getFavorites());

  useEffect(() => {
    refreshFavorites();
  }, []);

  return (
    <FavoritesContext.Provider value={{ favorites, refreshFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}
