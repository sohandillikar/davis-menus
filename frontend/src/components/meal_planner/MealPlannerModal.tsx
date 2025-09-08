import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Utensils } from 'lucide-react';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { NavigationButtons } from './NavigationButtons';
import { LoadingAnimation } from '../LoadingAnimation';
import { ProgressBar } from './ProgressBar';
import MenuItem from '@/types/MenuItem';
import { MealPlanDisplay } from './MealPlanDisplay';
import { useMealPlannerModalContext } from '@/contexts/MealPlannerModalContext';
import { getMealPlan } from '@/lib/utils';

export interface MealPreferences {
  calories: string;
  protein: string;
  meals: Record<string, string>;
  diets: string[];
  allergens: string[];
}

export interface SelectedItem {
  item: MenuItem;
  quantity: number;
}

export interface MealPlan {
  items: SelectedItem[];
  explanation: string;
}

export function MealPlannerModal() {
  const minCalories = 500;
  const minProtein = 25;

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<MealPreferences>({
    calories: '2500',
    protein: '75',
    meals: {},
    diets: [],
    allergens: [],
  });
  const [dayMealPlan, setDayMealPlan] = useState<Record<string, MealPlan>>({});

  const { isOpen, setIsOpen } = useMealPlannerModalContext();

  const handleClose = () => {
    setIsOpen(false);
    setIsLoading(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            minCalories={minCalories}
            minProtein={minProtein}
            preferences={preferences}
            setPreferences={setPreferences}
          />
        );
      case 2:
        return (
          <Step2 preferences={preferences} setPreferences={setPreferences} />
        );
      case 3:
        return (
          <Step3 preferences={preferences} setPreferences={setPreferences} />
        );
      case 4:
        return <MealPlanDisplay dayMealPlan={dayMealPlan} />;
    }
  };

  useEffect(() => {
    if (currentStep === 4) {
      const fetchMealPlan = async () => {
        localStorage.setItem(
          'aggiemenus.mealPreferences',
          JSON.stringify(preferences)
        );
        const payload = await getMealPlan(preferences);
        setDayMealPlan(payload);
        setIsLoading(false);
      };

      setIsLoading(true);
      fetchMealPlan();
    }
  }, [currentStep]);

  useEffect(() => {
    if (isOpen) {
      const storedPreferences = localStorage.getItem(
        'aggiemenus.mealPreferences'
      );
      if (storedPreferences) {
        setPreferences(JSON.parse(storedPreferences));
      } else {
        localStorage.setItem(
          'aggiemenus.mealPreferences',
          JSON.stringify(preferences)
        );
      }
    } else {
      handleClose();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Meal Planner
          </DialogTitle>
        </DialogHeader>

        <ProgressBar currentStep={currentStep} />

        {isLoading ? (
          <LoadingAnimation
            message="Let me cook..."
            submessage="Preparing your personalized meal plan"
          />
        ) : (
          renderStep()
        )}

        <NavigationButtons
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          preferences={preferences}
          minCalories={minCalories}
          minProtein={minProtein}
          isLoading={isLoading}
          onCloseModal={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}
