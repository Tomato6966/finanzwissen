"use client"
import { CalculatorBanner } from "./CalculatorBanner";
import { CalculatorHeader } from "./CalculatorHeader";

import { BarChart3, Plus, Search, Share2, Trash2, WandSparkles } from "lucide-react";
import LZString from "lz-string";
import { useCallback, useMemo, useState } from "react";
import {
    Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

import { Button } from "@/components/ui/button";
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getHistoricalData, searchAssets } from "@/lib/yahoofinanceService";

import { formatCurrency } from "./tools";

import type { Asset } from "@/lib/yahoofinanceService";
import type { FinanzWizardData } from "@/lib/calculator-types";
import { copyShareUrlToClipboard, getShareUrl } from "@/lib/share-utils";

interface FinanzWizardCalculatorProps {
    initialData: FinanzWizardData | null;
}

interface WizardPoint {
    date: string;
    portfolio: number;
    contributions: number;
}

const defaultData: FinanzWizardData = {
    initialCapital: 10000,
    monthlyContribution: 500,
    startDate: "2015-01-01",
    endDate: new Date().toISOString().slice(0, 10),
    assets: [
        { symbol: "IWDA.AS", weight: 80 },
        { symbol: "EIMI.L", weight: 20 },
    ],
};

export function FinanzWizardCalculator({ initialData }: FinanzWizardCalculatorProps) {
    const [formData, setFormData] = useState<FinanzWizardData>(initialData || defaultData);
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Asset[]>([]);
    const [chartData, setChartData] = useState<WizardPoint[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [shareMessage, setShareMessage] = useState<string | null>(null);

    const totalWeight = useMemo(() => formData.assets.reduce((sum, asset) => sum + asset.weight, 0), [formData.assets]);
    const finalPoint = chartData[chartData.length - 1];
    const totalReturn = finalPoint ? finalPoint.portfolio - finalPoint.contributions : 0;

    const updateAsset = (index: number, field: "symbol" | "weight", value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            assets: prev.assets.map((asset, itemIndex) => itemIndex === index ? { ...asset, [field]: value } : asset),
        }));
    };

    const addAsset = (symbol = "") => {
        setFormData((prev) => ({ ...prev, assets: [...prev.assets, { symbol, weight: 0 }] }));
    };

    const removeAsset = (index: number) => {
        setFormData((prev) => ({ ...prev, assets: prev.assets.filter((_, itemIndex) => itemIndex !== index) }));
    };

    const handleSearch = async () => {
        if (!query.trim()) return;
        setIsLoading(true);
        setSearchResults(await searchAssets(query, "etf,equity,index"));
        setIsLoading(false);
    };

    const runBacktest = async () => {
        setError(null);
        if (Math.round(totalWeight) !== 100) {
            setError("Die Gewichtungen muessen zusammen 100 Prozent ergeben.");
            return;
        }

        setIsLoading(true);
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        const histories = await Promise.all(formData.assets.map(async (asset) => ({
            ...asset,
            data: (await getHistoricalData(asset.symbol.trim(), startDate, endDate)).historicalData,
        })));

        if (histories.some((asset) => asset.data.size === 0)) {
            setError("Fuer mindestens ein Symbol konnten keine Yahoo-Finance-Daten geladen werden. Pruefe Ticker und Zeitraum.");
            setIsLoading(false);
            return;
        }

        const dates = Array.from(histories[0].data.keys()).filter((date) => histories.every((asset) => asset.data.has(date)));
        let portfolio = formData.initialCapital;
        let contributions = formData.initialCapital;
        let lastMonth = "";
        const points: WizardPoint[] = [];

        for (let index = 1; index < dates.length; index++) {
            const previousDate = dates[index - 1];
            const date = dates[index];
            const weightedReturn = histories.reduce((sum, asset) => {
                const previous = asset.data.get(previousDate) || 0;
                const current = asset.data.get(date) || previous;
                return sum + ((current - previous) / previous) * (asset.weight / 100);
            }, 0);

            portfolio *= 1 + weightedReturn;
            const month = date.slice(0, 7);
            if (month !== lastMonth) {
                portfolio += formData.monthlyContribution;
                contributions += formData.monthlyContribution;
                lastMonth = month;
            }

            if (index % 8 === 0 || index === dates.length - 1) {
                points.push({ date, portfolio, contributions });
            }
        }

        setChartData(points);
        setIsLoading(false);
    };

    const serializeState = useCallback(() => {
        const state = { type: "finanzwizard", data: formData };
        return LZString.compressToEncodedURIComponent(JSON.stringify(state));
    }, [formData]);

    const handleShareConfig = async () => {
        const serialized = serializeState();
        const shareUrl = getShareUrl('finanzwizard', serialized);
        const copied = await copyShareUrlToClipboard(shareUrl);
        if (copied) {
            setShareMessage("Link kopiert!");
        } else {
            setShareMessage("Kopieren fehlgeschlagen!");
        }
        setTimeout(() => setShareMessage(null), 3000);
    };

    return (
        <Card className="w-full shadow-xl rounded-2xl overflow-hidden py-0 border-border/70 dark:bg-card/90 backdrop-blur-md">
            <CalculatorHeader
                title="FinanzWizard Simulations-Rechner"
                description="Ganzheitliche Portfolio-Simulation mit echten historischen Kursdaten aus Yahoo Finance für Backtests und Sparpläne."
                icon={WandSparkles}
                badge="Simulationen"
                shareMessage={shareMessage}
                onShare={handleShareConfig}
            />

            <div className="p-6 sm:p-7 space-y-6">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Picker-Maske (Left Column) */}
                    <div className="md:col-span-1 space-y-4 rounded-xl border border-border/50 bg-card/50 dark:bg-card/30 p-4 sm:p-5">
                        <div className="border-b border-border/40 pb-3">
                            <h3 className="text-base font-semibold text-foreground">
                                Asset-Suche & Allokation
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Wählen Sie ETFs/Aktien und bestimmen Sie die Gewichtung.
                            </p>
                        </div>

                        {/* Search Box */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ticker suchen</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder="z.B. IWDA, CSPX, Apple..."
                                    className="h-8 text-xs"
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                                />
                                <Button size="sm" onClick={handleSearch} disabled={isLoading} className="h-8 text-xs">
                                    <Search className="h-3.5 w-3.5" />
                                </Button>
                            </div>

                            {searchResults.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {searchResults.slice(0, 4).map((asset) => (
                                        <Button
                                            key={asset.symbol}
                                            variant="outline"
                                            size="sm"
                                            className="h-6 text-[10px] px-2"
                                            onClick={() => addAsset(asset.symbol)}
                                        >
                                            <Plus className="mr-1 h-2.5 w-2.5" />
                                            {asset.symbol}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sparplan Parameter */}
                        <div className="space-y-3 pt-2 border-t border-border/40">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Startkapital (€)</Label>
                                    <Input
                                        type="number"
                                        value={formData.initialCapital}
                                        onChange={(event) => setFormData({ ...formData, initialCapital: Number(event.target.value) || 0 })}
                                        className="h-8 text-xs"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sparplan mtl. (€)</Label>
                                    <Input
                                        type="number"
                                        value={formData.monthlyContribution}
                                        onChange={(event) => setFormData({ ...formData, monthlyContribution: Number(event.target.value) || 0 })}
                                        className="h-8 text-xs"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Von</Label>
                                    <Input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(event) => setFormData({ ...formData, startDate: event.target.value })}
                                        className="h-8 text-xs"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bis</Label>
                                    <Input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(event) => setFormData({ ...formData, endDate: event.target.value })}
                                        className="h-8 text-xs"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Asset List */}
                        <div className="space-y-2.5 pt-2 border-t border-border/40">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Portfolio Positionen</Label>
                                <span className={`text-xs font-bold ${Math.round(totalWeight) === 100 ? "text-emerald-500" : "text-amber-500"}`}>
                                    {totalWeight}% {Math.round(totalWeight) === 100 ? "✓" : "(!)"}
                                </span>
                            </div>

                            {formData.assets.map((asset, index) => (
                                <div key={`${asset.symbol}-${index}`} className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/50 p-1.5">
                                    <Input
                                        value={asset.symbol}
                                        onChange={(event) => updateAsset(index, "symbol", event.target.value.toUpperCase())}
                                        placeholder="Ticker"
                                        className="h-7 text-xs flex-1 uppercase font-semibold"
                                    />
                                    <div className="flex items-center gap-1 w-20">
                                        <Input
                                            type="number"
                                            value={asset.weight}
                                            onChange={(event) => updateAsset(index, "weight", Number(event.target.value) || 0)}
                                            className="h-7 text-xs text-right"
                                        />
                                        <span className="text-[10px] text-muted-foreground">%</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeAsset(index)}
                                        className="h-7 w-7 text-destructive hover:text-destructive/80 shrink-0"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            ))}

                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-xs font-semibold border-dashed"
                                onClick={() => addAsset()}
                            >
                                <Plus className="mr-1.5 h-3.5 w-3.5" />
                                Position hinzufügen
                            </Button>

                            <Button
                                className="w-full text-xs font-semibold mt-2"
                                onClick={runBacktest}
                                disabled={isLoading}
                            >
                                <BarChart3 className="mr-1.5 h-4 w-4" />
                                {isLoading ? "Lade Yahoo Daten..." : "Backtest starten"}
                            </Button>
                        </div>
                    </div>

                    {/* Visualisierung-Maske (Right Column) */}
                    <div className="md:col-span-2 space-y-4">
                        {error && (
                            <CalculatorBanner
                                type="error"
                                message={error}
                            />
                        )}

                        {Math.round(totalWeight) !== 100 && !error && (
                            <CalculatorBanner
                                type="warning"
                                message={`Die Gewichtung summiert sich aktuell auf ${totalWeight}%. Bitte passen Sie die Anteile auf 100% an.`}
                            />
                        )}

                        {/* Top KPI Cards */}
                        <div className="grid sm:grid-cols-3 gap-3">
                            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 backdrop-blur-xs">
                                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Endwert Portfolio</span>
                                <h4 className="text-2xl font-extrabold text-primary mt-1">
                                    {formatCurrency(finalPoint?.portfolio || 0)}
                                </h4>
                            </div>

                            <div className="rounded-xl border border-border/50 bg-card/40 p-4 backdrop-blur-xs">
                                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Einzahlungen</span>
                                <h4 className="text-2xl font-bold text-foreground mt-1">
                                    {formatCurrency(finalPoint?.contributions || 0)}
                                </h4>
                            </div>

                            <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 backdrop-blur-xs">
                                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Wertzuwachs (Netto)</span>
                                <h4 className={`text-2xl font-extrabold mt-1 ${totalReturn >= 0 ? "text-emerald-500" : "text-destructive"}`}>
                                    {totalReturn >= 0 ? "+" : ""}{formatCurrency(totalReturn)}
                                </h4>
                            </div>
                        </div>

                        {/* Chart Container */}
                        <div className="rounded-xl border border-border/60 bg-card/60 dark:bg-card/30 p-4 sm:p-5 backdrop-blur-xs">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Portfolioverlauf (Historische Marktdaten)</span>
                                <span className="text-xs text-muted-foreground">
                                    {chartData.length > 0 ? `${chartData.length} Datenpunkte` : "Starten Sie den Backtest"}
                                </span>
                            </div>
                            <ResponsiveContainer width="100%" height={380}>
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="wizardPortfolioGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#0284c7" stopOpacity={0.02}/>
                                        </linearGradient>
                                        <linearGradient id="wizardContribGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#64748b" stopOpacity={0.25}/>
                                            <stop offset="95%" stopColor="#64748b" stopOpacity={0.02}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                                    <XAxis dataKey="date" minTickGap={40} stroke="currentColor" className="text-xs opacity-60" />
                                    <YAxis tickFormatter={(val: number) => formatCurrency(val)} width={85} stroke="currentColor" className="text-xs opacity-60" />
                                    <Tooltip
                                        formatter={(val) => formatCurrency(val as number)}
                                        contentStyle={{
                                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            color: '#fff',
                                            backdropFilter: 'blur(8px)'
                                        }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                                    <Area type="monotone" dataKey="contributions" name="Einzahlungen" stroke="#64748b" strokeWidth={1.5} fill="url(#wizardContribGradient)" />
                                    <Area type="monotone" dataKey="portfolio" name="Portfolio Gesamt" stroke="#0284c7" strokeWidth={2.5} fill="url(#wizardPortfolioGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            <CardFooter className="px-6 py-4 text-xs text-muted-foreground border-t border-border/40 flex justify-between items-center bg-card/30">
                <p>
                    Datenquelle: Yahoo Finance über Live-Proxy. Historische Kurse sind vergangenheitsbezogen und keine Garantie für die Zukunft.
                </p>
            </CardFooter>
        </Card>
    );
}
