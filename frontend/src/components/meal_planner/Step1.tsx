import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MealPreferences } from './MealPlannerModal';

interface Step1Props {
  minCalories: number;
  minProtein: number;
  preferences: MealPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<MealPreferences>>;
}

export function Step1({
  minCalories,
  minProtein,
  preferences,
  setPreferences,
}: Step1Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        What are your nutrition goals?
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        The recommended daily intake for college students is 2500 calories and
        75g protein.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="calories">Daily Calorie Goal</Label>
          <Input
            id="calories"
            type="number"
            value={preferences.calories}
            onChange={(e) =>
              setPreferences((prev) => ({ ...prev, calories: e.target.value }))
            }
          />
          <p className="text-xs text-muted-foreground">
            Minimum {minCalories} calories
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="protein">Daily Protein Goal (g)</Label>
          <Input
            id="protein"
            type="number"
            value={preferences.protein}
            onChange={(e) =>
              setPreferences((prev) => ({ ...prev, protein: e.target.value }))
            }
          />
          <p className="text-xs text-muted-foreground">
            Minimum {minProtein}g protein
          </p>
        </div>
      </div>
    </div>
  );
}
