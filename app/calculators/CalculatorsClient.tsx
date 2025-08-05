'use client';

import { BarChart2, PiggyBank, TrendingDown, TrendingUp, TrendingUpDown } from "lucide-react";
import LZString from "lz-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import {
	CompoundInterestCalculator, FinancialGoalsCalculator, MontecarloSimulation,
	RetirementCalculator, WithdrawalPlanCalculator
} from "@/components/Calculators";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import LoadingCard from "./LoadingCard";

import type {
	CompoundInterestData, FinancialGoalsData, MonteCarloData, RetirementData,
    WithDrawalInitialData,
} from "@/lib/calculator-types";

interface SharedCalculatorState {
    type: 'compound' | 'withdrawal' | 'retirement' | 'goals' | 'montecarlo';
    data: unknown;
}

export default function CalculatorsClient() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const hasSearchParam = !!searchParams.get('share');

    const [activeTab, setActiveTab] = useState("retirement");
    const [initialCompoundData, setInitialCompoundData] = useState<CompoundInterestData | null>(null);
    const [initialFinancialGoalsData, setInitialFinancialGoalsData] = useState<FinancialGoalsData | null>(null);
    const [initialWithdrawalData, setInitialWithdrawalData] = useState<WithDrawalInitialData["initialData"] | null>(null);
    const [initialRetirementData, setInitialRetirementData] = useState<RetirementData | null>(null);
    const [initialMontecarloData, setInitialMontecarloData] = useState<MonteCarloData | null>(null);

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.substring(1);
            const validTabs = ["compound", "withdrawal", "retirement", "goals", "montecarlo"];
            if (validTabs.includes(hash)) {
                setActiveTab(hash);
            }
        };

        handleHashChange();

        if (!window.location.hash) {
            router.replace(`${pathname}#${activeTab}`, { scroll: false });
        }

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, router]);
    useEffect(() => {
        const shareParam = searchParams.get('share');
        if (shareParam) {
            console.log("shareparam extracted")
            try {
                const decompressedJson = LZString.decompressFromEncodedURIComponent(shareParam);
                console.log("decompressedjson?", !!decompressedJson)
                if (decompressedJson) {
                    const sharedState: SharedCalculatorState = JSON.parse(decompressedJson);
                    const { type, data } = sharedState;
                    console.log("type", type)
                    setActiveTab(type);

                    switch (type) {
                        case 'compound':
                            setInitialCompoundData(data as CompoundInterestData);
                            break;
                        case 'withdrawal':
                            setInitialWithdrawalData(data as WithDrawalInitialData["initialData"]);
                            break;
                        case 'retirement':
                            setInitialRetirementData(data as RetirementData);
                            break;
                        case 'goals':
                            setInitialFinancialGoalsData(data as FinancialGoalsData);
                            break;
                        case 'montecarlo':
                            setInitialMontecarloData(data as MonteCarloData);
                            break;
                        default:
                            console.warn("Unknown calculator type in shared state:", type);
                    }

                    router.replace(`${pathname}#${type}`, { scroll: false });
                }
            } catch (e) {
                console.error("Failed to decode or parse shared state from URL:", e);
                router.replace(pathname, { scroll: false });
            }
        }
    }, [searchParams, pathname, router]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        router.push(`${pathname}#${value}`, { scroll: false });
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 font-sans rounded-md dark:bg-gray-800">
            <div className="text-center mb-12 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-foreground mb-4">Finanzrechner</h1>
                <p className="text-lg text-gray-600 dark:text-muted-foreground">
                    Planen Sie Ihre finanzielle Zukunft mit unseren interaktiven Rechnern – vom Zinseszins bis zur Monte-Carlo-Simulation.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full max-w-6xl mx-auto">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 h-auto p-2 bg-slate-300 dark:bg-black">
                    <TabsTrigger value="compound" className={activeTab === "compound" ? "bg-primary text-primary-foreground" : "bg-transparent text-foreground dark:text-muted-foreground"}><TrendingUp /> Zinseszins</TabsTrigger>
                    <TabsTrigger value="withdrawal" className={activeTab === "withdrawal" ? "bg-primary text-primary-foreground" : "bg-transparent text-foreground dark:text-muted-foreground"}><TrendingDown /> Entnahmeplan</TabsTrigger>
                    <TabsTrigger value="retirement" className={activeTab === "retirement" ? "bg-primary text-primary-foreground" : "bg-transparent text-foreground dark:text-muted-foreground"}><TrendingUpDown/>  Vorsorge</TabsTrigger>
                    <TabsTrigger value="goals" className={activeTab === "goals" ? "bg-primary text-primary-foreground" : "bg-transparent text-foreground dark:text-muted-foreground"}><PiggyBank /> Sparziele</TabsTrigger>
                    <TabsTrigger value="montecarlo" className={activeTab === "montecarlo" ? "bg-primary text-primary-foreground" : "bg-transparent text-foreground dark:text-muted-foreground"}><BarChart2 /> Monte Carlo</TabsTrigger>
                </TabsList>

                {
                    hasSearchParam
                    ? <LoadingCard />
                    : (<>
                        <TabsContent value="compound">
                            <CompoundInterestCalculator initialData={initialCompoundData} />
                        </TabsContent>
                        <TabsContent value="withdrawal">
                            <WithdrawalPlanCalculator initialData={initialWithdrawalData} />
                        </TabsContent>
                        <TabsContent value="retirement">
                            <RetirementCalculator initialData={initialRetirementData} />
                        </TabsContent>
                        <TabsContent value="goals">
                            <FinancialGoalsCalculator initialData={initialFinancialGoalsData} />
                        </TabsContent>
                        <TabsContent value="montecarlo">
                            <MontecarloSimulation initialData={initialMontecarloData} />
                        </TabsContent>
                    </>)
                }

            </Tabs>
        </div>
    );
}
