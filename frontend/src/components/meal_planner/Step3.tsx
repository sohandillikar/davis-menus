import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MealPreferences } from "./MealPlannerModal";
import { DIET_OPTIONS, ALLERGEN_OPTIONS } from "@/lib/constants";

interface Step3Props {
	mealPreferences: MealPreferences;
	setMealPreferences: React.Dispatch<React.SetStateAction<MealPreferences>>;
}

interface CheckboxGroupProps {
	label: string;
	options: string[];
	selectedOptions: string[];
	handleCheck: (option: string) => void;
}

function CheckboxGroup({ label, options, selectedOptions, handleCheck }: CheckboxGroupProps) {
	return (
		<div>
			<h3 className="font-medium mb-3">{label}</h3>
			<div className="grid grid-cols-2 gap-2">
				{options.map((option, i) => (
					<div key={i} className="flex items-center space-x-2">
						<Checkbox
						id={`option-${option}`}
						checked={selectedOptions.includes(option)}
						onCheckedChange={() => handleCheck(option)}/>
						<Label htmlFor={`option-${option}`} className="capitalize">
						{option}
						</Label>
					</div>
				))}
			</div>
		</div>
	);
}

export function Step3({ mealPreferences, setMealPreferences }: Step3Props) {
	const handleDietCheck = (selectedDiet: string) => {
		setMealPreferences(prev => ({
			...prev,
			diets: prev.diets.includes(selectedDiet) ?
			prev.diets.filter(diet => diet !== selectedDiet) :
			[...prev.diets, selectedDiet]
		}));
	};

	const handleAllergenCheck = (selectedAllergen: string) => {
		setMealPreferences(prev => ({
			...prev,
			allergens: prev.allergens.includes(selectedAllergen) ?
			prev.allergens.filter(allergen => allergen !== selectedAllergen) :
			[...prev.allergens, selectedAllergen]
		}));
	};

	return (
		<div>
			<h2 className="text-xl font-semibold mb-4">Any dietary preferences or allergens?</h2>
			<div className="space-y-6">
				<CheckboxGroup
				label="Dietary Preferences"
				options={DIET_OPTIONS}
				selectedOptions={mealPreferences.diets}
				handleCheck={handleDietCheck}
				/>
				<CheckboxGroup
				label="Exclude Allergens"
				options={ALLERGEN_OPTIONS}
				selectedOptions={mealPreferences.allergens}
				handleCheck={handleAllergenCheck}
				/>
			</div>
		</div>
	);
}