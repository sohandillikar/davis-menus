import { Badge } from "@/components/ui/badge";
import { MenuItem } from "@/models/MenuItem";

export function NutritionBadges({ item }: { item: MenuItem }) {
    return (
        <div className="flex flex-wrap gap-2">
            {item.data.calories !== "N/A" &&
                <Badge className="bg-orange-100 text-orange-700 font-medium px-2 py-1 text-xs pointer-events-none">
                    {Math.round(parseFloat(item.data.calories))} cal
                </Badge>
            }

            {item.data.protein_g !== "N/A" &&
                <Badge className="bg-green-100 text-green-700 font-medium px-2 py-1 text-xs pointer-events-none">
                    {Math.round(parseFloat(item.data.protein_g))}g protein
                </Badge>
            }

            {item.data.diets.map((diet, index) => (
                <Badge key={index} className="bg-red-100 text-red-700 font-medium px-2 py-1 text-xs border-0 capitalize pointer-events-none">
                    {diet}
                </Badge>
            ))}
        </div>
    );
};