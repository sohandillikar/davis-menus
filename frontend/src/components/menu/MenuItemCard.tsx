import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ItemHeader } from './ItemHeader';
import { NutritionBadges } from './NutritionBadges';
import { ExpandedDetails } from './ExpandedDetails';
import { MenuItemModal } from './MenuItemModal';
import MenuItem from '@/types/MenuItem';

interface MenuItemCardProps {
  item: MenuItem;
  display?: 'card' | 'compact';
  showExtraMetadata?: boolean; // Whether to show date, dining hall, and meal
  showLikeButton?: boolean;
  nutritionFactsLayout?: 'row' | 'grid';
}

export function MenuItemCard({
  item,
  display = 'card',
  showExtraMetadata = false,
  showLikeButton = true,
  nutritionFactsLayout = 'row'
}: MenuItemCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderComponent = (display: 'card' | 'compact') => {
    switch (display) {
      case 'card':
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
      case 'compact':
        return (
          <div
            className="p-2 bg-gradient-card border border-border/50 rounded-md shadow-soft hover:shadow-medium hover:bg-muted/50 transition-all duration-200 cursor-pointer"
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground truncate flex-1">
                {item.name}
              </span>
            </div>
          </div>
        );
    }
  }

  return (
    <div>
      {renderComponent(display)}
      <MenuItemModal item={item} isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </div>
  );
}
