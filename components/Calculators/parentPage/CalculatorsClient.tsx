'use client';

import { Banknote, BarChart2, Flame, Home, PiggyBank, ShieldCheck, TrendingDown, TrendingUp, TrendingUpDown, UsersRound, WandSparkles } from "lucide-react";
import LZString from "lz-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TabsContents } from "./CaluclatorsTabs";

import type {
    BudgetAnalysisData, CompoundInterestData, FinancialGoalsData, MonteCarloData, RetirementData,
    WithDrawalInitialData, ETFInvestmentData, FIRETimelineData, FinanzWizardData, SocietyComparisonData,
    EmergencyFundData, PensionGapData, InflationData, LoanData, BuyOrRentData
} from "@/lib/calculator-types";
interface SharedCalculatorState {
    type: 'compound' | 'withdrawal' | 'retirement' | 'goals' | 'montecarlo' | 'budget-analysis' | 'etf-investment' | 'fire-timeline' | 'finanzwizard' | 'society-comparison' | 'emergency-fund' | 'pension-gap' | 'inflation' | 'loan' | 'buy-or-rent';
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
    "etf-investment": {
        label: "ETF Investment",
        icon: TrendingUp,
    },
    "fire-timeline": {
        label: "FIRE Timeline",
        icon: Flame,
    },
    finanzwizard: {
        label: "FinanzWizard",
        icon: WandSparkles,
    },
    "society-comparison": {
        label: "Vergleich",
        icon: UsersRound,
    },
    "emergency-fund": {
        label: "Notgroschen",
        icon: ShieldCheck,
    },
    "pension-gap": {
        label: "Rentenlücke",
        icon: TrendingDown,
    },
    "inflation": {
        label: "Inflation",
        icon: TrendingDown,
    },
    "loan": {
        label: "Kredit",
        icon: Banknote,
    },
    "buy-or-rent": {
        label: "Kaufen / Mieten",
        icon: Home,
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
    const [initialETFInvestmentData, setInitialETFInvestmentData] = useState<ETFInvestmentData | null>(null);
    const [initialFIRETimelineData, setInitialFIRETimelineData] = useState<FIRETimelineData | null>(null);
    const [initialFinanzWizardData, setInitialFinanzWizardData] = useState<FinanzWizardData | null>(null);
    const [initialSocietyComparisonData, setInitialSocietyComparisonData] = useState<SocietyComparisonData | null>(null);
    const [initialEmergencyFundData, setInitialEmergencyFundData] = useState<EmergencyFundData | null>(null);
    const [initialPensionGapData, setInitialPensionGapData] = useState<PensionGapData | null>(null);
    const [initialInflationData, setInitialInflationData] = useState<InflationData | null>(null);
    const [initialLoanData, setInitialLoanData] = useState<LoanData | null>(null);
    const [initialBuyOrRentData, setInitialBuyOrRentData] = useState<BuyOrRentData | null>(null);

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
                        case 'etf-investment':
                            setInitialETFInvestmentData(data as ETFInvestmentData);
                            break;
                        case 'fire-timeline':
                            setInitialFIRETimelineData(data as FIRETimelineData);
                            break;
                        case 'finanzwizard':
                            setInitialFinanzWizardData(data as FinanzWizardData);
                            break;
                        case 'society-comparison':
                            setInitialSocietyComparisonData(data as SocietyComparisonData);
                            break;
                        case 'emergency-fund':
                            setInitialEmergencyFundData(data as EmergencyFundData);
                            break;
                        case 'pension-gap':
                            setInitialPensionGapData(data as PensionGapData);
                            break;
                        case 'inflation':
                            setInitialInflationData(data as InflationData);
                            break;
                        case 'loan':
                            setInitialLoanData(data as LoanData);
                            break;
                        case 'buy-or-rent':
                            setInitialBuyOrRentData(data as BuyOrRentData);
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
        <div className="p-4 md:p-8 bg-background font-sans rounded-md">
            <div className="text-center mb-12 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Finanzrechner</h1>
                <p className="text-lg text-muted-foreground">
                    Planen Sie Ihre finanzielle Zukunft mit unseren interaktiven Rechnern – vom Zinseszins bis zur Monte-Carlo-Simulation.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full max-w-6xl mx-auto">
                <TabsList className="flex flex-wrap justify-center w-full gap-2 h-auto p-2 bg-muted">
                    {Object.entries(TabListRecord).map(([key, value]) => (
                        <TabsTrigger key={key} value={key} className="flex-1 min-w-[20%] bg-primary/10 text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            <value.icon /> {value.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContents hasSearchParam={hasSearchParam} initialCompoundData={initialCompoundData} initialWithdrawalData={initialWithdrawalData} initialRetirementData={initialRetirementData} initialFinancialGoalsData={initialFinancialGoalsData} initialMontecarloData={initialMontecarloData} initialBudgetAnalysisData={initialBudgetAnalysisData} initialETFInvestmentData={initialETFInvestmentData} initialFIRETimelineData={initialFIRETimelineData} initialFinanzWizardData={initialFinanzWizardData} initialSocietyComparisonData={initialSocietyComparisonData} initialEmergencyFundData={initialEmergencyFundData} initialPensionGapData={initialPensionGapData} initialInflationData={initialInflationData} initialLoanData={initialLoanData} initialBuyOrRentData={initialBuyOrRentData} />
            </Tabs>
        </div>
    );
}
