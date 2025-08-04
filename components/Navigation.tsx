import { BarChart3, Calculator, Home, Target, TrendingUp } from "lucide-react";
import { useContext } from "react";

import { PageContext } from "../Context/PageContext";
import { Button } from "./ui/button";

interface NavigationMenuProps {
    mobile?: boolean;
};

export const NavigationMenu = ({ mobile = false }: NavigationMenuProps) => {
    const { activeTab, setActiveTab } = useContext(PageContext);
    return <nav className={`${mobile ? "flex flex-col space-y-4" : "hidden md:flex space-x-8"}`}>
        <Button
            variant={activeTab === "mindset" ? "default" : "ghost"}
            onClick={() => setActiveTab("mindset")}
            className="justify-start"
        >
            <TrendingUp className="w-4 h-4 mr-2" />
            Mindset & Überblick
        </Button>
        <Button
            variant={activeTab === "household" ? "default" : "ghost"}
            onClick={() => setActiveTab("household")}
            className="justify-start"
        >
            <Home className="w-4 h-4 mr-2" />
            Haushalt & Überblick
        </Button>
        <Button
            variant={activeTab === "goals" ? "default" : "ghost"}
            onClick={() => setActiveTab("goals")}
            className="justify-start"
        >
            <Target className="w-4 h-4 mr-2" />
            Ziele & Prioritäten
        </Button>
        <Button
            variant={activeTab === "tools" ? "default" : "ghost"}
            onClick={() => setActiveTab("tools")}
            className="justify-start"
        >
            <Calculator className="w-4 h-4 mr-2" />
            Tools
        </Button>
        <Button
            variant={activeTab === "budget-analysis" ? "default" : "ghost"}
            onClick={() => setActiveTab("budget-analysis")}
            className="justify-start"
        >
            <BarChart3 className="w-4 h-4 mr-2" />
            Budgetanalyse
        </Button>
        <Button
            variant={activeTab === "calculators" ? "default" : "ghost"}
            onClick={() => setActiveTab("calculators")}
            className="justify-start"
        >
            <Calculator className="w-4 h-4 mr-2" />
            Rechner
        </Button>
    </nav>
}
