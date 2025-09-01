import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MenuItem } from "@/models/MenuItem";
import * as db from "@/lib/database";

interface FavoritesContextType {
    favorites: MenuItem[];
    offeredThisWeek: MenuItem[];
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
    const [favorites, setFavorites] = useState<MenuItem[]>([]);
    const [offeredThisWeek, setOfferedThisWeek] = useState<MenuItem[]>([]);

    const refreshFavorites = () => {
        const currentFavs = JSON.parse(localStorage.getItem("aggiemenus.favoriteItems") || "[]");
        setFavorites(currentFavs.map(item => new MenuItem(item)));
    }

    useEffect(refreshFavorites, []);

    useEffect(() => {
        const refreshOfferedThisWeek = async () => {
            const payload = await db.getOfferedThisWeek(favorites);
            setOfferedThisWeek(payload);
        };
        refreshOfferedThisWeek();
    }, [favorites]);

    return (
        <FavoritesContext.Provider value={{ favorites, offeredThisWeek, refreshFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
}
