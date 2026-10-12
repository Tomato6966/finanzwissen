"use client"

import { Gauge, UsersRound, HelpCircle, TrendingUp, Award, BarChart2 } from "lucide-react";
import LZString from "lz-string";
import { useCallback, useMemo, useState } from "react";

import {
    Card, CardContent, CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { copyShareUrlToClipboard, getShareUrl } from "@/lib/share-utils";
import { CalculatorBanner } from "./CalculatorBanner";
import { CalculatorHeader } from "./CalculatorHeader";
import { formatCurrency } from "./tools";

import type { SocietyComparisonData } from "@/lib/calculator-types";

interface SocietyComparisonCalculatorProps {
    initialData: SocietyComparisonData | null;
}

type Region = SocietyComparisonData["region"];

const wealthByRegion = {
    AT: [
        { min: 0, max: 24, median: 7700, mean: 41400 },
        { min: 25, max: 39, median: 29700, mean: 174500 },
        { min: 40, max: 59, median: 170300, mean: 352700 },
        { min: 60, max: 120, median: 170500, mean: 298900 },
    ],
    DE: [
        { min: 0, max: 29, median: 12000, mean: 42000 },
        { min: 30, max: 44, median: 65000, mean: 180000 },
        { min: 45, max: 59, median: 132000, mean: 330000 },
        { min: 60, max: 120, median: 170000, mean: 360000 },
    ],
};

const incomePercentiles = {
    AT: [
        { percentile: 10, value: 12500 },
        { percentile: 25, value: 25000 },
        { percentile: 50, value: 38043 },
        { percentile: 75, value: 55678 },
        { percentile: 90, value: 82000 },
    ],
    DE: [
        { percentile: 10, value: 32526 },
        { percentile: 25, value: 40000 },
        { percentile: 50, value: 52159 },
        { percentile: 75, value: 71000 },
        { percentile: 90, value: 97680 },
    ],
};

const interpolatePercentile = (value: number, rows: { percentile: number; value: number }[]) => {
    if (value <= rows[0].value) return Math.max(1, Math.round((value / rows[0].value) * rows[0].percentile));
    for (let index = 1; index < rows.length; index++) {
        const lower = rows[index - 1];
        const upper = rows[index];
        if (value <= upper.value) {
            const progress = (value - lower.value) / (upper.value - lower.value);
            return Math.round(lower.percentile + progress * (upper.percentile - lower.percentile));
        }
    }
    const top = rows[rows.length - 1];
    return Math.min(99, Math.round(top.percentile + ((value - top.value) / top.value) * 8));
};

export function SocietyComparisonCalculator({ initialData }: SocietyComparisonCalculatorProps) {
    const [formData, setFormData] = useState<SocietyComparisonData>(initialData || {
        region: "AT",
        age: 35,
        netWorth: 75000,
        grossAnnualIncome: 52000,
    });
    const [shareMessage, setShareMessage] = useState<string | null>(null);

    const selectedRegions = useMemo<("AT" | "DE")[]>(
        () => formData.region === "DACH" ? ["AT", "DE"] : [formData.region],
        [formData.region]
    );

    const result = useMemo(() => {
        const wealthGroups = selectedRegions.map((region) => wealthByRegion[region].find((row) => formData.age >= row.min && formData.age <= row.max) || wealthByRegion[region][0]);
        const medianWealth = wealthGroups.reduce((sum, row) => sum + row.median, 0) / wealthGroups.length;
        const meanWealth = wealthGroups.reduce((sum, row) => sum + row.mean, 0) / wealthGroups.length;
        const incomeRows = selectedRegions.flatMap((region) => incomePercentiles[region]);
        const incomeReference = [10, 25, 50, 75, 90].map((percentile) => ({
            percentile,
            value: incomeRows.filter((row) => row.percentile === percentile).reduce((sum, row) => sum + row.value, 0) / selectedRegions.length,
        }));

        return {
            medianWealth,
            meanWealth,
            wealthVsMedian: medianWealth ? (formData.netWorth / medianWealth - 1) * 100 : 0,
            incomePercentile: interpolatePercentile(formData.grossAnnualIncome, incomeReference),
            incomeReference,
        };
    }, [formData, selectedRegions]);

    const serializeState = useCallback(() => {
        const state = { type: "society-comparison", data: formData };
        return LZString.compressToEncodedURIComponent(JSON.stringify(state));
    }, [formData]);

    const handleShareConfig = async () => {
        const serialized = serializeState();
        const shareUrl = getShareUrl('society-comparison', serialized);
        const copied = await copyShareUrlToClipboard(shareUrl);
        if (copied) {
            setShareMessage("Link kopiert!");
        } else {
            setShareMessage("Kopieren fehlgeschlagen!");
        }
        setTimeout(() => setShareMessage(null), 3000);
    };

    const validationError = useMemo(() => {
        if (formData.age < 18 || formData.age > 100) return "Bitte geben Sie ein Alter zwischen 18 und 100 Jahren an.";
        if (formData.grossAnnualIncome < 0) return "Das Bruttoeinkommen darf nicht negativ sein.";
        return null;
    }, [formData]);

    return (
        <Card className="w-full shadow-xl rounded-2xl overflow-hidden py-0 border-border/70 dark:bg-card/90 backdrop-blur-md">
            <CalculatorHeader
                title="DACH Vermögensvergleich"
                description="Vergleichen Sie Ihr persönliches Nettovermögen und Ihr Jahresbruttoeinkommen mit empirischen Daten aus Deutschland und Österreich."
                icon={UsersRound}
                badge="Alltag & Haushalt"
                shareMessage={shareMessage}
                onShare={handleShareConfig}
            />

            <div className="p-6 sm:p-7 space-y-6">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Picker-Maske (Left Column) */}
                    <div className="md:col-span-1 space-y-4 rounded-xl border border-border/50 bg-card/50 dark:bg-card/30 p-4 sm:p-5">
                        <div className="border-b border-border/40 pb-3">
                            <h3 className="text-base font-semibold text-foreground">
                                Eigene Daten
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Wählen Sie Region, Alter und Vermögensdaten.
                            </p>
                        </div>

                        <div className="space-y-3.5">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vergleichsraum</Label>
                                <Select value={formData.region} onValueChange={(region) => setFormData({ ...formData, region: region as Region })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="AT">Österreich (HFCS / Statistik Austria)</SelectItem>
                                        <SelectItem value="DE">Deutschland (PHF / Destatis)</SelectItem>
                                        <SelectItem value="DACH">DACH Gesamtraum</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Alter (Jahre)</Label>
                                <Input type="number" min={18} max={100} value={formData.age} onChange={(event) => setFormData({ ...formData, age: Number(event.target.value) || 0 })} />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Gesamtvermögen Netto (€)</Label>
                                <Input type="number" value={formData.netWorth} onChange={(event) => setFormData({ ...formData, netWorth: Number(event.target.value) || 0 })} />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bruttojahreseinkommen (€)</Label>
                                <Input type="number" min={0} value={formData.grossAnnualIncome} onChange={(event) => setFormData({ ...formData, grossAnnualIncome: Number(event.target.value) || 0 })} />
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
                            <div className="rounded-xl border border-teal-500/30 bg-teal-50/50 dark:bg-teal-950/20 p-4 backdrop-blur-xs">
                                <span className="text-xs uppercase tracking-wider text-teal-600 dark:text-teal-400 font-bold">Vermögen Median</span>
                                <h4 className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">
                                    {formatCurrency(result.medianWealth)}
                                </h4>
                                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                                    Ihre Altersgruppe ({formData.age} J.)
                                </span>
                            </div>

                            <div className="rounded-xl border border-border/50 bg-card/40 p-4 backdrop-blur-xs">
                                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Vermögen Durchschnitt</span>
                                <h4 className="text-2xl font-bold text-foreground mt-1">
                                    {formatCurrency(result.meanWealth)}
                                </h4>
                                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                                    Verzerrt durch Top-1%-Vermögen
                                </span>
                            </div>

                            <div className="rounded-xl border border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20 p-4 backdrop-blur-xs">
                                <span className="text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">Einkommens-Perzentil</span>
                                <h4 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                                    Top {100 - result.incomePercentile}% (P{result.incomePercentile})
                                </h4>
                                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                                    Verdienst höher als {result.incomePercentile}% der Bevölkerung
                                </span>
                            </div>
                        </div>

                        {/* Benchmark & Gauge Cards */}
                        <div className="rounded-xl border border-border/60 bg-card/60 dark:bg-card/30 p-5 space-y-5 backdrop-blur-xs">
                            <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                                <Gauge className="h-4 w-4 text-primary" />
                                <h4 className="text-sm font-semibold text-foreground">Gesellschaftliche Einordnung</h4>
                            </div>

                            {/* Net Worth Benchmark Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-medium text-foreground">Eigenes Vermögen vs. Median</span>
                                    <span className={`font-bold ${result.wealthVsMedian >= 0 ? "text-emerald-500" : "text-amber-500"}`}>
                                        {result.wealthVsMedian >= 0 ? "+" : ""}{result.wealthVsMedian.toFixed(0)}% gegenüber Peers
                                    </span>
                                </div>
                                <div className="h-3.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-teal-500 transition-all duration-500"
                                        style={{ width: `${Math.min(100, Math.max(5, (formData.netWorth / Math.max(result.meanWealth, 1)) * 60))}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] text-muted-foreground">
                                    <span>0 €</span>
                                    <span>Median: {formatCurrency(result.medianWealth)}</span>
                                    <span>Ø {formatCurrency(result.meanWealth)}</span>
                                </div>
                            </div>

                            {/* Income Benchmark Bar */}
                            <div className="space-y-2 pt-2 border-t border-border/40">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-medium text-foreground">Bruttoeinkommen Rangordnung</span>
                                    <span className="font-bold text-indigo-500">
                                        Perzentil {result.incomePercentile} von 100
                                    </span>
                                </div>
                                <div className="h-3.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                                        style={{ width: `${result.incomePercentile}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] text-muted-foreground">
                                    <span>P10: Einstieg</span>
                                    <span>P50: Median (50%)</span>
                                    <span>P90: Top 10%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CardFooter className="px-6 py-4 text-xs text-muted-foreground border-t border-border/40 flex justify-between items-center bg-card/30">
                <p>
                    Quellen: Statistik Austria (2024), OeNB HFCS Austria, Destatis, Deutsche Bundesbank PHF (2023). Statistische Näherung.
                </p>
            </CardFooter>
        </Card>
    );
}
