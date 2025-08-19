import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MealPreferences } from "./MealPlannerModal";

interface NavigationButtonsProps {
	currentStep: number;
	setCurrentStep: (step: number) => void;
	mealPreferences: MealPreferences;
	minCalories: number;
	minProtein: number;
	isLoading: boolean;
	onCloseModal: () => void;
}

export function NavigationButtons({ currentStep, setCurrentStep, mealPreferences, minCalories, minProtein, isLoading, onCloseModal }: NavigationButtonsProps) {
	const canProceedStep2 = (
		mealPreferences.calories &&
		mealPreferences.protein &&
		parseInt(mealPreferences.calories) >= minCalories &&
		parseInt(mealPreferences.protein) >= minProtein
	);
	const canProceedStep3 = (
		Object.keys(mealPreferences.meals).length === 3 &&
		Object.values(mealPreferences.meals).some(value => value !== "none")
	);

	return (
		<div className="flex justify-between pt-6 border-t">
			<Button
			variant="outline"
			onClick={() => setCurrentStep(Math.max(currentStep - 1, 1))}
			disabled={currentStep === 1 || isLoading}
			className="flex items-center gap-2">
				<ChevronLeft className="h-4 w-4" />
				Back
			</Button>

			{currentStep < 4 ?
				<Button
					onClick={() => setCurrentStep(Math.min(currentStep + 1, 4))}
					disabled={
						(currentStep === 1 && !canProceedStep2) ||
						(currentStep === 2 && !canProceedStep3)
					}
					className="flex items-center gap-2">
					Next
					<ChevronRight className="h-4 w-4" />
				</Button> :
				<Button disabled={isLoading} onClick={onCloseModal}>Close</Button>
			}
		</div>
	);
}