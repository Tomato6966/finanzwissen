import {
	BudgetAnalysis, CompoundInterestCalculator, FinancialGoalsCalculator, MontecarloSimulation,
	RetirementCalculator, WithdrawalPlanCalculator
} from "@/Calculators/index";
import { TabsContent } from "@/components/ui/tabs";

import LoadingCard from "./LoadingCard";

import type {
	BudgetAnalysisData, CompoundInterestData, FinancialGoalsData, MonteCarloData, RetirementData,
	WithDrawalInitialData
} from "@/lib/calculator-types";

export function TabsContents({ hasSearchParam, initialCompoundData, initialWithdrawalData, initialRetirementData, initialFinancialGoalsData, initialMontecarloData, initialBudgetAnalysisData }: { hasSearchParam: boolean, initialCompoundData: CompoundInterestData | null, initialWithdrawalData: WithDrawalInitialData["initialData"] | null, initialRetirementData: RetirementData | null, initialFinancialGoalsData: FinancialGoalsData | null, initialMontecarloData: MonteCarloData | null, initialBudgetAnalysisData: BudgetAnalysisData | null }) {
    if(hasSearchParam) return <LoadingCard />;
    return (
        <>
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
            <TabsContent value="budget-analysis">
                <BudgetAnalysis initialData={initialBudgetAnalysisData} />
            </TabsContent>
        </>
    )
}
