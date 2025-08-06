"use client"

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TOOL_CATEGORIES } from "../../components/tools/ToolCategories";
import { ToolsTabsContentsWrapper } from "../../components/tools/ToolsTabs";

export default function ToolsPage() {
    const router = useRouter();
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState("portfolio-trackers");

    // Effect to read the URL hash on component mount and set the active tab
    useEffect(() => {
        if (typeof window !== "undefined") {
            const hash = window.location.hash.substring(1); // Remove '#'
            const foundCategory = TOOL_CATEGORIES.find(cat => cat.id === hash);
            if (foundCategory) {
                setActiveTab(hash);
            } else if (TOOL_CATEGORIES.length > 0) {
                window.location.hash = TOOL_CATEGORIES[0].id;
                setActiveTab(TOOL_CATEGORIES[0].id);
            }
        }
    }, []);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        router.push(`${pathname}#${value}`, { scroll: false });
    };

    return (
        <div className="space-y-12 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-foreground mb-4">Tools & Ressourcen</h1>
                <p className="text-xl text-gray-600 dark:text-muted-foreground max-w-3xl mx-auto">
                    Praktische Tools, Vorlagen und Rechner für Ihre finanzielle Planung. Alle Ressourcen sind kostenlos und sofort
                    einsatzbereit.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">

                <TabsList className="flex flex-wrap justify-center w-full gap-2 h-auto p-2 bg-slate-300 dark:bg-black">
                    {TOOL_CATEGORIES.map((category) => (
                        <TabsTrigger
                            key={category.id}
                            value={category.id}
                            className="flex-1 min-w-[20%] bg-primary/10 text-white data-[state=active]:bg-primary data-[state=active]:text-white dark:text-muted-foreground"
                        >
                            {category.icon && <category.icon className="w-4 h-4" />}
                            {category.title}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <ToolsTabsContentsWrapper categories={TOOL_CATEGORIES} />
            </Tabs>
        </div>
    );
}
