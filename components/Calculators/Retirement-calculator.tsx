"use client"

import {
	Calculator, Calendar, Clock, Coins, Euro, HelpCircle, TrendingUp, Wallet
} from "lucide-react";
import LZString from "lz-string";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
	Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
	Tooltip as ShadcnTooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from "@/components/ui/tooltip";

import { formatCurrency, formatCurrencyPrecise } from "./tools";

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
        dynamicSavingsAdjustment: false, // Default to false
        savingsIncreaseRate: 2, // Default to 2% annual increase
        showNominalCapital: true, // Default to true
        showContributions: true, // Default to true
    });
    const [shareMessage, setShareMessage] = useState<string | null>(null); // State for share message


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

        const rateOfReturn = rawYield / 100;
        const inflationRate = rawInflation / 100;
        const taxFactor = 1 - taxRate / 100;
        let currentAnnualSavings = getAnnualSavings(savingsRate, savingsInterval);

        let accumulatedCapital = currentCapital;
        let cumulativeContributions = currentCapital; // Start with currentCapital for contributions
        const savingsPhaseData = [];
        const payoutPhaseData = [];

        let cumulativeInflationFactor = 1;

        // Savings phase
        for (let year = currentAge; year <= desiredRetirementAge; year++) {
            const yearIndex = year - currentAge;
            if (yearIndex > 0) {
                // Apply dynamic savings rate increase if enabled and in relevant modes
                if (
                    dynamicSavingsAdjustment &&
                    savingsIncreaseRate > 0 &&
                    (calculationType === "calculate_monthly_payout" ||
                        calculationType === "calculate_retirement_age")
                ) {
                    currentAnnualSavings = currentAnnualSavings * (1 + savingsIncreaseRate / 100);
                }
                accumulatedCapital =
                    accumulatedCapital * (1 + rateOfReturn) + currentAnnualSavings;
                cumulativeContributions += currentAnnualSavings; // Add current year's savings to total contributions
                cumulativeInflationFactor = cumulativeInflationFactor * (1 + inflationRate);
            }
            savingsPhaseData.push({
                age: year,
                "Kapital nominal": accumulatedCapital,
                "Kapital real": accumulatedCapital / cumulativeInflationFactor,
                "Einzahlungen": cumulativeContributions, // Add contributions to data
            });
        }

        const retirementCapital = accumulatedCapital;

        // Calculation for the "max monthly payout" mode
        if (calculationType === "calculate_monthly_payout") {
            // Payout phase
            if (annuityType === "endless") {
                const monthlyPayoutBrutto = (retirementCapital * rateOfReturn) / 12;
                const monthlyPayoutNetto = monthlyPayoutBrutto * taxFactor;

                let currentPayoutCapital = retirementCapital;
                let currentInflationFactor = cumulativeInflationFactor;
                for (let year = desiredRetirementAge; year <= lifeExpectancy; year++) {
                    const yearIndex = year - desiredRetirementAge;
                    if (yearIndex > 0) {
                        currentPayoutCapital = currentPayoutCapital * (1 + rateOfReturn) - monthlyPayoutBrutto * 12;
                        currentInflationFactor = currentInflationFactor * (1 + inflationRate);
                    }
                    payoutPhaseData.push({
                        age: year,
                        "Kapital nominal": currentPayoutCapital,
                        "Kapital real": currentPayoutCapital / currentInflationFactor,
                        "Einzahlungen": cumulativeContributions, // Contributions remain constant in payout phase
                    });
                }

                return {
                    retirementCapital,
                    monthlyPayoutBrutto,
                    monthlyPayoutNetto,
                    savingsPhaseData,
                    payoutPhaseData,
                    type: "payout",
                };
            } else {
                const yearsInRetirement = lifeExpectancy - desiredRetirementAge;
                const totalMonths = yearsInRetirement * 12;
                const monthlyRate = Math.pow(1 + rateOfReturn, 1 / 12) - 1;

                const monthlyPayoutBrutto =
                    (retirementCapital * monthlyRate) /
                    (1 - Math.pow(1 + monthlyRate, -totalMonths));
                const monthlyPayoutNetto = monthlyPayoutBrutto * taxFactor;

                let currentPayoutCapital = retirementCapital;
                let currentInflationFactor = cumulativeInflationFactor;
                for (
                    let year = desiredRetirementAge;
                    year <= lifeExpectancy;
                    year++
                ) {
                    const yearIndex = year - desiredRetirementAge;
                    if (yearIndex > 0) {
                        currentPayoutCapital =
                            currentPayoutCapital * Math.pow(1 + rateOfReturn, 1) -
                            monthlyPayoutBrutto * 12;
                        currentInflationFactor = currentInflationFactor * (1 + inflationRate);
                    }
                    payoutPhaseData.push({
                        age: year,
                        "Kapital nominal": currentPayoutCapital,
                        "Kapital real": currentPayoutCapital / currentInflationFactor,
                        "Einzahlungen": cumulativeContributions, // Contributions remain constant in payout phase
                    });
                }

                return {
                    retirementCapital,
                    monthlyPayoutBrutto,
                    monthlyPayoutNetto,
                    savingsPhaseData,
                    payoutPhaseData,
                    type: "payout",
                };
            }
        }

        // Calculation for the "calculate retirement age" mode
        if (calculationType === "calculate_retirement_age") {
            const annualNetPayout = desiredNetPayout * 12;
            const annualGrossPayout = annualNetPayout / taxFactor;
            let requiredCapital = 0;

            if (annuityType === "endless") {
                requiredCapital = annualGrossPayout / rateOfReturn;
            } else {
                const yearsToConsume = lifeExpectancy - desiredRetirementAge;
                const monthlyRate = Math.pow(1 + rateOfReturn, 1 / 12) - 1;
                const totalMonths = yearsToConsume * 12;
                requiredCapital =
                    (annualGrossPayout / 12) *
                    ((1 - Math.pow(1 + monthlyRate, -totalMonths)) / monthlyRate);
            }

            let retirementAge = currentAge;
            let currentCapitalSim = currentCapital;
            let currentAnnualSavingsSim = getAnnualSavings(savingsRate, savingsInterval);
            let cumulativeContributionsSim = currentCapital; // Initialize for simulation
            const savingsPhaseDataSim = [];

            while (currentCapitalSim < requiredCapital) {
                if (retirementAge >= 100) {
                    retirementAge = 100;
                    break;
                }
                const yearIndex = retirementAge - currentAge;
                const inflationFactor = Math.pow(1 + inflationRate, yearIndex);

                if (dynamicSavingsAdjustment && savingsIncreaseRate > 0) {
                    currentAnnualSavingsSim = currentAnnualSavingsSim * (1 + savingsIncreaseRate / 100);
                }

                currentCapitalSim =
                    currentCapitalSim * (1 + rateOfReturn) + currentAnnualSavingsSim;
                cumulativeContributionsSim += currentAnnualSavingsSim; // Add to contributions for simulation

                savingsPhaseDataSim.push({
                    age: retirementAge + 1,
                    "Kapital nominal": currentCapitalSim,
                    "Kapital real": currentCapitalSim / inflationFactor,
                    "Einzahlungen": cumulativeContributionsSim, // Add contributions to data
                });
                retirementAge++;
            }

            return {
                requiredCapital,
                retirementAge: retirementAge - 1,
                savingsPhaseData: savingsPhaseDataSim,
                type: "age",
            };
        }

        // Calculation for the "calculate savings rate" mode
        if (calculationType === "calculate_savings_rate") {
            const yearsToRetirement = desiredRetirementAge - currentAge;
            const totalMonths = yearsToRetirement * 12;
            const monthlyRate = Math.pow(1 + rateOfReturn, 1 / 12) - 1;

            const annualNetPayout = desiredNetPayout * 12;
            const annualGrossPayout = annualNetPayout / taxFactor;
            let requiredCapital = 0;

            if (annuityType === "endless") {
                requiredCapital = annualGrossPayout / rateOfReturn;
            } else {
                const yearsInRetirement = lifeExpectancy - desiredRetirementAge;
                const retirementTotalMonths = yearsInRetirement * 12;
                requiredCapital =
                    (annualGrossPayout / 12) *
                    ((1 - Math.pow(1 + monthlyRate, -retirementTotalMonths)) / monthlyRate);
            }

            const futureValueFactor = (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;

            const futureValueFromCurrentCapital = currentCapital * Math.pow(1 + monthlyRate, totalMonths);

            const requiredFutureSavings = requiredCapital - futureValueFromCurrentCapital;
            const requiredMonthlySavingsRate = requiredFutureSavings / futureValueFactor;

            return {
                futureCapital: requiredFutureSavings,
                requiredMonthlySavingsRate: requiredMonthlySavingsRate > 0 ? requiredMonthlySavingsRate : 0,
                type: "savings",
            };
        }

        return null;
    }, [formData, calculationType]);

    const memoizedHandleInputChange = useCallback((field: keyof FormData, value: string | number | boolean) => {
        setFormData((prev) => ({
            ...prev,
            [field]: typeof value === "string" && field !== "savingsInterval" ? parseFloat(value) : value,
        }));
    }, []);

    // Handle share config button click
    const handleShareConfig = () => {
        const serialized = serializeState();
        const shareUrl = `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH || ''}/calculators?share=${serialized}`;
        try {
            document.execCommand('copy'); // Fallback for older browsers
            navigator.clipboard.writeText(shareUrl).then(() => {
                setShareMessage("Link kopiert!");
                setTimeout(() => setShareMessage(null), 3000);
            }).catch(() => {
                // Fallback if writeText fails (e.g., not in secure context or permissions)
                const textarea = document.createElement('textarea');
                textarea.value = shareUrl;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                setShareMessage("Link kopiert! (Fallback)");
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
                                            Rendite in der Ansparphase p.a. (%)
                                        </Label>
                                        <ShadcnTooltip>
                                            <TooltipTrigger>
                                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    Die jährliche Rendite, die Sie während der
                                                    Ansparphase erwarten.
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
                                                    Die jährliche Inflationsrate, die die Kaufkraft
                                                    reduziert.
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
                                                Monatliche Sparrate (€)
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
                                            <ShadcnTooltip>
                                                <TooltipTrigger>
                                                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>
                                                        Die Häufigkeit, mit der die Sparrate eingezahlt
                                                        wird.
                                                    </p>
                                                </TooltipContent>
                                            </ShadcnTooltip>
                                        </div>
                                        <Select
                                            value={formData.savingsInterval}
                                            onValueChange={(value: FormData["savingsInterval"]) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    savingsInterval: value,
                                                }))
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
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="dynamicSavingsAdjustment">
                                                Dynamische Sparraten-Anpassung?
                                            </Label>
                                            <ShadcnTooltip>
                                                <TooltipTrigger>
                                                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>
                                                        Erhöhen Sie Ihre Sparrate jährlich um einen
                                                        festen Prozentsatz.
                                                    </p>
                                                </TooltipContent>
                                            </ShadcnTooltip>
                                        </div>
                                        <Switch
                                            id="dynamicSavingsAdjustment"
                                            checked={formData.dynamicSavingsAdjustment}
                                            onCheckedChange={(checked) =>
                                                memoizedHandleInputChange("dynamicSavingsAdjustment", checked)
                                            }
                                        />
                                    </div>
                                )}

                                {/* Savings Increase Rate - visible if dynamic adjustment is on */}
                                {showDynamicSavingsSection && formData.dynamicSavingsAdjustment && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="savingsIncreaseRate">
                                                Jährliche Steigerung der Sparrate (%)
                                            </Label>
                                            <ShadcnTooltip>
                                                <TooltipTrigger>
                                                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>
                                                        Der Prozentsatz, um den Ihre Sparrate jedes
                                                        Jahr erhöht wird.
                                                    </p>
                                                </TooltipContent>
                                            </ShadcnTooltip>
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
                                            <ShadcnTooltip>
                                                <TooltipTrigger>
                                                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>
                                                        Das Alter, in dem Sie in Rente gehen möchten.
                                                    </p>
                                                </TooltipContent>
                                            </ShadcnTooltip>
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
                                                Gewünschte monatliche Netto-Rente (€)
                                            </Label>
                                            <ShadcnTooltip>
                                                <TooltipTrigger>
                                                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Ihre gewünschte monatliche Auszahlung nach Steuern.</p>
                                                </TooltipContent>
                                            </ShadcnTooltip>
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
                                        <Label htmlFor="taxRate">Steuersatz / Auszahlung (%)</Label>
                                        <ShadcnTooltip>
                                            <TooltipTrigger>
                                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    Der Steuersatz, der auf die Auszahlung angewendet wird.
                                                </p>
                                            </TooltipContent>
                                        </ShadcnTooltip>
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
                                {(isPayoutMode || isAgeMode) && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label>Entnahme</Label>
                                            <ShadcnTooltip>
                                                <TooltipTrigger>
                                                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>
                                                        Kapitalverzehr: Das Kapital wird bis zur
                                                        Lebenserwartung verbraucht.<br />Endlos: Das Kapital
                                                        bleibt erhalten.
                                                    </p>
                                                </TooltipContent>
                                            </ShadcnTooltip>
                                        </div>
                                        <RadioGroup
                                            value={formData.annuityType}
                                            onValueChange={(value: AnnuityType) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    annuityType: value,
                                                }))
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
                                                <Label htmlFor="endless">Endlos</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                )}

                                {/* Life Expectancy - visible for Capital Consumption mode */}
                                {formData.annuityType === "capital_consumption" &&
                                    (isPayoutMode || isAgeMode) && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="lifeExpectancy">
                                                    Lebenserwartung (Alter)
                                                </Label>
                                                <ShadcnTooltip>
                                                    <TooltipTrigger>
                                                        <HelpCircle className="h-4 w-4 text-gray-500" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Das Alter, bis zu dem das Kapital aufgebraucht
                                                            sein soll.
                                                        </p>
                                                    </TooltipContent>
                                                </ShadcnTooltip>
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
                        {/* Display Result Cards */}
                        {calculationResult && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {isPayoutMode && (
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
                                                    {formatCurrency(calculationResult.retirementCapital!)}
                                                </div>
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
                                                    ({formatCurrency(calculationResult.monthlyPayoutBrutto!)} brutto)
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </>
                                )}
                                {isAgeMode && (
                                    <Card className="bg-blue-100 dark:bg-blue-900 col-span-2 border-blue-300 dark:border-blue-700">
                                        <CardHeader>
                                            <div className="flex flex-wrap items-center text-blue-700 dark:text-blue-300">
                                                <Clock className="mr-2 h-5 w-5" />
                                                <CardTitle className="text-xl flex-9/12">
                                                    Frühestes Rentenalter
                                                </CardTitle>
                                                <CardDescription>
                                                    Dann reicht das Kapital um monatlich {formatCurrency(formData.desiredNetPayout)} ({formatCurrency(formData.desiredNetPayout * (1 + formData.taxRate / 100))} brutto) zu entnehmen
                                                </CardDescription>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-4xl font-bold text-blue-800 dark:text-blue-200">
                                                {calculationResult.retirementAge} Jahre
                                            </div>
                                            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                                                Erforderliches Kapital: {formatCurrency(calculationResult.requiredCapital!)}
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                                {isSavingsMode && (
                                    <Card className="bg-green-100 dark:bg-green-900 col-span-2 border-green-300 dark:border-green-700">
                                        <CardHeader>
                                            <div className="flex flex-wrap items-center text-green-700 dark:text-green-300">
                                                <Euro className="mr-2 h-5 w-5" />
                                                <CardTitle className="text-xl flex-9/12">
                                                    Notwendige monatliche Sparrate
                                                </CardTitle>
                                                <CardDescription>
                                                    Dann reicht das Kapital ({formatCurrencyPrecise(calculationResult.futureCapital!)}) um monatlich {formatCurrency(formData.desiredNetPayout)} ({formatCurrency(formData.desiredNetPayout * (1 + formData.taxRate / 100))} brutto) zu entnehmen
                                                </CardDescription>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-4xl font-bold text-green-800 dark:text-green-200">
                                                {formatCurrency(calculationResult.requiredMonthlySavingsRate!)}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        )}

                        {/* Chart Toggles */}
                        {(isPayoutMode || isAgeMode) && (
                            <div className="bg-white p-4 rounded-lg shadow-md space-y-4 dark:bg-black">
                                <h3 className="text-lg font-semibold flex items-center">
                                    <TrendingUp className="mr-2 h-5 w-5" /> Diagramm-Optionen
                                </h3>
                                <div className="flex flex-wrap justify-between items-center w-full gap-5">
                                    <div className="flex gap-2 items-center">
                                        <Label htmlFor="showNominalCapital">
                                            Nominales Kapital anzeigen?
                                        </Label>
                                        <ShadcnTooltip>
                                            <TooltipTrigger>
                                                <HelpCircle className="h-4 w-4 text-gray-500" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Zeigt das Kapital ohne Inflationsbereinigung an.</p>
                                            </TooltipContent>
                                        </ShadcnTooltip>
                                        <Switch
                                            id="showNominalCapital"
                                            checked={formData.showNominalCapital}
                                            onCheckedChange={(checked) =>
                                                memoizedHandleInputChange("showNominalCapital", checked)
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Label htmlFor="showContributions">
                                            Kumulierte Einzahlungen anzeigen?
                                        </Label>
                                        <ShadcnTooltip>
                                            <TooltipTrigger>
                                                <HelpCircle className="h-4 w-4 text-gray-500" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Zeigt die Summe Ihrer eigenen Einzahlungen an.</p>
                                            </TooltipContent>
                                        </ShadcnTooltip>
                                        <Switch
                                            id="showContributions"
                                            checked={formData.showContributions}
                                            onCheckedChange={(checked) =>
                                                memoizedHandleInputChange("showContributions", checked)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Chart for Payout and Age modes */}
                        {(isPayoutMode || isAgeMode) && calculationResult && (
                            <div className="bg-white p-4 rounded-lg shadow-md dark:bg-slate-800">
                                <ResponsiveContainer width="100%" height={400}>
                                    <AreaChart
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="age"
                                            type="number"
                                            domain={["dataMin", "dataMax"]}
                                            allowDecimals={false}
                                            ticks={[
                                                ...(calculationResult.savingsPhaseData?.map(d => d.age) || []),
                                                ...(isPayoutMode ? (calculationResult.payoutPhaseData?.map(d => d.age) || []) : []),
                                            ].flat().filter(v => v !== undefined)}
                                        />
                                        <YAxis
                                            width="auto"
                                            tickFormatter={formatCurrency}
                                        />
                                        <Tooltip
                                            formatter={(value: number, name: string) => [
                                                formatCurrency(value),
                                                name,
                                            ]}
                                        />
                                        <Legend content={({ payload }) => (
                                            <ul
                                                style={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    justifyContent: "center",
                                                    columnGap: "32px",
                                                    rowGap: "12px",
                                                    listStyle: "none",
                                                    margin: 0,
                                                    padding: 0,
                                                }}
                                            >
                                                {payload?.map((entry, index) => {
                                                    const isNominal = entry.value?.toLowerCase().includes("nominal");
                                                    const isContributions = entry.value?.toLowerCase().includes("einzahlungen");
                                                    const color = entry.color;

                                                    // Only render legend items for visible lines
                                                    if (
                                                        (isNominal && !formData.showNominalCapital) ||
                                                        (isContributions && !formData.showContributions) ||
                                                        (entry.value?.toLowerCase().includes("real") && formData.inflation === 0) ||
                                                        (entry.value?.toLowerCase().includes("entnahme-kapital") && !isPayoutMode)
                                                    ) {
                                                        return null;
                                                    }

                                                    return (
                                                        <li
                                                            key={`legend-${index}`}
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                opacity: isNominal ? 0.4 : 1, // Nominal still slightly faded
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    position: "relative",
                                                                    width: 32,
                                                                    height: 2,
                                                                    marginRight: 8,
                                                                    backgroundColor: "transparent",
                                                                    borderBottom: isNominal || isContributions
                                                                        ? `2px dashed ${color}`
                                                                        : `2px solid ${color}`,
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        position: "absolute",
                                                                        top: -2,
                                                                        left: "50%",
                                                                        transform: "translateX(-50%)",
                                                                        width: 6,
                                                                        height: 6,
                                                                        backgroundColor: color,
                                                                        borderRadius: "50%",
                                                                    }}
                                                                />
                                                            </div>
                                                            <span style={{ fontSize: 12, color }}>{entry.value}</span>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )} />
                                        {/* Savings Phase Lines */}
                                        {formData.showNominalCapital && (
                                            <Area
                                                type="step"
                                                dataKey="Kapital nominal"
                                                data={calculationResult.savingsPhaseData}
                                                stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} strokeWidth={2} strokeOpacity={0.3}
                                                name="Anspar-Kapital (nominal)"
                                            />
                                        )}
                                        {formData.inflation > 0 && (
                                            <Area
                                                type="step"
                                                dataKey="Kapital real"
                                                data={calculationResult.savingsPhaseData}
                                                stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} strokeWidth={2} strokeOpacity={0.3}
                                                name="Anspar-Kapital (real - mit inflation)"
                                            />
                                        )}
                                        {/* Area for Contributions */}
                                        {formData.showContributions && (
                                            <Area
                                                type="step"
                                                dataKey="Einzahlungen"
                                                data={calculationResult.savingsPhaseData}
                                                stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} strokeDasharray="5 5"
                                                name="Kumulierte Einzahlungen"
                                            />
                                        )}
                                        {/* Payout Phase Lines */}
                                        {isPayoutMode && calculationResult.payoutPhaseData && calculationResult.payoutPhaseData.length > 0 && (
                                            <>
                                                {formData.showNominalCapital && (
                                                    <Area
                                                        type="step"
                                                        dataKey="Kapital nominal"
                                                        data={calculationResult.payoutPhaseData}
                                                        stroke="#9333ea" fill="#9333ea" fillOpacity={0.2} strokeOpacity={0.3}
                                                        name="Entnahme-Kapital (nominal)"
                                                    />
                                                )}
                                                {formData.inflation > 0 && (
                                                    <Area
                                                        type="step"
                                                        dataKey="Kapital real"
                                                        data={calculationResult.payoutPhaseData}
                                                        stroke="#9333ea" fill="#9333ea" fillOpacity={0.2} strokeOpacity={0.3}
                                                        name="Entnahme-Kapital (real - mit inflation)"
                                                    />
                                                )}
                                            </>
                                        )}
                                    </AreaChart>
                                </ResponsiveContainer>
                                <Separator className="my-4" />
                                <div className="text-sm text-gray-500 space-y-2">
                                    {formData.showNominalCapital && (
                                        <p>
                                            <span className="text-blue-600 font-bold">Die blaue Linie</span> zeigt das <b>nominale Kapital</b> in der Ansparphase.
                                        </p>
                                    )}
                                    {formData.inflation > 0 && (
                                        <p>
                                            Die hellere blaue Linie zeigt den <b>realen (inflationsbereinigten) Wert</b> des Ansparkapitals.
                                        </p>
                                    )}
                                    {formData.showContributions && (
                                        <p>
                                            <span className="text-green-600 font-bold">Die grüne gestrichelte Linie</span> zeigt die <b>kumulierten Einzahlungen</b>, also den Betrag, den Sie über die Jahre selbst angespart haben.
                                        </p>
                                    )}
                                    {isPayoutMode && formData.showNominalCapital && (
                                        <p>
                                            <span className="text-purple-600 font-bold">Die violette Linie</span> zeigt das <b>nominale Kapital</b> in der Entnahmephase.
                                        </p>
                                    )}
                                    {isPayoutMode && formData.inflation > 0 && (
                                        <p>
                                            Die hellere violette Linie zeigt den <b>realen (inflationsbereinigten) Wert</b> des Entnahmekapitals, der bei Entnahmen immer sinkt.
                                        </p>
                                    )}
                                </div>
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
