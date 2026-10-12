"use client";
import { CalculatorBanner } from "./CalculatorBanner";
import { CalculatorHeader } from "./CalculatorHeader";

import { TrendingDown, HelpCircle, Calendar, History, ChevronDown, ChevronUp } from "lucide-react";
import LZString from "lz-string";
import React, { useCallback, useMemo, useState } from "react";
import {
    Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InflationData } from "@/lib/calculator-types";
import { copyShareUrlToClipboard, getShareUrl } from "@/lib/share-utils";
import { formatCurrency, formatCurrencyPrecise } from "./tools";

interface InflationCalculatorProps {
    initialData?: InflationData | null;
}

const HISTORICAL_DATA: Record<string, Record<number, number>> = {
    AT: {
        1960: 1.5, 1961: 3.6, 1962: 4.5, 1963: 2.9, 1964: 3.9, 1965: 4.8, 1966: 2.9, 1967: 3.9, 1968: 3.0, 1969: 3.5,
        1970: 4.4, 1971: 4.7, 1972: 6.4, 1973: 7.6, 1974: 9.5, 1975: 8.5, 1976: 7.4, 1977: 5.5, 1978: 4.0, 1979: 3.7,
        1980: 6.4, 1981: 6.8, 1982: 5.4, 1983: 3.3, 1984: 5.6, 1985: 3.2, 1986: 1.7, 1987: 1.4, 1988: 1.9, 1989: 2.6,
        1990: 3.3, 1991: 3.3, 1992: 4.0, 1993: 3.6, 1994: 3.0, 1995: 2.2, 1996: 1.9, 1997: 1.3, 1998: 0.9, 1999: 0.6,
        2000: 2.3, 2001: 2.3, 2002: 1.7, 2003: 1.3, 2004: 2.1, 2005: 2.3, 2006: 1.4, 2007: 2.2, 2008: 3.2, 2009: 0.5,
        2010: 1.7, 2011: 3.3, 2012: 2.5, 2013: 2.0, 2014: 1.6, 2015: 0.9, 2016: 0.9, 2017: 2.1, 2018: 2.0, 2019: 1.5,
        2020: 1.4, 2021: 2.8, 2022: 8.6, 2023: 7.8, 2024: 2.9, 2025: 3.6,
    },
    DE: {
        1960: 1.5, 1961: 2.3, 1962: 2.9, 1963: 3.0, 1964: 2.3, 1965: 3.2, 1966: 3.5, 1967: 1.6, 1968: 1.6, 1969: 2.7,
        1970: 3.4, 1971: 5.3, 1972: 5.5, 1973: 6.9, 1974: 7.0, 1975: 5.9, 1976: 4.5, 1977: 3.7, 1978: 2.7, 1979: 4.1,
        1980: 5.4, 1981: 6.3, 1982: 5.3, 1983: 3.3, 1984: 2.4, 1985: 2.1, 1986: -0.1, 1987: 0.3, 1988: 1.3, 1989: 2.8,
        1990: 2.7, 1991: 3.5, 1992: 4.0, 1993: 4.5, 1994: 2.7, 1995: 1.8, 1996: 1.4, 1997: 1.9, 1998: 0.9, 1999: 0.6,
        2000: 1.4, 2001: 1.9, 2002: 1.4, 2003: 1.0, 2004: 1.7, 2005: 1.6, 2006: 1.6, 2007: 2.3, 2008: 2.6, 2009: 0.3,
        2010: 1.1, 2011: 2.1, 2012: 2.0, 2013: 1.5, 2014: 1.0, 2015: 0.5, 2016: 0.5, 2017: 1.5, 2018: 1.7, 2019: 1.4,
        2020: 0.4, 2021: 3.1, 2022: 6.9, 2023: 5.9, 2024: 2.3, 2025: 2.2,
    },
    EZ: {
        1991: 4.4, 1992: 4.4, 1993: 3.7, 1994: 2.9, 1995: 2.8, 1996: 2.3, 1997: 1.6, 1998: 1.1, 1999: 1.1,
        2000: 2.2, 2001: 2.4, 2002: 2.3, 2003: 2.1, 2004: 2.2, 2005: 2.2, 2006: 2.2, 2007: 2.1, 2008: 3.3, 2009: 0.3,
        2010: 1.6, 2011: 2.7, 2012: 2.5, 2013: 1.3, 2014: 0.4, 2015: 0.2, 2016: 0.2, 2017: 1.5, 2018: 1.8, 2019: 1.2,
        2020: 0.3, 2021: 2.6, 2022: 8.4, 2023: 5.5, 2024: 2.4, 2025: 2.4,
    },
    US: {
        1960: 1.5, 1961: 1.1, 1962: 1.2, 1963: 1.2, 1964: 1.3, 1965: 1.6, 1966: 3.0, 1967: 2.8, 1968: 4.3, 1969: 5.5,
        1970: 5.8, 1971: 4.3, 1972: 3.3, 1973: 6.2, 1974: 11.0, 1975: 9.1, 1976: 5.8, 1977: 6.5, 1978: 7.6, 1979: 11.3,
        1980: 13.5, 1981: 10.3, 1982: 6.2, 1983: 3.2, 1984: 4.3, 1985: 3.5, 1986: 1.9, 1987: 3.7, 1988: 4.1, 1989: 4.8,
        1990: 5.4, 1991: 4.2, 1992: 3.0, 1993: 3.0, 1994: 2.6, 1995: 2.8, 1996: 3.0, 1997: 2.3, 1998: 1.6, 1999: 2.2,
        2000: 3.4, 2001: 2.8, 2002: 1.6, 2003: 2.3, 2004: 2.7, 2005: 3.4, 2006: 3.2, 2007: 2.9, 2008: 3.8, 2009: -0.4,
        2010: 1.6, 2011: 3.2, 2012: 2.1, 2013: 1.5, 2014: 1.6, 2015: 0.1, 2016: 1.3, 2017: 2.1, 2018: 2.4, 2019: 1.8,
        2020: 1.2, 2021: 4.7, 2022: 8.0, 2023: 4.1, 2024: 2.9, 2025: 2.7,
    },
};

const REGION_LABELS: Record<string, string> = {
    AT: "Österreich",
    DE: "Deutschland",
    EZ: "Eurozone",
    US: "USA",
};

const REGION_INFO: Record<string, { minYear: number; maxYear: number; source: string }> = {
    AT: { minYear: 1960, maxYear: 2025, source: "Statistik Austria, Weltbank" },
    DE: { minYear: 1960, maxYear: 2025, source: "Destatis, Weltbank" },
    EZ: { minYear: 1991, maxYear: 2025, source: "EZB, Eurostat" },
    US: { minYear: 1960, maxYear: 2025, source: "BLS, Weltbank" },
};

function computeAverage(data: Record<number, number>, fromYear: number, toYear: number): number | null {
    const years = Object.keys(data).map(Number).filter(y => y >= fromYear && y <= toYear).sort((a, b) => a - b);
    if (years.length === 0) return null;
    const sum = years.reduce((acc, y) => acc + data[y], 0);
    return sum / years.length;
}

interface PeriodAverage {
    label: string;
    from: number;
    to: number;
}

const PERIODS: PeriodAverage[] = [
    { label: "Seit 1960", from: 1960, to: 2025 },
    { label: "Seit 1990", from: 1990, to: 2025 },
    { label: "Seit 2000", from: 2000, to: 2025 },
    { label: "Seit 2010", from: 2010, to: 2025 },
    { label: "Letzte 10 J.", from: 2016, to: 2025 },
    { label: "Letzte 5 J.", from: 2021, to: 2025 },
];

export function InflationCalculator({ initialData }: InflationCalculatorProps) {
    const [form, setForm] = useState<InflationData>(initialData || {
        amount: 100000,
        inflationRate: 2.5,
        years: 30,
        useHistorical: false,
        region: "AT",
        fromYear: 1960,
        toYear: 2025,
    });
    const [shareMessage, setShareMessage] = useState<string | null>(null);
    const [showBenchmarkTable, setShowBenchmarkTable] = useState(false);

    const regionMeta = REGION_INFO[form.region ?? "AT"];
    const availableYears = useMemo(() => {
        const data = HISTORICAL_DATA[form.region ?? "AT"];
        return Object.keys(data).map(Number).sort((a, b) => a - b);
    }, [form.region]);

    const avgInflation = useMemo(() => {
        if (!form.useHistorical) return null;
        return computeAverage(HISTORICAL_DATA[form.region ?? "AT"], form.fromYear ?? 1960, form.toYear ?? 2025);
    }, [form.useHistorical, form.region, form.fromYear, form.toYear]);

    const effectiveRate = form.useHistorical && avgInflation !== null ? avgInflation : form.inflationRate;

    const result = useMemo(() => {
        const nominalNeeded = form.amount * Math.pow(1 + effectiveRate / 100, form.years);
        const realPurchasingPower = form.amount / Math.pow(1 + effectiveRate / 100, form.years);
        const loss = form.amount - realPurchasingPower;
        return { nominalNeeded, realPurchasingPower, loss, avgRate: effectiveRate };
    }, [form.amount, effectiveRate, form.years]);

    const chartData = useMemo(() => {
        const data = [];
        for (let year = 0; year <= form.years; year++) {
            const purchasingPower = form.amount / Math.pow(1 + effectiveRate / 100, year);
            const nominalEquivalent = form.amount * Math.pow(1 + effectiveRate / 100, year);
            data.push({
                year,
                "Kaufkraft heute": Math.round(purchasingPower),
                "Nominal benötigt": Math.round(nominalEquivalent),
            });
        }
        return data;
    }, [form.amount, effectiveRate, form.years]);

    const serializeState = useCallback(() => {
        const state = { type: "inflation", data: form };
        return LZString.compressToEncodedURIComponent(JSON.stringify(state));
    }, [form]);

    const handleShareConfig = async () => {
        const serialized = serializeState();
        const shareUrl = getShareUrl('inflation', serialized);
        const copied = await copyShareUrlToClipboard(shareUrl);
        if (copied) {
            setShareMessage("Link kopiert!");
        } else {
            setShareMessage("Kopieren fehlgeschlagen!");
        }
        setTimeout(() => setShareMessage(null), 3000);
    };

    const update = (key: keyof InflationData, value: number | boolean | string) => {
        setForm(prev => ({ ...prev, [key]: value as never }));
    };

    const validationError = useMemo(() => {
        if (form.amount <= 0) return "Der Betrag muss größer als 0 € sein.";
        if (form.years <= 0) return "Der Anlagezeitraum muss mindestens 1 Jahr betragen.";
        if (!form.useHistorical && form.inflationRate < 0) return "Achtung: Negative Inflationsrate (Deflation) gewählt.";
        return null;
    }, [form]);

    return (
        <Card className="w-full shadow-xl rounded-2xl overflow-hidden py-0 border-border/70 dark:bg-card/90 backdrop-blur-md">
            <CalculatorHeader
                title="Inflations- & Kaufkraftrechner"
                description="Berechnen Sie den realen Kaufkraftverlust Ihres Vermögens über die Zeit mit historischen oder individuellen Raten."
                icon={TrendingDown}
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
                                Berechnungsmodus
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Wählen Sie feste Annahmen oder historische Daten.
                            </p>
                        </div>

                        <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-background/50">
                            <span className="text-xs font-medium">Historischer Index</span>
                            <Switch
                                id="use-historical"
                                checked={form.useHistorical}
                                onCheckedChange={v => update("useHistorical", v)}
                            />
                        </div>

                        <div className="space-y-3.5">
                            <div className="space-y-1.5">
                                <Label htmlFor="amount" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Betrag heute (€)</Label>
                                <Input min={0} id="amount" type="number" value={form.amount} onChange={e => update("amount", Number(e.target.value))} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="years" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Zeitraum (Jahre)</Label>
                                <Input min={1} max={100} id="years" type="number" value={form.years} onChange={e => update("years", Number(e.target.value))} />
                            </div>

                            {form.useHistorical ? (
                                <div className="space-y-3 pt-2 border-t border-border/40">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Region</Label>
                                        <Select value={form.region} onValueChange={v => update("region", v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(REGION_LABELS).map(([key, label]) => (
                                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Von</Label>
                                            <Select value={String(form.fromYear)} onValueChange={v => update("fromYear", Number(v))}>
                                                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {availableYears.filter(y => y < (form.toYear ?? 2025)).map(y => (
                                                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Bis</Label>
                                            <Select value={String(form.toYear)} onValueChange={v => update("toYear", Number(v))}>
                                                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {availableYears.filter(y => y > (form.fromYear ?? 1960)).map(y => (
                                                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {avgInflation !== null && (
                                        <div className="rounded-lg bg-primary/10 border border-primary/20 p-2.5 text-center text-xs text-primary font-medium">
                                            Ø {avgInflation.toFixed(2)}% p.a. ({form.fromYear}–{form.toYear})
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-1.5 pt-2 border-t border-border/40">
                                    <Label htmlFor="inflationRate" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Angenommene Inflation (% p.a.)</Label>
                                    <Input min={-5} max={50} id="inflationRate" type="number" step="0.1" value={form.inflationRate} onChange={e => update("inflationRate", Number(e.target.value))} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Visualisierung-Maske (Right Column) */}
                    <div className="md:col-span-2 space-y-4">
                        {validationError && (
                            <CalculatorBanner
                                type={validationError.startsWith("Achtung") ? "warning" : "error"}
                                message={validationError}
                            />
                        )}

                        {/* Top KPI Cards */}
                        <div className="grid sm:grid-cols-3 gap-3">
                            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 backdrop-blur-xs">
                                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Kaufkraft in {form.years} J.</span>
                                <h4 className="text-2xl font-extrabold text-destructive mt-1">
                                    {formatCurrency(result.realPurchasingPower)}
                                </h4>
                            </div>

                            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 backdrop-blur-xs">
                                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Nominal benötigt</span>
                                <h4 className="text-2xl font-extrabold text-primary mt-1">
                                    {formatCurrency(result.nominalNeeded)}
                                </h4>
                            </div>

                            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 backdrop-blur-xs">
                                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Kaufkraftverlust</span>
                                <h4 className="text-2xl font-extrabold text-amber-500 mt-1">
                                    -{formatCurrency(result.loss)}
                                </h4>
                            </div>
                        </div>

                        {/* Chart Container */}
                        <div className="rounded-xl border border-border/60 bg-card/60 dark:bg-card/30 p-4 sm:p-5 backdrop-blur-xs">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kaufkraftentwicklung bei {effectiveRate.toFixed(2)}% p.a.</span>
                                <span className="text-xs text-muted-foreground">Startwert: {formatCurrency(form.amount)}</span>
                            </div>
                            <ResponsiveContainer width="100%" height={320}>
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="inflationLossGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02}/>
                                        </linearGradient>
                                        <linearGradient id="nominalNeededGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#0284c7" stopOpacity={0.02}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                                    <XAxis dataKey="year" tickFormatter={(v: number) => `${v}J`} stroke="currentColor" className="text-xs opacity-60" />
                                    <YAxis tickFormatter={(v: number) => formatCurrency(v)} width={85} stroke="currentColor" className="text-xs opacity-60" />
                                    <Tooltip
                                        formatter={(val) => formatCurrencyPrecise(val as number)}
                                        labelFormatter={(label) => `Jahr ${label}`}
                                        contentStyle={{
                                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            color: '#fff',
                                            backdropFilter: 'blur(8px)'
                                        }}
                                    />
                                    <Area type="monotone" dataKey="Nominal benötigt" stroke="#0284c7" strokeWidth={2} fill="url(#nominalNeededGradient)" />
                                    <Area type="monotone" dataKey="Kaufkraft heute" stroke="#ef4444" strokeWidth={2} fill="url(#inflationLossGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Collapsible Benchmark Table */}
                        <div className="rounded-xl border border-border/50 bg-card/40 overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setShowBenchmarkTable(!showBenchmarkTable)}
                                className="w-full flex items-center justify-between p-3.5 text-xs font-semibold text-foreground hover:bg-muted/30 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <History className="h-4 w-4 text-primary" />
                                    <span>Historische Inflationsraten im Vergleich anzeigen</span>
                                </div>
                                {showBenchmarkTable ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>

                            {showBenchmarkTable && (
                                <div className="p-4 border-t border-border/40 space-y-3">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs border-collapse">
                                            <thead>
                                                <tr className="border-b border-border/40 text-muted-foreground">
                                                    <th className="text-left py-2 pr-3 font-semibold">Region</th>
                                                    {PERIODS.map(p => (
                                                        <th key={p.label} className="text-right py-2 px-2 font-semibold whitespace-nowrap">{p.label}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(["AT", "DE", "EZ", "US"] as const).map(region => {
                                                    const data = HISTORICAL_DATA[region];
                                                    const minY = Math.min(...Object.keys(data).map(Number));
                                                    return (
                                                        <tr key={region} className="border-b border-border/30 last:border-0 hover:bg-muted/20">
                                                            <td className="py-2 pr-3 font-medium text-foreground">{REGION_LABELS[region]}</td>
                                                            {PERIODS.map(p => {
                                                                const avg = p.from >= minY ? computeAverage(data, p.from, p.to) : null;
                                                                return (
                                                                    <td key={p.label} className="text-right py-2 px-2 tabular-nums">
                                                                        {avg !== null ? `${avg.toFixed(1)}%` : "–"}
                                                                    </td>
                                                                );
                                                            })}
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">
                                        Quellen: Statistik Austria, Destatis, EZB / Eurostat, BLS, Weltbank (VPI / HICP).
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <CardFooter className="px-6 py-4 text-xs text-muted-foreground border-t border-border/40 flex justify-between items-center bg-card/30">
                <p>
                    Hinweis: Historische Raten sind keine Garantie für zukünftige Geldentwertung. Renditen oberhalb der Inflationsrate sichern die reale Kaufkraft.
                </p>
            </CardFooter>
        </Card>
    );
}