"use client";

import { Banknote } from "lucide-react";
import React, { useMemo, useState } from "react";
import {
    Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoanData } from "@/lib/calculator-types";

interface LoanCalculatorProps {
    initialData?: LoanData | null;
}

export function LoanCalculator({ initialData }: LoanCalculatorProps) {
    const [form, setForm] = useState<LoanData>({
        loanAmount: 300000,
        interestRate: 3.5,
        initialRepaymentRate: 2.0,
        years: 30,
        compareRefinanceRate: null,
    });

    const result = useMemo(() => {
        const monthlyInterestRate = form.interestRate / 100 / 12;
        const totalRate = (form.interestRate / 100 + form.initialRepaymentRate / 100) / 12;
        const monthlyPayment = form.loanAmount * totalRate;
        const totalMonths = form.years * 12;

        let balance = form.loanAmount;
        let totalInterestPaid = 0;
        const schedule = [];

        for (let month = 1; month <= totalMonths; month++) {
            const interest = balance * monthlyInterestRate;
            const repayment = Math.min(monthlyPayment - interest, balance);
            balance = Math.max(0, balance - repayment);
            totalInterestPaid += interest;

            if (month % 12 === 0) {
                schedule.push({
                    year: month / 12,
                    "Restschuld": Math.round(balance),
                    "Kumulierte Zinsen": Math.round(totalInterestPaid),
                });
            }
        }

        let refinanceSavings: number | null = null;
        let refinancePayment: number | null = null;
        if (form.compareRefinanceRate !== null && form.compareRefinanceRate > 0) {
            const newMonthlyRate = (form.compareRefinanceRate / 100 + form.initialRepaymentRate / 100) / 12;
            refinancePayment = form.loanAmount * newMonthlyRate;
            let newBalance = form.loanAmount;
            let newTotalInterest = 0;
            for (let month = 1; month <= totalMonths; month++) {
                const newInterest = newBalance * (form.compareRefinanceRate / 100 / 12);
                const newRepayment = Math.min(refinancePayment - newInterest, newBalance);
                newBalance = Math.max(0, newBalance - newRepayment);
                newTotalInterest += newInterest;
            }
            refinanceSavings = totalInterestPaid - newTotalInterest;
        }

        return { monthlyPayment, totalInterestPaid, remainingDebt: balance, schedule, refinanceSavings, refinancePayment };
    }, [form]);

    const update = (key: keyof LoanData, value: number | null) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    return (
        <Card className="w-full max-w-5xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Banknote className="h-6 w-6 text-primary" />
                    Kredit-Rechner
                </CardTitle>
                <CardDescription>
                    Berechne Tilgung, Gesamtkosten und Zinslast. Optional: Vergleiche Umschuldung zu einem niedrigeren Zinssatz.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                        <Label>Kreditsumme (€)</Label>
                        <Input type="number" value={form.loanAmount} onChange={e => update("loanAmount", Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Zinssatz (% p.a.)</Label>
                        <Input type="number" step="0.1" value={form.interestRate} onChange={e => update("interestRate", Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Anfängliche Tilgung (% p.a.)</Label>
                        <Input type="number" step="0.1" value={form.initialRepaymentRate} onChange={e => update("initialRepaymentRate", Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Laufzeit (Jahre)</Label>
                        <Input type="number" value={form.years} onChange={e => update("years", Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Vergleichs-Zinssatz Umschuldung (% p.a., optional)</Label>
                        <Input
                            type="number"
                            step="0.1"
                            value={form.compareRefinanceRate ?? ""}
                            onChange={e => update("compareRefinanceRate", e.target.value === "" ? null : Number(e.target.value))}
                            placeholder="z.B. 2.5"
                        />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-muted/30 transition-all duration-300 ease-out hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 p-4 text-center">
                        <div className="text-sm text-muted-foreground">Monatliche Rate</div>
                        <div className="text-2xl font-bold text-primary">{result.monthlyPayment.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €</div>
                    </div>
                    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-muted/30 transition-all duration-300 ease-out hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 p-4 text-center">
                        <div className="text-sm text-muted-foreground">Gesamte Zinslast</div>
                        <div className="text-2xl font-bold text-amber-600">{result.totalInterestPaid.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €</div>
                    </div>
                    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-muted/30 transition-all duration-300 ease-out hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 p-4 text-center">
                        <div className="text-sm text-muted-foreground">Restschuld nach {form.years} Jahren</div>
                        <div className="text-2xl font-bold text-foreground">{result.remainingDebt.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €</div>
                    </div>
                </div>

                {result.refinanceSavings !== null && result.refinanceSavings > 0 && (
                    <div className="group relative overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-900/20 p-4 text-center transition-all duration-300 ease-out hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-500/50">
                        <div className="text-sm text-muted-foreground">Zinsersparnis durch Umschuldung</div>
                        <div className="text-2xl font-bold text-emerald-600">{result.refinanceSavings.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €</div>
                        <div className="text-sm text-muted-foreground mt-1">
                            Neue Rate: {result.refinancePayment!.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €/Monat
                        </div>
                    </div>
                )}

                <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-muted/30 transition-all duration-300 ease-out hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 p-4 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={result.schedule} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip formatter={(value) => `${Number(value).toLocaleString("de-DE")} €`} />
                            <Area type="monotone" dataKey="Restschuld" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} />
                            <Area type="monotone" dataKey="Kumulierte Zinsen" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.15} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
