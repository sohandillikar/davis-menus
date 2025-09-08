import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { LikeButton } from './LikeButton';
import { NutritionBadges } from './NutritionBadges';
import { ExpandedDetails } from './ExpandedDetails';
import MenuItem from '@/types/MenuItem';
import * as utils from '@/lib/utils';

interface MenuItemModalProps {
    item: MenuItem;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export function MenuItemModal({ item, isOpen, setIsOpen }: MenuItemModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <DialogTitle className="text-xl font-semibold text-foreground leading-tight">
                        {item.name}
                        </DialogTitle>
                        <div className="capitalize text-sm text-muted-foreground mt-2">
                            {utils.formatDateFromDB(item.date)} • {item.meal} • {item.dining_hall}
                        </div>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                        <LikeButton item={item} />
                    </div>
                </div>
            </DialogHeader>
            <div className="space-y-4">
                <NutritionBadges item={item} />
                <ExpandedDetails item={item} />
            </div>
            </DialogContent>
        </Dialog>
    );
}