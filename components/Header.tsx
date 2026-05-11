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

    return <header className="bg-background/80 backdrop-blur-md border-b border-border/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <LinkButton href="/" className="flex items-center gap-2 text-2xl shrink-0" variant={!activeTab ? "secondary" : "ghost"}>
                    <Image
                        className="w-8 h-8"
                        src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/finanzwissen.png`}
                        width={120}
                        height={120}
                        alt="logo"
                    />
                    <span className="hidden sm:inline">FinanzWissen</span>
                </LinkButton>

                <div className="flex items-center gap-2">
                    {/* Desktop Navigation */}
                    <NavigationMenu />

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleDarkMode()}
                        className="hidden md:flex shrink-0"
                    >
                        {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>
                </div>

                {/* Mobile Navigation */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="md:hidden bg-transparent shrink-0">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80">
                        <div className="flex items-center mb-8">
                            <TrendingUp className="w-6 h-6 text-primary mr-2" />
                            <span className="text-lg font-semibold">FinanzWissen</span>
                        </div>
                        <NavigationMenu mobile />
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    </header>;
}
