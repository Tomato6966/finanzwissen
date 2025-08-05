"use client";

import { createContext, useEffect, useState } from "react";

export type ActiveTabKeys = "home" | "goals" | "household" | "mindset" | "calculators" | "tools" | "budget-analysis";

export interface PageContext {
    isDarkMode: boolean;
    setIsDarkMode: (isDarkMode: boolean) => void;
};

export const PageContext = createContext<PageContext>({
    isDarkMode: false,
    setIsDarkMode: () => {},
});

export default function PageRouter({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage?.getItem("isDarkMode") || null;
        if (stored !== null) {
            setIsDarkMode(stored === "true");
        }
    }, []);

    // Save to localStorage when isDarkMode changes
    useEffect(() => {
        localStorage?.setItem("isDarkMode", String(isDarkMode));
    }, [isDarkMode]);

    return (
        <div
            className={`min-h-screen transition-colors duration-300 ${
                isDarkMode
                    ? "dark bg-gray-900"
                    : "bg-gradient-to-br from-blue-50 to-indigo-100"
            }`}
        >
            <PageContext.Provider value={{ isDarkMode, setIsDarkMode }}>
                {children}
            </PageContext.Provider>
        </div>
    );
}
