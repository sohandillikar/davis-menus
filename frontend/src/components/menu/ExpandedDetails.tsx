import { Badge } from "@/components/ui/badge";
import { MenuItemData } from "./MenuItem";
import { NutritionFacts } from "./NutritionFacts";

interface ExpandedDetailsProps {
    item: MenuItemData;
    nutritionFactsLayout: "row" | "grid";
}

function Description({ description, feature }: { description: string, feature: string }) {
    if (description || feature) {
        return (
            <div className="space-y-2">
                {description &&
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        {description}
                    </p>
                }
                {feature &&
                    <p className="text-primary text-sm font-medium">
                        {feature}
                    </p>
                }
            </div>
        );
    }
    return null;
};

function AllergensList({ allergens }: { allergens: string[] }) {
    return (
        <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Allergens:</h4>
            <div className="flex flex-wrap gap-1">
                {allergens.map((allergen, i) => (
                    <Badge key={i} className="bg-red-100 text-red-700 font-medium px-2 py-1 text-xs border-0 capitalize pointer-events-none">
                        {allergen}
                    </Badge>
                ))}
            </div>
        </div>
    );
};

export function ExpandedDetails({ item, nutritionFactsLayout }: ExpandedDetailsProps) {
    return (
        <div className="pt-3 border-t border-border/30 space-y-3 animate-fade-in">
            {/* Description and Feature */}
            <Description description={item.description} feature={item.feature} />
            
            {/* Nutrition Facts Grid */}
            <NutritionFacts item={item} layout={nutritionFactsLayout} />

            {/* Allergens */}
            {item.allergens.length > 0 && <AllergensList allergens={item.allergens} /> }

            {/* Ingredients */}
            <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Ingredients:</h4>
                <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 rounded-lg p-3">
                    {item.ingredients}
                </p>
            </div>
        </div>
    );
};