"use client";
import { BarChart3, Calculator, Home, TrendingUp } from "lucide-react";

import { useGetActiveTab } from "../utils/PathUtils";
import LinkButton from "./ui/linkButton";
import { Separator } from "./ui/separator";

interface NavigationMenuProps {
    mobile?: boolean;
};

const navItems = [
    { href: "/mindset", tab: "mindset", icon: TrendingUp, label: "Mindset, Möglichkeiten, Strategien" },
    { href: "/moneymanagement", tab: "moneymanagement", icon: Home, label: "Geldmanagement" },
    { href: "/tools", tab: "tools", icon: Calculator, label: "Tools & Ressourcen" },
    { href: "/calculators", tab: "calculators", icon: Calculator, label: "Rechner" },
    { href: "/community", tab: "community", icon: BarChart3, label: "Community" },
];

export const NavigationMenu = ({ mobile = false }: NavigationMenuProps) => {
    const [activeTab] = useGetActiveTab();
    if (!mobile) {
        return <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
                <LinkButton
                    key={item.tab}
                    href={item.href}
                    variant={activeTab === item.tab ? "default" : "ghost"}
                    className="justify-start"
                >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                </LinkButton>
            ))}
        </nav>
    }
    return <nav className="flex flex-col">
        {navItems.map((item, i) => (
            <div key={item.tab}>
                {i > 0 && <Separator className="my-1" />}
                <LinkButton
                    href={item.href}
                    variant={activeTab === item.tab ? "default" : "ghost"}
                    className="justify-start w-full"
                >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                </LinkButton>
            </div>
        ))}
    </nav>
}
