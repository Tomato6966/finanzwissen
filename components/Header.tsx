"use client";
import { Menu, Moon, Sun, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useContext } from "react";

import { Button } from "@/components/ui//button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { PageContext } from "../Context/PageContext";
import { useGetActiveTab } from "../utils/PathUtils";
import { NavigationMenu } from "./Navigation";
import LinkButton from "./ui/linkButton";

export default function Header() {
    const [activeTab] = useGetActiveTab();
    const { isDarkMode, toggleDarkMode } = useContext(PageContext)

    return <header className="bg-white dark:bg-slate-700 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <LinkButton href="/" className="flex justify-center items-center space-x-1 text-2xl" variant={!activeTab ? "secondary" : "ghost"}>
                    <Image
                        className="w-8 h-8 mt-1"
                        src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/finanzwissen.png`}
                        width={120}
                        height={120}
                        alt="logo"
                    />
                    FinanzWissen
                </LinkButton>

                <div className="flex items-center space-x-4">
                    {/* Desktop Navigation */}
                    <NavigationMenu />

                    <Button
                        variant="outline"
                        size="icon" onClick={() => toggleDarkMode()}
                        className="hidden md:flex bg-transparent float-end"
                    >
                        {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>

                </div>

                {/* Mobile Navigation */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="md:hidden bg-transparent">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80">
                        <div className="flex items-center mb-8">
                            <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
                            <span className="text-lg font-semibold">FinanzWissen</span>
                        </div>
                        <NavigationMenu mobile />
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    </header>;
}
