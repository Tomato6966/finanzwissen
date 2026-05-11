"use client"

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

    const handleShareConfig = () => {
        const shareUrl = `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH || ""}/calculators?share=${serializeState()}`;
        navigator.clipboard?.writeText(shareUrl).then(() => {
            setShareMessage("Link kopiert!");
            setTimeout(() => setShareMessage(null), 3000);
        }).catch(() => setShareMessage("Kopieren fehlgeschlagen"));
    };

    return (
        <Card className="w-full max-w-7xl overflow-hidden border-border bg-card shadow-2xl py-0">
            <CardHeader className="bg-muted p-6 text-foreground">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <CardTitle className="flex items-center gap-3 text-3xl">
                            <WandSparkles className="h-8 w-8 text-primary" />
                            FinanzWizard
                        </CardTitle>
                        <CardDescription className="mt-2 text-muted-foreground">
                            All-in-one Portfolio-Backtest mit Yahoo-Finance-Daten. Läuft clientseitig und nutzt den vorhandenen CORS-Proxy fuer GitHub Pages.
                        </CardDescription>
                    </div>
                    <Button onClick={handleShareConfig} variant="secondary">
                        <Share2 className="mr-2 h-4 w-4" />
                        {shareMessage || "Konfiguration teilen"}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="grid gap-6 p-6 lg:grid-cols-3">
                <div className="space-y-5">
                    <div className="rounded-lg border p-4">
                        <h3 className="mb-3 flex items-center gap-2 font-semibold">
                            <Search className="h-5 w-5" />
                            Ticker suchen
                        </h3>
                        <div className="flex gap-2">
                            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="MSCI World, Apple, S&P 500..." />
                            <Button onClick={handleSearch} disabled={isLoading}>Suchen</Button>
                        </div>
                        <div className="mt-3 space-y-2">
                            {searchResults.slice(0, 5).map((asset) => (
                                <Button key={asset.symbol} variant="outline" size="sm" className="mr-2" onClick={() => addAsset(asset.symbol)}>
                                    <Plus className="mr-1 h-3 w-3" />
                                    {asset.symbol}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3 rounded-lg border p-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>Startkapital Euro</Label>
                                <Input type="number" value={formData.initialCapital} onChange={(event) => setFormData({ ...formData, initialCapital: Number(event.target.value) || 0 })} />
                            </div>
                            <div>
                                <Label>Sparplan mtl. Euro</Label>
                                <Input type="number" value={formData.monthlyContribution} onChange={(event) => setFormData({ ...formData, monthlyContribution: Number(event.target.value) || 0 })} />
                            </div>
                            <div>
                                <Label>Startdatum</Label>
                                <Input type="date" value={formData.startDate} onChange={(event) => setFormData({ ...formData, startDate: event.target.value })} />
                            </div>
                            <div>
                                <Label>Enddatum</Label>
                                <Input type="date" value={formData.endDate} onChange={(event) => setFormData({ ...formData, endDate: event.target.value })} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Portfolio</h3>
                            <span className={totalWeight === 100 ? "text-emerald-600" : "text-orange-600"}>{totalWeight}%</span>
                        </div>
                        {formData.assets.map((asset, index) => (
                            <div key={`${asset.symbol}-${index}`} className="grid grid-cols-[1fr_90px_38px] gap-2">
                                <Input value={asset.symbol} onChange={(event) => updateAsset(index, "symbol", event.target.value.toUpperCase())} placeholder="Ticker" />
                                <Input type="number" value={asset.weight} onChange={(event) => updateAsset(index, "weight", Number(event.target.value) || 0)} />
                                <Button variant="ghost" size="icon" onClick={() => removeAsset(index)}>
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" className="w-full" onClick={() => addAsset()}>
                            <Plus className="mr-2 h-4 w-4" />
                            Position hinzufuegen
                        </Button>
                        <Button className="w-full" onClick={runBacktest} disabled={isLoading}>
                            <BarChart3 className="mr-2 h-4 w-4" />
                            {isLoading ? "Lade Daten..." : "Backtest starten"}
                        </Button>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                    </div>
                </div>

                <div className="space-y-4 lg:col-span-2">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Endwert</CardTitle>
                            </CardHeader>
                            <CardContent className="text-3xl font-bold text-cyan-700 dark:text-cyan-300">
                                {formatCurrency(finalPoint?.portfolio || 0)}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Einzahlungen</CardTitle>
                            </CardHeader>
                            <CardContent className="text-3xl font-bold">
                                {formatCurrency(finalPoint?.contributions || 0)}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Gewinn</CardTitle>
                            </CardHeader>
                            <CardContent className={`text-3xl font-bold ${totalReturn >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                                {formatCurrency(totalReturn)}
                            </CardContent>
                        </Card>
                    </div>
                    <div className="rounded-lg border p-4">
                        <ResponsiveContainer width="100%" height={460}>
                            <AreaChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                                <XAxis dataKey="date" minTickGap={36} />
                                <YAxis tickFormatter={(value) => formatCurrency(Number(value))} width={90} />
                                <Tooltip formatter={(value: number, name: string) => [formatCurrency(value), name]} />
                                <Legend />
                                <Area type="monotone" dataKey="contributions" name="Einzahlungen" stroke="#64748b" fill="#cbd5e1" fillOpacity={0.45} />
                                <Area type="monotone" dataKey="portfolio" name="Portfolio" stroke="#0891b2" fill="#67e8f9" fillOpacity={0.5} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="bg-slate-50 p-5 text-sm text-muted-foreground dark:bg-slate-900">
                Datenquelle: Yahoo Finance ueber Browser-Fetch. Historische Kurse koennen fehlen, verzerrt sein oder nicht alle Ausschüttungen abbilden.
            </CardFooter>
        </Card>
    );
}
