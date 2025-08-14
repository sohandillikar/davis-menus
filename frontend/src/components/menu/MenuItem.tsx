import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ItemHeader } from "./ItemHeader";
import { NutritionBadges } from "./NutritionBadges";
import { ExpandedDetails } from "./ExpandedDetails";

export interface MenuItemData {
  id: number;
  created_at: string;
  date: string;
  dining_hall: string;
  meal: string;
  platform: string;
  item_name: string;
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

interface MenuItemProps {
  item: MenuItemData;
  showExtraMetadata?: boolean; // Whether to show date, dining hall, and meal
  nutritionFactsLayout?: "row" | "grid";
}
  
export function MenuItem({ item, showExtraMetadata = false, nutritionFactsLayout = "row" }: MenuItemProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card 
      className="p-4 bg-gradient-card border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="space-y-3">
        {/* Header */}
        <ItemHeader item={item} expanded={expanded} showExtraMetadata={showExtraMetadata} />

        {/* Badges Row */}
        <NutritionBadges item={item} />

        {/* Expanded Details */}
        {expanded && <ExpandedDetails item={item} nutritionFactsLayout={nutritionFactsLayout} /> }
      </div>
    </Card>
  );
}