"use client";

import { TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";
import React, { useMemo, useState } from "react";
import {
    Bar, BarChart, CartesianGrid, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PensionGapData } from "@/lib/calculator-types";

interface PensionGapCalculatorProps {
    initialData?: PensionGapData | null;
}

export function PensionGapCalculator({ initialData }: PensionGapCalculatorProps) {
    const [form, setForm] = useState<PensionGapData>({
        currentAge: 35,
        retirementAge: 67,
        currentGrossIncome: 4500,
        expectedStatePension: 1600,
        desiredNetReplacementRate: 80,
        expectedReturn: 6,
        inflation: 2,
    });

    const result = useMemo(() => {
        const yearsToRetirement = form.retirementAge - form.currentAge;
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
        for (let age = form.currentAge; age <= form.retirementAge; age += 5) {
            const yearsPassed = age - form.currentAge;
            const projectedSavings = result.monthlyRate * 12 * ((Math.pow(1 + (form.expectedReturn / 100 - form.inflation / 100), Math.max(1, yearsPassed)) - 1) / Math.max(0.001, form.expectedReturn / 100 - form.inflation / 100));
            data.push({
                age,
                "Gesetzliche Rente": form.expectedStatePension * 12,
                "Private Lücke": result.gapAnnual,
                "Aufgebautes Vermögen": Math.min(projectedSavings, result.totalNeededCapital),
            });
        }
        return data;
    }, [form, result]);

    const update = (key: keyof PensionGapData, value: number) => {
        setForm(prev => ({ ...prev, [key]: Math.max(0, value) }));
    };

    return (
        <Card className="w-full max-w-5xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-6 w-6 text-primary" />
                    Rentenlücken-Rechner
                </CardTitle>
                <CardDescription>
                    Sieh, wie viel gesetzliche Rente du erwirtschaften kannst und welche Lücke du privat schließen musst — mit monatlichem Sparplan.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                        <Label>Aktuelles Alter</Label>
                        <Input type="number" value={form.currentAge} onChange={e => update("currentAge", Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Geplantes Rentenalter</Label>
                        <Input type="number" value={form.retirementAge} onChange={e => update("retirementAge", Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Aktuelles Bruttogehalt (€/Monat)</Label>
                        <Input type="number" value={form.currentGrossIncome} onChange={e => update("currentGrossIncome", Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Erwartete gesetzliche Rente (€/Monat)</Label>
                        <Input type="number" value={form.expectedStatePension} onChange={e => update("expectedStatePension", Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Gewünschte Netto-Ersatzrate (%)</Label>
                        <Input type="number" value={form.desiredNetReplacementRate} onChange={e => update("desiredNetReplacementRate", Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Erwartete Rendite (% p.a.)</Label>
                        <Input type="number" step="0.1" value={form.expectedReturn} onChange={e => update("expectedReturn", Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Inflation (% p.a.)</Label>
                        <Input type="number" step="0.1" value={form.inflation} onChange={e => update("inflation", Number(e.target.value))} />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-muted/30 transition-all duration-300 ease-out hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 p-4 text-center">
                        <div className="text-sm text-muted-foreground">Monatliche Lücke</div>
                        <div className="text-2xl font-bold text-red-600">{result.gapMonthly.toLocaleString("de-DE")} €</div>
                    </div>
                    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-muted/30 transition-all duration-300 ease-out hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 p-4 text-center">
                        <div className="text-sm text-muted-foreground">Benötigter monatlicher Sparplan</div>
                        <div className="text-2xl font-bold text-primary">{result.monthlyRate.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €</div>
                    </div>
                    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-muted/30 transition-all duration-300 ease-out hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 p-4 text-center">
                        <div className="text-sm text-muted-foreground">Benötigtes Vermögen (4%-Regel)</div>
                        <div className="text-2xl font-bold text-foreground">{result.totalNeededCapital.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €</div>
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-muted/30 transition-all duration-300 ease-out hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 p-4 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="age" />
                            <YAxis />
                            <Tooltip formatter={(value) => `${Number(value).toLocaleString("de-DE")} €` as any} />
                            <Legend />
                            <ReferenceLine y={form.expectedStatePension * 12} label="Gesetzliche Rente p.a." stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                            <Bar dataKey="Gesetzliche Rente" fill="hsl(var(--muted-foreground))" />
                            <Bar dataKey="Private Lücke" fill="hsl(var(--destructive))" />
                            <Bar dataKey="Aufgebautes Vermögen" fill="hsl(var(--primary))" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {result.gapMonthly <= 0 && (
                    <div className="flex items-center gap-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 p-3 text-emerald-700 dark:text-emerald-300 text-sm">
                        <TrendingUp className="h-4 w-4" />
                        Deine gesetzliche Rente deckt deinen Wunschstandard. Du kannst zusätzliches Vermögen für Erbe oder Lifestyle aufbauen.
                    </div>
                )}
                {result.gapMonthly > 0 && (
                    <div className="flex items-center gap-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 p-3 text-amber-700 dark:text-amber-300 text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        Du hast eine monatliche Lücke von {result.gapMonthly.toLocaleString("de-DE")} €. Beginne früh mit einem ETF-Sparplan — je länger der Zeitraum, desto weniger monatlich nötig.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
