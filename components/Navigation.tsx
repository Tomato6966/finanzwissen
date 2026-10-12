"use client";
import { BarChart3, Calculator, CandlestickChart, Home, Sparkles, TrendingUp, Wallet } from "lucide-react";

import { useGetActiveTab } from "../utils/PathUtils";
import LinkButton from "./ui/linkButton";
import { Separator } from "./ui/separator";

interface NavigationMenuProps {
    mobile?: boolean;
}

const navItems = [
    { href: "/mindset", tab: "mindset", icon: TrendingUp, label: "Strategien", badge: null },
    { href: "/moneymanagement", tab: "moneymanagement", icon: Wallet, label: "Budget", badge: null },
    { href: "/tools", tab: "tools", icon: Calculator, label: "Tools", badge: null },
    { href: "/calculators", tab: "calculators", icon: Calculator, label: "Rechner", badge: null },
    { href: "/trading", tab: "trading", icon: CandlestickChart, label: "Trading", badge: "Neu" },
    { href: "/community", tab: "community", icon: BarChart3, label: "Community", badge: null },
];

export const NavigationMenu = ({ mobile = false }: NavigationMenuProps) => {
    const [activeTab] = useGetActiveTab();
    if (!mobile) {
        return (
            <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                    const isActive = activeTab === item.tab;
                    return (
                        <LinkButton
                            key={item.tab}
                            href={item.href}
                            variant={isActive ? "default" : "ghost"}
                            className="relative text-sm px-3 py-1.5 font-medium transition-all"
                        >
                            <item.icon className="w-4 h-4 mr-1.5 opacity-80" />
                            <span>{item.label}</span>
                            {item.badge && (
                                <span className="ml-1.5 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                                    {item.badge}
                                </span>
                            )}
                        </LinkButton>
                    );
                })}
            </nav>
        );
    }
    return (
        <nav className="flex flex-col gap-1 py-2">
            {navItems.map((item, i) => {
                const isActive = activeTab === item.tab;
                return (
                    <div key={item.tab}>
                        {i > 0 && <Separator className="my-1 opacity-50" />}
                        <LinkButton
                            href={item.href}
                            variant={isActive ? "default" : "ghost"}
                            className="justify-between w-full text-base py-3"
                        >
                            <span className="flex items-center">
                                <item.icon className="w-5 h-5 mr-3 opacity-80" />
                                {item.label}
                            </span>
                            {item.badge && (
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                                    {item.badge}
                                </span>
                            )}
                        </LinkButton>
                    </div>
                );
            })}
        </nav>
    );
};
