import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface LikeButtonProps {
    itemName: string;
}

export function LikeButton({ itemName }: LikeButtonProps) {
    const [liked, setLiked] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        console.log(`Handle like for ${itemName}`);

        setLiked(!liked);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 200);
    };

    useEffect(() => {
        setLiked(false);
    }, []);
    // ^ This useEffect should run every time favorites changes

    return (
        <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 hover:bg-transparent ${liked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={handleLike}>
            <Heart className={`h-4 w-4 transition-transform duration-200 ${isAnimating ? 'scale-125' : 'scale-100'} ${liked ? 'fill-current' : ''}`} />
        </Button>
    );
}