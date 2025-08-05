export interface CompoundInterestData {
    compoundForm: { principal: number; rate: number; time: number; contribution: number; interval: number; };
    useContribution: boolean;
    inflationRate: number;
    showRange: boolean;
    bestCasePercentage: number;
    worstCasePercentage: number;
    useAdvancedContribution: boolean;
    advancedContributionPeriods: { id: number; startYear: number; endYear: number; amount: number; }[];
    dynamicSavingsAdjustment: boolean;
    savingsIncreaseRate: number;
    showContributions: boolean;
    showNominal: boolean;
}

export interface FinancialGoalsData {
    goalForm: { principal: number; contribution: number; rate: number; };
    goals: { id: number; title: string; value: number; }[];
    showGoalLines: boolean;
}

export interface MonteCarloData {
    monteCarloForm: {
        principal: number;
        time: number;
        monthlyContribution: number;
        simulations: number;
        assets: { ticker: string; name: string; weight: number; drift: number; volatility: number; }[];
    };
}

export interface RetirementData {
    calculationType: CalculationType;
    formData: FormData;
}

export interface WithdrawalDataPoint {
    year: number;
    balance: number;
}

export type WithdrawalMode = 'fixed' | 'max';
export type MaxWithdrawalSettings = { strategy: "endless" | "years"; years: number };
export type WithDrawalForm = { principal: number; withdrawal: number; rate: number; tax: number };

export interface WithDrawalInitialData {
    initialData: { withdrawalMode: WithdrawalMode; maxWithdrawalSettings: MaxWithdrawalSettings; withdrawalForm: WithDrawalForm } | null;
}



export interface MonteCarloPathPoint {
    x: number;
    y: number;
}

export interface MonteCarloStats {
    median: number;
    p10: number;
    p90: number;
    worst: number;
    best: number;
}

export interface MonteCarloForm {
    principal: number;
    time: number;
    monthlyContribution: number;
    simulations: number;
    assets: { ticker: string; name: string; weight: number; drift: number; volatility: number; }[];
}

export interface MonteCarloResultMetrics {
    maxDrawdown: number;
    avgAnnualReturn: number;
    sharpeRatio: number;
}

export interface MonteCarloResults {
    paths: MonteCarloPathPoint[][];
    percentileMetrics: {
        p10: MonteCarloResultMetrics;
        p25: MonteCarloResultMetrics;
        p50: MonteCarloResultMetrics;
        p75: MonteCarloResultMetrics;
        p90: MonteCarloResultMetrics;
    } | null;
    overallStats: MonteCarloStats | null;
    totalContributions: number;
}


export type CalculationType =
    | "calculate_monthly_payout"
    | "calculate_retirement_age"
    | "calculate_savings_rate";

export type AnnuityType = "capital_consumption" | "endless";

export interface FormData {
    currentAge: number;
    currentCapital: number;
    yield: number;
    inflation: number;
    savingsRate: number;
    savingsInterval:
    | "daily"
    | "weekly"
    | "bi_weekly"
    | "monthly"
    | "quarterly"
    | "yearly";
    desiredRetirementAge: number;
    desiredNetPayout: number;
    taxRate: number;
    annuityType: AnnuityType;
    lifeExpectancy: number;
    dynamicSavingsAdjustment: boolean;
    savingsIncreaseRate: number;
    showNominalCapital: boolean;
    showContributions: boolean;
}

// Props for the component
export interface RetirementCalculatorProps {
    initialData: RetirementData | null;
}

export interface BudgetItem {
    id: string;
    name: string;
    value: string;
    type: 'income' | 'expense';
    isRemovable: boolean;
    color?: string;
}

export interface BudgetAnalysisData {
    budgetItems: BudgetItem[];
    visualizationType: 'bar' | 'sankey';
}
