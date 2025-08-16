import { Button } from "@/components/ui/button";
import { ChevronDown, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FcGoogle } from "react-icons/fc";
import { FavoritesSheet } from "../favorites/FavoritesSheet";
import { MealPlannerButton } from "./MealPlannerButton";
import { useAuthContext } from "@/contexts/AuthContext";

function WhatIsCookingButton() {
    const { user, isSignedIn, signIn, signOut } = useAuthContext();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                variant="ghost" 
                size="sm"
                className="text-white hover:bg-white/10"
                >
                What's cooking, {isSignedIn ? user.user_metadata.name.split(" ")[0] : "Aggie"}?
                <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto bg-background/95 backdrop-blur border border-border/50" align="end">
                <DropdownMenuItem
                className={`px-4 whitespace-nowrap ${!isSignedIn && "hover:bg-gray-100 focus:bg-gray-100 hover:text-foreground focus:text-foreground"}`}
                onClick={isSignedIn ? signOut : signIn}>
                    {isSignedIn ? <LogOut className="h-4 w-4 mr-2" /> : <FcGoogle className="h-4 w-4 mr-2" />}
                    {isSignedIn ? "Sign out" : "Sign in with Google"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function DesktopButtons() {
    return (
        <div className="hidden md:flex items-center gap-3">
            <MealPlannerButton variant="desktop" />
            <FavoritesSheet />
            <WhatIsCookingButton />
        </div>
    )
}