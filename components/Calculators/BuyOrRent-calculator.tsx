"use client";

import { Home, TrendingUp } from "lucide-react";
import React, { useMemo, useState } from "react";
import {
    CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BuyOrRentData } from "@/lib/calculator-types";

interface BuyOrRentCalculatorProps {
    initialData?: BuyOrRentData | null;
}

export function BuyOrRentCalculator({ initialData }: BuyOrRentCalculatorProps) {
    const [form, setForm] = useState<BuyOrRentData>({
        purchasePrice: 400000,
        downPayment: 80000,
        interestRate: 3.5,
        initialRepaymentRate: 2.0,
        maintenancePercent: 1.0,
        nebenkostenPercent: 1.5,
        monthlyRent: 1200,
        rentIncreasePercent: 2.0,
        investmentReturn: 6.0,
        years: 30,
    });

    const result = useMemo(() => {
        const loanAmount = form.purchasePrice - form.downPayment;
        const monthlyInterest = form.interestRate / 100 / 12;
        const monthlyMaintenance = (form.purchasePrice * form.maintenancePercent / 100) / 12;
        const monthlyNebenkosten = (form.purchasePrice * form.nebenkostenPercent / 100) / 12;

        const actualMonthlyRate = loanAmount * (monthlyInterest + form.initialRepaymentRate / 100 / 12);

        let crossoverYear: number | null = null;
        let buyEquity = -form.downPayment;
        let buyHomeValue = form.purchasePrice;
        let buyLoan = loanAmount;
        let rentPortfolio = form.downPayment;

        const data = [];
        for (let year = 0; year <= form.years; year++) {
            if (year > 0) {
                const yearlyRent = form.monthlyRent * 12 * Math.pow(1 + form.rentIncreasePercent / 100, year - 1);
                const yearlyInterest = buyLoan * (form.interestRate / 100);
                const yearlyPayment = actualMonthlyRate * 12;
                const yearlyRepayment = Math.min(yearlyPayment - yearlyInterest, buyLoan);
                buyLoan = Math.max(0, buyLoan - yearlyRepayment);
                buyHomeValue = buyHomeValue * 1.02; // 2% nominal appreciation

                const yearlyBuyCost = yearlyPayment + (monthlyMaintenance + monthlyNebenkosten) * 12;
                const yearlyRentCost = yearlyRent;
                const savedByRenting = yearlyBuyCost - yearlyRentCost;

                rentPortfolio = (rentPortfolio + savedByRenting) * (1 + form.investmentReturn / 100);
                buyEquity = buyHomeValue - buyLoan;
            }

            const buyNet = buyEquity;
            const rentNet = rentPortfolio;

            if (crossoverYear === null && buyNet > rentNet && year > 0) {
                crossoverYear = year;
            }

            data.push({
                year,
                "Kaufen (Eigenkapital)": Math.round(buyNet),
                "Mieten + Anlage": Math.round(rentNet),
            });
        }

        const finalBuy = data[data.length - 1]["Kaufen (Eigenkapital)"] as number;
        const finalRent = data[data.length - 1]["Mieten + Anlage"] as number;

        return {
            crossoverYear,
            finalBuy,
            finalRent,
            winner: finalBuy > finalRent ? "Kaufen" : "Mieten + Investieren",
            chartData: data,
        };
    }, [form]);

    const update = (key: keyof BuyOrRentData, value: number) => {
        setForm(prev => ({ ...prev, [key]: Math.max(0, value) }));
    };

    return (
        <Card className="w-full max-w-5xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Home className="h-6 w-6 text-primary" />
                    Kaufen oder Mieten
                </CardTitle>
                <CardDescription>
                    Vergleiche Gesamtkosten Eigentum (Zinsen, Nebenkosten, Instandhaltung) mit Miete + investierter Differenz über Jahrzehnte.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                        <Label>Kaufpreis (€)</Label>
                        <Input type="number" value={form.purchasePrice} onChange={e => update("purchasePrice", Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Eigenkapital (€)</Label>
                        <Input type="number" value={form.downPayment} onChange={e => update("downPayment", Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Zinssatz Hypothek (% p.a.)</Label>
                        <Input type="number" step="0.1" value={form.interestRate} onChange={e => update("interestRate", Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Anfängliche Tilgung (% p.a.)</Label>
                        <Input type="number" step="0.1" value={form.initialRepaymentRate} onChange={e => update("initialRepaymentRate", Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Instandhaltung (% p.a. vom Kaufpreis)</Label>
                        <Input type="number" step="0.1" value={form.maintenancePercent} onChange={e => update("maintenancePercent", Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Nebenkosten (% p.a. vom Kaufpreis)</Label>
                        <Input type="number" step="0.1" value={form.nebenkostenPercent} onChange={e => update("nebenkostenPercent", Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Monatliche Miete (€)</Label>
                        <Input type="number" value={form.monthlyRent} onChange={e => update("monthlyRent", Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Mietsteigerung (% p.a.)</Label>
                        <Input type="number" step="0.1" value={form.rentIncreasePercent} onChange={e => update("rentIncreasePercent", Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Rendite Alternativanlage (% p.a.)</Label>
                        <Input type="number" step="0.1" value={form.investmentReturn} onChange={e => update("investmentReturn", Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Betrachtungszeitraum (Jahre)</Label>
                        <Input type="number" value={form.years} onChange={e => update("years", Number(e.target.value))} />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-muted/30 transition-all duration-300 ease-out hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 p-4 text-center">
                        <div className="text-sm text-muted-foreground">Ergebnis nach {form.years} Jahren</div>
                        <div className="text-2xl font-bold text-primary">{result.winner}</div>
                    </div>
                    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-muted/30 transition-all duration-300 ease-out hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 p-4 text-center">
                        <div className="text-sm text-muted-foreground">Eigenkapital Kaufen</div>
                        <div className="text-2xl font-bold text-foreground">{result.finalBuy.toLocaleString("de-DE")} €</div>
                    </div>
                    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-muted/30 transition-all duration-300 ease-out hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 p-4 text-center">
                        <div className="text-sm text-muted-foreground">Portfolio Mieten + Anlage</div>
                        <div className="text-2xl font-bold text-foreground">{result.finalRent.toLocaleString("de-DE")} €</div>
                    </div>
                </div>

                {result.crossoverYear && (
                    <div className="flex items-center gap-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 p-3 text-emerald-700 dark:text-emerald-300 text-sm">
                        <TrendingUp className="h-4 w-4" />
                        Kaufen überholt Mieten ab Jahr {result.crossoverYear}.
                    </div>
                )}
                {!result.crossoverYear && (
                    <div className="flex items-center gap-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 p-3 text-amber-700 dark:text-amber-300 text-sm">
                        <TrendingUp className="h-4 w-4" />
                        Mieten + Investieren bleibt im Zeitraum voraus. Prüfe langfristig bei steigenden Mieten.
                    </div>
                )}

                <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-muted/30 transition-all duration-300 ease-out hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 p-4 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={result.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip formatter={(value) => `${Number(value).toLocaleString("de-DE")} €`} />
                            <Legend />
                            <Line type="monotone" dataKey="Kaufen (Eigenkapital)" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="Mieten + Anlage" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
