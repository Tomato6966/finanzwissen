"use client";

import { ShieldCheck } from "lucide-react";
import React, { useMemo, useState } from "react";

import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmergencyFundData } from "@/lib/calculator-types";

interface EmergencyFundCalculatorProps {
    initialData?: EmergencyFundData | null;
}

export function EmergencyFundCalculator({ initialData }: EmergencyFundCalculatorProps) {
    const [form, setForm] = useState<EmergencyFundData>({
        monthlyFixedCosts: 2000,
        monthlyVariableCosts: 500,
        jobSecurityMonths: 6,
        dependents: 0,
        liquidAssets: 5000,
    });

    const result = useMemo(() => {
        const baseMonths = form.jobSecurityMonths;
        const dependentBuffer = form.dependents * 1.5; // extra months per dependent
        const recommendedMonths = Math.max(3, baseMonths + dependentBuffer);
        const monthlyTotal = form.monthlyFixedCosts + form.monthlyVariableCosts;
        const recommendedAmount = monthlyTotal * recommendedMonths;
        const gap = recommendedAmount - form.liquidAssets;
        const status = gap <= 0 ? "optimal" : gap <= monthlyTotal * 3 ? "acceptable" : "critical";
        return { recommendedMonths, monthlyTotal, recommendedAmount, gap, status };
    }, [form]);

    const update = (key: keyof EmergencyFundData, value: number) => {
        setForm(prev => ({ ...prev, [key]: Math.max(0, value) }));
    };

    const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
        optimal: { label: "Optimal", color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
        acceptable: { label: "Akzeptabel", color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/30" },
        critical: { label: "Handlungsbedarf", color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30" },
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    Notgroschen-Rechner
                </CardTitle>
                <CardDescription>
                    Berechne deinen individuellen Notgroschen statt pauschaler 3-6 Monate. Vermeide Cash-Drag und Unterversorgung.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Monatliche Fixkosten (€)</Label>
                        <Input type="number" value={form.monthlyFixedCosts} onChange={e => update("monthlyFixedCosts", Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Monatliche variable Kosten (€)</Label>
                        <Input type="number" value={form.monthlyVariableCosts} onChange={e => update("monthlyVariableCosts", Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Job-Sicherheit (Monate ohne Einkommen, die du überbrücken willst)</Label>
                        <Input type="number" value={form.jobSecurityMonths} onChange={e => update("jobSecurityMonths", Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Anzahl Personen, die auf dich angewiesen sind</Label>
                        <Input type="number" value={form.dependents} onChange={e => update("dependents", Number(e.target.value))} />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                        <Label>Bereits verfügbare liquide Rücklagen (€)</Label>
                        <Input type="number" value={form.liquidAssets} onChange={e => update("liquidAssets", Number(e.target.value))} />
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-muted/30 transition-all duration-300 ease-out hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Empfohlene Dauer</span>
                        <span className="font-semibold">{result.recommendedMonths.toFixed(1)} Monate</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Monatliche Gesamtkosten</span>
                        <span className="font-semibold">{result.monthlyTotal.toLocaleString("de-DE")} €</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Empfohlener Notgroschen</span>
                        <span className="font-semibold text-primary">{result.recommendedAmount.toLocaleString("de-DE")} €</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Bestehende Rücklagen</span>
                        <span className="font-semibold">{form.liquidAssets.toLocaleString("de-DE")} €</span>
                    </div>
                    <div className="border-t border-border pt-3 flex items-center justify-between">
                        <span className="text-muted-foreground">Lücke / Überschuss</span>
                        <span className={`font-bold ${result.gap > 0 ? "text-red-600" : "text-emerald-600"}`}>
                            {result.gap > 0 ? `+${result.gap.toLocaleString("de-DE")} € fehlend` : `${Math.abs(result.gap).toLocaleString("de-DE")} € überschüssig`}
                        </span>
                    </div>
                    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${statusConfig[result.status].bg} ${statusConfig[result.status].color}`}>
                        Status: {statusConfig[result.status].label}
                    </div>
                </div>

                <div className="text-sm text-muted-foreground">
                    <strong>Hinweis:</strong> Mehr als 12 Monate Notgroschen in bar/Sparkonto kostet Rendite. Alles über dem empfohlenen Wert sollte langfristig angelegt werden.
                </div>
            </CardContent>
        </Card>
    );
}
