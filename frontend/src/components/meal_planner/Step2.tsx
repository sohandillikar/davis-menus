import { useState, useEffect } from "react";
import { SelectItem, SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@/components/ui/select";
import { SelectContent } from "@/components/ui/select";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MealPreferences } from "./MealPlannerModal";
import { LoadingAnimation } from "./LoadingAnimation";
import * as utils from "@/lib/utils";
import * as db from "@/lib/database";

interface Step2Props {
	mealPreferences: MealPreferences;
	setMealPreferences: React.Dispatch<React.SetStateAction<MealPreferences>>;
}

export function Step2({ mealPreferences, setMealPreferences }: Step2Props) {
	const [isLoading, setIsLoading] = useState(false);
	const [availableDiningHalls, setAvailableDiningHalls] = useState<Record<string, string[]>>({});
	
	const handleValueChange = (meal: string, value: string) => {
		setMealPreferences(prev => ({
			...prev,
			meals: {
				...prev.meals,
				[meal]: value
			}
		}));
	};

	useEffect(() => {
		const fetchAvailableDiningHalls = async () => {
			const today = utils.formatDateForDB(new Date());
			const response = await db.getAvailableDiningHalls(today);
			setAvailableDiningHalls(response);
			setTimeout(() => setIsLoading(false), 300);
		}

		setIsLoading(true);
		fetchAvailableDiningHalls();
	}, []);

	return (
		isLoading ? <LoadingAnimation message="Gimme a sec..." submessage="Fetching available dining halls" /> :
		<div>
			<h2 className="text-xl font-semibold mb-4">Which dining hall for each meal?</h2>
			<div className="space-y-4">
				{Object.keys(availableDiningHalls).map((meal, i) => (
					<div key={i} className="space-y-2">
						<Label className="capitalize font-medium">{meal}</Label>
						<Select 
						value={mealPreferences.meals[meal] || ""} 
						onValueChange={(value) => handleValueChange(meal, value)}>
							<SelectTrigger>
								<SelectValue placeholder="Choose dining hall" />
							</SelectTrigger>
							<SelectContent>
								{availableDiningHalls[meal].map((hall, i) => (
									<SelectItem key={i} value={hall} className="capitalize">
									{hall.charAt(0).toUpperCase() + hall.slice(1)}
									</SelectItem>
								))}
								<SelectItem value="none">
									{`None (I'm skipping ${meal})`}
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				))}
			</div>
		</div>
	);
}