import { useAuthContext } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { MenuItem, MenuItemData } from "@/components/menu/MenuItem";

interface FillerComponentProps {
    header: string;
    body: string;
    icon: React.ReactNode;
    action?: React.ReactNode;
}

interface FavoritesListProps {
    items: MenuItemData[];
    hasFavorites: boolean;
    showExtraMetadata?: boolean;
}

function FillerComponent({ header, body, icon, action = null }: FillerComponentProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center py-8">
            {icon}
            <h3 className="font-semibold text-lg mb-2">{header}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
                {body}
            </p>
            {action}
        </div>
    );
}

export function FavoritesList({ items, hasFavorites, showExtraMetadata = false }: FavoritesListProps) {
    const { isSignedIn, signIn } = useAuthContext();

    return (
        <ScrollArea className="h-full">
            <div className="space-y-3 pr-4">
                {!isSignedIn ?
                    <FillerComponent
                    header="Sign in to track your favorites"
                    body="Sign in to save your favorite menu items and get notified when they're back on the menu!"
                    icon={<Heart className="h-12 w-12 text-muted-foreground mb-4" />}
                    action={
                        <Button
                        variant="outline"
                        className="mt-4 hover:bg-gray-100 focus:bg-gray-100 hover:text-foreground focus:text-foreground"
                        onClick={signIn}>
                            <FcGoogle className="h-4 w-4 mr-2" />
                            Sign in with Google
                        </Button>
                    }/> :
                    items.length === 0 ? hasFavorites ?
                    <FillerComponent
                    header="No favorites this week"
                    body="Your favorite menu items offered this week will appear here."
                    icon={<Heart className="h-12 w-12 text-muted-foreground mb-4" />}
                    /> :
                    <FillerComponent
                    header="No favorites yet"
                    body="Tap the heart icon next to your favorite dishes to track when they're back on the menu!"
                    icon={<Heart className="h-12 w-12 text-muted-foreground mb-4" />}
                    /> :
                    items.map((item, i) => <MenuItem key={i} item={item} showExtraMetadata={showExtraMetadata} nutritionFactsLayout="grid" />)
                }
            </div>
        </ScrollArea>
    );
}