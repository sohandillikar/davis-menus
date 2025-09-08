import { Button } from '@/components/ui/button';
import { Utensils } from 'lucide-react';
import { useMealPlannerModalContext } from '@/contexts/MealPlannerModalContext';

interface MealPlannerButtonProps {
  variant: 'desktop' | 'mobile';
  onClick?: () => void;
}

export function MealPlannerButton({
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
        <Button
          variant="secondary"
          size="sm"
          className="bg-white/10 text-white border border-white/20 hover:bg-white/20"
          onClick={handleClick}
        >
          <Utensils className="h-4 w-4 mr-2" />
          What Should I Eat?
        </Button>
      ) : (
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleClick}
        >
          <Utensils className="h-4 w-4 mr-2" />
          What Should I Eat?
        </Button>
      )}
    </>
  );
}
