'use client';

import {
  Banknote,
  BarChart2,
  ChevronDown,
  ChevronUp,
  Flame,
  Home,
  PiggyBank,
  Search,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  TrendingUpDown,
  UsersRound,
  WandSparkles,
} from "lucide-react";
import LZString from "lz-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TabsContents } from "./CaluclatorsTabs";
import { CalculatorBanner } from "../CalculatorBanner";

import type {
  BudgetAnalysisData,
  BuyOrRentData,
  CompoundInterestData,
  EmergencyFundData,
  ETFInvestmentData,
  FinancialGoalsData,
  FinanzWizardData,
  FIRETimelineData,
  InflationData,
  LoanData,
  MonteCarloData,
  PensionGapData,
  RetirementData,
  SocietyComparisonData,
  WithDrawalInitialData,
} from "@/lib/calculator-types";

interface SharedCalculatorState {
  type:
    | 'compound'
    | 'withdrawal'
    | 'retirement'
    | 'goals'
    | 'montecarlo'
    | 'budget-analysis'
    | 'etf-investment'
    | 'fire-timeline'
    | 'finanzwizard'
    | 'society-comparison'
    | 'emergency-fund'
    | 'pension-gap'
    | 'inflation'
    | 'loan'
    | 'buy-or-rent';
  data: unknown;
}

interface CalculatorTabItem {
  label: string;
  category: string;
  icon: React.ElementType;
  badge?: string;
}

const TabListRecord: Record<string, CalculatorTabItem> = {
  compound: {
    label: "Zinseszins",
    category: "Vermögen",
    icon: TrendingUp,
    badge: "Basis",
  },
  "etf-investment": {
    label: "ETF Investment",
    category: "Vermögen",
    icon: TrendingUp,
    badge: "Populär",
  },
  goals: {
    label: "Sparziele",
    category: "Vermögen",
    icon: PiggyBank,
  },
  "emergency-fund": {
    label: "Notgroschen",
    category: "Vermögen",
    icon: ShieldCheck,
  },
  retirement: {
    label: "Vorsorgerechner",
    category: "Rente & FIRE",
    icon: TrendingUpDown,
    badge: "Empfohlen",
  },
  withdrawal: {
    label: "Entnahmeplan",
    category: "Rente & FIRE",
    icon: TrendingDown,
  },
  "fire-timeline": {
    label: "FIRE Timeline",
    category: "Rente & FIRE",
    icon: Flame,
    badge: "Freiheit",
  },
  "pension-gap": {
    label: "Rentenlücke",
    category: "Rente & FIRE",
    icon: TrendingDown,
  },
  "budget-analysis": {
    label: "Budgetanalyse",
    category: "Alltag & Haushalt",
    icon: PiggyBank,
  },
  inflation: {
    label: "Inflation & Kaufkraft",
    category: "Alltag & Haushalt",
    icon: TrendingDown,
  },
  "society-comparison": {
    label: "Vergleich / DACH",
    category: "Alltag & Haushalt",
    icon: UsersRound,
  },
  loan: {
    label: "Kredit & Tilgung",
    category: "Immobilien & Kredit",
    icon: Banknote,
  },
  "buy-or-rent": {
    label: "Kaufen vs. Mieten",
    category: "Immobilien & Kredit",
    icon: Home,
    badge: "Entscheidung",
  },
  montecarlo: {
    label: "Monte Carlo",
    category: "Simulationen",
    icon: BarChart2,
    badge: "Stochastik",
  },
  finanzwizard: {
    label: "FinanzWizard",
    category: "Simulationen",
    icon: WandSparkles,
    badge: "KI-Modus",
  },
};

const CATEGORIES = [
  "Alle",
  "Vermögen",
  "Rente & FIRE",
  "Alltag & Haushalt",
  "Immobilien & Kredit",
  "Simulationen",
] as const;

export default function CalculatorsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasSearchParam = !!searchParams.get('share');

  const [activeTab, setActiveTab] = useState("retirement");
  const [selectedCategory, setSelectedCategory] = useState<string>("Alle");
  const [searchFilter, setSearchFilter] = useState<string>("");

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

  const [shareError, setShareError] = useState<string | null>(null);

  // Sync hash with active tab on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.substring(1);
      if (hash && hash in TabListRecord) {
        setActiveTab(hash);
      }
    }
  }, []);

  // Handle share state without infinite router reload loop
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check search params directly or via window.location.search to ensure compatibility with static exports
    const urlParams = new URLSearchParams(window.location.search);
    const encodedState = urlParams.get('share') || searchParams.get('share');

    if (encodedState) {
      try {
        const decompressedJson = LZString.decompressFromEncodedURIComponent(encodedState);
        if (decompressedJson) {
          const sharedState: SharedCalculatorState = JSON.parse(decompressedJson);
          const { type, data } = sharedState;
          if (type && type in TabListRecord) {
            setActiveTab(type);
          }

          switch (type) {
            case 'compound':
              setInitialCompoundData(data as CompoundInterestData);
              break;
            case 'goals':
              setInitialFinancialGoalsData(data as FinancialGoalsData);
              break;
            case 'withdrawal':
              setInitialWithdrawalData(data as WithDrawalInitialData["initialData"]);
              break;
            case 'retirement':
              setInitialRetirementData(data as RetirementData);
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

          // Clean URL without triggering Next.js router re-render loop on GitHub Pages
          const cleanUrl = `${window.location.pathname}#${type}`;
          window.history.replaceState(null, '', cleanUrl);
        } else {
          setShareError("Der Freigabelink konnte nicht dekomprimiert werden. Es wurden die Standardwerte geladen.");
          window.history.replaceState(null, '', window.location.pathname);
        }
      } catch (e) {
        console.error("Failed to decode or parse shared state from URL:", e);
        setShareError("Der Freigabelink ist fehlerhaft oder abgelaufen. Es wurden die Standardwerte geladen.");
        const cleanUrl = window.location.pathname;
        window.history.replaceState(null, '', cleanUrl);
      }
    }
  }, []); // Run once on mount

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, '', `${window.location.pathname}#${value}`);
    }
  };

  const filteredCalculators = useMemo(() => {
    return Object.entries(TabListRecord).filter(([key, item]) => {
      const matchesCategory =
        selectedCategory === "Alle" || item.category === selectedCategory;
      const matchesSearch =
        searchFilter.trim() === "" ||
        item.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.category.toLowerCase().includes(searchFilter.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchFilter]);

  const activeMeta = TabListRecord[activeTab as keyof typeof TabListRecord];

  return (
    <div className="space-y-8 w-full py-2 sm:py-6">
      {/* HEADER SECTION */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          <TrendingUpDown className="h-3.5 w-3.5" />
          <span>15 Interaktive Finanzmodelle</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Finanzrechner Hub
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Kombiniere wissenschaftliche Simulationen, Zinseszins, Steuerberechnungen und Altersvorsorge.
          Wähle dein Modell für transparente Zahlen ohne Werbefrust.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        {/* CALCULATOR HUB SELECTOR BAR */}
        <div className="rounded-2xl border border-border/70 bg-card/80 backdrop-blur-md p-4 sm:p-5 shadow-sm space-y-4">
          {/* TOP CONTROLS: Category Pills + Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "bg-muted/70 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-56 shrink-0">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechner filtern..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-border/70 bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* CALCULATOR GRID BUTTONS */}
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 w-full h-auto p-0 bg-transparent">
            {filteredCalculators.map(([key, item]) => {
              const isActive = activeTab === key;
              return (
                <TabsTrigger
                  key={key}
                  value={key}
                  className={`relative flex items-center justify-start gap-2.5 rounded-xl border p-2.5 text-left text-xs transition-all ${
                    isActive
                      ? "border-primary/50 bg-primary/10 text-primary font-semibold shadow-xs"
                      : "border-border/50 bg-card/60 hover:bg-accent/60 hover:border-border text-foreground"
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1 truncate">
                    <span className="block truncate font-medium">{item.label}</span>
                    <span className="block text-[10px] text-muted-foreground truncate">
                      {item.category}
                    </span>
                  </div>
                  {item.badge && (
                    <span className="absolute top-1 right-1 text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-md bg-primary/15 text-primary">
                      {item.badge}
                    </span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* ACTIVE CALCULATOR CONTENT */}
        <div className="pt-2 space-y-4">
          {shareError && (
            <CalculatorBanner
              type="warning"
              title="Freigabelink Hinweis"
              message={shareError}
              onDismiss={() => setShareError(null)}
            />
          )}
          <TabsContents
            hasSearchParam={hasSearchParam}
            initialCompoundData={initialCompoundData}
            initialWithdrawalData={initialWithdrawalData}
            initialRetirementData={initialRetirementData}
            initialFinancialGoalsData={initialFinancialGoalsData}
            initialMontecarloData={initialMontecarloData}
            initialBudgetAnalysisData={initialBudgetAnalysisData}
            initialETFInvestmentData={initialETFInvestmentData}
            initialFIRETimelineData={initialFIRETimelineData}
            initialFinanzWizardData={initialFinanzWizardData}
            initialSocietyComparisonData={initialSocietyComparisonData}
            initialEmergencyFundData={initialEmergencyFundData}
            initialPensionGapData={initialPensionGapData}
            initialInflationData={initialInflationData}
            initialLoanData={initialLoanData}
            initialBuyOrRentData={initialBuyOrRentData}
          />
        </div>
      </Tabs>
    </div>
  );
}
