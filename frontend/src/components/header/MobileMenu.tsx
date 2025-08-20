import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { FavoritesSheet } from "../favorites/FavoritesSheet";
import { FcGoogle } from "react-icons/fc";
import { useAuthContext } from "@/contexts/AuthContext";
import { MealPlannerButton } from "./MealPlannerButton";

interface MenuButtonsProps {
    setIsMobileMenuOpen: (isOpen: boolean) => void;
}

function MenuButtons({ setIsMobileMenuOpen }: MenuButtonsProps) {
    const { isSignedIn, signIn, signOut } = useAuthContext();
    return (
        <div className="mt-6 space-y-4">
            {/* What Should I Eat? */}
            <MealPlannerButton variant="mobile" onClick={() => setIsMobileMenuOpen(false)} />

            {/* Favorites */}
            <FavoritesSheet variant="mobile" />

            {/* Sign in with Google */}
            {isSignedIn ?
                <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                </Button> :
                <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-gray-100 focus:bg-gray-100 hover:text-foreground focus:text-foreground"
                    onClick={signIn}>
                    <FcGoogle className="h-4 w-4 mr-2" />
                    Sign in with Google
                </Button>
            }
        </div>
    );
}

export function MobileMenu() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, isSignedIn } = useAuthContext();
    return (
        <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                    <Button 
                    variant="secondary" 
                    size="sm"
                    className="bg-white/10 text-white border border-white/20 hover:bg-white/20"
                    >
                    <Menu className="h-4 w-4" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full">
                    <SheetHeader>
                        <SheetTitle>What's cooking, {isSignedIn ? user.user_metadata.name.split(" ")[0] : "Aggie"}?</SheetTitle>
                    </SheetHeader>
                    <MenuButtons setIsMobileMenuOpen={setIsMobileMenuOpen} />
                </SheetContent>
            </Sheet>
        </div>
    );
}