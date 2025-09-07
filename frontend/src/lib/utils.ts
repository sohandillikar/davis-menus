import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import MenuItem from "@/types/MenuItem";
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

export async function getMenuItems() {
  const response = await fetch(`${API_BASE_URL}/menu_items/all`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

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
    item.date === formatDateForDB(selectedDate) &&
    item.dining_hall === selectedHall &&
    item.meal === selectedMeal
  );

  // Filter by diets
  if (selectedDiets.length > 0) {
    menuItems = menuItems.filter(item =>
      selectedDiets.every(diet => item.diets.includes(diet))
    );
  }

  // Filter by allergens
  if (selectedAllergens.length > 0) {
    menuItems = menuItems.filter(item =>
      !item.allergens.some(allergen => selectedAllergens.includes(allergen))
    );
  }

  return menuItems;
}

export function isFavorite(item: MenuItem) {
  const favorites = JSON.parse(localStorage.getItem("aggiemenus.favoriteItems") || "[]");
  return favorites.some((fav: MenuItem) => fav.name === item.name);
}

export function addFavorite(item: MenuItem) {
  if (isFavorite(item)) return;
  const favorites = JSON.parse(localStorage.getItem("aggiemenus.favoriteItems") || "[]");
  favorites.push(item);
  localStorage.setItem("aggiemenus.favoriteItems", JSON.stringify(favorites));
}

export function removeFavorite(item: MenuItem) {
  let favorites = JSON.parse(localStorage.getItem("aggiemenus.favoriteItems") || "[]");
  favorites = favorites.filter((fav: MenuItem) => fav.name !== item.name);
  localStorage.setItem("aggiemenus.favoriteItems", JSON.stringify(favorites));
}

export async function getMealPlan(mealPreferences: MealPreferences) {
  const response = await fetch(`${API_BASE_URL}/get_meal_plan`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      meal_preferences: mealPreferences,
      date: formatDateForDB(new Date())
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.meal_plan;
}
