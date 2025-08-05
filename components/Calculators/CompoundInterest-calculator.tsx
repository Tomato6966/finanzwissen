/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { HelpCircle, TrendingUp } from "lucide-react";
import LZString from "lz-string";
import React, { FC, useCallback, useEffect, useState } from "react";
import {
	Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

import { Button } from "@/components/ui/button";
import {
	Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CompoundInterestData } from "@/lib/calculator-types";

import {
	formatCurrency, formatCurrencyPrecise, handleFormChange, handleSelectChange, TooltipWrapper
} from "./tools";

export interface CompoundDataPoint {
    year: number;
    nominal: number;
    real: number;
    minNominal: number;
    maxNominal: number;
    minReal: number;
    maxReal: number;
    contributions: number;
}

interface AdvancedContributionPeriod {
    id: number;
    startYear: number;
    endYear: number;
    amount: number;
}

interface CompoundInterestCalculatorProps {
    initialData: CompoundInterestData | null;
}

export const CompoundInterestCalculator: FC<CompoundInterestCalculatorProps> = ({
    initialData,
}) => {
    // State for all calculators
    const [compoundForm, setCompoundForm] = useState({ principal: 10000, rate: 7, time: 20, contribution: 500, interval: 12 });
    const [useContribution, setUseContribution] = useState<boolean>(true);
    const [inflationRate, setInflationRate] = useState<number>(2.5);
    const [compoundData, setCompoundData] = useState<CompoundDataPoint[]>([]);
    const [showRange, setShowRange] = useState<boolean>(false);
    const [bestCasePercentage, setBestCasePercentage] = useState<number>(2.5);
    const [worstCasePercentage, setWorstCasePercentage] = useState<number>(-2.5);
    const [useAdvancedContribution, setUseAdvancedContribution] = useState<boolean>(false);
    const [advancedContributionPeriods, setAdvancedContributionPeriods] = useState<AdvancedContributionPeriod[]>([
        { id: Date.now(), startYear: 0, endYear: 20, amount: 500 }
    ]);

    const [dynamicSavingsAdjustment, setDynamicSavingsAdjustment] = useState<boolean>(false);
    const [savingsIncreaseRate, setSavingsIncreaseRate] = useState<number>(2);

    const [showContributions, setShowContributions] = useState(true);
    const [showNominal, setShowNominal] = useState(true);

    const [shareMessage, setShareMessage] = useState<string | null>(null); // State for share message


    const serializeState = useCallback(() => {
        const state = {
            type: 'compound',
            data: {
                compoundForm,
                useContribution,
                inflationRate,
                showRange,
                bestCasePercentage,
                worstCasePercentage,
                useAdvancedContribution,
                advancedContributionPeriods,
                dynamicSavingsAdjustment,
                savingsIncreaseRate,
                showContributions,
                showNominal,
            }
        };
        const jsonString = JSON.stringify(state);
        return LZString.compressToEncodedURIComponent(jsonString);
    }, [
        compoundForm, useContribution, inflationRate, showRange, bestCasePercentage,
        worstCasePercentage, useAdvancedContribution, advancedContributionPeriods,
        dynamicSavingsAdjustment, savingsIncreaseRate, showContributions, showNominal
    ]);

    // Effect to read initial state from props
    useEffect(() => {
        if (initialData) {
            setCompoundForm(initialData.compoundForm || { principal: 10000, rate: 7, time: 20, contribution: 500, interval: 12 });
            setUseContribution(initialData.useContribution ?? true);
            setInflationRate(initialData.inflationRate ?? 2.5);
            setShowRange(initialData.showRange ?? false);
            setBestCasePercentage(initialData.bestCasePercentage ?? 2.5);
            setWorstCasePercentage(initialData.worstCasePercentage ?? -2.5);
            setUseAdvancedContribution(initialData.useAdvancedContribution ?? false);
            setAdvancedContributionPeriods(initialData.advancedContributionPeriods || [{ id: Date.now(), startYear: 0, endYear: 20, amount: 500 }]);
            setDynamicSavingsAdjustment(initialData.dynamicSavingsAdjustment ?? false);
            setSavingsIncreaseRate(initialData.savingsIncreaseRate ?? 2);
            setShowContributions(initialData.showContributions ?? true);
            setShowNominal(initialData.showNominal ?? true);
        }
    }, [initialData]);

    const calculateCompoundInterest = () => {
        const { principal, rate, time } = compoundForm;
        const R_nominal = rate / 100;
        const R_inflation = inflationRate / 100;

        const rates = {
            avg: R_nominal,
            max: R_nominal + bestCasePercentage / 100,
            min: R_nominal + worstCasePercentage / 100,
        };

        const finalData: CompoundDataPoint[] = [];

        let balanceAvg = principal;
        let balanceMin = principal;
        let balanceMax = principal;
        let cumulativeContributions = principal; // Start with the initial principal as part of contributions

        for (let year = 0; year <= time; year++) {
            let annualContributionForThisYear = 0;

            if (useContribution) {
                if (useAdvancedContribution) {
                    // If advanced contributions are used, dynamic adjustment is ignored for simplicity
                    const period = advancedContributionPeriods.find(p => year >= p.startYear && year <= p.endYear);
                    if (period) {
                        annualContributionForThisYear = period.amount * compoundForm.interval;
                    }
                } else {
                    // Apply dynamic adjustment only if not using advanced contributions
                    if (dynamicSavingsAdjustment && savingsIncreaseRate > 0 && year > 0) {
                        // Calculate the effective monthly contribution for this specific year
                        // based on the initial monthly contribution and the annual increase rate.
                        const initialMonthlyContribution = compoundForm.contribution;
                        const adjustedMonthlyContribution = initialMonthlyContribution * Math.pow(1 + savingsIncreaseRate / 100, year);
                        annualContributionForThisYear = adjustedMonthlyContribution * compoundForm.interval;
                    } else {
                        annualContributionForThisYear = compoundForm.contribution * compoundForm.interval;
                    }
                }
            }

            if (year > 0) {
                balanceAvg += annualContributionForThisYear;
                balanceMin += annualContributionForThisYear;
                balanceMax += annualContributionForThisYear;
                cumulativeContributions += annualContributionForThisYear;

                balanceAvg *= (1 + rates.avg);
                balanceMin *= (1 + rates.min);
                balanceMax *= (1 + rates.max);
            }

            const realBalanceAvg = balanceAvg / Math.pow(1 + R_inflation, year);
            const realBalanceMin = balanceMin / Math.pow(1 + R_inflation, year);
            const realBalanceMax = balanceMax / Math.pow(1 + R_inflation, year);

            finalData.push({
                year,
                nominal: balanceAvg,
                real: realBalanceAvg,
                minNominal: balanceMin,
                maxNominal: balanceMax,
                minReal: realBalanceMin,
                maxReal: realBalanceMax,
                contributions: cumulativeContributions // This is the cumulative sum
            });
        }
        setCompoundData(finalData);
    };

    // Effect to calculate whenever local state changes
    useEffect(() => {
        calculateCompoundInterest();
    }, [
        compoundForm,
        useContribution,
        inflationRate,
        bestCasePercentage,
        worstCasePercentage,
        useAdvancedContribution,
        advancedContributionPeriods,
        dynamicSavingsAdjustment,
        savingsIncreaseRate,
        showContributions,
        showNominal,
    ]);


    // Handler for advanced contribution periods
    const handleAdvancedContributionChange = (id: number, field: keyof AdvancedContributionPeriod, value: number) => {
        setAdvancedContributionPeriods(prevPeriods =>
            prevPeriods.map(period =>
                period.id === id ? { ...period, [field]: value } : period
            )
        );
    };

    const addAdvancedContributionPeriod = () => {
        const lastPeriod = advancedContributionPeriods[advancedContributionPeriods.length - 1];
        setAdvancedContributionPeriods([...advancedContributionPeriods, { id: Date.now(), startYear: (lastPeriod?.endYear || 0) + 1, endYear: (lastPeriod?.endYear || 0) + 5, amount: 0 }]);
    };

    const removeAdvancedContributionPeriod = (id: AdvancedContributionPeriod["id"]) => {
        setAdvancedContributionPeriods((prevPeriods) => prevPeriods.filter(p => p.id !== id));
    };

    const memoizedHandleFormChange = useCallback(handleFormChange(setCompoundForm), []);
    const memoizedHandleSelectChange = useCallback(handleSelectChange(setCompoundForm, 'interval'), []);

    // Handle share config button click
    const handleShareConfig = () => {
        const serialized = serializeState();
        const shareUrl = `${window.location.origin}/calculators?share=${serialized}`;
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

    return (
        <Card className="w-full max-w-6xl shadow-xl rounded-lg overflow-hidden py-0">
            <CardHeader className="bg-primary text-primary-foreground p-6 rounded-t-lg flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-3xl font-bold flex items-center gap-4">
                        <TrendingUp /> Zinseszinsrechner
                    </CardTitle>
                    <CardDescription className="text-primary-foreground opacity-90 text-sm mt-2">
                        Visualisieren Sie das Wachstum Ihres Vermögens nominal und real (inflationsbereinigt).
                    </CardDescription>
                </div>
                <Button onClick={handleShareConfig} className="ml-4" variant="secondary">
                    {shareMessage || "Share Config"}
                </Button>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-8 pb-6">
                <div className="md:col-span-1 space-y-4">
                    <div>
                        <Label htmlFor="principal">Anfangskapital (€)</Label>
                        <Input id="principal" name="principal" type="number" value={compoundForm.principal} onChange={memoizedHandleFormChange} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="useContribution">Sparrate hinzufügen?</Label>
                        <Switch id="useContribution" checked={useContribution} onCheckedChange={setUseContribution} />
                    </div>
                    {useContribution && (
                        <>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="useAdvancedContribution">Erweiterte Sparrate?</Label>
                                <TooltipWrapper content="Aktivieren Sie dies, um unterschiedliche Sparraten für verschiedene Zeiträume festzulegen.">
                                    <HelpCircle className="w-4 h-4 text-gray-400" />
                                </TooltipWrapper>
                                <Switch id="useAdvancedContribution" checked={useAdvancedContribution} onCheckedChange={setUseAdvancedContribution} />
                            </div>

                            {!useAdvancedContribution ? (
                                <>
                                    <div>
                                        <Label htmlFor="contribution">Monatliche Sparrate (€)</Label>
                                        <Input id="contribution" name="contribution" type="number" value={compoundForm.contribution} onChange={memoizedHandleFormChange} />
                                    </div>
                                    <div>
                                        <Label htmlFor="interval">Intervall</Label>
                                        <Select value={String(compoundForm.interval)} onValueChange={memoizedHandleSelectChange}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="365">Täglich</SelectItem>
                                                <SelectItem value="52">Wöchentlich</SelectItem>
                                                <SelectItem value="26">2-Wöchentlich</SelectItem>
                                                <SelectItem value="12">Monatlich</SelectItem>
                                                <SelectItem value="4">Quartalsweise</SelectItem>
                                                <SelectItem value="1">Jährlich</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {/* Dynamic Savings Adjustment Switch */}
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="dynamicSavingsAdjustment">
                                            Dynamische Sparraten-Anpassung?
                                        </Label>
                                        <TooltipWrapper content="Erhöhen Sie Ihre Sparrate jährlich um einen festen Prozentsatz. Dies gilt nur für die Standard-Sparrate, nicht für die erweiterte Konfiguration.">
                                            <HelpCircle className="h-4 w-4 text-gray-400" />
                                        </TooltipWrapper>
                                        <Switch
                                            id="dynamicSavingsAdjustment"
                                            checked={dynamicSavingsAdjustment}
                                            onCheckedChange={setDynamicSavingsAdjustment}
                                        />
                                    </div>

                                    {/* Savings Increase Rate - visible if dynamic adjustment is on */}
                                    {dynamicSavingsAdjustment && (
                                        <div>
                                            <Label htmlFor="savingsIncreaseRate">
                                                Jährliche Steigerung der Sparrate (%)
                                            </Label>
                                            <Input
                                                id="savingsIncreaseRate"
                                                type="number"
                                                value={savingsIncreaseRate}
                                                onChange={(e) => setSavingsIncreaseRate(parseFloat(e.target.value) || 0)}
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="space-y-4 pt-4">
                                    <h4 className="font-bold border-b pb-2">Erweiterte Sparraten-Konfiguration</h4>
                                    {advancedContributionPeriods.map((period) => (
                                        <div key={period.id} className="flex flex-col gap-2 p-2 border rounded-md bg-gray-50">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <Label htmlFor={`start-year-${period.id}`}>Von Jahr</Label>
                                                    <Input id={`start-year-${period.id}`} type="number" value={period.startYear} onChange={(e) => handleAdvancedContributionChange(period.id, 'startYear', parseFloat(e.target.value) || 0)} />
                                                </div>
                                                <div>
                                                    <Label htmlFor={`end-year-${period.id}`}>Bis Jahr</Label>
                                                    <Input id={`end-year-${period.id}`} type="number" value={period.endYear} onChange={(e) => handleAdvancedContributionChange(period.id, 'endYear', parseFloat(e.target.value) || 0)} />
                                                </div>
                                            </div>
                                            <div>
                                                <Label htmlFor={`amount-${period.id}`}>Monatliche Sparrate (€)</Label>
                                                <Input id={`amount-${period.id}`} type="number" value={period.amount} onChange={(e) => handleAdvancedContributionChange(period.id, 'amount', parseFloat(e.target.value) || 0)} />
                                            </div>
                                            {advancedContributionPeriods.length > 1 && (
                                                <Button variant="ghost" size="sm" onClick={() => removeAdvancedContributionPeriod(period.id)} className="w-full text-red-500">Periode entfernen</Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button onClick={addAdvancedContributionPeriod} className="w-full">Periode hinzufügen</Button>
                                </div>
                            )}
                        </>
                    )}
                    <div>
                        <Label htmlFor="rate" className="flex items-center gap-1">Jährlicher Zinssatz (%)
                            <TooltipWrapper content="Nominale Rendite vor Inflation. Der breite Aktienmarkt (z.B. MSCI World) hat historisch ca. 7-8% p.a. erzielt.">
                                <HelpCircle className="w-4 h-4 text-gray-400" />
                            </TooltipWrapper>
                        </Label>
                        <Input id="rate" name="rate" type="number" step="0.1" value={compoundForm.rate} onChange={memoizedHandleFormChange} />
                    </div>
                    <div>
                        <Label htmlFor="inflationRate" className="flex items-center gap-1">Jährliche Inflationsrate (%)
                            <TooltipWrapper content="Historisch lag die Inflation in vielen Industrieländern zwischen 2% und 3% pro Jahr.">
                                <HelpCircle className="w-4 h-4 text-gray-400" />
                            </TooltipWrapper>
                        </Label>
                        <Input id="inflationRate" name="inflationRate" type="number" step="0.1" value={inflationRate} onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)} />
                    </div>
                    <div>
                        <Label htmlFor="time">Anlagedauer (Jahre)</Label>
                        <Input id="time" name="time" type="number" value={compoundForm.time} onChange={memoizedHandleFormChange} />
                    </div>
                </div>
                <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold">Prognose (Real): {formatCurrency(compoundData[compoundData.length - 1]?.real || 0)}</h4>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="showContributions">Einzahlungen anzeigen</Label>
                                <Switch id="showContributions" checked={showContributions} onCheckedChange={setShowContributions} />
                            </div>
                            <div className="flex items-center gap-2">
                                <Label htmlFor="showNominal">Nominal anzeigen</Label>
                                <Switch id="showNominal" checked={showNominal} onCheckedChange={setShowNominal} />
                            </div>
                            <div className="flex items-center gap-2">
                                <Label htmlFor="showRange">Zeige Bereich</Label>
                                <Switch id="showRange" checked={showRange} onCheckedChange={setShowRange} />
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full justify-center p-5">
                        <ResponsiveContainer width="100%" height={500}>
                            <AreaChart data={compoundData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" unit=" J" />
                                <YAxis tickFormatter={(val: number) => formatCurrency(val)} width={"auto"} />
                                <Tooltip formatter={(value: number, name: string) => [`${formatCurrencyPrecise(value)}`, name]} />
                                {showRange && <Area type="monotone" dataKey="maxReal" stackId="2" stroke="#4ade80" fill="#4ade80" name="Best-Case (Real)" />}
                                <Area type="monotone" dataKey="real" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} name="Erwartet (Real)" />
                                {showRange && <Area type="monotone" dataKey="minReal" stackId="3" stroke="#f87171" fill="#f9c1c1" name="Worst-Case (Real)" />}
                                {showNominal && <Line type="monotone" dataKey="nominal" stroke="#6b7280" dot={false} name="Nominal" />}
                                {showContributions && <Line type="monotone" dataKey="contributions" stroke="#8884d8" strokeDasharray="5 5" dot={false} name="Einzahlungen" />}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-6 text-sm text-gray-500 flex justify-between items-center">
                <p>
                    Hinweis: Dies ist ein Modell, keine Garantie. Die tatsächliche Rendite kann von der hier angegebenen Schätzung abweichen.
                </p>
            </CardFooter>
        </Card>
    );
};
