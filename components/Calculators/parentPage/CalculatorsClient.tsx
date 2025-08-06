'use client';

import { BarChart2, PiggyBank, TrendingDown, TrendingUp, TrendingUpDown } from "lucide-react";
import LZString from "lz-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TabsContents } from "./CaluclatorsTabs";

import type {
    BudgetAnalysisData, CompoundInterestData, FinancialGoalsData, MonteCarloData, RetirementData,
    WithDrawalInitialData,
} from "@/lib/calculator-types";
interface SharedCalculatorState {
    type: 'compound' | 'withdrawal' | 'retirement' | 'goals' | 'montecarlo' | 'budget-analysis';
    data: unknown;
}

const TabListRecord = {
    compound: {
        label: "Zinseszins",
        icon: TrendingUp,
    },
    withdrawal: {
        label: "Entnahmeplan",
        icon: TrendingDown,
    },
    retirement: {
        label: "Vorsorge",
        icon: TrendingUpDown,
    },
    goals: {
        label: "Sparziele",
        icon: PiggyBank,
    },
    montecarlo: {
        label: "Monte Carlo",
        icon: BarChart2,
    },
    "budget-analysis": {
        label: "Budgetanalyse",
        icon: PiggyBank,
    },
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
    const [initialBudgetAnalysisData, setInitialBudgetAnalysisData] = useState<BudgetAnalysisData | null>(null);

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.substring(1);
            const validTabs = Object.keys(TabListRecord);
            if (validTabs.includes(hash)) setActiveTab(hash);
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
            try {
                const decompressedJson = LZString.decompressFromEncodedURIComponent(shareParam);
                if (decompressedJson) {
                    const sharedState: SharedCalculatorState = JSON.parse(decompressedJson);
                    const { type, data } = sharedState;
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
                        case 'budget-analysis':
                            setInitialBudgetAnalysisData(data as BudgetAnalysisData);
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
                <TabsList className="flex flex-wrap justify-center w-full gap-2 h-auto p-2 bg-slate-300 dark:bg-black">
                    {Object.entries(TabListRecord).map(([key, value]) => (
                        <TabsTrigger key={key} value={key} className="flex-1 min-w-[20%] bg-primary/10 text-white data-[state=active]:bg-primary data-[state=active]:text-white dark:text-muted-foreground">
                            <value.icon /> {value.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContents hasSearchParam={hasSearchParam} initialCompoundData={initialCompoundData} initialWithdrawalData={initialWithdrawalData} initialRetirementData={initialRetirementData} initialFinancialGoalsData={initialFinancialGoalsData} initialMontecarloData={initialMontecarloData} initialBudgetAnalysisData={initialBudgetAnalysisData} />
            </Tabs>
        </div>
    );
}
