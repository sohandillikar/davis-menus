import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MenuItemData } from "@/components/menu/MenuItem";

interface FavoritesContextType {
    favorites: MenuItemData[];
    offeredThisWeek: MenuItemData[];
    refreshFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function useFavoritesContext() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavoritesContext must be used within an FavoritesProvider');
    }
    return context;
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<MenuItemData[]>([]);
    const [offeredThisWeek, setOfferedThisWeek] = useState<MenuItemData[]>([]);

    const refreshFavorites = async () => {
        console.log("refreshFavorites inside FavoritesContext");
    }

    const refreshOfferedThisWeek = async () => {
        console.log("refreshOfferedThisWeek inside FavoritesContext");
    }

    useEffect(() => {
        refreshOfferedThisWeek();
    }, [favorites]);

    return (
        <FavoritesContext.Provider value={{ favorites, offeredThisWeek, refreshFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
}
