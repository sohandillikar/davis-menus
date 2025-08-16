import { LogoAndTitle } from "./LogoAndTitle";
import { DesktopButtons } from "./DesktopButtons";
import { MobileMenu } from "./MobileMenu";

export function Header() {
    return (
        <header className="bg-gradient-primary shadow-glow sticky top-0 z-50 border-b border-primary/20">
            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Left side - Logo and title */}
                    <LogoAndTitle />
                    
                    {/* Right side - Desktop buttons (hidden on mobile) */}
                    <DesktopButtons />
                    
                    {/* Mobile hamburger menu (shown on mobile) */}
                    <MobileMenu />
                </div>
            </div>
        </header>
    );
};