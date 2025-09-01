import { MenuItem } from "@/models/MenuItem";
import { supabase } from "@/lib/supabase";
import { MEALS } from "@/lib/constants";
import * as utils from "@/lib/utils";

export async function getMenuItems(selectedDate: Date, selectedHall: string, selectedMeal: string): Promise<MenuItem[]> {
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

    return data.map(item => new MenuItem(item));
}

export async function getWeekMenuItems(firstDate: Date, lastDate: Date): Promise<MenuItem[]> {
    let allData: MenuItem[] = [];
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

        const menuItems = data.map(item => new MenuItem(item));
        
        allData.push(...menuItems);
        from += batchSize;
    }

    return allData;
}

export async function getOfferedThisWeek(favorites: MenuItem[]) {
    const today = new Date();
    const { lastSunday, nextSaturday } = utils.getWeekBoundaries(today);
    const itemNames = favorites.map(item => item.data.item_name);

    const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .in("item_name", itemNames)
        .gte("date", utils.formatDateForDB(today))
        .lte("date", utils.formatDateForDB(nextSaturday))
        .order("date", { ascending: true })
        .order("item_name", { ascending: true });

    if (error) {
        console.error("Error fetching favorite items offered this week:", error);
        return [];
    }

    return data.map(item => new MenuItem(item));
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
