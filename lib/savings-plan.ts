export interface AdvancedSavingsPeriod {
    id: number;
    startYear: number;
    endYear: number;
    monthlyAmount: number;
}

export const defaultAdvancedSavingsPeriods = (endYear = 30): AdvancedSavingsPeriod[] => [
    { id: 1, startYear: 0, endYear: Math.max(0, endYear), monthlyAmount: 500 },
];

export const getAnnualSavingsForYear = ({
    yearIndex,
    baseRate,
    interval,
    useAdvancedPlan,
    advancedPeriods,
    dynamicSavingsAdjustment = false,
    savingsIncreaseRate = 0,
}: {
    yearIndex: number;
    baseRate: number;
    interval: "daily" | "weekly" | "bi_weekly" | "monthly" | "quarterly" | "yearly";
    useAdvancedPlan?: boolean;
    advancedPeriods?: AdvancedSavingsPeriod[];
    dynamicSavingsAdjustment?: boolean;
    savingsIncreaseRate?: number;
}) => {
    if (useAdvancedPlan && advancedPeriods?.length) {
        const period = advancedPeriods.find((item) => yearIndex >= item.startYear && yearIndex <= item.endYear);
        return Math.max(0, period?.monthlyAmount ?? 0) * 12;
    }

    const intervalMultiplier = {
        daily: 365,
        weekly: 52,
        bi_weekly: 26,
        monthly: 12,
        quarterly: 4,
        yearly: 1,
    }[interval];

    const adjustedRate = dynamicSavingsAdjustment && savingsIncreaseRate > 0
        ? baseRate * Math.pow(1 + savingsIncreaseRate / 100, Math.max(0, yearIndex))
        : baseRate;

    return Math.max(0, adjustedRate) * intervalMultiplier;
};
