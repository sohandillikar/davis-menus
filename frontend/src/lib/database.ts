import { supabase } from "@/lib/supabase";
import { MenuItemData } from "@/components/menu/MenuItem";
import * as utils from "@/lib/utils";
import { MealPreferences } from "@/components/meal_planner/MealPlannerModal";
import { MEALS } from "@/lib/constants";

export async function getMenuItems(selectedDate: Date, selectedHall: string, selectedMeal: string) {
    const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('date', utils.formatDateForDB(selectedDate))
    .eq('dining_hall', selectedHall)
    .eq('meal', selectedMeal);

    if (error) {
        console.error("Error fetching menu items:", error);
        return [];
    }

    return data;
}

export async function getWeekMenuItems(firstDate: Date, lastDate: Date) {
    let allData: MenuItemData[] = [];
    let from = 0;
    const batchSize = 1000;

    while (true) {
        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .gte('date', utils.formatDateForDB(firstDate))
            .lte('date', utils.formatDateForDB(lastDate))
            .range(from, from + batchSize - 1);
        
        if (error) {
            console.error("Error fetching menu items:", error);
            return [];
        }
        
        if (!data || data.length === 0) break;
        
        allData.push(...data);
        from += batchSize;
    }
    return allData;
}

export async function getAllLikedItems(userId: string) {
    const { data: favItemIds, error: favItemsError } = await supabase
        .from("favorite_items")
        .select("item_id")
        .eq("user_id", userId);

    if (favItemsError) {
        console.error("Error fetching liked items:", favItemsError);
        return [];
    }

    const { data: favMenuItems, error: favMenuItemsError } = await supabase
        .from("menu_items")
        .select("*")
        .in("id", favItemIds.map(item => item.item_id));

    if (favMenuItemsError) {
        console.error("Error fetching menu items:", favMenuItemsError);
        return [];
    }

    return favMenuItems;
}

export async function getOfferedThisWeek(favoriteItems: MenuItemData[]) {
    const today = new Date();
    const nSaturday = new Date(today);
    nSaturday.setDate(today.getDate() + (6 - today.getDay()));
    
    const favoriteItemNames = favoriteItems.map(item => item.item_name);

    const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .in("item_name", favoriteItemNames)
        .gte("date", utils.formatDateForDB(today))
        .lte("date", utils.formatDateForDB(nSaturday))
        .order("date", { ascending: true })
        .order("item_name", { ascending: true });

    if (error) {
        console.error("Error fetching favorite items offered this week:", error);
        return [];
    }

    return data;
}

export async function likeMenuItem(userId: string, itemName: string) {
    const { data: favItemId, error: favItemIdError } = await supabase
        .from("menu_items")
        .select("id")
        .eq("item_name", itemName)
        .limit(1);

    if (favItemIdError) {
        console.error("Error fetching menu item from name:", favItemIdError);
        return { success: false };
    }

    const { error } = await supabase
        .from("favorite_items")
        .insert([{ user_id: userId, item_id: favItemId[0].id }]);

    if (error) {
        console.error("Error liking menu item:", error);
        return { success: false };
    } else {
        return { success: true };
    }
}

export async function unlikeMenuItem(userId: string, itemName: string) {

    // Get all the favorite item ids for the user
    const { data: allFavIds, error: allFavIdsError } = await supabase
        .from("favorite_items")
        .select("item_id")
        .eq("user_id", userId);
    
    if (allFavIdsError) {
        console.error("Error fetching all user's favorite item ids:", allFavIdsError);
        return { success: false };
    }

    // Keep the ids where name = itemName
    const { data: filteredFavIds, error: filteredFavIdsError } = await supabase
        .from("menu_items")
        .select("id")
        .in("id", allFavIds.map(item => item.item_id))
        .eq("item_name", itemName);
    
    if (filteredFavIdsError) {
        console.error("Error filtering all favorite item ids where name = itemName:", filteredFavIdsError);
        return { success: false };
    }

    // Delete the ids where name = itemName
    const { error: deleteError } = await supabase
        .from("favorite_items")
        .delete()
        .eq("user_id", userId)
        .in("item_id", filteredFavIds.map(item => item.id));

    if (deleteError) {
        console.error("Error deleting favorite items where name = itemName:", deleteError);
        return { success: false };
    }

    return { success: true };
}

export async function getAvailableDiningHalls(date: string) {
    let availableDiningHalls: Record<string, string[]> = {};
    
    for (const meal of MEALS) {
        const { data, error } = await supabase
            .from("menu_items")
            .select("dining_hall")
            .eq("date", date)
            .eq("meal", meal);

        if (error) {
            console.error("Error fetching dining halls for meal:", error);
        } else {
            const uniqueDiningHalls = new Set(data.map(item => item.dining_hall));
            availableDiningHalls[meal] = Array.from(uniqueDiningHalls);
        }
    }

    return availableDiningHalls;
}

export async function getUserPreferences(userId: string) {
    const { data, error } = await supabase
        .from("meal_preferences")
        .select("calories, protein, meals, diets, allergens")
        .eq("user_id", userId);

    if (error)
        console.error("Error fetching user preferences:", error);
    else if (data.length > 0)
        return data[0];
}

export async function saveMealPreferences(userId: string, mealPreferences: MealPreferences) {
    const { error } = await supabase
    .from("meal_preferences")
    .upsert({
        "user_id": userId,
        calories: mealPreferences.calories,
        protein: mealPreferences.protein,
        meals: mealPreferences.meals,
        diets: mealPreferences.diets,
        allergens: mealPreferences.allergens
    });

    if (error) {
        console.error("Error saving meal preferences:", error);
        return { success: false };
    }

    return { success: true };
}
