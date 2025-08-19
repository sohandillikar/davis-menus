import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useFavoritesContext } from "@/contexts/FavoritesContext";
import { SignInModal } from "@/components/SignInModal";
import * as db from "@/lib/database";

interface LikeButtonProps {
    itemName: string;
}

export function LikeButton({ itemName }: LikeButtonProps) {
    const [liked, setLiked] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

    const { user, isSignedIn } = useAuthContext();
    const { favorites } = useFavoritesContext();

    const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (!isSignedIn) {
            setIsSignInModalOpen(true);
        } else {
            let success = false;
            if (liked) {
                const result = await db.unlikeMenuItem(user.id, itemName);
                success = result.success;
            } else {
                const result = await db.likeMenuItem(user.id, itemName);
                success = result.success;
            }
            if (success) {
                setLiked(!liked);
                setIsAnimating(true);
                setTimeout(() => setIsAnimating(false), 200);
            }
        }
    };

    useEffect(() => {
        setLiked(favorites.some(favorite => favorite.item_name === itemName));
    }, [favorites]);

    return (<>
        <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 hover:bg-transparent ${liked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={handleLike}>
            <Heart className={`h-4 w-4 transition-transform duration-200 ${isAnimating ? 'scale-125' : 'scale-100'} ${liked ? 'fill-current' : ''}`} />
        </Button>
        <SignInModal
            title="Hey there!"
            description="Please sign in to save your favorite menu items :)"
            googleButtonText="Continue"
            open={isSignInModalOpen}
            onOpenChange={setIsSignInModalOpen}
        />
    </>);
}