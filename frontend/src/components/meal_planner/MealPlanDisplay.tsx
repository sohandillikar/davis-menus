import { Card, CardContent } from "@/components/ui/card";
import { APP_TITLE, APP_LOGO_SRC } from "@/lib/constants";
import { SelectedItem } from "./MealPlannerModal";
import { MealCard } from "./MealCard";

interface MealPlanDisplayProps {
    mealPlan: Record<string, SelectedItem[]>;
}

interface DailyTotalsProps {
    totalCalories: number;
    totalProtein: number;
}

function DailyTotals({ totalCalories, totalProtein }: DailyTotalsProps) {
    return (
        <Card className="bg-primary/5 border-primary/20">
            <CardContent className="flex items-center justify-center py-4">
                <div>
                <p className="text-sm text-muted-foreground">
                    Daily totals: {Math.round(totalCalories)} calories • {Math.round(totalProtein)}g protein
                </p>
                </div>
            </CardContent>
        </Card>
    )
}

export function MealPlanDisplay({ mealPlan }: MealPlanDisplayProps) {
    const totalCalories = Object.values(mealPlan).reduce((acc, meal) =>
        acc + meal.reduce((acc, item) =>
            acc + Number(item.item.calories) * item.quantity, 0), 0);
    const totalProtein = Object.values(mealPlan).reduce((acc, meal) =>
        acc + meal.reduce((acc, item) =>
            acc + Number(item.item.protein_g) * item.quantity, 0), 0);

    return (
        <div className="space-y-6">
            <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <img src={APP_LOGO_SRC} alt={`${APP_TITLE} logo`} className="h-6 w-6" />
                Ta-Da!
            </h2>
            <div className="space-y-4">
                {Object.keys(mealPlan).map((meal, i) => (
                    <MealCard key={i} meal={meal} mealData={mealPlan[meal]} />
                ))}
                
                <DailyTotals totalCalories={totalCalories} totalProtein={totalProtein} />
            </div>
            </div>
        </div>
    );
}