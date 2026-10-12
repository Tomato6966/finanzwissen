"use client";

import { Banknote, TrendingDown, ArrowDownRight, Sparkles, HelpCircle } from "lucide-react";
import LZString from "lz-string";
import React, { useCallback, useMemo, useState } from "react";
import {
    Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

import {
    Card, CardContent, CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoanData } from "@/lib/calculator-types";
import { copyShareUrlToClipboard, getShareUrl } from "@/lib/share-utils";
import { CalculatorBanner } from "./CalculatorBanner";
import { CalculatorHeader } from "./CalculatorHeader";
import { formatCurrency, formatCurrencyPrecise } from "./tools";

interface LoanCalculatorProps {
    initialData?: LoanData | null;
}

export function LoanCalculator({ initialData }: LoanCalculatorProps) {
    const [form, setForm] = useState<LoanData>(initialData || {
        loanAmount: 300000,
        interestRate: 3.5,
        initialRepaymentRate: 2.0,
        years: 30,
        compareRefinanceRate: null,
    });
    const [shareMessage, setShareMessage] = useState<string | null>(null);

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

            if (month % 12 === 0 || month === totalMonths) {
                schedule.push({
                    year: `${month / 12}J`,
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

    const serializeState = useCallback(() => {
        const state = { type: "loan", data: form };
        return LZString.compressToEncodedURIComponent(JSON.stringify(state));
    }, [form]);

    const handleShareConfig = async () => {
        const serialized = serializeState();
        const shareUrl = getShareUrl('loan', serialized);
        const copied = await copyShareUrlToClipboard(shareUrl);
        if (copied) {
            setShareMessage("Link kopiert!");
        } else {
            setShareMessage("Kopieren fehlgeschlagen!");
        }
        setTimeout(() => setShareMessage(null), 3000);
    };

    const update = (key: keyof LoanData, value: number | null) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const validationError = useMemo(() => {
        if (form.loanAmount <= 0) return "Die Kreditsumme muss größer als 0 € sein.";
        if (form.years <= 0) return "Die Laufzeit muss mindestens 1 Jahr betragen.";
        if (form.initialRepaymentRate <= 0) return "Die anfängliche Tilgung muss größer als 0% sein.";
        return null;
    }, [form]);

    return (
        <Card className="w-full shadow-xl rounded-2xl overflow-hidden py-0 border-border/70 dark:bg-card/90 backdrop-blur-md">
            <CalculatorHeader
                title="Kredit- & Tilgungsrechner"
                description="Berechnen Sie Monatsraten, Zinskosten, Tilgungspläne und Restschuld für Baufinanzierungen oder Kredite."
                icon={Banknote}
                badge="Immobilien & Kredit"
                shareMessage={shareMessage}
                onShare={handleShareConfig}
            />

            <div className="p-6 sm:p-7 space-y-6">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Picker-Maske (Left Column) */}
                    <div className="md:col-span-1 space-y-4 rounded-xl border border-border/50 bg-card/50 dark:bg-card/30 p-4 sm:p-5">
                        <div className="border-b border-border/40 pb-3">
                            <h3 className="text-base font-semibold text-foreground">
                                Kreditkonditionen
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Geben Sie Kredithöhe, Zins und Tilgungssatz ein.
                            </p>
                        </div>

                        <div className="space-y-3.5">
                            <div className="space-y-1.5">
                                <Label htmlFor="loanAmount" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kreditsumme (€)</Label>
                                <Input min={0} id="loanAmount" type="number" value={form.loanAmount} onChange={e => update("loanAmount", Number(e.target.value))} />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="interestRate" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sollzins (% p.a.)</Label>
                                    <Input min={0} max={25} id="interestRate" type="number" step="0.1" value={form.interestRate} onChange={e => update("interestRate", Number(e.target.value))} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="initialRepaymentRate" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tilgung (% p.a.)</Label>
                                    <Input min={0.5} max={25} id="initialRepaymentRate" type="number" step="0.1" value={form.initialRepaymentRate} onChange={e => update("initialRepaymentRate", Number(e.target.value))} />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="years" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Laufzeit (Jahre)</Label>
                                <Input min={1} max={50} id="years" type="number" value={form.years} onChange={e => update("years", Number(e.target.value))} />
                            </div>

                            <div className="space-y-1.5 pt-2 border-t border-border/40">
                                <Label htmlFor="compareRefinanceRate" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vergleichs-Zins Anschluss (% p.a.)</Label>
                                <Input
                                    id="compareRefinanceRate"
                                    type="number"
                                    step="0.1"
                                    value={form.compareRefinanceRate ?? ""}
                                    onChange={e => update("compareRefinanceRate", e.target.value === "" ? null : Number(e.target.value))}
                                    placeholder="Optional (z.B. 2.5)"
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
                        <div className="grid sm:grid-cols-3 gap-3">
                            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 backdrop-blur-xs">
                                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Monatliche Rate</span>
                                <h4 className="text-2xl font-extrabold text-primary mt-1">
                                    {formatCurrency(result.monthlyPayment)}
                                </h4>
                            </div>

                            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 backdrop-blur-xs">
                                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Gesamte Zinskosten</span>
                                <h4 className="text-2xl font-extrabold text-amber-500 mt-1">
                                    {formatCurrency(result.totalInterestPaid)}
                                </h4>
                            </div>

                            <div className="rounded-xl border border-border/50 bg-card/40 p-4 backdrop-blur-xs">
                                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Restschuld nach {form.years} J.</span>
                                <h4 className="text-2xl font-bold text-foreground mt-1">
                                    {formatCurrency(result.remainingDebt)}
                                </h4>
                            </div>
                        </div>

                        {/* Refinance Badge */}
                        {result.refinanceSavings !== null && result.refinanceSavings > 0 && (
                            <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="h-5 w-5 text-emerald-500" />
                                    <div>
                                        <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Umschuldungs-Vorteil</h5>
                                        <p className="text-xs text-muted-foreground">Neue Rate: {formatCurrency(result.refinancePayment!)} / Monat</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-muted-foreground">Ersparnis:</span>
                                    <h4 className="text-lg font-black text-emerald-500">+{formatCurrency(result.refinanceSavings)}</h4>
                                </div>
                            </div>
                        )}

                        {/* Chart Container */}
                        <div className="rounded-xl border border-border/60 bg-card/60 dark:bg-card/30 p-4 sm:p-5 backdrop-blur-xs">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tilgungsverlauf & Zinslast</span>
                                <span className="text-xs text-muted-foreground">Annuität: {formatCurrency(result.monthlyPayment * 12)} p.a.</span>
                            </div>
                            <ResponsiveContainer width="100%" height={320}>
                                <AreaChart data={result.schedule} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="restschuldGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#0284c7" stopOpacity={0.02}/>
                                        </linearGradient>
                                        <linearGradient id="interestGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                                    <XAxis dataKey="year" stroke="currentColor" className="text-xs opacity-60" />
                                    <YAxis tickFormatter={(v: number) => formatCurrency(v)} width={85} stroke="currentColor" className="text-xs opacity-60" />
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
                                    <Area type="monotone" dataKey="Restschuld" stroke="#0284c7" strokeWidth={2} fill="url(#restschuldGradient)" />
                                    <Area type="monotone" dataKey="Kumulierte Zinsen" stroke="#ef4444" strokeWidth={2} fill="url(#interestGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            <CardFooter className="px-6 py-4 text-xs text-muted-foreground border-t border-border/40 flex justify-between items-center bg-card/30">
                <p>
                    Tipp: Eine Erhöhung der anfänglichen Tilgung um 1% verkürzt die Gesamtlaufzeit und spart tausende Euro an Zinsen.
                </p>
            </CardFooter>
        </Card>
    );
}
