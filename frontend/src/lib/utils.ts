import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import MenuItem from '@/types/MenuItem';
import { MealPreferences } from '@/components/meal_planner/MealPlannerModal';
import { API_BASE_URL, CALORIE_REC, PROTEIN_REC, MIN_CALORIES, MAX_CALORIES } from '@/lib/constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export function formatDateFromDB(date: string): string {
  const dateObj = new Date(date + 'T00:00:00');
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    timeZone: 'America/Los_Angeles',
  });
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
  menuItems = menuItems.filter(
    (item) =>
      item.date === formatDateForDB(selectedDate) &&
      item.dining_hall === selectedHall &&
      item.meal === selectedMeal
  );

  // Filter by diets
  if (selectedDiets.length > 0) {
    menuItems = menuItems.filter((item) =>
      selectedDiets.every((diet) => item.diets.includes(diet))
    );
  }

  // Filter by allergens
  if (selectedAllergens.length > 0) {
    menuItems = menuItems.filter(
      (item) =>
        !item.allergens.some((allergen) => selectedAllergens.includes(allergen))
    );
  }

  return menuItems;
}

export function getFavorites() {
  return JSON.parse(localStorage.getItem('aggiemenus.favoriteItems') || '[]');
}

export function isFavorite(item: MenuItem) {
  const favorites = getFavorites();
  return favorites.some((fav: MenuItem) => fav.name === item.name);
}

export function addFavorite(item: MenuItem) {
  if (isFavorite(item)) return;
  const favorites = getFavorites();
  favorites.push(item);
  localStorage.setItem('aggiemenus.favoriteItems', JSON.stringify(favorites));
}

export function removeFavorite(item: MenuItem) {
  let favorites = getFavorites();
  favorites = favorites.filter((fav: MenuItem) => fav.name !== item.name);
  localStorage.setItem('aggiemenus.favoriteItems', JSON.stringify(favorites));
}

export async function getOfferedThisWeek() {
  const favorites = getFavorites();
  const favoriteNames = favorites.map((favorite) => favorite.name);
  const response = await fetch(`${API_BASE_URL}/offered_this_week`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item_names: favoriteNames }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch favorites offered this week');
  }

  const data = await response.json();
  return data.menu_items;
}

export async function getAvailableDiningHalls(date: Date) {
  const response = await fetch(`${API_BASE_URL}/available_dining_halls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date: formatDateForDB(date) }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.available_dining_halls;
}

export async function getMealPlan(mealPreferences: MealPreferences) {
  const response = await fetch(`${API_BASE_URL}/meal_plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      meal_preferences: mealPreferences,
      date: formatDateForDB(new Date()),
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.meal_plan;
}

// TODO: Add a score for the goals
export function scoreGoals(calories: number, protein: number) {
  const PD_REC = PROTEIN_REC / CALORIE_REC;
  const MIN_PD = PD_REC * 0.95;
  const MAX_PD = PD_REC * 2;

  const density = protein / calories;

  const deltaCal = Math.abs(calories - CALORIE_REC) / CALORIE_REC;
  const deltaProt = Math.abs(protein - PROTEIN_REC) / PROTEIN_REC;

  let feedback = "";

  if (calories < MIN_CALORIES) {
    //  score = 50% - how far off from MIN_CALORIES
    const suggestedCalories = Math.max(calories * 1.25, 1200);
    const suggestedProtein = suggestedCalories * PD_REC;
    feedback = `Consider setting your goals around ${Math.round(suggestedCalories)} calories and ${Math.round(suggestedProtein)}g protein to create a healthy filling meal plan.`;
  } else if (calories > MAX_CALORIES) {
    //  score = 50% - how far off from MAX_CALORIES
    const suggestedCalories = Math.min(calories * 0.75, 4500);
    const suggestedProtein = suggestedCalories * PD_REC;
    feedback = `Consider setting your goals around ${Math.round(suggestedCalories)} calories and ${Math.round(suggestedProtein)}g protein to create a healthy filling meal plan.`;
  } else if (density < MIN_PD || density > MAX_PD) {
    //  score = 50% + how far off from MIN_PD or MAX_PD
    const suggestedDensity = density < MIN_PD ? MIN_PD : MAX_PD;
    if (deltaCal > deltaProt) {
      const suggestedCalories = protein / suggestedDensity;
      feedback = `Consider ${calories < CALORIE_REC ? "increasing" : "reducing"} to ${Math.round(suggestedCalories)} calories to balance ${protein}g protein.`;
    } else if (deltaProt > deltaCal) {
      const suggestedProtein = calories * suggestedDensity;
      feedback = `Consider ${protein < PROTEIN_REC ? "increasing" : "reducing"} to ${Math.round(suggestedProtein)}g protein to balance ${calories} calories.`;
    }
  } else {
    feedback = `Awesome! ${calories} calories and ${protein}g protein make a balanced meal plan.`;
  }

  return {
    score: 0,
    feedback: feedback
  };
}