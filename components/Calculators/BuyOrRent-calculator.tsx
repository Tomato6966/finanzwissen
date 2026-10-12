"use client";

import { Home, TrendingUp, HelpCircle, CheckCircle2, DollarSign } from "lucide-react";
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
import { BuyOrRentData } from "@/lib/calculator-types";
import { copyShareUrlToClipboard, getShareUrl } from "@/lib/share-utils";
import { CalculatorBanner } from "./CalculatorBanner";
import { CalculatorHeader } from "./CalculatorHeader";
import { formatCurrency, formatCurrencyPrecise } from "./tools";

interface BuyOrRentCalculatorProps {
    initialData?: BuyOrRentData | null;
}

export function BuyOrRentCalculator({ initialData }: BuyOrRentCalculatorProps) {
    const [form, setForm] = useState<BuyOrRentData>(initialData || {
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
    const [shareMessage, setShareMessage] = useState<string | null>(null);

    const result = useMemo(() => {
        const loanAmount = Math.max(0, form.purchasePrice - form.downPayment);
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
                year: `${year}J`,
                "Kaufen (Eigenkapital)": Math.round(buyNet),
                "Mieten + Depot": Math.round(rentNet),
            });
        }

        const finalBuy = data[data.length - 1]["Kaufen (Eigenkapital)"] as number;
        const finalRent = data[data.length - 1]["Mieten + Depot"] as number;

        return {
            crossoverYear,
            finalBuy,
            finalRent,
            winner: finalBuy > finalRent ? "Kaufen (Immobilie)" : "Mieten + Investieren",
            difference: Math.abs(finalBuy - finalRent),
            chartData: data,
        };
    }, [form]);

    const serializeState = useCallback(() => {
        const state = { type: "buy-or-rent", data: form };
        return LZString.compressToEncodedURIComponent(JSON.stringify(state));
    }, [form]);

    const handleShareConfig = async () => {
        const serialized = serializeState();
        const shareUrl = getShareUrl('buy-or-rent', serialized);
        const copied = await copyShareUrlToClipboard(shareUrl);
        if (copied) {
            setShareMessage("Link kopiert!");
        } else {
            setShareMessage("Kopieren fehlgeschlagen!");
        }
        setTimeout(() => setShareMessage(null), 3000);
    };

    const update = (key: keyof BuyOrRentData, value: number) => {
        setForm(prev => ({ ...prev, [key]: Math.max(0, value) }));
    };

    const validationError = useMemo(() => {
        if (form.purchasePrice <= 0) return "Der Kaufpreis muss größer als 0 € sein.";
        if (form.downPayment > form.purchasePrice) return "Das Eigenkapital darf den Kaufpreis nicht überschreiten.";
        if (form.monthlyRent <= 0) return "Die Kaltmiete muss größer als 0 € sein.";
        if (form.years <= 0) return "Der Betrachtungszeitraum muss mindestens 1 Jahr betragen.";
        return null;
    }, [form]);

    return (
        <Card className="w-full shadow-xl rounded-2xl overflow-hidden py-0 border-border/70 dark:bg-card/90 backdrop-blur-md">
            <CalculatorHeader
                title="Kaufen oder Mieten Rechner"
                description="Vergleichen Sie den realen Vermögensaufbau beim Immobilienkauf gegenüber Mieten und Anlegen des Eigenkapitals am Kapitalmarkt."
                icon={Home}
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
                                Vergleichsparameter
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Vergleichen Sie Kaufkonditionen und Mietalternativen.
                            </p>
                        </div>

                        <div className="space-y-3.5">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="purchasePrice" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kaufpreis (€)</Label>
                                    <Input min={0} id="purchasePrice" type="number" value={form.purchasePrice} onChange={e => update("purchasePrice", Number(e.target.value))} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="downPayment" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Eigenkapital (€)</Label>
                                    <Input min={0} id="downPayment" type="number" value={form.downPayment} onChange={e => update("downPayment", Number(e.target.value))} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="interestRate" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kreditzins (% p.a.)</Label>
                                    <Input min={0} max={25} id="interestRate" type="number" step="0.1" value={form.interestRate} onChange={e => update("interestRate", Number(e.target.value))} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="initialRepaymentRate" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tilgung (% p.a.)</Label>
                                    <Input min={0.5} max={25} id="initialRepaymentRate" type="number" step="0.1" value={form.initialRepaymentRate} onChange={e => update("initialRepaymentRate", Number(e.target.value))} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="maintenancePercent" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Instandhaltung (% p.a.)</Label>
                                    <Input min={0} max={10} id="maintenancePercent" type="number" step="0.1" value={form.maintenancePercent} onChange={e => update("maintenancePercent", Number(e.target.value))} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="nebenkostenPercent" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nebenkosten (% p.a.)</Label>
                                    <Input min={0} max={10} id="nebenkostenPercent" type="number" step="0.1" value={form.nebenkostenPercent} onChange={e => update("nebenkostenPercent", Number(e.target.value))} />
                                </div>
                            </div>

                            <div className="pt-2 border-t border-border/40 space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="monthlyRent" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Monatsmiete (€)</Label>
                                        <Input min={0} id="monthlyRent" type="number" value={form.monthlyRent} onChange={e => update("monthlyRent", Number(e.target.value))} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="rentIncreasePercent" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mietsteigerung (% p.a.)</Label>
                                        <Input min={0} max={15} id="rentIncreasePercent" type="number" step="0.1" value={form.rentIncreasePercent} onChange={e => update("rentIncreasePercent", Number(e.target.value))} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="investmentReturn" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Depotrendite (% p.a.)</Label>
                                        <Input min={0} max={25} id="investmentReturn" type="number" step="0.1" value={form.investmentReturn} onChange={e => update("investmentReturn", Number(e.target.value))} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="years" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Horizont (Jahre)</Label>
                                        <Input min={1} max={50} id="years" type="number" value={form.years} onChange={e => update("years", Number(e.target.value))} />
                                    </div>
                                </div>
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
                                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Günstiger nach {form.years} J.</span>
                                <h4 className="text-xl font-extrabold text-primary mt-1 truncate">
                                    {result.winner}
                                </h4>
                                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                                    Vorteil: {formatCurrency(result.difference)}
                                </span>
                            </div>

                            <div className="rounded-xl border border-border/50 bg-card/40 p-4 backdrop-blur-xs">
                                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Nettovermögen Kaufen</span>
                                <h4 className="text-xl font-bold text-foreground mt-1">
                                    {formatCurrency(result.finalBuy)}
                                </h4>
                                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                                    Immobilienwert abzgl. Restkredit
                                </span>
                            </div>

                            <div className="rounded-xl border border-border/50 bg-card/40 p-4 backdrop-blur-xs">
                                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Nettovermögen Mieten</span>
                                <h4 className="text-xl font-bold text-foreground mt-1">
                                    {formatCurrency(result.finalRent)}
                                </h4>
                                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                                    Depot inkl. gesparter Nebenkosten
                                </span>
                            </div>
                        </div>

                        {/* Crossover Notice Card */}
                        {result.crossoverYear ? (
                            <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 flex items-center gap-3">
                                <TrendingUp className="h-5 w-5 text-emerald-500 shrink-0" />
                                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                                    <strong>Wendepunkt:</strong> Kaufen überholt Mieten nach ca. <strong>{result.crossoverYear} Jahren</strong>. Ab diesem Zeitpunkt überwiegt der Tilgungseffekt gegenüber dem Zinseszinseffekt des Aktiendepots.
                                </p>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 p-4 flex items-center gap-3">
                                <TrendingUp className="h-5 w-5 text-amber-500 shrink-0" />
                                <p className="text-xs text-amber-700 dark:text-amber-300">
                                    Mieten und Investieren bleibt über den gesamten Zeitraum von {form.years} Jahren im Vorteil. Die Opportunitätskosten des Eigenkapitals und Zinsen wiegen schwerer als die Mietausgaben.
                                </p>
                            </div>
                        )}

                        {/* Chart Container */}
                        <div className="rounded-xl border border-border/60 bg-card/60 dark:bg-card/30 p-4 sm:p-5 backdrop-blur-xs">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vermögensentwicklung im Zeitverlauf</span>
                                <span className="text-xs text-muted-foreground">Kaufpreis: {formatCurrency(form.purchasePrice)} | Miete: {formatCurrency(form.monthlyRent)}/M</span>
                            </div>
                            <ResponsiveContainer width="100%" height={320}>
                                <AreaChart data={result.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="buyGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#0284c7" stopOpacity={0.02}/>
                                        </linearGradient>
                                        <linearGradient id="rentGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.02}/>
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
                                    <Area type="monotone" dataKey="Kaufen (Eigenkapital)" stroke="#0284c7" strokeWidth={2.5} fill="url(#buyGradient)" />
                                    <Area type="monotone" dataKey="Mieten + Depot" stroke="#10b981" strokeWidth={2.5} fill="url(#rentGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            <CardFooter className="px-6 py-4 text-xs text-muted-foreground border-t border-border/40 flex justify-between items-center bg-card/30">
                <p>
                    Hinweis: Modell berücksichtigt 2% nominale Wertsteigerung der Immobilie p.a. sowie Nebenkosten und Instandhaltung.
                </p>
            </CardFooter>
        </Card>
    );
}
