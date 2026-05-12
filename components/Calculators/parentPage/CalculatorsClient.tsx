'use client';

import { Banknote, BarChart2, ChevronDown, ChevronUp, Flame, Home, PiggyBank, ShieldCheck, TrendingDown, TrendingUp, TrendingUpDown, UsersRound, WandSparkles } from "lucide-react";
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
    const [tabListExpanded, setTabListExpanded] = useState(false);

    useEffect(() => {
        if (window.innerWidth >= 1024) setTabListExpanded(true);
    }, []);
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
        setTabListExpanded(false);
        router.push(`${pathname}#${value}`, { scroll: false });
    };

    return (
        <div className="p-3 sm:p-4 md:p-8 bg-background font-sans rounded-md">
            <div className="text-center mb-8 sm:mb-12 max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">Finanzrechner</h1>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                    Planen Sie Ihre finanzielle Zukunft mit unseren interaktiven Rechnern – vom Zinseszins bis zur Monte-Carlo-Simulation.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full max-w-6xl mx-auto">
                {/* Collapsed: active tab pill + expand button */}
                {!tabListExpanded && (
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="bg-primary/10 text-primary border border-primary/30 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2">
                            {(() => {
                                const Tab = TabListRecord[activeTab as keyof typeof TabListRecord];
                                return Tab ? <><Tab.icon className="h-4 w-4" /> {Tab.label}</> : null;
                            })()}
                        </div>
                        <button
                            onClick={() => setTabListExpanded(true)}
                            className="bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground rounded-lg px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1"
                            aria-label="Alle Rechner anzeigen"
                        >
                            <ChevronDown className="h-4 w-4" />
                        </button>
                    </div>
                )}
                {/* Expanded: grid of all tabs */}
                {tabListExpanded && (
                    <div className="mb-4">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <span className="text-sm font-medium text-muted-foreground">Rechner wählen</span>
                            <button
                                onClick={() => setTabListExpanded(false)}
                                className="bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground rounded-lg px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1"
                                aria-label="Rechnerauswahl einklappen"
                            >
                                <ChevronUp className="h-3.5 w-3.5" />
                            </button>
                        </div>
                        <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 w-full h-auto p-2 bg-muted">
                            {Object.entries(TabListRecord).map(([key, value]) => (
                                <TabsTrigger key={key} value={key} className="bg-primary/10 text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-3 py-2 justify-center text-center whitespace-normal leading-tight">
                                    <value.icon className="h-4 w-4 shrink-0" /> <span>{value.label}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
                )}

                <TabsContents hasSearchParam={hasSearchParam} initialCompoundData={initialCompoundData} initialWithdrawalData={initialWithdrawalData} initialRetirementData={initialRetirementData} initialFinancialGoalsData={initialFinancialGoalsData} initialMontecarloData={initialMontecarloData} initialBudgetAnalysisData={initialBudgetAnalysisData} initialETFInvestmentData={initialETFInvestmentData} initialFIRETimelineData={initialFIRETimelineData} initialFinanzWizardData={initialFinanzWizardData} initialSocietyComparisonData={initialSocietyComparisonData} initialEmergencyFundData={initialEmergencyFundData} initialPensionGapData={initialPensionGapData} initialInflationData={initialInflationData} initialLoanData={initialLoanData} initialBuyOrRentData={initialBuyOrRentData} />
            </Tabs>
        </div>
    );
}
