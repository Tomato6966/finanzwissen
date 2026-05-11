"use client"

import { Gauge, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";

import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

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

    return (
        <Card className="w-full max-w-6xl overflow-hidden py-0">
            <CardHeader className="bg-[linear-gradient(135deg,#052e2b,#0f766e,#4338ca)] p-6 text-white">
                <CardTitle className="flex items-center gap-3 text-3xl">
                    <UsersRound className="h-8 w-8" />
                    Gesellschaftsvergleich AT/DE/DACH
                </CardTitle>
                <CardDescription className="text-white/80">
                    Ordnet Vermögen und Bruttojahreseinkommen grob gegen Altersgruppen und Einkommensverteilungen ein.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 p-6 lg:grid-cols-3">
                <div className="space-y-4 rounded-lg border p-4">
                    <div className="space-y-2">
                        <Label>Vergleichsraum</Label>
                        <Select value={formData.region} onValueChange={(region: Region) => setFormData({ ...formData, region })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="AT">Österreich</SelectItem>
                                <SelectItem value="DE">Deutschland</SelectItem>
                                <SelectItem value="DACH">DACH grob</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Alter</Label>
                        <Input type="number" value={formData.age} onChange={(event) => setFormData({ ...formData, age: Number(event.target.value) || 0 })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Gesamtvermögen netto Euro</Label>
                        <Input type="number" value={formData.netWorth} onChange={(event) => setFormData({ ...formData, netWorth: Number(event.target.value) || 0 })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Bruttojahreseinkommen Euro</Label>
                        <Input type="number" value={formData.grossAnnualIncome} onChange={(event) => setFormData({ ...formData, grossAnnualIncome: Number(event.target.value) || 0 })} />
                    </div>
                </div>

                <div className="space-y-4 lg:col-span-2">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="border-teal-200 bg-teal-50 dark:bg-teal-950/30">
                            <CardHeader>
                                <CardTitle>Vermoegen Median</CardTitle>
                            </CardHeader>
                            <CardContent className="text-3xl font-bold text-teal-700 dark:text-teal-300">
                                {formatCurrency(result.medianWealth)}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Vermoegen Ø</CardTitle>
                            </CardHeader>
                            <CardContent className="text-3xl font-bold">
                                {formatCurrency(result.meanWealth)}
                            </CardContent>
                        </Card>
                        <Card className="border-indigo-200 bg-indigo-50 dark:bg-indigo-950/30">
                            <CardHeader>
                                <CardTitle>Einkommen</CardTitle>
                            </CardHeader>
                            <CardContent className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">
                                P{result.incomePercentile}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="rounded-lg border p-5">
                        <div className="mb-5 flex items-center gap-2">
                            <Gauge className="h-5 w-5 text-teal-600" />
                            <h3 className="font-semibold">Einordnung</h3>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <div className="mb-2 flex justify-between text-sm">
                                    <span>Vermoegen gegen Altersgruppen-Median</span>
                                    <span>{result.wealthVsMedian >= 0 ? "+" : ""}{result.wealthVsMedian.toFixed(0)}%</span>
                                </div>
                                <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                    <div className="h-full rounded-full bg-teal-500" style={{ width: `${Math.min(100, Math.max(4, (formData.netWorth / Math.max(result.meanWealth, 1)) * 70))}%` }} />
                                </div>
                            </div>
                            <div>
                                <div className="mb-2 flex justify-between text-sm">
                                    <span>Bruttoeinkommen Perzentil</span>
                                    <span>P{result.incomePercentile}</span>
                                </div>
                                <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                    <div className="h-full rounded-full bg-indigo-500" style={{ width: `${result.incomePercentile}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="bg-slate-50 p-5 text-sm text-muted-foreground dark:bg-slate-900">
                Quellen/Stand: Statistik Austria Jahreseinkommen 2024, OeNB HFCS Austria 2021, Destatis Bruttojahresverdienst 2024, Bundesbank PHF 2023. DE/DACH Altersvermögen ist grob modelliert, weil vergleichbare Altersgruppen nicht immer deckungsgleich veröffentlicht werden.
            </CardFooter>
        </Card>
    );
}
