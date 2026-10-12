"use client";

import { TrendingDown, TrendingUp, AlertTriangle, HelpCircle } from "lucide-react";
import LZString from "lz-string";
import React, { useCallback, useMemo, useState } from "react";
import {
    Bar, BarChart, CartesianGrid, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

import {
    Card, CardContent, CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PensionGapData } from "@/lib/calculator-types";
import { copyShareUrlToClipboard, getShareUrl } from "@/lib/share-utils";
import { CalculatorBanner } from "./CalculatorBanner";
import { CalculatorHeader } from "./CalculatorHeader";
import { formatCurrency, formatCurrencyPrecise } from "./tools";

interface PensionGapCalculatorProps {
    initialData?: PensionGapData | null;
}

export function PensionGapCalculator({ initialData }: PensionGapCalculatorProps) {
    const [form, setForm] = useState<PensionGapData>(initialData || {
        currentAge: 35,
        retirementAge: 67,
        currentGrossIncome: 4500,
        expectedStatePension: 1600,
        desiredNetReplacementRate: 80,
        expectedReturn: 6,
        inflation: 2,
    });
    const [shareMessage, setShareMessage] = useState<string | null>(null);

    const result = useMemo(() => {
        const yearsToRetirement = Math.max(1, form.retirementAge - form.currentAge);
        const desiredNetPension = (form.currentGrossIncome * (form.desiredNetReplacementRate / 100));
        const gapMonthly = Math.max(0, desiredNetPension - form.expectedStatePension);
        const gapAnnual = gapMonthly * 12;

        const realReturn = form.expectedReturn / 100 - form.inflation / 100;
        const monthlyRate = realReturn > 0
            ? gapAnnual / ((Math.pow(1 + realReturn, yearsToRetirement) - 1) / realReturn) / 12
            : gapAnnual / yearsToRetirement / 12;

        const totalNeededCapital = gapAnnual / 0.04; // 4% rule approximation

        return {
            yearsToRetirement,
            desiredNetPension,
            gapMonthly,
            gapAnnual,
            monthlyRate,
            totalNeededCapital,
        };
    }, [form]);

    const chartData = useMemo(() => {
        const data = [];
        const step = Math.max(1, Math.round((form.retirementAge - form.currentAge) / 6));
        for (let age = form.currentAge; age <= form.retirementAge; age += step) {
            const yearsPassed = age - form.currentAge;
            const realReturn = form.expectedReturn / 100 - form.inflation / 100;
            const projectedSavings = result.monthlyRate * 12 * ((Math.pow(1 + Math.max(0, realReturn), Math.max(1, yearsPassed)) - 1) / Math.max(0.001, realReturn));
            data.push({
                age: `${age}J`,
                "Gesetzliche Rente": form.expectedStatePension * 12,
                "Private Lücke": result.gapAnnual,
                "Aufgebautes Vermögen": Math.min(projectedSavings, result.totalNeededCapital),
            });
        }
        return data;
    }, [form, result]);

    const serializeState = useCallback(() => {
        const state = { type: "pension-gap", data: form };
        return LZString.compressToEncodedURIComponent(JSON.stringify(state));
    }, [form]);

    const handleShareConfig = async () => {
        const serialized = serializeState();
        const shareUrl = getShareUrl('pension-gap', serialized);
        const copied = await copyShareUrlToClipboard(shareUrl);
        if (copied) {
            setShareMessage("Link kopiert!");
        } else {
            setShareMessage("Kopieren fehlgeschlagen!");
        }
        setTimeout(() => setShareMessage(null), 3000);
    };

    const update = (key: keyof PensionGapData, value: number) => {
        setForm(prev => ({ ...prev, [key]: Math.max(0, value) }));
    };

    const validationError = useMemo(() => {
        if (form.currentAge >= form.retirementAge) {
            return "Das geplante Rentenalter muss höher sein als das aktuelle Alter.";
        }
        if (form.currentGrossIncome <= 0) {
            return "Das Bruttogehalt muss größer als 0 € sein.";
        }
        if (form.expectedReturn <= form.inflation) {
            return "Hinweis: Die angenommene Rendite liegt auf oder unter der Inflationsrate. Kein realer Kapitalzuwachs.";
        }
        return null;
    }, [form]);

    return (
        <Card className="w-full shadow-xl rounded-2xl overflow-hidden py-0 border-border/70 dark:bg-card/90 backdrop-blur-md">
            <CalculatorHeader
                title="Rentenlückenrechner"
                description="Berechnen Sie die Differenz zwischen Ihrem aktuellen Einkommen und der voraussichtlichen gesetzlichen Rente."
                icon={TrendingDown}
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
                                Einkommen & Zeiten
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Definieren Sie Altersgrenzen und Versorgungswünsche.
                            </p>
                        </div>

                        <div className="space-y-3.5">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="currentAge" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aktuelles Alter</Label>
                                    <Input min={18} max={99} id="currentAge" type="number" value={form.currentAge} onChange={e => update("currentAge", Number(e.target.value))} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="retirementAge" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rentenalter</Label>
                                    <Input min={form.currentAge + 1} max={100} id="retirementAge" type="number" value={form.retirementAge} onChange={e => update("retirementAge", Number(e.target.value))} />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="currentGrossIncome" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bruttogehalt (€/Monat)</Label>
                                <Input min={0} id="currentGrossIncome" type="number" value={form.currentGrossIncome} onChange={e => update("currentGrossIncome", Number(e.target.value))} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="expectedStatePension" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Gesetzliche Rente (€/Monat)</Label>
                                <Input min={0} id="expectedStatePension" type="number" value={form.expectedStatePension} onChange={e => update("expectedStatePension", Number(e.target.value))} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="desiredNetReplacementRate" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Wunsch-Niveau (% vom Brutto)</Label>
                                <Input min={20} max={120} id="desiredNetReplacementRate" type="number" value={form.desiredNetReplacementRate} onChange={e => update("desiredNetReplacementRate", Number(e.target.value))} />
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
                                <div className="space-y-1.5">
                                    <Label htmlFor="expectedReturn" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rendite (% p.a.)</Label>
                                    <Input min={0} max={25} id="expectedReturn" type="number" step="0.1" value={form.expectedReturn} onChange={e => update("expectedReturn", Number(e.target.value))} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="inflation" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inflation (% p.a.)</Label>
                                    <Input min={0} max={15} id="inflation" type="number" step="0.1" value={form.inflation} onChange={e => update("inflation", Number(e.target.value))} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visualisierung-Maske (Right Column) */}
                    <div className="md:col-span-2 space-y-4">
                        {validationError && (
                            <CalculatorBanner
                                type={validationError.startsWith("Hinweis") ? "warning" : "error"}
                                message={validationError}
                            />
                        )}

                        {/* Top KPI Cards */}
                        <div className="grid sm:grid-cols-3 gap-3">
                            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 backdrop-blur-xs">
                                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Monatliche Rentenlücke</span>
                                <h4 className="text-2xl font-extrabold text-destructive mt-1">
                                    {formatCurrency(result.gapMonthly)}
                                </h4>
                            </div>

                            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 backdrop-blur-xs">
                                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Nötige Sparrate (mtl.)</span>
                                <h4 className="text-2xl font-extrabold text-primary mt-1">
                                    {formatCurrency(result.monthlyRate)}
                                </h4>
                            </div>

                            <div className="rounded-xl border border-border/50 bg-card/40 p-4 backdrop-blur-xs">
                                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Kapitalbedarf (4%-Regel)</span>
                                <h4 className="text-2xl font-bold text-foreground mt-1">
                                    {formatCurrency(result.totalNeededCapital)}
                                </h4>
                            </div>
                        </div>

                        {/* Chart Container */}
                        <div className="rounded-xl border border-border/60 bg-card/60 dark:bg-card/30 p-4 sm:p-5 backdrop-blur-xs">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vermögensaufbau vs. Versorgungslücke</span>
                                <span className="text-xs text-muted-foreground">Noch {result.yearsToRetirement} Jahre Ansparzeit</span>
                            </div>
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                                    <XAxis dataKey="age" stroke="currentColor" className="text-xs opacity-60" />
                                    <YAxis tickFormatter={(val: number) => formatCurrency(val)} width={85} stroke="currentColor" className="text-xs opacity-60" />
                                    <Tooltip
                                        formatter={(val) => formatCurrencyPrecise(val as number)}
                                        contentStyle={{
                                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            color: '#fff',
                                            backdropFilter: 'blur(8px)'
                                        }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                                    <ReferenceLine y={form.expectedStatePension * 12} stroke="currentColor" opacity={0.3} strokeDasharray="4 4" />
                                    <Bar dataKey="Gesetzliche Rente" fill="#0284c7" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Private Lücke" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Aufgebautes Vermögen" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Status Notice */}
                        {result.gapMonthly <= 0 ? (
                            <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 flex items-center gap-3">
                                <TrendingUp className="h-5 w-5 text-emerald-500 shrink-0" />
                                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                                    Ihre prognostizierte gesetzliche Rente deckt Ihren Wunschstandard vollständig ab.
                                </p>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 p-4 flex items-center gap-3">
                                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                                <p className="text-xs text-amber-700 dark:text-amber-300">
                                    Versorgungslücke von {formatCurrency(result.gapMonthly)} / Monat. Bei {form.expectedReturn}% p.a. Rendite reichen bereits {formatCurrency(result.monthlyRate)} monatlich, um die Lücke zu schließen.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CardFooter className="px-6 py-4 text-xs text-muted-foreground border-t border-border/40 flex justify-between items-center bg-card/30">
                <p>
                    Hinweis: Brutto- und Nettowerte können durch zukünftige Steuer- und Abgabenänderungen variieren. Reines Orientierungsmodell.
                </p>
            </CardFooter>
        </Card>
    );
}
