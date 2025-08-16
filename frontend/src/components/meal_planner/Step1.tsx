import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from "./MealPlannerModal";

interface Step1Props {
	formData: FormData;
	setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function Step1({ formData, setFormData }: Step1Props) {
	return (<>
		<h2 className="text-xl font-semibold mb-4">What are your nutrition goals?</h2>
		<div className="grid grid-cols-2 gap-4">
			<div className="space-y-2">
				<Label htmlFor="calories">Daily Calorie Goal</Label>
				<Input
				id="calories"
				type="number"
				value={formData.calories}
				onChange={(e) => setFormData(prev => ({ ...prev, calories: e.target.value }))}
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="protein">Daily Protein Goal (g)</Label>
				<Input
				id="protein"
				type="number"
				value={formData.protein}
				onChange={(e) => setFormData(prev => ({ ...prev, protein: e.target.value }))}
				/>
			</div>
		</div>
	</>);
}