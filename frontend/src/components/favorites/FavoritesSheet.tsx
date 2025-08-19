import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart } from "lucide-react";
import { FavoritesList } from "./FavoritesList";
import { useFavoritesContext } from "@/contexts/FavoritesContext";

interface FavoritesSheetProps {
  variant?: "default" | "mobile";
}

export function FavoritesSheet({ variant = "default" }: FavoritesSheetProps) {
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    const { favorites, offeredThisWeek, refreshFavorites } = useFavoritesContext();

    useEffect(() => {
        refreshFavorites();
    }, [isFavoritesOpen]);

    return (
        <Sheet open={isFavoritesOpen} onOpenChange={() => setIsFavoritesOpen(!isFavoritesOpen)}>
            <SheetTrigger asChild>
                <Button 
                variant={variant === "mobile" ? "outline" : "secondary"}
                size="sm"
                className={variant === "mobile" ? "w-full justify-start" : "bg-white/10 text-white border border-white/20 hover:bg-white/20"}>
                <Heart className="h-4 w-4 mr-2" />
                Favorites
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full flex flex-col h-full">
                <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Favorites
                </SheetTitle>
                </SheetHeader>
                <Tabs defaultValue="favorites" className="mt-6 flex flex-col flex-1 min-h-0" onValueChange={refreshFavorites}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="favorites">Your favorites</TabsTrigger>
                        <TabsTrigger value="offered">Offered this week</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="favorites" className="mt-4 flex-1 min-h-0">
                        <FavoritesList items={favorites} hasFavorites={favorites.length > 0} />
                    </TabsContent>
                    
                    <TabsContent value="offered" className="mt-4 flex-1 min-h-0">
                        <FavoritesList items={offeredThisWeek} hasFavorites={favorites.length > 0} showExtraMetadata={true} showLikeButton={false} />
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
};