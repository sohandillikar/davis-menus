import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { FavoritesSheet } from "../favorites/FavoritesSheet";
import { MealPlannerButton } from "./MealPlannerButton";

export function MobileMenu() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
                        <SheetTitle>What's cooking, Aggie?</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                        <MealPlannerButton variant="mobile" onClick={() => setIsMobileMenuOpen(false)} />
                        <FavoritesSheet variant="mobile" />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}