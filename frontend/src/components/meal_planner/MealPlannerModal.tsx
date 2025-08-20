import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Utensils } from "lucide-react";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { NavigationButtons } from "./NavigationButtons";
import { LoadingAnimation } from "./LoadingAnimation";
import { ProgressBar } from "./ProgressBar";
import { useAuthContext } from '@/contexts/AuthContext';
import { MenuItemData } from "@/components/menu/MenuItem";
import * as db from "@/lib/database";
import * as utils from "@/lib/utils";
import { MealPlanDisplay } from "./MealPlanDisplay";

interface MealPlannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface MealPreferences {
  calories: string;
  protein: string;
  meals: Record<string, string>;
  diets: string[];
  allergens: string[];
}

export interface SelectedItem {
  item: MenuItemData;
  quantity: number;
}

export interface MealPlan {
  items: SelectedItem[];
  explanation: string;
}

export function MealPlannerModal({ open, onOpenChange }: MealPlannerModalProps) {
  const minCalories = 500;
  const minProtein = 25;
  const defaultMealPreferences: MealPreferences = {
    calories: "2500",
    protein: "75",
    meals: {},
    diets: [],
    allergens: []
  };
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [mealPreferences, setMealPreferences] = useState<MealPreferences>(defaultMealPreferences);
  const [dayMealPlan, setDayMealPlan] = useState<Record<string, MealPlan>>({});

  const { user } = useAuthContext();

  const resetModal = () => {
    setCurrentStep(1);
    setIsLoading(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    resetModal();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 minCalories={minCalories} minProtein={minProtein} mealPreferences={mealPreferences} setMealPreferences={setMealPreferences} />;

      case 2:
        return <Step2 mealPreferences={mealPreferences} setMealPreferences={setMealPreferences} />;

      case 3:
        return <Step3 mealPreferences={mealPreferences} setMealPreferences={setMealPreferences} />;

      case 4:
        return <MealPlanDisplay dayMealPlan={dayMealPlan} />;
    }
  };

  useEffect(() => {
    if (currentStep === 4) {
      const fetchMealPlan = async () => {
        await db.saveMealPreferences(user.id, mealPreferences);
        const response = await utils.getMealPlan(mealPreferences);
        setDayMealPlan(response);
        setIsLoading(false);
      }

      setIsLoading(true);
      fetchMealPlan();
    }
  }, [currentStep]);

  useEffect(() => {
    if (open) {
      const fetchUserPreferences = async () => {
        const response = await db.getUserPreferences(user.id);
        if (response)
          setMealPreferences(response);
      }

      fetchUserPreferences();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Meal Planner
          </DialogTitle>
        </DialogHeader>

        <ProgressBar currentStep={currentStep} />

        {isLoading ? <LoadingAnimation message="Lemme me cook..." submessage="Preparing your personalized meal plan" /> : renderStep()}

        <NavigationButtons
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          mealPreferences={mealPreferences}
          minCalories={minCalories}
          minProtein={minProtein}
          isLoading={isLoading}
          onCloseModal={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}