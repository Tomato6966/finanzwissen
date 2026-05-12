"use client"

import { ChevronDown, ChevronUp } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TOOL_CATEGORIES } from "../../components/tools/ToolCategories";
import { ToolsTabsContentsWrapper } from "../../components/tools/ToolsTabs";

export default function ToolsPage() {
    const router = useRouter();
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState("portfolio-trackers");
    const [tabListExpanded, setTabListExpanded] = useState(false);

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
        setTabListExpanded(false);
        router.push(`${pathname}#${value}`, { scroll: false });
    };

    return (
        <div className="space-y-8 sm:space-y-12 p-3 sm:p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4">Tools & Ressourcen</h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                    Praktische Tools, Vorlagen und Rechner für Ihre finanzielle Planung. Alle Ressourcen sind kostenlos und sofort
                    einsatzbereit.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                {/* Collapsed: active tab pill + expand button */}
                {!tabListExpanded && (
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="bg-primary/10 text-primary border border-primary/30 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2">
                            {(() => {
                                const cat = TOOL_CATEGORIES.find(c => c.id === activeTab);
                                return cat ? <><cat.icon className="h-4 w-4" /> {cat.title}</> : null;
                            })()}
                        </div>
                        <button
                            onClick={() => setTabListExpanded(true)}
                            className="bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground rounded-lg px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1"
                            aria-label="Alle Kategorien anzeigen"
                        >
                            <ChevronDown className="h-4 w-4" />
                        </button>
                    </div>
                )}
                {/* Expanded: grid of all tabs */}
                {tabListExpanded && (
                    <div className="mb-4">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <span className="text-sm font-medium text-muted-foreground">Kategorie wählen</span>
                            <button
                                onClick={() => setTabListExpanded(false)}
                                className="bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground rounded-lg px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1"
                                aria-label="Kategorieauswahl einklappen"
                            >
                                <ChevronUp className="h-3.5 w-3.5" />
                            </button>
                        </div>
                        <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 w-full h-auto p-2 bg-muted">
                            {TOOL_CATEGORIES.map((category) => (
                                <TabsTrigger
                                    key={category.id}
                                    value={category.id}
                                    className="bg-primary/10 text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-3 py-2 justify-center text-center whitespace-normal leading-tight"
                                >
                                    {category.icon && <category.icon className="w-4 h-4 shrink-0" />}
                                    <span>{category.title}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
                )}

                <ToolsTabsContentsWrapper categories={TOOL_CATEGORIES} />
            </Tabs>
        </div>
    );
}
