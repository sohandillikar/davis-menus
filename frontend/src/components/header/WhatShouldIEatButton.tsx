import { Button } from "@/components/ui/button";
import { Utensils } from "lucide-react";
import { SignInModal } from "../SignInModal";
import { useAuthContext } from "@/contexts/AuthContext";
import { useState } from "react";

interface WhatShouldIEatButtonProps {
    variant: "desktop" | "mobile";
}

export function WhatShouldIEatButton({ variant }: WhatShouldIEatButtonProps) {
    const { isSignedIn } = useAuthContext();
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

    const handleClick = () => {
        if (isSignedIn) {
            // TODO: Open AI Meal Planner
            console.log("Open AI Meal Planner");
        } else {
            setIsSignInModalOpen(true);
        }
    };
    
    return (<>
        {variant === "desktop" ?
            <Button 
                variant="secondary" 
                size="sm"
                className="bg-white/10 text-white border border-white/20 hover:bg-white/20"
                onClick={handleClick}
                >
                <Utensils className="h-4 w-4 mr-2" />
                What Should I Eat?
            </Button> :
            <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleClick}>
                <Utensils className="h-4 w-4 mr-2" />
                What Should I Eat?
            </Button>
        }
        <SignInModal
            title="Sign In Required"
            description="Please sign in to access personalized meal recommendations"
            googleButtonText="Continue"
            open={isSignInModalOpen}
            onOpenChange={setIsSignInModalOpen}
        />
    </>);
}