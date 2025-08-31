import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart } from "lucide-react";
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
    showLikeButton?: boolean;
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

export function FavoritesList({ items, hasFavorites, showExtraMetadata = false, showLikeButton = true }: FavoritesListProps) {
    return (
        <ScrollArea className="h-full">
            <div className="space-y-3 pr-4">
                {items.length === 0 ? hasFavorites ?
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
                    items.map((item, i) => (
                        <MenuItem
                        key={i}
                        item={item}
                        showExtraMetadata={showExtraMetadata}
                        showLikeButton={showLikeButton}
                        nutritionFactsLayout="grid"
                        />
                    ))
                }
            </div>
        </ScrollArea>
    );
}