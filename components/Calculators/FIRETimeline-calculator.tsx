"use client"

import { Flame, Info, Share2, Target } from "lucide-react";
import LZString from "lz-string";
import { useCallback, useMemo, useState } from "react";
import {
    Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

import { Button } from "@/components/ui/button";
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultAdvancedSavingsPeriods, getAnnualSavingsForYear } from "@/lib/savings-plan";

import { AdvancedSavingsPlanInput } from "./AdvancedSavingsPlanInput";
import { formatCurrency } from "./tools";

import type { FIRETimelineData } from "@/lib/calculator-types";

interface FIRETimelineCalculatorProps {
    initialData: FIRETimelineData | null;
}

export function FIRETimelineCalculator({ initialData }: FIRETimelineCalculatorProps) {
    const [shareMessage, setShareMessage] = useState<string | null>(null);
    const [formData, setFormData] = useState<FIRETimelineData>(initialData || {
        currentAge: 30,
        targetAge: 55,
        pensionAge: 67,
        lifeExpectancy: 90,
        startCapital: 50000,
        monthlyExpenses: 2500,
        guaranteedIncome: 0,
        statePension: 1200,
        expectedReturn: 7,
        inflation: 2.5,
        withdrawalRate: 3.5,
        taxRate: 35,
        useAdvancedSavingsPlan: true,
        advancedSavingsPeriods: [
            { id: 1, startYear: 0, endYear: 4, monthlyAmount: 2000 },
            { id: 2, startYear: 5, endYear: 9, monthlyAmount: 1000 },
            { id: 3, startYear: 10, endYear: 60, monthlyAmount: 0 },
        ],
    });

    const updateField = (field: keyof FIRETimelineData, value: number | boolean | FIRETimelineData["advancedSavingsPeriods"]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const result = useMemo(() => {
        const nominalReturn = formData.expectedReturn / 100;
        const inflationRate = formData.inflation / 100;
        const realReturn = (1 + nominalReturn) / (1 + inflationRate) - 1;
        const withdrawalRate = Math.max(0.1, formData.withdrawalRate) / 100;
        const horizon = Math.max(1, formData.lifeExpectancy - formData.currentAge);
        const taxRate = Math.max(0, Math.min(100, formData.taxRate)) / 100;

        // Convert guaranteedIncome from BRUTTO to NETTO
        const guaranteedIncomeNetto = formData.guaranteedIncome * (1 - taxRate);

        const targetAnnualNeedBeforePension = Math.max(0, (formData.monthlyExpenses - guaranteedIncomeNetto) * 12);
        const targetAnnualNeedAfterPension = Math.max(0, (formData.monthlyExpenses - guaranteedIncomeNetto - formData.statePension) * 12);
        const requiredCapitalBeforePension = targetAnnualNeedBeforePension / withdrawalRate;
        const requiredCapitalAfterPension = targetAnnualNeedAfterPension / withdrawalRate;

        let capital = formData.startCapital;
        let coastAge: number | null = null;
        let fullFireAge: number | null = null;
        let cumulativeSavings = formData.startCapital;

        const chartData = [];

        for (let year = 0; year <= horizon; year++) {
            const age = formData.currentAge + year;
            const inflationFactor = Math.pow(1 + inflationRate, year);
            const realCapital = capital / inflationFactor;
            const requiredNow = age >= formData.pensionAge ? requiredCapitalAfterPension : requiredCapitalBeforePension;
            const monthlyPortfolioIncome = (realCapital * withdrawalRate) / 12;
            const guaranteedMonthly = guaranteedIncomeNetto + (age >= formData.pensionAge ? formData.statePension : 0);

            if (fullFireAge === null && monthlyPortfolioIncome + guaranteedMonthly >= formData.monthlyExpenses) {
                fullFireAge = age;
            }

            const yearsToTarget = Math.max(0, formData.targetAge - age);
            const coastCapitalAtTarget = realCapital * Math.pow(1 + realReturn, yearsToTarget);
            const targetRequirement = formData.targetAge >= formData.pensionAge ? requiredCapitalAfterPension : requiredCapitalBeforePension;
            if (coastAge === null && coastCapitalAtTarget >= targetRequirement) {
                coastAge = age;
            }

            chartData.push({
                age,
                "Depot real": realCapital,
                "FIRE-Ziel real": requiredNow,
                "Einzahlungen": cumulativeSavings,
                "Portfolio-Entnahme mtl.": monthlyPortfolioIncome,
            });

            const annualSavings = getAnnualSavingsForYear({
                yearIndex: year,
                baseRate: 0,
                interval: "monthly",
                useAdvancedPlan: formData.useAdvancedSavingsPlan,
                advancedPeriods: formData.advancedSavingsPeriods,
            });
            cumulativeSavings += annualSavings;
            capital = capital * (1 + nominalReturn) + annualSavings;
        }

        return {
            coastAge,
            fullFireAge,
            requiredCapitalBeforePension,
            requiredCapitalAfterPension,
            chartData,
        };
    }, [formData]);

    const serializeState = useCallback(() => {
        const state = { type: "fire-timeline", data: formData };
        return LZString.compressToEncodedURIComponent(JSON.stringify(state));
    }, [formData]);

    const handleShareConfig = () => {
        const shareUrl = `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH || ""}/calculators?share=${serializeState()}`;
        navigator.clipboard?.writeText(shareUrl).then(() => {
            setShareMessage("Link kopiert!");
            setTimeout(() => setShareMessage(null), 3000);
        }).catch(() => setShareMessage("Kopieren fehlgeschlagen"));
    };

    const numberInput = (field: keyof FIRETimelineData, label: string, step = 1) => (
        <div className="space-y-2">
            <Label htmlFor={`fire-${field}`}>{label}</Label>
            <Input
                id={`fire-${field}`}
                type="number"
                step={step}
                value={String(formData[field])}
                onChange={(event) => updateField(field, Number(event.target.value) || 0)}
            />
        </div>
    );

    return (
        <Card className="w-full max-w-7xl overflow-hidden border-border bg-card text-card-foreground shadow-2xl py-0">
            <CardHeader className="border-b border-border bg-muted p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <CardTitle className="flex items-center gap-3 text-3xl">
                            <Flame className="h-8 w-8 text-cyan-600" />
                            FIRE Timeline
                        </CardTitle>
                        <CardDescription className="mt-2 text-cyan-700">
                            Coast FIRE und Full FIRE mit Sparphasen, Inflation, Pension/Rente und garantierten Zusatzeinkommen.
                        </CardDescription>
                    </div>
                    <Button onClick={handleShareConfig} variant="secondary">
                        <Share2 className="mr-2 h-4 w-4" />
                        {shareMessage || "Konfiguration teilen"}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="grid gap-6 p-6 lg:grid-cols-3">
                <div className="group relative overflow-hidden space-y-4 rounded-lg border border-border bg-muted/30 p-4 transition-all duration-300 ease-out hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30">
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                        <Target className="h-5 w-5 text-cyan-600" />
                        Eingaben
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {numberInput("currentAge", "Alter")}
                        {numberInput("targetAge", "Zielalter")}
                        {numberInput("pensionAge", "Pension/Rente ab")}
                        {numberInput("lifeExpectancy", "Planung bis")}
                        {numberInput("startCapital", "Startkapital Euro (NETTO)")}
                        {numberInput("monthlyExpenses", "Monatsbedarf Euro (NETTO)")}
                        {numberInput("guaranteedIncome", "Garantiertes Einkommen mtl. (BRUTTO)")}
                        {numberInput("statePension", "Staatliche Pension/Rente mtl. (NETTO)")}
                        {numberInput("expectedReturn", "Rendite p.a. %", 0.1)}
                        {numberInput("inflation", "Inflation %", 0.1)}
                        {numberInput("withdrawalRate", "Entnahmerate %", 0.1)}
                        {numberInput("taxRate", "Steuersatz %", 0.1)}
                    </div>
                    <AdvancedSavingsPlanInput
                        enabled={formData.useAdvancedSavingsPlan}
                        onEnabledChange={(enabled) => updateField("useAdvancedSavingsPlan", enabled)}
                        periods={formData.advancedSavingsPeriods || defaultAdvancedSavingsPeriods(30)}
                        onPeriodsChange={(periods) => updateField("advancedSavingsPeriods", periods)}
                    />
                </div>

                <div className="space-y-4 lg:col-span-2">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="border-cyan-600/30 bg-cyan-600/10 text-card-foreground">
                            <CardHeader>
                                <CardTitle>Coast FIRE</CardTitle>
                                <CardDescription className="text-cyan-700">Ab hier kann das Depot bis zum Zielalter theoretisch alleine weiterwachsen.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold text-cyan-600">
                                    {result.coastAge ? `${result.coastAge} Jahre` : "Nicht erreicht"}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-emerald-600/30 bg-emerald-600/10 text-card-foreground">
                            <CardHeader>
                                <CardTitle>Full FIRE</CardTitle>
                                <CardDescription className="text-emerald-700">Portfolio-Entnahme plus sichere Einkommen decken den Monatsbedarf.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold text-emerald-600">
                                    {result.fullFireAge ? `${result.fullFireAge} Jahre` : "Nicht erreicht"}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="rounded-lg border border-border bg-background p-4 text-foreground">
                        <ResponsiveContainer width="100%" height={430}>
                            <AreaChart data={result.chartData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                                <XAxis dataKey="age" tickFormatter={(value) => `${value}J`} />
                                <YAxis tickFormatter={(value) => formatCurrency(Number(value))} width={90} />
                                <Tooltip formatter={(value, name) => [formatCurrency(value as number), name as string]} />
                                <Legend />
                                <Area type="monotone" dataKey="FIRE-Ziel real" stroke="#f97316" fill="#fed7aa" fillOpacity={0.4} />
                                <Area type="monotone" dataKey="Depot real" stroke="#06b6d4" fill="#67e8f9" fillOpacity={0.45} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="border-t border-cyan-400/20 p-5 text-sm text-cyan-100/80">
                <Info className="mr-2 h-4 w-4" />
                Modellrechnung in heutiger Kaufkraft. Keine Garantie, keine Finanzberatung.
            </CardFooter>
        </Card>
    );
}
