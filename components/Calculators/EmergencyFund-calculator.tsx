"use client";

import { ShieldCheck, HelpCircle, CheckCircle2, AlertCircle } from "lucide-react";
import LZString from "lz-string";
import React, { useCallback, useMemo, useState } from "react";
import {
    Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

import {
    Card, CardContent, CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmergencyFundData } from "@/lib/calculator-types";
import { copyShareUrlToClipboard, getShareUrl } from "@/lib/share-utils";
import { CalculatorBanner } from "./CalculatorBanner";
import { CalculatorHeader } from "./CalculatorHeader";
import { formatCurrency, formatCurrencyPrecise } from "./tools";

interface EmergencyFundCalculatorProps {
    initialData?: EmergencyFundData | null;
}

export function EmergencyFundCalculator({ initialData }: EmergencyFundCalculatorProps) {
    const [form, setForm] = useState<EmergencyFundData>(initialData || {
        monthlyFixedCosts: 2000,
        monthlyVariableCosts: 500,
        jobSecurityMonths: 6,
        dependents: 0,
        liquidAssets: 5000,
    });
    const [shareMessage, setShareMessage] = useState<string | null>(null);

    const result = useMemo(() => {
        const baseMonths = form.jobSecurityMonths;
        const dependentBuffer = form.dependents * 1.5; // extra months per dependent
        const recommendedMonths = Math.max(3, baseMonths + dependentBuffer);
        const monthlyTotal = form.monthlyFixedCosts + form.monthlyVariableCosts;
        const recommendedAmount = monthlyTotal * recommendedMonths;
        const gap = recommendedAmount - form.liquidAssets;
        const coverageRatio = recommendedAmount > 0 ? (form.liquidAssets / recommendedAmount) * 100 : 100;
        const status = gap <= 0 ? "optimal" : gap <= monthlyTotal * 3 ? "acceptable" : "critical";
        return { recommendedMonths, monthlyTotal, recommendedAmount, gap, coverageRatio, status };
    }, [form]);

    const serializeState = useCallback(() => {
        const state = { type: "emergency-fund", data: form };
        return LZString.compressToEncodedURIComponent(JSON.stringify(state));
    }, [form]);

    const handleShareConfig = async () => {
        const serialized = serializeState();
        const shareUrl = getShareUrl('emergency-fund', serialized);
        const copied = await copyShareUrlToClipboard(shareUrl);
        if (copied) {
            setShareMessage("Link kopiert!");
        } else {
            setShareMessage("Kopieren fehlgeschlagen!");
        }
        setTimeout(() => setShareMessage(null), 3000);
    };

    const update = (key: keyof EmergencyFundData, value: number) => {
        setForm(prev => ({ ...prev, [key]: Math.max(0, value) }));
    };

    const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
        optimal: { label: "Optimal abgesichert", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
        acceptable: { label: "Teilweise gedeckt", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/30" },
        critical: { label: "Handlungsbedarf", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30" },
    };

    const validationError = useMemo(() => {
        if (form.monthlyFixedCosts <= 0 && form.monthlyVariableCosts <= 0) {
            return "Bitte geben Sie Ihre monatlichen Lebenshaltungskosten an.";
        }
        if (result.recommendedMonths > 12) {
            return "Hinweis: Mehr als 12 Monate Notgroschen in bar bindet viel Liquidität ohne Zinseszins-Wachstum.";
        }
        return null;
    }, [form, result.recommendedMonths]);

    const comparisonChartData = [
        {
            name: "Bestand",
            "Aktuelle Rücklagen": form.liquidAssets,
            "Empfohlen": 0,
        },
        {
            name: "Zielreserve",
            "Aktuelle Rücklagen": 0,
            "Empfohlen": result.recommendedAmount,
        },
    ];

    return (
        <Card className="w-full shadow-xl rounded-2xl overflow-hidden py-0 border-border/70 dark:bg-card/90 backdrop-blur-md">
            <CalculatorHeader
                title="Notgroschen-Rechner"
                description="Ermitteln Sie die empfohlene Liquiditätsreserve für unvorhergesehene Lebenslagen und Notfälle."
                icon={ShieldCheck}
                badge="Vermögen"
                shareMessage={shareMessage}
                onShare={handleShareConfig}
            />

            <div className="p-6 sm:p-7 space-y-6">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Picker-Maske (Left Column) */}
                    <div className="md:col-span-1 space-y-4 rounded-xl border border-border/50 bg-card/50 dark:bg-card/30 p-4 sm:p-5">
                        <div className="border-b border-border/40 pb-3">
                            <h3 className="text-base font-semibold text-foreground">
                                Ausgaben & Profil
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Passen Sie Lebenshaltungskosten und Sicherheitsbedürfnis an.
                            </p>
                        </div>

                        <div className="space-y-3.5">
                            <div className="space-y-1.5">
                                <Label htmlFor="monthlyFixedCosts" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Monatliche Fixkosten (€)</Label>
                                <Input min={0} id="monthlyFixedCosts" type="number" value={form.monthlyFixedCosts} onChange={e => update("monthlyFixedCosts", Number(e.target.value))} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="monthlyVariableCosts" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Monatliche variable Kosten (€)</Label>
                                <Input min={0} id="monthlyVariableCosts" type="number" value={form.monthlyVariableCosts} onChange={e => update("monthlyVariableCosts", Number(e.target.value))} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="jobSecurityMonths" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Puffer-Monate (Arbeitsplatz)</Label>
                                <Input min={1} max={24} id="jobSecurityMonths" type="number" value={form.jobSecurityMonths} onChange={e => update("jobSecurityMonths", Number(e.target.value))} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="dependents" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Unterhaltsberechtigte Personen</Label>
                                <Input min={0} max={10} id="dependents" type="number" value={form.dependents} onChange={e => update("dependents", Number(e.target.value))} />
                            </div>
                            <div className="space-y-1.5 pt-2 border-t border-border/40">
                                <Label htmlFor="liquidAssets" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aktuelle liquide Rücklagen (€)</Label>
                                <Input min={0} id="liquidAssets" type="number" value={form.liquidAssets} onChange={e => update("liquidAssets", Number(e.target.value))} />
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
                            <div className="rounded-xl border border-border/50 bg-card/40 p-4 backdrop-blur-xs">
                                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Empfohlen ({result.recommendedMonths.toFixed(1)} Mon.)</span>
                                <h4 className="text-2xl font-bold text-primary mt-1">
                                    {formatCurrency(result.recommendedAmount)}
                                </h4>
                            </div>

                            <div className="rounded-xl border border-border/50 bg-card/40 p-4 backdrop-blur-xs">
                                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Aktueller Stand</span>
                                <h4 className="text-2xl font-bold text-foreground mt-1">
                                    {formatCurrency(form.liquidAssets)}
                                </h4>
                            </div>

                            <div className={`rounded-xl border ${statusConfig[result.status].border} ${statusConfig[result.status].bg} p-4 backdrop-blur-xs`}>
                                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Lücke / Puffer</span>
                                <h4 className={`text-2xl font-extrabold mt-1 ${result.gap > 0 ? "text-red-500" : "text-emerald-500"}`}>
                                    {result.gap > 0 ? `-${formatCurrency(result.gap)}` : `+${formatCurrency(Math.abs(result.gap))}`}
                                </h4>
                            </div>
                        </div>

                        {/* Coverage Progress Bar */}
                        <div className="rounded-xl border border-border/50 bg-card/40 p-4 backdrop-blur-xs space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-muted-foreground uppercase tracking-wider">Deckungsgrad des Notgroschens</span>
                                <span className={`font-bold ${statusConfig[result.status].color}`}>
                                    {result.coverageRatio.toFixed(0)}% ({statusConfig[result.status].label})
                                </span>
                            </div>
                            <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 rounded-full ${
                                        result.coverageRatio >= 100
                                            ? "bg-emerald-500"
                                            : result.coverageRatio >= 50
                                            ? "bg-amber-500"
                                            : "bg-red-500"
                                    }`}
                                    style={{ width: `${Math.min(100, Math.max(5, result.coverageRatio))}%` }}
                                />
                            </div>
                        </div>

                        {/* Chart Container */}
                        <div className="rounded-xl border border-border/60 bg-card/60 dark:bg-card/30 p-4 sm:p-5 backdrop-blur-xs">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vergleich: Rücklagen vs. Zielreserve</span>
                                <span className="text-xs text-muted-foreground">Monatsbedarf: {formatCurrency(result.monthlyTotal)}</span>
                            </div>
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={comparisonChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                                    <XAxis dataKey="name" stroke="currentColor" className="text-xs opacity-60" />
                                    <YAxis tickFormatter={(v: number) => formatCurrency(v)} width={80} stroke="currentColor" className="text-xs opacity-60" />
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
                                    <Bar dataKey="Aktuelle Rücklagen" fill="#0284c7" radius={[6, 6, 0, 0]} />
                                    <Bar dataKey="Empfohlen" fill="#10b981" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            <CardFooter className="px-6 py-4 text-xs text-muted-foreground border-t border-border/40 flex justify-between items-center bg-card/30">
                <p>
                    Tipp: Notgroschen auf einem separaten Tagesgeldkonto mit Einlagensicherung parken – nicht auf dem Girokonto vermischen.
                </p>
            </CardFooter>
        </Card>
    );
}
