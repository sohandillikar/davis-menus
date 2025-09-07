export default interface MenuItem {
	id: number;
	date: string;
	dining_hall: string;
	meal: string;
	platform: string;
	name: string;
	description: string;
	feature: string;
	serving_size_oz: string;
	calories: string;
	fat_g: string;
	carbohydrates_g: string;
	protein_g: string;
	allergens: string[];
	diets: string[];
	ingredients: string;
}