import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MealPlan } from "./MealPlannerModal";
import { MenuItemBadges } from "./MenuItemBadges";
import * as utils from "@/lib/utils";

interface MealCardProps {
    meal: string;
    mealPlanData: MealPlan;
}

export function MealCard({ meal, mealPlanData }: MealCardProps) {
    let totalCalories = 0;
    let totalProtein = 0;

    for (const item of mealPlanData.items) {
        totalCalories += Number(item.item.calories) * item.quantity;
        totalProtein += Number(item.item.protein_g) * item.quantity;
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="capitalize text-lg">{meal}</CardTitle>
                <CardDescription>
                    {utils.stringToTitleCase(mealPlanData.items[0].item.dining_hall)} • {Math.round(totalCalories)} cal • {Math.round(totalProtein)}g protein
                </CardDescription>
                {mealPlanData.explanation &&
                    <p className="text-sm text-muted-foreground mt-2 italic">
                        {mealPlanData.explanation}
                    </p>
                }
            </CardHeader>
            <CardContent>
                <MenuItemBadges mealItemsData={mealPlanData.items} />
            </CardContent>
        </Card>
    );
}