"use client";

import { TrendingDown } from "lucide-react";
import React, { useMemo, useState } from "react";
import {
    Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InflationData } from "@/lib/calculator-types";

interface InflationCalculatorProps {
    initialData?: InflationData | null;
}

export function InflationCalculator({ initialData }: InflationCalculatorProps) {
    const [form, setForm] = useState<InflationData>({
        amount: 100000,
        inflationRate: 2.5,
        years: 30,
    });

    const result = useMemo(() => {
        const nominalNeeded = form.amount * Math.pow(1 + form.inflationRate / 100, form.years);
        const realPurchasingPower = form.amount / Math.pow(1 + form.inflationRate / 100, form.years);
        const loss = form.amount - realPurchasingPower;
        return { nominalNeeded, realPurchasingPower, loss };
    }, [form]);

    const chartData = useMemo(() => {
        const data = [];
        for (let year = 0; year <= form.years; year++) {
            const purchasingPower = form.amount / Math.pow(1 + form.inflationRate / 100, year);
            const nominalEquivalent = form.amount * Math.pow(1 + form.inflationRate / 100, year);
            data.push({
                year,
                "Kaufkraft heutiger Betrag": Math.round(purchasingPower),
                "Nominal benötigt": Math.round(nominalEquivalent),
            });
        }
        return data;
    }, [form]);

    const update = (key: keyof InflationData, value: number) => {
        setForm(prev => ({ ...prev, [key]: Math.max(0, value) }));
    };

    return (
        <Card className="w-full max-w-5xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-6 w-6 text-primary" />
                    Inflations-Kaufkraft-Rechner
                </CardTitle>
                <CardDescription>
                    Berechne, wie viel Kaufkraft dein Geld in Zukunft tatsächlich noch hat — und wie viel du nominal brauchst, um den heutigen Wert zu halten.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                        <Label>Betrag heute (€)</Label>
                        <Input type="number" value={form.amount} onChange={e => update("amount", Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Inflationsrate (% p.a.)</Label>
                        <Input type="number" step="0.1" value={form.inflationRate} onChange={e => update("inflationRate", Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Zeitraum (Jahre)</Label>
                        <Input type="number" value={form.years} onChange={e => update("years", Number(e.target.value))} />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-muted/30 transition-all duration-300 ease-out hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 p-4 text-center">
                        <div className="text-sm text-muted-foreground">Kaufkraft in {form.years} Jahren</div>
                        <div className="text-2xl font-bold text-red-600">{result.realPurchasingPower.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €</div>
                    </div>
                    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-muted/30 transition-all duration-300 ease-out hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 p-4 text-center">
                        <div className="text-sm text-muted-foreground">Nominal benötigt für gleiche Kaufkraft</div>
                        <div className="text-2xl font-bold text-primary">{result.nominalNeeded.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €</div>
                    </div>
                    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-muted/30 transition-all duration-300 ease-out hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 p-4 text-center">
                        <div className="text-sm text-muted-foreground">Kaufkraftverlust</div>
                        <div className="text-2xl font-bold text-amber-600">{result.loss.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €</div>
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-muted/30 transition-all duration-300 ease-out hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 p-4 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip formatter={(value) => `${Number(value).toLocaleString("de-DE")} €`} />
                            <Area type="monotone" dataKey="Kaufkraft heutiger Betrag" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.15} />
                            <Area type="monotone" dataKey="Nominal benötigt" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
