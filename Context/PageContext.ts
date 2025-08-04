import { createContext } from "react";

export type ActiveTabKeys = "home" | "goals" | "household" | "mindset" | "calculators" | "tools" | "budget-analysis";

export interface PageContext {
    isDarkMode: boolean;
    setIsDarkMode: (isDarkMode: boolean) => void;
    activeTab: ActiveTabKeys;
    setActiveTab: (activeTab: ActiveTabKeys) => void;
};

export const PageContext = createContext<PageContext>({
    isDarkMode: false,
    setIsDarkMode: (isDarkMode: boolean) => { },
    activeTab: "home",
    setActiveTab: (activeTab: ActiveTabKeys) => { },
})
