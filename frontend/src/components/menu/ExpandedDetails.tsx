import { Badge } from "@/components/ui/badge";
import { MenuItem } from "@/models/MenuItem";
import { NutritionFacts } from "./NutritionFacts";

interface ExpandedDetailsProps {
    item: MenuItem;
    nutritionFactsLayout?: "row" | "grid";
    showDiets?: boolean;
}

interface BadgesListProps {
    badges: string[];
    title: string;
    color: "red" | "green";
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

function BadgesList({ badges, title, color }: BadgesListProps) {
    return (
        <div>
            <h4 className="text-sm font-medium text-foreground mb-2">{title}:</h4>
            <div className="flex flex-wrap gap-1">
                {badges.map((badge, i) => (
                    <Badge key={i} className={`bg-${color}-100 text-${color}-700 font-medium px-2 py-1 text-xs border-0 capitalize pointer-events-none`}>
                        {badge}
                    </Badge>
                ))}
            </div>
        </div>
    );
};

export function ExpandedDetails({ item, nutritionFactsLayout = "row", showDiets = false }: ExpandedDetailsProps) {
    return (
        <div className="pt-3 border-t border-border/30 space-y-3 animate-fade-in">
            {/* Description and Feature */}
            <Description description={item.data.description} feature={item.data.feature} />
            
            {/* Nutrition Facts Grid */}
            <NutritionFacts item={item} layout={nutritionFactsLayout} />

            {/* Allergens */}
            {item.data.allergens.length > 0 && <BadgesList badges={item.data.allergens} title="Allergens" color="red" /> }

            {/* Diets */}
            {showDiets && item.data.diets.length > 0 && <BadgesList badges={item.data.diets} title="Diets" color="green" /> }

            {/* Ingredients */}
            {item.data.ingredients &&
                <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Ingredients:</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 rounded-lg p-3">
                        {item.data.ingredients}
                    </p>
                </div>
            }
        </div>
    );
};