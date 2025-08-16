import { SelectItem, SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@/components/ui/select";
import { SelectContent } from "@/components/ui/select";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DINING_HALLS } from "@/lib/constants";
import { FormData } from "./MealPlannerModal";

interface Step3Props {
	formData: FormData;
	setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function Step3({ formData, setFormData }: Step3Props) {
	const sortedMeals = formData.meals.sort((a, b) => {
		const order = {"breakfast": 0, "lunch": 1, "dinner": 2};
		return order[a] - order[b];
	});

	const handleValueChange = (meal: string, value: string) => {
		setFormData(prev => ({
			...prev,
			diningHalls: {
				...prev.diningHalls,
				[meal]: value
			}
		}));
	};

	return (<>
		<h2 className="text-xl font-semibold mb-4">Which dining hall for each meal?</h2>
		<div className="space-y-4">
			{sortedMeals.map((meal, i) => (
				<div key={i} className="space-y-2">
					<Label className="capitalize font-medium">{meal}</Label>
					<Select 
					value={formData.diningHalls[meal] || ""} 
					onValueChange={(value) => handleValueChange(meal, value)}>
						<SelectTrigger>
							<SelectValue placeholder="Choose dining hall" />
						</SelectTrigger>
						<SelectContent>
							{DINING_HALLS.map((hall) => (
								<SelectItem key={hall} value={hall} className="capitalize">
								{hall}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			))}
		</div>
	</>);
}