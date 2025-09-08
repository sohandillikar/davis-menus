import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ItemHeader } from './ItemHeader';
import { NutritionBadges } from './NutritionBadges';
import { ExpandedDetails } from './ExpandedDetails';
import MenuItem from '@/types/MenuItem';

interface MenuItemModalProps {
  item: MenuItem;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function MenuItemModal({ item, isOpen, setIsOpen }: MenuItemModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <ItemHeader item={item} showExtraMetadata={false} showLikeButton={true} />
        <NutritionBadges item={item} />
        <ExpandedDetails item={item} />
      </DialogContent>
    </Dialog>
  );
}
