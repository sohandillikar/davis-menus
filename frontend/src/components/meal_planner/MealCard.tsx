import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectedItem } from "./MealPlannerModal";
import { MenuItemBadges } from "./MenuItemBadges";
import * as utils from "@/lib/utils";

interface MealCardProps {
    meal: string;
    mealData: SelectedItem[];
}

export function MealCard({ meal, mealData }: MealCardProps) {
    const totalCalories = mealData.reduce((acc, item) => acc + Number(item.item.calories) * item.quantity, 0);
    const totalProtein = mealData.reduce((acc, item) => acc + Number(item.item.protein_g) * item.quantity, 0);

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="capitalize text-lg">{meal}</CardTitle>
                <CardDescription>
                    {utils.stringToTitleCase(mealData[0].item.dining_hall)} • {Math.round(totalCalories)} cal • {Math.round(totalProtein)}g protein
                </CardDescription>
                {/* <p className="text-sm text-muted-foreground mt-2 italic">
                    High-protein breakfast with eggs and carbs for sustained energy throughout the morning.
                </p> */}
            </CardHeader>
            <CardContent>
                <MenuItemBadges mealData={mealData} />
            </CardContent>
        </Card>
    );
}