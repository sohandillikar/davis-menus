import { createContext, useContext, useState, ReactNode } from "react";

interface SignInModalContextType {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    mode: string;
    setMode: (mode: string) => void;
}

const SignInModalContext = createContext<SignInModalContextType | undefined>(undefined);

export function useSignInModalContext() {
    const context = useContext(SignInModalContext);
    if (context === undefined) {
        throw new Error('useSignInModalContext must be used within an SignInModalProvider');
    }
    return context;
}

export function SignInModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState("mealPlanner");

    return (
        <SignInModalContext.Provider value={{ isOpen, setIsOpen, mode, setMode }}>
            {children}
        </SignInModalContext.Provider>
    );
}