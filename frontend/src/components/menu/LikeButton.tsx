import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import MenuItem from '@/types/MenuItem';
import { useFavoritesContext } from '@/contexts/FavoritesContext';
import * as utils from '@/lib/utils';

interface LikeButtonProps {
  item: MenuItem;
}

export function LikeButton({ item }: LikeButtonProps) {
  const [liked, setLiked] = useState(utils.isFavorite(item));
  const [isAnimating, setIsAnimating] = useState(false);
  const { favorites } = useFavoritesContext();

  const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (liked) utils.removeFavorite(item);
    else utils.addFavorite(item);

    setLiked(!liked);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);
  };

  useEffect(() => {
    setLiked(utils.isFavorite(item));
  }, [favorites]);
  // ^ This useEffect should run every time favorites changes

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`h-8 w-8 hover:bg-transparent ${liked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'}`}
      onClick={handleLike}
    >
      <Heart
        className={`h-4 w-4 transition-transform duration-200 ${isAnimating ? 'scale-125' : 'scale-100'} ${liked ? 'fill-current' : ''}`}
      />
    </Button>
  );
}
