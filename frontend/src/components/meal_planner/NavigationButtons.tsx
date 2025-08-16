import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FormData } from "./MealPlannerModal";

interface NavigationButtonsProps {
	currentStep: number;
	setCurrentStep: (step: number) => void;
	formData: FormData;
	isLoading: boolean;
	onCloseModal: () => void;
}

export function NavigationButtons({ currentStep, setCurrentStep, formData, isLoading, onCloseModal }: NavigationButtonsProps) {
	const canProceedStep2 = formData.calories && formData.protein;
	const canProceedStep3 = formData.meals.length > 0;
	const canProceedStep4 = formData.meals.every(meal => formData.diningHalls[meal]);

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

			{currentStep < 5 ?
				<Button
					onClick={() => setCurrentStep(Math.min(currentStep + 1, 5))}
					disabled={
						(currentStep === 1 && !canProceedStep2) ||
						(currentStep === 2 && !canProceedStep3) ||
						(currentStep === 3 && !canProceedStep4) ||
						isLoading
					}
					className="flex items-center gap-2">
					Next
					<ChevronRight className="h-4 w-4" />
				</Button> :
				<Button onClick={onCloseModal}>Close</Button>
			}
		</div>
	);
}