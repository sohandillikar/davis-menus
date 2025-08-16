import { useState, useEffect } from "react";
import { Header } from "@/components/header/Header";
import { DayPicker } from "@/components/DayPicker";
import { TabSelector } from "@/components/TabSelector";
import { FilterControls } from "@/components/filters/FilterControls";
import { MenuDisplay } from "@/components/menu/MenuDisplay";
import { useFavoritesContext } from "@/contexts/FavoritesContext";
import { DINING_HALLS, MEALS } from "@/lib/constants";
import * as db from "@/lib/database";
import * as utils from "@/lib/utils";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHall, setSelectedHall] = useState("tercero");
  const [selectedMeal, setSelectedMeal] = useState("breakfast");
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);

  const [weekBoundaries, setWeekBoundaries] = useState({
    lastSunday: new Date(),
    nextSaturday: new Date()
  });
  
  const [weeklyMenuItems, setWeeklyMenuItems] = useState([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [loadingMenuItems, setLoadingMenuItems] = useState(true);

  const { refreshFavorites } = useFavoritesContext();

  useEffect(() => {
    setWeekBoundaries(utils.calculateWeekBoundaries(selectedDate));
  }, []);

  useEffect(() => {
    const fetchWeeklyMenuItems = async () => {
      const payload = await db.getWeeklyMenuItems(
        weekBoundaries.lastSunday,
        weekBoundaries.nextSaturday
      );
      setWeeklyMenuItems(payload);
      setLoadingMenuItems(false);
    };

    setLoadingMenuItems(true);
    fetchWeeklyMenuItems();
  }, [weekBoundaries]);

  useEffect(() => {
    setFilteredMenuItems(utils.filterMenuItems(weeklyMenuItems, selectedDate, selectedHall, selectedMeal, selectedDiets, selectedAllergens));
    refreshFavorites();
  }, [weeklyMenuItems, selectedDate, selectedHall, selectedMeal, selectedDiets, selectedAllergens]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Date Picker */}
        <div className="animate-fade-in">
          <DayPicker
            firstDate={weekBoundaries.lastSunday}
            lastDate={weekBoundaries.nextSaturday}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>

        {/* Dining Hall Tabs */}
        <div
          className="animate-fade-in"
          style={{ animationDelay: "0.1s" }}>
          <TabSelector
            selectedValue={selectedHall}
            onValueChange={setSelectedHall}
            tabs={DINING_HALLS}
            type="primary"
          />
        </div>

        {/* Meal Tabs */}
        <div
          className="animate-fade-in"
          style={{ animationDelay: "0.2s" }}>
          <TabSelector
            selectedValue={selectedMeal}
            onValueChange={setSelectedMeal}
            tabs={MEALS}
            type="secondary"
          />
        </div>

        {/* Filter Controls */}
        <div className="animate-fade-in" style={{ animationDelay: "0.25s" }}>
          <FilterControls
            selectedDiets={selectedDiets}
            selectedAllergens={selectedAllergens}
            setSelectedDiets={setSelectedDiets}
            setSelectedAllergens={setSelectedAllergens}
            totalItems={filteredMenuItems.length}
          />
        </div>

        {/* Menu Display */}
        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          {loadingMenuItems ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading menu items...</p>
            </div>
          ) :
            <MenuDisplay
              items={filteredMenuItems}
              diningHall={selectedHall}
              meal={selectedMeal}
            />
          }
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 border-t border-border/30 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            UC Davis Dining Menus • Made with 💙 for Aggies
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;