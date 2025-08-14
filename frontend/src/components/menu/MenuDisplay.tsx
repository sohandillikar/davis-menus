import { MenuItem, MenuItemData } from "./MenuItem";
import { NoMenuAvailable } from "./NoMenuAvailable";

interface MenuDisplayProps {
  items: MenuItemData[];
  diningHall: string;
  meal: string;
}

export function MenuDisplay({ items, diningHall, meal }: MenuDisplayProps) {
  // Group items by platform
  const groupedItems = items.reduce((acc, item) => {
    const platform = item.platform || 'General';
    if (!acc[platform]) {
      acc[platform] = [];
    }
    acc[platform].push(item);
    return acc;
  }, {} as Record<string, MenuItemData[]>);

  const platforms = Object.keys(groupedItems);

  return (<>
    {platforms.length === 0 ?
      <NoMenuAvailable meal={meal} diningHall={diningHall} /> :
      <div className="space-y-8 pb-6">
        {platforms.map((platform) => (
          <div key={platform} className="space-y-4">
            {/* Platform Header */}
            <div className="sticky top-0 z-10 bg-platform-header/80 backdrop-blur-sm border border-border/30 rounded-lg p-3 shadow-soft">
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-lg font-bold text-foreground">
                  {platform}
                </h2>
                <span className="text-sm text-muted-foreground font-normal">
                  ({groupedItems[platform].length})
                </span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="grid gap-4">
              {groupedItems[platform].map((item, i) => (
                <MenuItem
                  key={i}
                  item={item}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    }
  </>);
}