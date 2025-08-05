"use client";
import { Calculator, Home, TrendingUp } from "lucide-react";

import { useGetActiveTab } from "../utils/PathUtils";
// import { Button } from "./ui/button"; // No longer directly using Button here
import LinkButton from "./ui/linkButton"; // Ensure this path is correct

interface NavigationMenuProps {
    mobile?: boolean;
};

export const NavigationMenu = ({ mobile = false }: NavigationMenuProps) => {
    const [activeTab] = useGetActiveTab();
    return <nav className={`${mobile ? "flex flex-col space-y-4" : "hidden md:flex space-x-4 flex-grow"}`}>
        <LinkButton
            href="/mindset"
            variant={activeTab === "mindset" ? "default" : "ghost"}
            className="justify-start"
        >
            <TrendingUp className="w-4 h-4 mr-2" />
            Mindset, Möglichkeiten, Strategien
        </LinkButton>
        <LinkButton
            href="/moneymanagement"
            variant={activeTab === "moneymanagement" ? "default" : "ghost"}
            className="justify-start"
        >
            <Home className="w-4 h-4 mr-2" />
            Geldmanagement
        </LinkButton>
        <LinkButton
            href="/tools"
            variant={activeTab === "tools" ? "default" : "ghost"}
            className="justify-start"
        >
            <Calculator className="w-4 h-4 mr-2" />
            Tools & Ressourcen
        </LinkButton>
        <LinkButton href="/calculators" variant={activeTab === "calculators" ? "default" : "ghost"} className="justify-start">
            <Calculator className="w-4 h-4 mr-2" />
            Rechner
        </LinkButton>
    </nav>
}
