import { ChevronDown, ChevronUp } from "lucide-react";
import { LikeButton } from "./LikeButton";
import { MenuItemData } from "./MenuItem";

interface ItemHeaderProps {
    item: MenuItemData;
    expanded: boolean;
    showExtraMetadata: boolean;
    showLikeButton: boolean;
}

export function ItemHeader({ item, expanded, showExtraMetadata, showLikeButton }: ItemHeaderProps) {
    const formatDate = (date: string): string => {
        const dateObj = new Date(date + "T00:00:00");
        return dateObj.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: '2-digit',
            timeZone: 'America/Los_Angeles'
        });
    };
    return (
        <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-lg leading-tight">
                {item.item_name}
                </h3>
                {showExtraMetadata && (
                    <div className="capitalize text-xs text-muted-foreground mt-1 truncate">
                        {formatDate(item.date)} • {item.meal} • {item.dining_hall}
                    </div>
                )}
            </div>
            <div className="ml-3 flex-shrink-0 flex items-center gap-2">
                {showLikeButton && <LikeButton itemName={item.item_name} />}
                {expanded ?
                    <ChevronUp className="h-5 w-5 text-muted-foreground" /> :
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                }
            </div>
        </div>
    );
};