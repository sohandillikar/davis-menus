import { createContext, useContext, useState, ReactNode } from "react";

interface MealPlannerModalContextType {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const MealPlannerModalContext = createContext<MealPlannerModalContextType | undefined>(undefined);

export function useMealPlannerModalContext() {
    const context = useContext(MealPlannerModalContext);
    if (context === undefined) {
        throw new Error('useMealPlannerModalContext must be used within an MealPlannerModalProvider');
    }
    return context;
}

export function MealPlannerModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <MealPlannerModalContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </MealPlannerModalContext.Provider>
    );
}