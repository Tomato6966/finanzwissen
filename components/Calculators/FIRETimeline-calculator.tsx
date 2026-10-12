"use client"
import { CalculatorBanner } from "./CalculatorBanner";
import { CalculatorHeader } from "./CalculatorHeader";

import { Flame, Info, Share2, Target } from "lucide-react";
import LZString from "lz-string";
import { useCallback, useMemo, useState } from "react";
import {
    Area, AreaChart, CartesianGrid, Legend, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis
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
import { copyShareUrlToClipboard, getShareUrl } from "@/lib/share-utils";

interface FIRETimelineCalculatorProps {
    initialData: FIRETimelineData | null;
}

export function FIRETimelineCalculator({ initialData }: FIRETimelineCalculatorProps) {
    const [shareMessage, setShareMessage] = useState<string | null>(null);
    const [formData, setFormData] = useState<FIRETimelineData>(initialData || {
        currentAge: 30,
        pensionAge: 67,
        lifeExpectancy: 90,
        startCapital: 50000,
        monthlySavings: 500,
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
        let coastStartCapital: number | null = null;
        let coastStartYear: number | null = null;
        let coastProjectionValue: number | null = null;

        const chartData = [];

        for (let year = 0; year <= horizon; year++) {
            const age = formData.currentAge + year;
            const inflationFactor = Math.pow(1 + inflationRate, year);
            const realCapital = capital / inflationFactor;
            const requiredNow = requiredCapitalBeforePension;
            const monthlyPortfolioIncome = (realCapital * withdrawalRate) / 12;
            const guaranteedMonthly = guaranteedIncomeNetto + (age >= formData.pensionAge ? formData.statePension : 0);

            if (fullFireAge === null && monthlyPortfolioIncome + guaranteedMonthly >= formData.monthlyExpenses) {
                fullFireAge = age;
            }

            const yearsToTarget = Math.max(0, formData.pensionAge - age);
            const coastCapitalAtTarget = realCapital * Math.pow(1 + realReturn, yearsToTarget);
            const targetRequirement = requiredCapitalBeforePension;
            if (coastAge === null && coastCapitalAtTarget >= targetRequirement) {
                coastAge = age;
                coastStartCapital = capital;
                coastStartYear = year;
                coastProjectionValue = realCapital;
            }

            if (coastStartYear !== null && year > coastStartYear) {
                coastProjectionValue = coastProjectionValue! * (1 + realReturn);
            }

            const coastSchwelle = requiredCapitalBeforePension / Math.pow(1 + realReturn, Math.max(1, formData.pensionAge - age));

            chartData.push({
                age,
                "Depot real": realCapital,
                "FIRE-Ziel real": requiredNow,
                "Coast-Schwelle": coastSchwelle,
                "Coast-Verlauf": coastProjectionValue,
                "Einzahlungen": cumulativeSavings,
                "Portfolio-Entnahme mtl.": monthlyPortfolioIncome,
            });

            const annualSavings = getAnnualSavingsForYear({
                yearIndex: year,
                baseRate: formData.monthlySavings,
                interval: "monthly",
                useAdvancedPlan: formData.useAdvancedSavingsPlan,
                advancedPeriods: formData.advancedSavingsPeriods,
            });
            cumulativeSavings += annualSavings;
            capital = capital * (1 + nominalReturn) + annualSavings;
        }

        const yearsToCoastTarget = Math.max(1, formData.pensionAge - formData.currentAge);
        const coastTargetCapital = requiredCapitalBeforePension / Math.pow(1 + realReturn, yearsToCoastTarget);

        return {
            coastAge,
            fullFireAge,
            requiredCapitalBeforePension,
            requiredCapitalAfterPension,
            coastTargetCapital,
            chartData,
        };
    }, [formData]);

    const serializeState = useCallback(() => {
        const state = { type: "fire-timeline", data: formData };
        return LZString.compressToEncodedURIComponent(JSON.stringify(state));
    }, [formData]);

    const handleShareConfig = async () => {
        const serialized = serializeState();
        const shareUrl = getShareUrl('fire-timeline', serialized);
        const copied = await copyShareUrlToClipboard(shareUrl);
        if (copied) {
            setShareMessage("Link kopiert!");
        } else {
            setShareMessage("Kopieren fehlgeschlagen!");
        }
        setTimeout(() => setShareMessage(null), 3000);
    };

    const validationError = useMemo(() => {
        if (formData.currentAge >= formData.pensionAge) {
            return "Das Rentenalter muss höher als das aktuelle Alter sein.";
        }
        if (formData.monthlyExpenses <= 0) {
            return "Der Monatsbedarf muss größer als 0 € sein.";
        }
        if (formData.withdrawalRate <= 0) {
            return "Die sichere Entnahmerate muss größer als 0% sein.";
        }
        return null;
    }, [formData]);

    const numberInput = (field: keyof FIRETimelineData, label: string, step = 1) => (
        <div className="space-y-1.5">
            <Label htmlFor={`fire-${field}`} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
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
        <Card className="w-full shadow-xl rounded-2xl overflow-hidden py-0 border-border/70 dark:bg-card/90 backdrop-blur-md">
            <CalculatorHeader
                title="FIRE Timeline Rechner"
                description="Ermitteln Sie Ihren Weg zur finanziellen Unabhängigkeit und den genauen Zeitpunkt für Coast FIRE und Full FIRE."
                icon={Flame}
                badge="Rente & FIRE"
                shareMessage={shareMessage}
                onShare={handleShareConfig}
            />

            <div className="p-6 sm:p-7 space-y-6">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Picker-Maske (Left Column) */}
                    <div className="md:col-span-1 space-y-4 rounded-xl border border-border/50 bg-card/50 dark:bg-card/30 p-4 sm:p-5">
                        <div className="border-b border-border/40 pb-3">
                            <h3 className="text-base font-semibold text-foreground">
                                FIRE Parameter
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Altersstufen, Vermögen und Monatsbedarf.
                            </p>
                        </div>

                        <div className="space-y-3.5">
                            <div className="grid grid-cols-2 gap-2">
                                {numberInput("currentAge", "Alter")}
                                {numberInput("pensionAge", "Rentenalter")}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {numberInput("startCapital", "Startkapital (€)")}
                                {numberInput("monthlyExpenses", "Bedarf mtl. (€)")}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {numberInput("guaranteedIncome", "Garant. Netto (€)")}
                                {numberInput("statePension", "Rente mtl. (€)")}
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
                                {numberInput("expectedReturn", "Rendite %", 0.1)}
                                {numberInput("inflation", "Inflation %", 0.1)}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {numberInput("withdrawalRate", "Entnahme %", 0.1)}
                                {numberInput("taxRate", "Steuer %", 0.1)}
                            </div>

                            {!formData.useAdvancedSavingsPlan && numberInput("monthlySavings", "Monatliche Sparrate (€)")}

                            <div className="pt-2 border-t border-border/40">
                                <AdvancedSavingsPlanInput
                                    enabled={formData.useAdvancedSavingsPlan}
                                    onEnabledChange={(enabled) => updateField("useAdvancedSavingsPlan", enabled)}
                                    periods={formData.advancedSavingsPeriods || defaultAdvancedSavingsPeriods(30)}
                                    onPeriodsChange={(periods) => updateField("advancedSavingsPeriods", periods)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Visualisierung-Maske (Right Column) */}
                    <div className="md:col-span-2 space-y-4">
                        {validationError && (
                            <CalculatorBanner
                                type="error"
                                message={validationError}
                            />
                        )}

                        {/* Top KPI Cards */}
                        <div className="grid sm:grid-cols-2 gap-3">
                            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4 backdrop-blur-xs">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-xs uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-bold">Coast FIRE Erreicht mit</span>
                                        <h4 className="text-3xl font-black text-cyan-600 dark:text-cyan-400 mt-1">
                                            {result.coastAge ? `${result.coastAge} Jahren` : "Nicht erreicht"}
                                        </h4>
                                    </div>
                                    <span className="text-xs text-muted-foreground bg-cyan-500/10 px-2 py-0.5 rounded-full font-medium">⚓ Coast</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Depot wächst ab hier bis zur Rente eigenständig. Nötig heute: <strong className="text-foreground">{formatCurrency(result.coastTargetCapital)}</strong>
                                </p>
                            </div>

                            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 backdrop-blur-xs">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">Full FIRE Erreicht mit</span>
                                        <h4 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                                            {result.fullFireAge ? `${result.fullFireAge} Jahren` : "Nicht erreicht"}
                                        </h4>
                                    </div>
                                    <span className="text-xs text-muted-foreground bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium">🔥 Full FIRE</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Vollständige finanzielle Freiheit. Zielkapital: <strong className="text-foreground">{formatCurrency(result.requiredCapitalBeforePension)}</strong>
                                </p>
                            </div>
                        </div>

                        {/* Chart Container */}
                        <div className="rounded-xl border border-border/60 bg-card/60 dark:bg-card/30 p-4 sm:p-5 backdrop-blur-xs">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vermögenspfad (real inflationsbereinigt)</span>
                                <span className="text-xs text-muted-foreground">Zielentnahme: {formData.withdrawalRate}% p.a.</span>
                            </div>
                            <ResponsiveContainer width="100%" height={380}>
                                <AreaChart data={result.chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="depotRealGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02}/>
                                        </linearGradient>
                                        <linearGradient id="fireTargetGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.25}/>
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0.02}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                                    <XAxis dataKey="age" tickFormatter={(value) => `${value}J`} stroke="currentColor" className="text-xs opacity-60" />
                                    <YAxis tickFormatter={(value) => formatCurrency(Number(value))} width={90} stroke="currentColor" className="text-xs opacity-60" />
                                    <Tooltip
                                        formatter={(value, name) => [formatCurrency(value as number), name as string]}
                                        contentStyle={{
                                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            color: '#fff',
                                            backdropFilter: 'blur(8px)'
                                        }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                                    <Line type="monotone" dataKey="Coast-Schwelle" stroke="#0891b2" strokeDasharray="5 3" dot={false} strokeWidth={2} name="Coast-Schwelle" />
                                    <Area type="monotone" dataKey="FIRE-Ziel real" stroke="#f97316" strokeWidth={2} fill="url(#fireTargetGradient)" />
                                    <Area type="monotone" dataKey="Depot real" stroke="#06b6d4" strokeWidth={2.5} fill="url(#depotRealGradient)" />
                                    {result.coastAge && <ReferenceLine x={result.coastAge} stroke="#0891b2" strokeWidth={2} label={{ value: "⚓ Coast", position: "insideTopRight", fill: "#0891b2", fontSize: 12 }} />}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            <CardFooter className="px-6 py-4 text-xs text-muted-foreground border-t border-border/40 flex justify-between items-center bg-card/30">
                <p>
                    Hinweis: Modellrechnung in heutiger Kaufkraft (reale Werte). Die 4%- bzw. Trinity-Studie basiert auf US-Daten und dient als Orientierung.
                </p>
            </CardFooter>
        </Card>
    );
}
