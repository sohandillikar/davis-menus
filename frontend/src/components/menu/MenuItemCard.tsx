import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ItemHeader } from './ItemHeader';
import { NutritionBadges } from './NutritionBadges';
import { ExpandedDetails } from './ExpandedDetails';
import MenuItem from '@/types/MenuItem';

interface MenuItemCardProps {
  item: MenuItem;
  showExtraMetadata?: boolean; // Whether to show date, dining hall, and meal
  showLikeButton?: boolean;
  nutritionFactsLayout?: 'row' | 'grid';
}

export function MenuItemCard({
  item,
  showExtraMetadata = false,
  showLikeButton = true,
  nutritionFactsLayout = 'row',
}: MenuItemCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      className="p-4 bg-gradient-card border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="space-y-3">
        {/* Header */}
        <ItemHeader
          item={item}
          expanded={expanded}
          showExtraMetadata={showExtraMetadata}
          showLikeButton={showLikeButton}
        />

        {/* Badges Row */}
        <NutritionBadges item={item} />

        {/* Expanded Details */}
        {expanded && (
          <ExpandedDetails
            item={item}
            nutritionFactsLayout={nutritionFactsLayout}
          />
        )}
      </div>
    </Card>
  );
}
