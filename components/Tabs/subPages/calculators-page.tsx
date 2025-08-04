"use client"

import { BarChart2, Home, PiggyBank, Target, TrendingUp } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CompoundInterestCalculator } from "./Calculators/CompoundInterest-calculator";
import { FinancialGoalsCalculator } from "./Calculators/FinancialGoals-calculator";
import { MontecarloSimulation } from "./Calculators/Montecarlo-simulation";
import { RetirementCalculator } from "./Calculators/Retirement-calculator";
import { WithdrawalPlanCalculator } from "./Calculators/WithdrawalPlan-calculator";

// --- MAIN COMPONENT ---
export function Calculators() {

    return (
        <div className="p-4 md:p-8 bg-gray-50 font-sans">
            <div className="text-center mb-12 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Finanzrechner</h1>
                <p className="text-lg text-gray-600">
                    Planen Sie Ihre finanzielle Zukunft mit unseren interaktiven Rechnern – vom Zinseszins bis zur Monte-Carlo-Simulation.
                </p>
            </div>

            <Tabs defaultValue="retirement" className="w-full max-w-6xl mx-auto">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 h-auto p-2 bg-slate-300">
                    <TabsTrigger value="compound" className="flex items-center gap-2 text-xs sm:text-sm border-transparent border-2 hover:border-white"><TrendingUp className="w-4 h-4" /> Zinseszins</TabsTrigger>
                    <TabsTrigger value="withdrawal" className="flex items-center gap-2 text-xs sm:text-sm border-transparent border-2 hover:border-white"><Home className="w-4 h-4" /> Entnahmeplan</TabsTrigger>
                    <TabsTrigger value="retirement" className="flex items-center gap-2 text-xs sm:text-sm border-transparent border-2 hover:border-white"><PiggyBank className="w-4 h-4" /> Vorsorge</TabsTrigger>
                    <TabsTrigger value="goals" className="flex items-center gap-2 text-xs sm:text-sm border-transparent border-2 hover:border-white"><Target className="w-4 h-4" /> Sparziele</TabsTrigger>
                    <TabsTrigger value="montecarlo" className="flex items-center gap-2 text-xs sm:text-sm border-transparent border-2 hover:border-white"><BarChart2 className="w-4 h-4" /> Monte Carlo</TabsTrigger>
                </TabsList>

                {/* --- 1. COMPOUND INTEREST CALCULATOR --- */}
                <TabsContent value="compound">
                    <CompoundInterestCalculator />
                </TabsContent>

                {/* --- 2. WITHDRAWAL PLAN CALCULATOR --- */}
                <TabsContent value="withdrawal">
                    <WithdrawalPlanCalculator />
                </TabsContent>

                {/* --- 3. RETIREMENT CALCULATOR --- */}
                <TabsContent value="retirement">
                    <RetirementCalculator />
                </TabsContent>

                {/* --- 4. FINANCIAL GOALS CALCULATOR --- */}
                <TabsContent value="goals">
                    <FinancialGoalsCalculator />
                </TabsContent>

                {/* --- 5. MONTE CARLO SIMULATOR --- */}
                <TabsContent value="montecarlo">
                    <MontecarloSimulation />
                </TabsContent>
            </Tabs>
        </div>
    );
}
