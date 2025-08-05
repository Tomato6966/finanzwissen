"use client";
import { BarChart3, Calculator, Home, Target, TrendingUp } from "lucide-react";

import { useGetActiveTab } from "../utils/PathUtils";
// import { Button } from "./ui/button"; // No longer directly using Button here
import LinkButton from "./ui/linkButton"; // Ensure this path is correct

interface NavigationMenuProps {
    mobile?: boolean;
};

export const NavigationMenu = ({ mobile = false }: NavigationMenuProps) => {
    const [activeTab] = useGetActiveTab();
    return <nav className={`${mobile ? "flex flex-col space-y-4" : "hidden md:flex space-x-8"}`}>
        <LinkButton
            href="/mindset"
            variant={activeTab === "mindset" ? "default" : "ghost"}
            className="justify-start"
        >
            <TrendingUp className="w-4 h-4 mr-2" />
            Mindset & Überblick
        </LinkButton>
        <LinkButton
            href="/household"
            variant={activeTab === "household" ? "default" : "ghost"}
            className="justify-start"
        >
            <Home className="w-4 h-4 mr-2" />
            Haushalt & Überblick
        </LinkButton>
        <LinkButton
            href="/goals"
            variant={activeTab === "goals" ? "default" : "ghost"}
            className="justify-start"
        >
            <Target className="w-4 h-4 mr-2" />
            Ziele & Prioritäten
        </LinkButton>
        <LinkButton
            href="/tools"
            variant={activeTab === "tools" ? "default" : "ghost"}
            className="justify-start"
        >
            <Calculator className="w-4 h-4 mr-2" />
            Tools
        </LinkButton>
        <LinkButton
            href="/budget-analysis"
            variant={activeTab === "budget-analysis" ? "default" : "ghost"}
            className="justify-start"
        >
            <BarChart3 className="w-4 h-4 mr-2" />
            Budgetanalyse
        </LinkButton>
        <LinkButton href="/calculators" variant={activeTab === "calculators" ? "default" : "ghost"} className="justify-start">
            <Calculator className="w-4 h-4 mr-2" />
            Rechner
        </LinkButton>
    </nav>
}
