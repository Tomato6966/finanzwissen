"use client";

import { createContext, useEffect } from "react";

import { useLocalStorage } from "../components/useCustomLocalStorage";

export type ActiveTabKeys = "home" | "goals" | "moneymanagement" | "mindset" | "calculators" | "tools" | "budget-analysis";

export interface PageContextType {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
};

export const PageContext = createContext<PageContextType>({
    isDarkMode: false,
    toggleDarkMode: () => { },
})

export default function PageRouter({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isDarkMode, setIsDarkMode] = useLocalStorage("darkMode", false);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    return (
        <div
            className={`h-full transition-colors duration-300 ${
                isDarkMode
                    ? "dark bg-gray-900"
                    : "bg-gradient-to-br from-blue-50 to-indigo-100"
            }`}
        >
            <PageContext.Provider value={{ isDarkMode, toggleDarkMode }}>
                {children}
            </PageContext.Provider>
        </div>
    );
}
