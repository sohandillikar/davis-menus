import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MenuItem } from "@/models/MenuItem";
import { MealPreferences } from "@/components/meal_planner/MealPlannerModal";
import { API_BASE_URL } from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stringToTitleCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatDateForDB(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getWeekBoundaries(date: Date) {
  const lastSunday = new Date(date);
  lastSunday.setDate(date.getDate() - date.getDay());
  lastSunday.setHours(0, 0);

  const nextSaturday = new Date(date);
  nextSaturday.setDate(date.getDate() + (6 - date.getDay()));
  nextSaturday.setHours(23, 59);

  return { lastSunday, nextSaturday };
};

export function filterMenuItems(
  menuItems: MenuItem[],
  selectedDate: Date,
  selectedHall: string,
  selectedMeal: string,
  selectedDiets: string[],
  selectedAllergens: string[]
): MenuItem[] {
  // Filter by date, hall, and meal
  menuItems = menuItems.filter(item =>
    item.data.date === formatDateForDB(selectedDate) &&
    item.data.dining_hall === selectedHall &&
    item.data.meal === selectedMeal
  );

  // Filter by diets
  if (selectedDiets.length > 0) {
    menuItems = menuItems.filter(item =>
      selectedDiets.every(diet => item.data.diets.includes(diet))
    );
  }

  // Filter by allergens
  menuItems = menuItems.filter(item => !item.containsAllergens(selectedAllergens));

  return menuItems;
}

export async function getMealPlan(mealPreferences: MealPreferences) {
  const response = await fetch(`${API_BASE_URL}/get_meal_plan`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      meal_preferences: mealPreferences,
      date: formatDateForDB(new Date()),
      use: "algo"
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.meal_plan;
}
