import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SelectedItem } from "./MealPlannerModal";
import { MenuItemData } from "@/components/menu/MenuItem";
import { ExpandedDetails } from "@/components/menu/ExpandedDetails";

interface MenuItemBadgeProps {
    item: MenuItemData;
    quantity: number;
    expanded: boolean;
    onClick: () => void;
}

interface MenuItemBadgesProps {
    mealData: SelectedItem[];
}

function MenuItemBadge({ item, quantity, expanded, onClick }: MenuItemBadgeProps) {
    return (
        <span className="bg-muted px-2 py-1 rounded-md text-sm cursor-pointer hover:bg-muted/80 transition-colors inline-flex items-center gap-1" onClick={onClick}>
            {item.item_name} {quantity > 1 && `x${quantity}`}
            <ChevronDown className={`h-3 w-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </span>
    );
}

export function MenuItemBadges({ mealData }: MenuItemBadgesProps) {
    const [expandedItem, setExpandedItem] = useState<MenuItemData | null>(null);

    const toggleExpansion = (item: MenuItemData) => {
        setExpandedItem(expandedItem?.id === item.id ? null : item);
    }

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                {mealData.map((item, i) =>
                    <MenuItemBadge
                    key={i}
                    item={item.item}
                    quantity={item.quantity}
                    expanded={expandedItem?.id === item.item.id}
                    onClick={() => toggleExpansion(item.item)}
                    />
                )}
            </div>

            {/* Expanded content for selected item */}
            {expandedItem && <ExpandedDetails item={expandedItem} nutritionFactsLayout="row" showDiets={true} />}
        </div>
    );
}