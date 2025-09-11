import { useRef, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { MealPreferences } from './MealPlannerModal';
import { CALORIE_REC, PROTEIN_REC } from '@/lib/constants';
import { scoreGoals } from '@/lib/utils';

interface Step1Props {
  minCalories: number;
  minProtein: number;
  preferences: MealPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<MealPreferences>>;
}

export default function Step1({
  minCalories,
  minProtein,
  preferences,
  setPreferences,
}: Step1Props) {
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(`The recommended daily intake for college students is ${CALORIE_REC} calories and ${PROTEIN_REC}g protein.`);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const calories = parseFloat(preferences.calories);
    const protein = parseFloat(preferences.protein);
    
    if (calories && protein && calories > 0 && protein > 0) {
      const result = scoreGoals(calories, protein);
      setScore(result.score);
      if (!isFirstRender.current) {
        setFeedback(result.feedback);
      }
    } else {
      setScore(0);
      setFeedback("Please enter calorie and protein goals that are greater than 0.");
    }
    isFirstRender.current = false;
  }, [preferences.calories, preferences.protein]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        What are your nutrition goals?
      </h2>
      <p className="text-sm text-muted-foreground mb-4">{feedback}</p>
      <Progress 
          value={score * 100} 
          className={`h-2 mb-4 ${
            score >= 0.8 
              ? '[&>div]:bg-green-500' 
              : score >= 0.5 
              ? '[&>div]:bg-yellow-500' 
              : '[&>div]:bg-red-500'
          }`}
        />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="calories">Daily Calorie Goal</Label>
          <Input
            id="calories"
            type="number"
            value={preferences.calories}
            onChange={e => setPreferences((prev) => ({ ...prev, calories: e.target.value }))}
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
            onChange={e => setPreferences((prev) => ({ ...prev, protein: e.target.value }))}
          />
          <p className="text-xs text-muted-foreground">
            Minimum {minProtein}g protein
          </p>
        </div>
      </div>
    </div>
  );
}
