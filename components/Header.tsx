"use client";
import { Menu, Moon, Sun, X } from "lucide-react";
import Image from "next/image";
import { useContext } from "react";

import { Button } from "@/components/ui//button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { PageContext } from "../Context/PageContext";
import { useGetActiveTab } from "../utils/PathUtils";
import { NavigationMenu } from "./Navigation";
import LinkButton from "./ui/linkButton";

export default function Header() {
    const [activeTab] = useGetActiveTab();
    const { isDarkMode, toggleDarkMode } = useContext(PageContext)

    return <header className="bg-background/80 backdrop-blur-md border-b border-border/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 md:h-16">
                <LinkButton href="/" className="flex items-center gap-2 text-xl sm:text-2xl shrink-0" variant={!activeTab ? "secondary" : "ghost"}>
                    <Image
                        className="w-7 h-7 sm:w-8 sm:h-8"
                        src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/finanzwissen.png`}
                        width={120}
                        height={120}
                        alt="logo"
                    />
                    <span className="hidden sm:inline">FinanzWissen</span>
                </LinkButton>

                <div className="flex items-center gap-1 sm:gap-2">
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
                        <Button variant="outline" size="icon" className="md:hidden bg-transparent shrink-0 min-h-[44px] min-w-[44px]">
                            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80 [&>button:last-child]:hidden flex flex-col">
                        <SheetTitle className="sr-only">Navigation</SheetTitle>
                        <div className="flex items-center gap-3 px-4 pt-3 pb-4 border-b border-border/60">
                            <Image
                                className="w-8 h-8"
                                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/finanzwissen.png`}
                                width={120}
                                height={120}
                                alt="logo"
                            />
                            <span className="flex-1 text-lg font-semibold">FinanzWissen</span>
                            <SheetClose className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer">
                                <X className="h-5 w-5" />
                            </SheetClose>
                        </div>
                        <div className="flex-1 overflow-y-auto px-2">
                            <NavigationMenu mobile />
                        </div>
                        <div className="border-t border-border/60 pt-4 px-4 pb-2">
                            <button
                                onClick={() => toggleDarkMode()}
                                className="flex items-center justify-center gap-2 w-full rounded-lg bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground px-4 py-2.5 text-sm font-medium transition-colors"
                            >
                                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                {isDarkMode ? "Helles Design" : "Dunkles Design"}
                            </button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    </header>;
}
