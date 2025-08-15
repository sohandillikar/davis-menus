import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MenuItemData } from "@/components/menu/MenuItem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateForDB(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateWeekBoundaries(date: Date) {
  const lastSunday = new Date(date);
  lastSunday.setDate(date.getDate() - date.getDay());

  const nextSaturday = new Date(date);
  nextSaturday.setDate(date.getDate() + (6 - date.getDay()));

  return { lastSunday, nextSaturday };
};

function containsAllergens(item: MenuItemData, allergens: string[]): boolean {
  for (let itemAllergen of item.allergens) {
    itemAllergen = itemAllergen.toLowerCase().trim();
    for (let allergen of allergens) {
      allergen = allergen.toLowerCase().trim();
      if (itemAllergen.includes(allergen))
        return true;
    }
  }
  return false;
}

export function filterMenuItems(
  menuItems: MenuItemData[],
  selectedDate: Date,
  selectedHall: string,
  selectedMeal: string,
  selectedDiets: string[],
  selectedAllergens: string[]
): MenuItemData[] {
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
  menuItems = menuItems.filter(item =>
    !containsAllergens(item, selectedAllergens)
  );

  return menuItems;
}

export function strToTitleCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
