import { Button } from '@/components/ui/button';
import { IconSwitch } from '@/components/ui/icon-switch';
import { Filter, X, Grid3X3, List } from 'lucide-react';
import { FilterButton } from './FilterButton';
import { ActiveFilterPills } from './ActiveFilterPills';
import { DIET_OPTIONS, ALLERGEN_OPTIONS } from '@/lib/constants';

interface FilterControlsProps {
  selectedDiets: string[];
  selectedAllergens: string[];
  setSelectedDiets: (diets: string[]) => void;
  setSelectedAllergens: (allergens: string[]) => void;
  displayView: 'card' | 'compact';
  setDisplayView: (view: 'card' | 'compact') => void;
  totalItems: number;
}

export function FilterControls({
  selectedDiets,
  selectedAllergens,
  setSelectedDiets,
  setSelectedAllergens,
  displayView,
  setDisplayView,
  totalItems,
}: FilterControlsProps) {
  const clearAllFilters = () => {
    setSelectedDiets([]);
    setSelectedAllergens([]);
  };

  const toggleDisplayView = () => {
    setDisplayView(displayView === 'card' ? 'compact' : 'card');
  };

  const totalFilters = selectedDiets.length + selectedAllergens.length;

  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <div className="flex-1">
        <div className="space-y-4">
          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Filters:
              </span>
            </div>

            {/* Diets Filter */}
            <FilterButton
              title="Diets"
              description="Dietary Preferences"
              options={DIET_OPTIONS}
              selectedOptions={selectedDiets}
              onOptionsChange={setSelectedDiets}
              color="green"
            />

            {/* Allergens Filter */}
            <FilterButton
              title="Exclude Allergens"
              description="Exclude Allergens"
              options={ALLERGEN_OPTIONS}
              selectedOptions={selectedAllergens}
              onOptionsChange={setSelectedAllergens}
              color="red"
            />

            {/* Clear Filters */}
            {totalFilters > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-8 px-2 text-muted-foreground hover:text-white"
              >
                <X className="h-3 w-3 mr-1" />
                Clear ({totalFilters})
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          {totalFilters > 0 && (
            <div className="flex flex-wrap gap-2">
              <ActiveFilterPills
                selectedOptions={selectedDiets}
                onOptionsChange={setSelectedDiets}
                color="green"
              />
              <ActiveFilterPills
                selectedOptions={selectedAllergens}
                onOptionsChange={setSelectedAllergens}
                color="red"
                preText="No"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <IconSwitch
          checked={displayView === 'compact'}
          onCheckedChange={() => toggleDisplayView()}
        />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium">{totalItems}</span>
          <span>items</span>
        </div>
      </div>
    </div>
  );
}
