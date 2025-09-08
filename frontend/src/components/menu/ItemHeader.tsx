import { ChevronDown, ChevronUp } from 'lucide-react';
import { LikeButton } from './LikeButton';
import MenuItem from '@/types/MenuItem';
import * as utils from '@/lib/utils';

interface ItemHeaderProps {
  item: MenuItem;
  expanded?: boolean | null;
  showExtraMetadata: boolean;
  showLikeButton: boolean;
}

export function ItemHeader({
  item,
  expanded = null,
  showExtraMetadata,
  showLikeButton,
}: ItemHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground text-lg leading-tight">
          {item.name}
        </h3>
        {showExtraMetadata && (
          <div className="capitalize text-xs text-muted-foreground mt-1 truncate">
            {utils.formatDateFromDB(item.date)} • {item.meal} • {item.dining_hall}
          </div>
        )}
      </div>
      <div className="ml-3 flex-shrink-0 flex items-center gap-2">
        {showLikeButton && <LikeButton item={item} />}
        {expanded !== null ? (
          expanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )
        ) : null}
      </div>
    </div>
  );
}
