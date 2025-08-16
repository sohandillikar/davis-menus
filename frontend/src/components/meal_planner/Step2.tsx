import { Button } from "@/components/ui/button";
import { FormData } from "./MealPlannerModal";
import { MEALS } from "@/lib/constants";

interface Step2Props {
	formData: FormData;
	setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function Step2({ formData, setFormData }: Step2Props) {
	const handleClick = (selectedMeal: string) => {
		let newMeals = [...formData.meals];
		const newDiningHalls = { ...formData.diningHalls };

		if (formData.meals.includes(selectedMeal)) {
			newMeals = newMeals.filter(meal => meal !== selectedMeal);
			delete newDiningHalls[selectedMeal];
		} else {
			newMeals.push(selectedMeal);
		}

		setFormData(prev => ({
			...prev,
			meals: newMeals,
			diningHalls: newDiningHalls
		}));
	};

	return (<>
		<h2 className="text-xl font-semibold mb-4">Choose Meals</h2>
		<p className="text-sm text-muted-foreground mb-6">Which meals are you planning? (Select one or more)</p>
		<div className="grid grid-cols-3 gap-4">
			{MEALS.map((meal, i) => (
				<Button
				key={i}
				variant={formData.meals.includes(meal) ? "default" : "outline"}
				className="capitalize"
				onClick={() => handleClick(meal)}>
				{meal}
				</Button>
			))}
		</div>
	</>);
}