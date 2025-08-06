"use client"

import {
	AlertTriangle, Calculator, Calendar, Clock, Coins, Euro, HelpCircle, TrendingUp, Wallet
} from "lucide-react";
import LZString from "lz-string";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
	Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
	Tooltip as ShadcnTooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from "@/components/ui/tooltip";

import { formatCurrency } from "./tools";

import type { AnnuityType, CalculationType, FormData, RetirementCalculatorProps } from "../../lib/calculator-types";

// Main component
export function RetirementCalculator({ initialData }: RetirementCalculatorProps) {
    const [calculationType, setCalculationType] =
        useState<CalculationType>("calculate_monthly_payout");
    const [formData, setFormData] = useState<FormData>({
        currentAge: 30,
        currentCapital: 25000,
        yield: 7,
        inflation: 2.5,
        savingsRate: 500,
        savingsInterval: "monthly",
        desiredRetirementAge: 67,
        desiredNetPayout: 1500,
        taxRate: 25,
        annuityType: "capital_consumption",
        lifeExpectancy: 90,
        dynamicSavingsAdjustment: false,
        savingsIncreaseRate: 2,
        showNominalCapital: true,
        showContributions: true,
    });
    const [shareMessage, setShareMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);


    const serializeState = useCallback(() => {
        const state = {
            type: 'retirement',
            data: {
                calculationType,
                formData,
            }
        };
        const jsonString = JSON.stringify(state);
        return LZString.compressToEncodedURIComponent(jsonString);
    }, [calculationType, formData]);

    // Effect to read initial state from props on component mount
    useEffect(() => {
        if (initialData) {
            setCalculationType(initialData.calculationType || "calculate_monthly_payout");
            setFormData(initialData.formData || {
                currentAge: 30,
                currentCapital: 25000,
                yield: 7,
                inflation: 2.5,
                savingsRate: 500,
                savingsInterval: "monthly",
                desiredRetirementAge: 67,
                desiredNetPayout: 1500,
                taxRate: 25,
                annuityType: "capital_consumption",
                lifeExpectancy: 90,
                dynamicSavingsAdjustment: false,
                savingsIncreaseRate: 2,
                showNominalCapital: true,
                showContributions: true,
            });
        }
    }, [initialData]);

    // Calculate annual savings based on interval
    const getAnnualSavings = (
        rate: number,
        interval: FormData["savingsInterval"]
    ) => {
        switch (interval) {
            case "daily":
                return rate * 365;
            case "weekly":
                return rate * 52;
            case "bi_weekly":
                return rate * 26;
            case "monthly":
                return rate * 12;
            case "quarterly":
                return rate * 4;
            case "yearly":
                return rate;
            default:
                return 0;
        }
    };

    // Main calculation logic
    const calculationResult = useMemo(() => {
        setError(null); // Reset error on each calculation
        const {
            currentAge,
            currentCapital,
            yield: rawYield,
            inflation: rawInflation,
            savingsRate,
            savingsInterval,
            desiredRetirementAge,
            desiredNetPayout,
            taxRate,
            annuityType,
            lifeExpectancy,
            dynamicSavingsAdjustment,
            savingsIncreaseRate,
        } = formData;

        // --- Input Validation ---
        if (desiredRetirementAge <= currentAge) {
            setError("Das Rentenalter muss nach dem aktuellen Alter liegen.");
            return null;
        }
        if (lifeExpectancy <= desiredRetirementAge && annuityType === 'capital_consumption') {
            setError("Die Lebenserwartung muss nach dem Rentenalter liegen.");
            return null;
        }
        if (currentAge < 0 || currentCapital < 0 || rawYield < 0 || savingsRate < 0 || desiredRetirementAge < 0 || desiredNetPayout < 0 || taxRate < 0 || lifeExpectancy < 0) {
            setError("Negative Werte sind für die meisten Felder nicht zulässig.");
            return null;
        }


        const rateOfReturn = rawYield / 100;
        const inflationRate = rawInflation / 100;
        const taxFactor = 1 - taxRate / 100;
        const realRateOfReturn = (1 + rateOfReturn) / (1 + inflationRate) - 1;

        const currentAnnualSavings = getAnnualSavings(savingsRate, savingsInterval);

        // --- Shared Savings Phase Logic ---
        const calculateSavingsPhase = (endAge: number) => {
            let accumulatedCapital = currentCapital;
            let cumulativeContributions = currentCapital;
            const savingsData = [];
            let cumulativeInflationFactor = 1;
            let dynamicAnnualSavings = getAnnualSavings(savingsRate, savingsInterval);

            for (let age = currentAge; age <= endAge; age++) {
                const yearIndex = age - currentAge;
                if (yearIndex > 0) {
                    if (dynamicSavingsAdjustment && savingsIncreaseRate > 0) {
                        dynamicAnnualSavings *= (1 + savingsIncreaseRate / 100);
                    }
                    accumulatedCapital = accumulatedCapital * (1 + rateOfReturn) + dynamicAnnualSavings;
                    cumulativeContributions += dynamicAnnualSavings;
                }
                cumulativeInflationFactor *= (1 + inflationRate);
                savingsData.push({
                    age: age,
                    "Kapital nominal": accumulatedCapital,
                    "Kapital real": accumulatedCapital / cumulativeInflationFactor,
                    "Einzahlungen": cumulativeContributions,
                });
            }
            return { savingsData, accumulatedCapital, cumulativeContributions, cumulativeInflationFactor };
        };


        // --- Mode: Calculate Monthly Payout ---
        if (calculationType === "calculate_monthly_payout") {
            const { savingsData, accumulatedCapital, cumulativeContributions, cumulativeInflationFactor } = calculateSavingsPhase(desiredRetirementAge);
            const retirementCapitalNominal = accumulatedCapital;
            const retirementCapitalReal = retirementCapitalNominal / cumulativeInflationFactor;

            let monthlyPayoutBruttoReal: number;
            if (annuityType === "endless") {
                if (realRateOfReturn <= 0) {
                    setError("Bei einer endlosen Rente muss die reale Rendite positiv sein, um ein Schrumpfen des Kapitals zu vermeiden.");
                    return null;
                }
                monthlyPayoutBruttoReal = (retirementCapitalReal * realRateOfReturn) / 12;
            } else {
                const yearsInRetirement = lifeExpectancy - desiredRetirementAge;
                if (yearsInRetirement <= 0) {
                     setError("Die Lebenserwartung muss größer als das Rentenalter sein.");
                     return null;
                }
                const totalMonths = yearsInRetirement * 12;
                const monthlyRealRate = Math.pow(1 + realRateOfReturn, 1 / 12) - 1;
                if (monthlyRealRate === 0) {
                    monthlyPayoutBruttoReal = retirementCapitalReal / totalMonths;
                } else {
                    monthlyPayoutBruttoReal = (retirementCapitalReal * monthlyRealRate) / (1 - Math.pow(1 + monthlyRealRate, -totalMonths));
                }
            }

            const monthlyPayoutNettoReal = monthlyPayoutBruttoReal * taxFactor;

            // Payout phase simulation (using REAL values for consistency)
            const payoutPhaseData = [];
            let currentRealCapital = retirementCapitalReal;
            let payoutPhaseInflationFactor = cumulativeInflationFactor;

            for (let age = desiredRetirementAge; age <= lifeExpectancy; age++) {
                 const yearIndex = age - desiredRetirementAge;
                 if (yearIndex > 0) {
                     const annualRealWithdrawal = monthlyPayoutBruttoReal * 12;
                     currentRealCapital = currentRealCapital * (1 + realRateOfReturn) - annualRealWithdrawal;
                     if (currentRealCapital < 0) currentRealCapital = 0; // Capital cannot be negative
                 }
                 payoutPhaseInflationFactor *= (1 + inflationRate);
                 payoutPhaseData.push({
                     age: age,
                     "Kapital nominal": currentRealCapital * payoutPhaseInflationFactor,
                     "Kapital real": currentRealCapital,
                     "Einzahlungen": cumulativeContributions,
                 });
            }

            // Combine savings and payout data for the chart with distinct keys
            const chartData = savingsData.map(p => ({
                age: p.age,
                "Anspar-Kapital-Real": p["Kapital real"],
                "Anspar-Kapital-Nominal": p["Kapital nominal"],
                "Entnahme-Kapital-Real": p["Kapital real"],
                "Entnahme-Kapital-Nominal": p["Kapital nominal"],
                "Einzahlungen": p["Einzahlungen"],
            }));

            const connectionPointIndex = savingsData.length - 1;
            if (connectionPointIndex >= 0) {
                const connectionPoint = chartData[connectionPointIndex];
                connectionPoint["Entnahme-Kapital-Real"] = connectionPoint["Anspar-Kapital-Real"];
                connectionPoint["Entnahme-Kapital-Nominal"] = connectionPoint["Anspar-Kapital-Nominal"];
            }

            payoutPhaseData.slice(1).forEach(p => {
                if(chartData.find(v => v.age === p.age)) return;
                chartData.push({
                    age: p.age,
                    "Entnahme-Kapital-Real": p["Kapital real"],
                    "Anspar-Kapital-Real": 0,
                    "Anspar-Kapital-Nominal": 0,
                    "Entnahme-Kapital-Nominal": p["Kapital nominal"],
                    "Einzahlungen": p["Einzahlungen"],
                });
            });

            return {
                retirementCapital: retirementCapitalNominal,
                retirementCapitalReal: retirementCapitalReal,
                monthlyPayoutBrutto: monthlyPayoutBruttoReal,
                monthlyPayoutNetto: monthlyPayoutNettoReal,
                chartData: chartData,
                type: "payout",
            };
        }

        // --- Mode: Calculate Retirement Age ---
        if (calculationType === "calculate_retirement_age") {
            const annualNetPayout = desiredNetPayout * 12;
            const annualGrossPayoutReal = annualNetPayout / taxFactor; // This is a real value
            let requiredCapitalReal: number;

            if (annuityType === "endless") {
                if (realRateOfReturn <= 0) {
                    setError("Für eine endlose Rente mit der gewünschten Auszahlung muss die reale Rendite positiv sein.");
                    return null;
                }
                requiredCapitalReal = annualGrossPayoutReal / realRateOfReturn;
            } else {
                const yearsToConsume = lifeExpectancy - desiredRetirementAge; // Initial estimate
                 if (yearsToConsume <= 0) {
                     setError("Die Lebenserwartung muss größer als das Rentenalter sein.");
                     return null;
                }
                const monthlyRealRate = Math.pow(1 + realRateOfReturn, 1 / 12) - 1;
                const totalMonths = yearsToConsume * 12;
                requiredCapitalReal = (annualGrossPayoutReal / 12) * ((1 - Math.pow(1 + monthlyRealRate, -totalMonths)) / monthlyRealRate);
            }

            let retirementAge = currentAge;
            let accumulatedNominalCapital = currentCapital;
            let accumulatedRealCapital = currentCapital;
            let dynamicAnnualSavings = currentAnnualSavings;
            let cumulativeContributions = currentCapital;
            const savingsPhaseDataSim = [];

            while (accumulatedRealCapital < requiredCapitalReal) {
                retirementAge++;
                if (retirementAge > 120) { // Boundary condition
                    setError("Rentenalter nicht erreichbar. Überprüfen Sie Ihre Sparrate und Renditeerwartungen.");
                    return null;
                }

                if (dynamicSavingsAdjustment && savingsIncreaseRate > 0) {
                    dynamicAnnualSavings *= (1 + savingsIncreaseRate / 100);
                }

                accumulatedNominalCapital = accumulatedNominalCapital * (1 + rateOfReturn) + dynamicAnnualSavings;
                cumulativeContributions += dynamicAnnualSavings;
                const inflationFactor = Math.pow(1 + inflationRate, retirementAge - currentAge);
                accumulatedRealCapital = accumulatedNominalCapital / inflationFactor;

                savingsPhaseDataSim.push({
                    age: retirementAge,
                    "Kapital nominal": accumulatedNominalCapital,
                    "Kapital real": accumulatedRealCapital,
                    "Einzahlungen": cumulativeContributions,
                });
            }

            const chartData = savingsPhaseDataSim.map(p => ({
                age: p.age,
                "Anspar-Kapital-Real": p["Kapital real"],
                "Anspar-Kapital-Nominal": p["Kapital nominal"],
                "Einzahlungen": p["Einzahlungen"],
            }));

            return {
                requiredCapital: requiredCapitalReal,
                retirementAge: retirementAge,
                retirementCapitalReal: accumulatedRealCapital,
                chartData: chartData,
                type: "age",
            };
        }

        // --- Mode: Calculate Savings Rate ---
        if (calculationType === "calculate_savings_rate") {
            const yearsToRetirement = desiredRetirementAge - currentAge;
            const annualNetPayout = desiredNetPayout * 12;
            const annualGrossPayoutReal = annualNetPayout / taxFactor;
            let requiredCapitalReal: number;

            if (annuityType === "endless") {
                 if (realRateOfReturn <= 0) {
                    setError("Für eine endlose Rente mit der gewünschten Auszahlung muss die reale Rendite positiv sein.");
                    return null;
                }
                requiredCapitalReal = annualGrossPayoutReal / realRateOfReturn;
            } else {
                const yearsInRetirement = lifeExpectancy - desiredRetirementAge;
                const retirementTotalMonths = yearsInRetirement * 12;
                const monthlyRealRate = Math.pow(1 + realRateOfReturn, 1 / 12) - 1;
                requiredCapitalReal = (annualGrossPayoutReal / 12) * ((1 - Math.pow(1 + monthlyRealRate, -retirementTotalMonths)) / monthlyRealRate);
            }

            // What is the required capital in NOMINAL terms at retirement?
            const requiredCapitalNominal = requiredCapitalReal * Math.pow(1 + inflationRate, yearsToRetirement);

            // What will our current capital grow to in NOMINAL terms?
            const futureValueFromCurrentCapital = currentCapital * Math.pow(1 + rateOfReturn, yearsToRetirement);

            const nominalShortfall = requiredCapitalNominal - futureValueFromCurrentCapital;

            if (nominalShortfall <= 0) {
                // Current capital is already enough
                return {
                    requiredMonthlySavingsRate: 0,
                    futureCapital: requiredCapitalNominal,
                    type: "savings",
                };
            }

            // What savings rate is needed to cover the nominal shortfall?
            const monthlyRate = Math.pow(1 + rateOfReturn, 1 / 12) - 1;
            const totalMonths = yearsToRetirement * 12;
            const futureValueFactor = (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
            const requiredMonthlySavingsRate = nominalShortfall / futureValueFactor;

            return {
                futureCapital: requiredCapitalNominal,
                requiredMonthlySavingsRate: requiredMonthlySavingsRate,
                type: "savings",
            };
        }

        return null;
    }, [formData, calculationType]);

    const memoizedHandleInputChange = useCallback((field: keyof FormData, value: string | number | boolean) => {
        setFormData((prev) => ({
            ...prev,
            [field]: typeof value === "string" && !["savingsInterval", "annuityType"].includes(field) ? parseFloat(value) || 0 : value,
        }));
    }, []);

    // Handle share config button click
    const handleShareConfig = () => {
        const serialized = serializeState();
        const shareUrl = `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH || ''}/calculators?share=${serialized}`;
        try {
            navigator.clipboard.writeText(shareUrl).then(() => {
                setShareMessage("Link kopiert!");
                setTimeout(() => setShareMessage(null), 3000);
            }).catch(() => {
                // Fallback for older browsers or non-secure contexts
                const textarea = document.createElement('textarea');
                textarea.value = shareUrl;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                setShareMessage("Link kopiert!");
                setTimeout(() => setShareMessage(null), 3000);
            });
        } catch (err) {
            console.error('Failed to copy text: ', err);
            setShareMessage("Kopieren fehlgeschlagen!");
            setTimeout(() => setShareMessage(null), 3000);
        }
    };


    const isPayoutMode = calculationType === "calculate_monthly_payout";
    const isAgeMode = calculationType === "calculate_retirement_age";
    const isSavingsMode = calculationType === "calculate_savings_rate";

    // Determine if dynamic savings adjustment section should be visible
    const showDynamicSavingsSection = isPayoutMode || isAgeMode;

    return (
        <TooltipProvider>
            <Card className="w-full max-w-6xl shadow-xl rounded-lg overflow-hidden py-0 dark:bg-card">
                <CardHeader className="bg-primary text-primary-foreground p-6 rounded-t-lg flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-3xl font-bold flex items-center">
                            <Calculator className="mr-3 h-8 w-8" /> Vorsorgerechner
                        </CardTitle>
                        <CardDescription className="text-primary-foreground opacity-90 text-sm mt-2">
                            Planen Sie Ihre Anspar- und Entnahmephase. Finden Sie Ihr optimales
                            Rentenalter oder die nötige Sparrate.
                        </CardDescription>
                    </div>
                    <Button onClick={handleShareConfig} className="ml-4" variant="secondary">
                        {shareMessage || "Share Config"}
                    </Button>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Input Panel */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="calculationType">
                                <div className="flex items-center">
                                    <Calendar className="mr-2 h-4 w-4" /> Berechnungsmodus
                                </div>
                            </Label>
                            <Select
                                value={calculationType}
                                onValueChange={(value: CalculationType) =>
                                    setCalculationType(value)
                                }
                            >
                                <SelectTrigger id="calculationType">
                                    <SelectValue placeholder="Wähle einen Modus" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="calculate_monthly_payout">
                                        Berechne max. monatliche Netto-Rente
                                    </SelectItem>
                                    <SelectItem value="calculate_retirement_age">
                                        Berechne frühestes Rentenalter
                                    </SelectItem>
                                    <SelectItem value="calculate_savings_rate">
                                        Berechne notwendige Sparrate
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center">
                                <Wallet className="mr-2 h-5 w-5" /> Ihre Daten
                            </h3>
                            <div className="space-y-4">
                                {/* Current Age */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="currentAge">Aktuelles Alter</Label>
                                        <ShadcnTooltip>
                                            <TooltipTrigger>
                                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Ihr derzeitiges Alter in Jahren.</p>
                                            </TooltipContent>
                                        </ShadcnTooltip>
                                    </div>
                                    <Input
                                        id="currentAge"
                                        type="number"
                                        value={String(formData.currentAge)}
                                        onChange={(e) =>
                                            memoizedHandleInputChange("currentAge", e.target.value)
                                        }
                                    />
                                </div>

                                {/* Current Capital */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="currentCapital">Aktuelles Kapital (€)</Label>
                                        <ShadcnTooltip>
                                            <TooltipTrigger>
                                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Ihr derzeit angespartes Kapital.</p>
                                            </TooltipContent>
                                        </ShadcnTooltip>
                                    </div>
                                    <Input
                                        id="currentCapital"
                                        type="number"
                                        value={String(formData.currentCapital)}
                                        onChange={(e) =>
                                            memoizedHandleInputChange("currentCapital", e.target.value)
                                        }
                                    />
                                </div>

                                {/* Yield */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="yield">
                                            Rendite p.a. (%)
                                        </Label>
                                        <ShadcnTooltip>
                                            <TooltipTrigger>
                                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    Die jährliche nominale Rendite, die Sie auf Ihr Kapital erwarten.
                                                </p>
                                            </TooltipContent>
                                        </ShadcnTooltip>
                                    </div>
                                    <Input
                                        id="yield"
                                        type="number"
                                        value={String(formData.yield)}
                                        onChange={(e) =>
                                            memoizedHandleInputChange("yield", e.target.value)
                                        }
                                    />
                                </div>

                                {/* Inflation */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="inflation">Jährliche Inflation (%)</Label>
                                        <ShadcnTooltip>
                                            <TooltipTrigger>
                                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    Die erwartete jährliche Inflationsrate.
                                                </p>
                                            </TooltipContent>
                                        </ShadcnTooltip>
                                    </div>
                                    <Input
                                        id="inflation"
                                        type="number"
                                        step={0.1}
                                        value={String(formData.inflation)}
                                        onChange={(e) =>
                                            memoizedHandleInputChange("inflation", e.target.value)
                                        }
                                    />
                                </div>

                                {/* Monthly Savings Rate - visible only for Payout and Age modes */}
                                {!isSavingsMode && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="savingsRate">
                                                Sparrate
                                            </Label>
                                            <ShadcnTooltip>
                                                <TooltipTrigger>
                                                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Der Betrag, den Sie regelmäßig sparen.</p>
                                                </TooltipContent>
                                            </ShadcnTooltip>
                                        </div>
                                        <Input
                                            id="savingsRate"
                                            type="number"
                                            value={String(formData.savingsRate)}
                                            onChange={(e) =>
                                                memoizedHandleInputChange("savingsRate", e.target.value)
                                            }
                                        />
                                    </div>
                                )}

                                {/* Savings Interval - visible only for Payout and Age modes */}
                                {!isSavingsMode && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="savingsInterval">
                                                Intervall der Einzahlung
                                            </Label>
                                        </div>
                                        <Select
                                            value={formData.savingsInterval}
                                            onValueChange={(value: FormData["savingsInterval"]) =>
                                                memoizedHandleInputChange("savingsInterval", value)
                                            }
                                        >
                                            <SelectTrigger id="savingsInterval">
                                                <SelectValue placeholder="Intervall wählen" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="monthly">monatlich</SelectItem>
                                                <SelectItem value="quarterly">quartalsweise</SelectItem>
                                                <SelectItem value="yearly">jährlich</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {/* Dynamic Savings Adjustment Switch */}
                                {showDynamicSavingsSection && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between pt-2">
                                            <Label htmlFor="dynamicSavingsAdjustment">
                                                Dynamische Sparrate
                                            </Label>
                                            <ShadcnTooltip>
                                                <TooltipTrigger>
                                                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>
                                                        Erhöhen Sie Ihre Sparrate jährlich um einen festen Prozentsatz.
                                                    </p>
                                                </TooltipContent>
                                            </ShadcnTooltip>
                                            <Switch
                                                id="dynamicSavingsAdjustment"
                                                checked={formData.dynamicSavingsAdjustment}
                                                onCheckedChange={(checked) =>
                                                    memoizedHandleInputChange("dynamicSavingsAdjustment", checked)
                                                }
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Savings Increase Rate - visible if dynamic adjustment is on */}
                                {showDynamicSavingsSection && formData.dynamicSavingsAdjustment && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="savingsIncreaseRate">
                                                Jährliche Steigerung (%)
                                            </Label>
                                        </div>
                                        <Input
                                            id="savingsIncreaseRate"
                                            type="number"
                                            value={String(formData.savingsIncreaseRate)}
                                            onChange={(e) =>
                                                memoizedHandleInputChange("savingsIncreaseRate", e.target.value)
                                            }
                                        />
                                    </div>
                                )}

                                {/* Desired Retirement Age - visible only for Payout and Savings modes */}
                                {!isAgeMode && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="desiredRetirementAge">
                                                Gewünschtes Rentenalter
                                            </Label>
                                        </div>
                                        <Input
                                            id="desiredRetirementAge"
                                            type="number"
                                            value={String(formData.desiredRetirementAge)}
                                            onChange={(e) =>
                                                memoizedHandleInputChange(
                                                    "desiredRetirementAge",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                )}

                                {/* Desired Net Payout - visible only for Age and Savings modes */}
                                {(isAgeMode || isSavingsMode) && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="desiredNetPayout">
                                                Gewünschte mtl. Netto-Rente (€)
                                            </Label>
                                        </div>
                                        <Input
                                            id="desiredNetPayout"
                                            type="number"
                                            value={String(formData.desiredNetPayout)}
                                            onChange={(e) =>
                                                memoizedHandleInputChange("desiredNetPayout", e.target.value)
                                            }
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="taxRate">Steuersatz auf Auszahlung (%)</Label>
                                    </div>
                                    <Input
                                        id="taxRate"
                                        type="number"
                                        value={String(formData.taxRate)}
                                        onChange={(e) =>
                                            memoizedHandleInputChange("taxRate", e.target.value)
                                        }
                                    />
                                </div>

                                {/* Annuity Type */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label>Entnahmeart</Label>
                                        <ShadcnTooltip>
                                            <TooltipTrigger>
                                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    <b>Kapitalverzehr:</b> Das Kapital wird bis zur Lebenserwartung verbraucht.
                                                    <br />
                                                    <b>Ewige Rente:</b> Das reale Kapital bleibt erhalten, nur Zinsen werden entnommen.
                                                </p>
                                            </TooltipContent>
                                        </ShadcnTooltip>
                                    </div>
                                    <RadioGroup
                                        value={formData.annuityType}
                                        onValueChange={(value: AnnuityType) =>
                                            memoizedHandleInputChange("annuityType", value)
                                        }
                                        className="flex space-x-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="capital_consumption"
                                                id="capital_consumption"
                                            />
                                            <Label htmlFor="capital_consumption">
                                                Kapitalverzehr
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="endless" id="endless" />
                                            <Label htmlFor="endless">Ewige Rente</Label>
                                        </div>
                                    </RadioGroup>
                                </div>


                                {/* Life Expectancy - visible for Capital Consumption mode */}
                                {formData.annuityType === "capital_consumption" && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="lifeExpectancy">
                                                Lebenserwartung (Alter)
                                            </Label>
                                        </div>
                                        <Input
                                            id="lifeExpectancy"
                                            type="number"
                                            value={String(formData.lifeExpectancy)}
                                            onChange={(e) => memoizedHandleInputChange("lifeExpectancy", e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Results Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Error Display */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Fehler bei der Berechnung</AlertTitle>
                                <AlertDescription>
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Display Result Cards */}
                        {!error && calculationResult && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {isPayoutMode && 'retirementCapitalReal' in calculationResult && (
                                    <>
                                        <Card className="bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700">
                                            <CardHeader>
                                                <div className="flex items-center text-purple-700 dark:text-purple-300">
                                                    <Coins className="mr-2 h-5 w-5" />
                                                    <CardTitle className="text-xl">
                                                        Kapital bei Renteneintritt
                                                    </CardTitle>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-4xl font-bold text-purple-800 dark:text-purple-200">
                                                    {formatCurrency(calculationResult.retirementCapitalReal!)}
                                                </div>
                                                <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                                                    Real (heutige Kaufkraft)
                                                </p>
                                                {formData.inflation > 0 && (
                                                    <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-800/30 rounded">
                                                        <p className="text-xs text-purple-600 dark:text-purple-400">
                                                            <strong>Nominal:</strong>&nbsp;
                                                            {formatCurrency(calculationResult.retirementCapital!)}
                                                        </p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-orange-100 dark:bg-orange-900 border-orange-300 dark:border-orange-700">
                                            <CardHeader>
                                                <div className="flex items-center text-orange-700 dark:text-orange-300">
                                                    <TrendingUp className="mr-2 h-5 w-5" />
                                                    <CardTitle className="text-xl">
                                                        Mögliche mtl. Netto-Rente
                                                    </CardTitle>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-4xl font-bold text-orange-800 dark:text-orange-200">
                                                    {formatCurrency(calculationResult.monthlyPayoutNetto!)}
                                                </div>
                                                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                                                    Real (heutige Kaufkraft, Brutto wärens: {formatCurrency(calculationResult.monthlyPayoutBrutto!)})
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </>
                                )}
                                {isAgeMode && 'retirementAge' in calculationResult && (
                                    <Card className="bg-blue-100 dark:bg-blue-900 col-span-2 border-blue-300 dark:border-blue-700">
                                        <CardHeader>
                                            <div className="flex items-center text-blue-700 dark:text-blue-300">
                                                <Clock className="mr-2 h-5 w-5" />
                                                <CardTitle className="text-xl">
                                                    Frühestes Rentenalter
                                                </CardTitle>
                                            </div>
                                            <CardDescription className="text-blue-600 dark:text-blue-400">
                                                Um Ihre gewünschte Rente von {formatCurrency(formData.desiredNetPayout)} netto zu erhalten.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-4xl font-bold text-blue-800 dark:text-blue-200">
                                                {calculationResult.retirementAge} Jahre
                                            </div>
                                            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                                                Benötigtes reales Kapital: {formatCurrency(calculationResult.requiredCapital!)}
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                                {isSavingsMode && 'requiredMonthlySavingsRate' in calculationResult && (
                                    <Card className="bg-green-100 dark:bg-green-900 col-span-2 border-green-300 dark:border-green-700">
                                        <CardHeader>
                                            <div className="flex items-center text-green-700 dark:text-green-300">
                                                <Euro className="mr-2 h-5 w-5" />
                                                <CardTitle className="text-xl">
                                                    Notwendige monatliche Sparrate
                                                </CardTitle>
                                            </div>
                                             <CardDescription className="text-green-600 dark:text-green-400">
                                                Um Ihre gewünschte Rente von {formatCurrency(formData.desiredNetPayout)} netto zu erhalten.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-4xl font-bold text-green-800 dark:text-green-200">
                                                {formatCurrency(calculationResult.requiredMonthlySavingsRate!)}
                                            </div>
                                             <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                                Benötigtes nominales Kapital: {formatCurrency(calculationResult.futureCapital!)}
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        )}

                        {/* Chart Toggles */}
                        {(isPayoutMode || isAgeMode) && !error && calculationResult && (
                            <div className="bg-white p-4 rounded-lg shadow-md space-y-4 dark:bg-black">
                                <h3 className="text-lg font-semibold flex items-center">
                                    <TrendingUp className="mr-2 h-5 w-5" /> Diagramm-Optionen
                                </h3>
                                <div className="flex flex-wrap justify-start items-center w-full gap-x-8 gap-y-4">
                                    <div className="flex gap-2 items-center">
                                        <Switch
                                            id="showNominalCapital"
                                            checked={formData.showNominalCapital}
                                            onCheckedChange={(checked) =>
                                                memoizedHandleInputChange("showNominalCapital", checked)
                                            }
                                        />
                                        <Label htmlFor="showNominalCapital">
                                            Nominales Kapital
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            id="showContributions"
                                            checked={formData.showContributions}
                                            onCheckedChange={(checked) =>
                                                memoizedHandleInputChange("showContributions", checked)
                                            }
                                        />
                                        <Label htmlFor="showContributions">
                                            Einzahlungen
                                        </Label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Chart for Payout and Age modes */}
                        {(isPayoutMode || isAgeMode) && !error && calculationResult && 'chartData' in calculationResult && (
                            <div className="bg-white p-4 rounded-lg shadow-md dark:bg-slate-800">
                                <ResponsiveContainer width="100%" height={400}>
                                    <AreaChart
                                        data={calculationResult.chartData || []}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="2 2" opacity={0.3} />
                                        <XAxis
                                            width={"auto"}
                                            dataKey="age"
                                            type="number"
                                            domain={['dataMin', 'dataMax']}
                                            allowDecimals={false}
                                            tickCount={15}
                                            tickFormatter={(value) => value.toString() + "J"}
                                            // label={{ value: "Alter", position: "insideBottom", offset: -5 }}
                                        />
                                        <YAxis
                                            width={"auto"}
                                            tickCount={8}
                                            tickFormatter={(value) => formatCurrency(value)}
                                            // label={{ value: "Kapital", angle: -90, position: "insideLeft", offset: 10 }}
                                        />
                                        <Tooltip
                                            formatter={(value: number, name: string) => [
                                                formatCurrency(value),
                                                name,
                                            ]}
                                        />
                                        <Legend />

                                        {/* Real Capital Areas */}
                                        <Area type="step" dataKey="Entnahme-Kapital-Real" name="Entnahme-Kapital (Real)" stroke="#a855f7" fill="#a855f7" fillOpacity={0.35} strokeWidth={2} connectNulls />
                                        <Area type="step" dataKey="Anspar-Kapital-Real" name="Anspar-Kapital (Real)" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.35} strokeWidth={2} connectNulls />

                                        {/* Nominal Capital Areas */}
                                        {formData.showNominalCapital && (
                                            <>
                                                <Area type="step" dataKey="Entnahme-Kapital-Nominal" name="Entnahme-Kapital (Nominal)" stroke="#a855f7" fill="#a855f7" fillOpacity={0.15} strokeWidth={1} strokeDasharray="5 5" connectNulls />
                                                <Area type="step" dataKey="Anspar-Kapital-Nominal" name="Anspar-Kapital (Nominal)" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={1} strokeDasharray="5 5" connectNulls />
                                            </>
                                        )}

                                        {/* Contributions Area */}
                                        {formData.showContributions && (
                                            <Area type="step" dataKey="Einzahlungen" name="Einzahlungen" stroke="#16a34a" fill="transparent" strokeWidth={2} strokeDasharray="5 5" connectNulls />
                                        )}
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="p-6 text-sm text-gray-500 flex justify-between items-center">
                    <p>
                        Hinweis: Dies ist ein Modell, keine Garantie. Die tatsächliche Rendite kann von der hier angegebenen Schätzung abweichen.
                    </p>
                </CardFooter>
            </Card>
        </TooltipProvider>
    );
}
