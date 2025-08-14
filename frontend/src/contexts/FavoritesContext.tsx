import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MenuItemData } from "@/components/menu/MenuItem";
import { useAuthContext } from "./AuthContext";
import * as db from "@/lib/database";

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
    const { user, isSignedIn } = useAuthContext();
    const [favorites, setFavorites] = useState<MenuItemData[]>([]);
    const [offeredThisWeek, setOfferedThisWeek] = useState<MenuItemData[]>([]);

    const refreshFavorites = async () => {
        if (isSignedIn) {
            const favorites = await db.getAllLikedItems(user.id);
            setFavorites(favorites);
        } else {
            setFavorites([]);
        }
    }

    const refreshOfferedThisWeek = async () => {
        if (isSignedIn) {
            const offeredThisWeek = await db.getOfferedThisWeek(favorites);
            setOfferedThisWeek(offeredThisWeek);
        } else {
            setOfferedThisWeek([]);
        }
    }

    useEffect(() => {
        refreshFavorites();
    }, [isSignedIn]);

    useEffect(() => {
        refreshOfferedThisWeek();
    }, [favorites]);

    return (
        <FavoritesContext.Provider value={{ favorites, offeredThisWeek, refreshFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
}
