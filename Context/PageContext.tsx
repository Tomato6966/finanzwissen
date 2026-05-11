"use client";

import { createContext, useEffect, useState } from "react";

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
    const [mounted, setMounted] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);


    // Handle hydration - only run after component mounts
    useEffect(() => {
        setMounted(true);

        // Read from localStorage after hydration
        try {
            const stored = localStorage.getItem("darkMode");
            if (stored !== null) {
                const parsed = JSON.parse(stored);
                setIsDarkMode(parsed);
            }
        } catch (error) {
            console.log("Error reading darkMode from localStorage:", error);
        }
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => !prev);
    };

    // Save to localStorage when isDarkMode changes
    useEffect(() => {
        if (mounted) {
            try {
                localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
            } catch (error) {
                console.log("Error saving darkMode to localStorage:", error);
            }
        }
    }, [isDarkMode, mounted]);

    // Apply dark mode class after hydration
    useEffect(() => {
        if (mounted) {
            document.documentElement.classList.toggle("dark", isDarkMode);
        }
    }, [isDarkMode, mounted]);

    // Always render with the same initial state to prevent hydration mismatch
    return (
        <PageContext.Provider value={{ isDarkMode: mounted ? isDarkMode : false, toggleDarkMode }}>
            {children}
        </PageContext.Provider>
    );
}
