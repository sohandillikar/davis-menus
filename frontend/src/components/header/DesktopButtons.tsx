import FavoritesSheet from '../favorites/FavoritesSheet';
import MealPlannerButton from './MealPlannerButton';

export default function DesktopButtons() {
  return (
    <div className="hidden md:flex items-center gap-3">
      <MealPlannerButton variant="desktop" />
      <FavoritesSheet />
    </div>
  );
}
