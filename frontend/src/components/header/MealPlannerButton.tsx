import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Utensils } from 'lucide-react';
import { useMealPlannerModalContext } from '@/contexts/MealPlannerModalContext';

interface MealPlannerButtonProps {
  variant: 'desktop' | 'mobile';
  onClick?: () => void;
}

export default function MealPlannerButton({
  variant,
  onClick,
}: MealPlannerButtonProps) {
  const { setIsOpen } = useMealPlannerModalContext();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    setIsOpen(true);
  };

  return (
    <>
      {variant === 'desktop' ? (
        <div className="relative">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/10 text-white border border-white/20 hover:bg-white/20"
            onClick={handleClick}
          >
            <Utensils className="h-4 w-4 mr-2" />
            What Should I Eat?
          </Button>
          <Badge className="absolute -top-2.5 -right-2.5 bg-primary text-primary-foreground animate-pulse-glow border-0 px-2 py-0.5 text-xs">
            New!
          </Badge>
        </div>
      ) : (
        <div className="relative">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleClick}
          >
            <Utensils className="h-4 w-4 mr-2" />
            What Should I Eat?
          </Button>
          <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground animate-pulse-glow border-0 px-2 py-0.5 text-xs">
            New!
          </Badge>
        </div>
      )}
    </>
  );
}
