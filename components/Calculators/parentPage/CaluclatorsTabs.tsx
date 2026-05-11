import {
	BudgetAnalysis, CompoundInterestCalculator, FinancialGoalsCalculator, MontecarloSimulation,
	RetirementCalculator, WithdrawalPlanCalculator,
	ETFInvestmentCalculator, FIRETimelineCalculator, FinanzWizardCalculator, SocietyComparisonCalculator,
	EmergencyFundCalculator, PensionGapCalculator, InflationCalculator, LoanCalculator, BuyOrRentCalculator
} from "@/Calculators/index";
import { TabsContent } from "@/components/ui/tabs";

import LoadingCard from "./LoadingCard";

import type {
	BudgetAnalysisData, CompoundInterestData, FinancialGoalsData, MonteCarloData, RetirementData,
	WithDrawalInitialData,
	ETFInvestmentData, FIRETimelineData, FinanzWizardData, SocietyComparisonData,
	EmergencyFundData, PensionGapData, InflationData, LoanData, BuyOrRentData
} from "@/lib/calculator-types";

export function TabsContents({ hasSearchParam, initialCompoundData, initialWithdrawalData, initialRetirementData, initialFinancialGoalsData, initialMontecarloData, initialBudgetAnalysisData, initialETFInvestmentData, initialFIRETimelineData, initialFinanzWizardData, initialSocietyComparisonData, initialEmergencyFundData, initialPensionGapData, initialInflationData, initialLoanData, initialBuyOrRentData }: { hasSearchParam: boolean, initialCompoundData: CompoundInterestData | null, initialWithdrawalData: WithDrawalInitialData["initialData"] | null, initialRetirementData: RetirementData | null, initialFinancialGoalsData: FinancialGoalsData | null, initialMontecarloData: MonteCarloData | null, initialBudgetAnalysisData: BudgetAnalysisData | null, initialETFInvestmentData: ETFInvestmentData | null, initialFIRETimelineData: FIRETimelineData | null, initialFinanzWizardData: FinanzWizardData | null, initialSocietyComparisonData: SocietyComparisonData | null, initialEmergencyFundData: EmergencyFundData | null, initialPensionGapData: PensionGapData | null, initialInflationData: InflationData | null, initialLoanData: LoanData | null, initialBuyOrRentData: BuyOrRentData | null }) {
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
            <TabsContent value="etf-investment">
                <ETFInvestmentCalculator initialData={initialETFInvestmentData} />
            </TabsContent>
            <TabsContent value="fire-timeline">
                <FIRETimelineCalculator initialData={initialFIRETimelineData} />
            </TabsContent>
            <TabsContent value="finanzwizard">
                <FinanzWizardCalculator initialData={initialFinanzWizardData} />
            </TabsContent>
            <TabsContent value="society-comparison">
                <SocietyComparisonCalculator initialData={initialSocietyComparisonData} />
            </TabsContent>
            <TabsContent value="emergency-fund">
                <EmergencyFundCalculator initialData={initialEmergencyFundData} />
            </TabsContent>
            <TabsContent value="pension-gap">
                <PensionGapCalculator initialData={initialPensionGapData} />
            </TabsContent>
            <TabsContent value="inflation">
                <InflationCalculator initialData={initialInflationData} />
            </TabsContent>
            <TabsContent value="loan">
                <LoanCalculator initialData={initialLoanData} />
            </TabsContent>
            <TabsContent value="buy-or-rent">
                <BuyOrRentCalculator initialData={initialBuyOrRentData} />
            </TabsContent>
        </>
    )
}
