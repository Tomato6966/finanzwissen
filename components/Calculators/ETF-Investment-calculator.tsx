/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import {
	BarChart, ChartAreaIcon, ExternalLink, Eye, EyeClosed, Info, PieChart, TrendingUp
} from "lucide-react";
import LZString from "lz-string";
import React, { FC, useCallback, useEffect, useState } from "react";
import {
	Area, AreaChart, CartesianGrid, Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer,
	Tooltip, XAxis, YAxis
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/MultiSelect";
import {
	Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ETFInvestmentData } from "@/lib/calculator-types";
import {
	calculateProjection, calculateRiskProfile, getAvailableRegions, getETFRecommendations,
	getReturnBreakdown
} from "@/lib/etf-calculator-logic";
import { getHistoricalData } from "@/lib/yahoofinanceService";

import { formatCurrency, handleFormChange, handleSelectChange } from "./tools";

interface ETFInvestmentCalculatorProps {
    initialData: ETFInvestmentData | null;
}

interface ETFRecommendation {
    name: string;
    weight: number;
    ticker?: string;
    isin?: string;
    description?: string;
    ter?: number;
    justEtfUrl?: string;
    historicalReturn?: number;
    volatility?: number;
}

interface Projection {
    futureValue: number;
    totalInvestment: number;
    totalProfit: number;
    chartData?: Array<{
        year: number;
        value: number;
        contributions: number;
        returns: number;
    }>;
}

interface Results {
    stockAllocation: number;
    bondAllocation: number;
    recommendations: ETFRecommendation[];
    projection10Years: Projection;
    projection20Years: Projection;
    annualReturn: number;
    riskScore: number;
}

interface HistoricalPerformance {
    ticker: string;
    annualReturn: number;
    volatility: number;
    maxDrawdown: number;
    sharpeRatio: number;
}


// Example for HIGH RISK / USA + TECH: http://localhost:3000/calculators?share=N4IgLgngDgpiBcIZgGYFoCWA7AbjAzmALYxZggA0IAJgIZi0Ki0Dmc8ATB1QE4b4BrACoB7ADYwetLAGN2IVix4F8GPJRDY8hEmQASIvgC8RWBCDGmWG5Swyn8CANogAqgGUAghoCiAVx4RKEYqAHFLACNaMQ0hGBkACyxxETs4AF0qGVMwPgi-MHssTyIRPzIEAEYAVgAGWqycvIKigEkySRxo81KyBLEIDUJaHkKsFgBhWigMBhj4OvqGpAAPWD5SOXMYNclyKmwZMT9qGHaUMXoihFy-GABfe6A
export const ETFInvestmentCalculator: FC<ETFInvestmentCalculatorProps> = ({
    initialData,
}) => {
    const [formData, setFormData] = useState<ETFInvestmentData>({
        age: 30,
        riskTolerance: "moderate",
        investmentHorizon: "normal",
        regions: ["Global"],
        contributionAmount: 500,
        contributionInterval: "monthly",
        startingCapital: 10000,
        experience: "intermediate",
        includeInflation: true,
    });

    const [results, setResults] = useState<Results | null>(null);
    const [shareMessage, setShareMessage] = useState<string | null>(null);
    const [isLoadingHistorical, setIsLoadingHistorical] = useState<boolean>(false);
    const [historicalPerformance, setHistoricalPerformance] = useState<HistoricalPerformance[]>([]);
    const [availableRegions, setAvailableRegions] = useState<Array<{label: string, value: string}>>(getAvailableRegions("intermediate"));
    const [showReturnDetails, setShowReturnDetails] = useState<boolean>(false);
    const [showProjection, setShowProjection] = useState<boolean>(false);

    const handleShareConfig = () => {
        const serialized = serializeState();
        const shareUrl = `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH || ""}/calculators?share=${serialized}`;
        try {
            navigator.clipboard.writeText(shareUrl).then(() => {
                setShareMessage("Link kopiert!");
                setTimeout(() => setShareMessage(null), 3000);
            });
        } catch (err) {
            console.error("Failed to copy text: ", err);
            setShareMessage("Kopieren fehlgeschlagen!");
            setTimeout(() => setShareMessage(null), 3000);
        }
    };

    const serializeState = useCallback(() => {
        const state = {
            type: "etf-investment",
            data: formData
        };
        const jsonString = JSON.stringify(state);
        return LZString.compressToEncodedURIComponent(jsonString);
    }, [formData]);

    const memoizedHandleFormChange = useCallback(handleFormChange(setFormData), []);
    const memoizedHandleSelectChange = useCallback((name: keyof ETFInvestmentData) => {
        return handleSelectChange(setFormData, name as string);
    }, []);

    const handleRegionsChange = useCallback((newRegions: string[]) => {
        setFormData(prev => ({...prev, regions: newRegions}));
    }, []);

    const handleExperienceChange = useCallback((newExperience: string) => {
        const newAvailableRegions = getAvailableRegions(newExperience);
        setAvailableRegions(newAvailableRegions);

        // Reset regions if current selection is not available for new experience level
        const validRegions = formData.regions.filter(region =>
            newAvailableRegions.some(ar => ar.value === region)
        );

        // If beginner, force Global selection
        const finalRegions = newExperience === "beginner" ? ["Global"] :
            validRegions.length > 0 ? validRegions : [];

        setFormData(prev => ({
            ...prev,
            experience: newExperience as ETFInvestmentData["experience"],
            regions: finalRegions
        }));
    }, [formData.regions]);

    // Fetch historical data for recommended ETFs
    const fetchHistoricalData = useCallback(async (recommendations: ETFRecommendation[]) => {
        if (recommendations.length === 0) return;

        setIsLoadingHistorical(true);
        const historicalData: HistoricalPerformance[] = [];

        const endDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(endDate.getFullYear() - 5); // 5 years of data

        for (const rec of recommendations.filter(r => r.ticker)) {
            try {
                const data = await getHistoricalData(rec.ticker!, startDate, endDate);
                if (data.historicalData.size > 0) {
                    const prices = Array.from(data.historicalData.values());
                    const returns = [];

                    for (let i = 1; i < prices.length; i++) {
                        returns.push((prices[i] - prices[i-1]) / prices[i-1]);
                    }

                    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length * 252; // Annualized
                    const volatility = Math.sqrt(returns.reduce((a, b) => a + Math.pow(b - avgReturn/252, 2), 0) / returns.length) * Math.sqrt(252);

                    // Calculate max drawdown
                    let maxDrawdown = 0;
                    let peak = prices[0];
                    for (const price of prices) {
                        if (price > peak) peak = price;
                        const drawdown = (peak - price) / peak;
                        if (drawdown > maxDrawdown) maxDrawdown = drawdown;
                    }

                    const sharpeRatio = avgReturn / volatility;

                    historicalData.push({
                        ticker: rec.ticker!,
                        annualReturn: avgReturn * 100,
                        volatility: volatility * 100,
                        maxDrawdown: maxDrawdown * 100,
                        sharpeRatio
                    });
                }
            } catch (error) {
                console.error(`Error fetching data for ${rec.ticker}:`, error);
            }
        }

        setHistoricalPerformance(historicalData);
        setIsLoadingHistorical(false);
    }, []);

    useEffect(() => {
        const { stockAllocation, bondAllocation, riskScore } = calculateRiskProfile(formData);
        const recommendations = getETFRecommendations(stockAllocation, formData.regions, formData);
        const { projection10Years, projection20Years, annualReturn } = calculateProjection(formData, stockAllocation, bondAllocation, recommendations);

        setResults({
            stockAllocation,
            bondAllocation,
            recommendations,
            projection10Years,
            projection20Years,
            annualReturn,
            riskScore,
        });

        // Fetch historical data for recommendations
        fetchHistoricalData(recommendations);
    }, [formData, fetchHistoricalData]);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    return (
        <Card className="w-full max-w-7xl shadow-2xl rounded-xl overflow-hidden py-0 dark:bg-card bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-8 rounded-t-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-4xl font-bold flex items-center gap-4 mb-2">
                            <TrendingUp className="w-10 h-10" />
                            ETF-Investment-Strategie-Rechner
                        </CardTitle>
                        <CardDescription className="text-white/90 text-lg">
                            Erstellen Sie eine passende ETF-Anlagestrategie basierend auf Ihrem Risikoprofil und Ihren Zielen.
                        </CardDescription>
                    </div>
                    <Button
                        onClick={handleShareConfig}
                        className="bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-sm transition-all duration-200"
                        variant="outline"
                    >
                        {shareMessage || "Konfiguration teilen"}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-8 p-8">
                <Card className="md:col-span-1 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-blue-700 dark:text-blue-300">
                            Ihre Angaben
                        </CardTitle>
                        <CardDescription>
                            Geben Sie Ihre persönlichen Daten ein, um eine maßgeschneiderte Strategie zu erhalten.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="age" className="text-sm font-medium">Alter</Label>
                            <Input
                                min={18}
                                max={100}
                                id="age"
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={memoizedHandleFormChange}
                                className="focus:ring-2 focus:ring-blue-500"
                                placeholder="z.B. 30"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="riskTolerance" className="text-sm font-medium">Risikobereitschaft</Label>
                            <Select value={formData.riskTolerance} onValueChange={memoizedHandleSelectChange("riskTolerance")}>
                                <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="Wählen Sie Ihre Risikobereitschaft" />
                                </SelectTrigger>
                                <SelectContent className="w-auto min-w-[280px] max-w-[400px]">
                                    <SelectItem value="conservative" className="h-auto py-2">
                                        <div className="flex items-start gap-2 w-full">
                                            <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0 mt-0.5"></div>
                                            <span className="text-wrap leading-tight text-sm">Konservativ - Sicherheit steht im Vordergrund</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="moderate" className="h-auto py-2">
                                        <div className="flex items-start gap-2 w-full">
                                            <div className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0 mt-0.5"></div>
                                            <span className="text-wrap leading-tight text-sm">Moderat - Ausgewogenes Verhältnis</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="aggressive" className="h-auto py-2">
                                        <div className="flex items-start gap-2 w-full">
                                            <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 mt-0.5"></div>
                                            <span className="text-wrap leading-tight text-sm">Offensiv - Höhere Rendite bei höherem Risiko</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="investmentHorizon" className="text-sm font-medium">Anlagehorizont</Label>
                            <Select value={formData.investmentHorizon} onValueChange={memoizedHandleSelectChange("investmentHorizon")}>
                                <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="Wie lange möchten Sie investieren?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="short">Kurz (3-5 Jahre)</SelectItem>
                                    <SelectItem value="medium">Mittel (5-10 Jahre)</SelectItem>
                                    <SelectItem value="normal">Normal (10-20 Jahre)</SelectItem>
                                    <SelectItem value="long">Lang (20-40 Jahre)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="regions" className="text-sm font-medium">Gewünschte Regionen</Label>
                            <MultiSelect
                                options={availableRegions}
                                value={formData.regions}
                                onChange={handleRegionsChange}
                                placeholder={formData.experience === "beginner" ?
                                    "Global wird für Anfänger empfohlen" :
                                    "Wählen Sie Ihre gewünschten Regionen"}
                                className="focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500">
                                {formData.experience === "beginner" &&
                                    "Als Anfänger empfehlen wir eine globale Diversifikation"}
                                {formData.experience === "intermediate" &&
                                    "Kombinieren Sie verschiedene Regionen für bessere Diversifikation"}
                                {formData.experience === "expert" &&
                                    "Als Experte können Sie gezielt in spezifische Regionen investieren"}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startingCapital" className="text-sm font-medium">Startkapital (€)</Label>
                                <Input
                                    min={0}
                                    id="startingCapital"
                                    name="startingCapital"
                                    type="number"
                                    value={formData.startingCapital}
                                    onChange={memoizedHandleFormChange}
                                    className="focus:ring-2 focus:ring-blue-500"
                                    placeholder="10.000"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contributionAmount" className="text-sm font-medium">Sparbetrag (€)</Label>
                                <Input
                                    min={0}
                                    id="contributionAmount"
                                    name="contributionAmount"
                                    type="number"
                                    value={formData.contributionAmount}
                                    onChange={memoizedHandleFormChange}
                                    className="focus:ring-2 focus:ring-blue-500"
                                    placeholder="500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contributionInterval" className="text-sm font-medium">Sparintervall</Label>
                            <Select value={formData.contributionInterval} onValueChange={memoizedHandleSelectChange("contributionInterval")}>
                                <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="Wie oft möchten Sie sparen?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Täglich</SelectItem>
                                    <SelectItem value="weekly">Wöchentlich</SelectItem>
                                    <SelectItem value="bi-weekly">2-Wöchentlich</SelectItem>
                                    <SelectItem value="monthly">Monatlich (empfohlen)</SelectItem>
                                    <SelectItem value="quarterly">Quartalsweise</SelectItem>
                                    <SelectItem value="yearly">Jährlich</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="experience" className="text-sm font-medium">Investitionserfahrung</Label>
                            <Select value={formData.experience} onValueChange={handleExperienceChange}>
                                <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="Wie erfahren sind Sie?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="beginner">
                                        <div className="flex flex-col">
                                            <span>Anfänger</span>
                                            <span className="text-xs text-gray-500">Erste Erfahrungen - FTSE All-World empfohlen</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="intermediate">
                                        <div className="flex flex-col">
                                            <span>Fortgeschritten</span>
                                            <span className="text-xs text-gray-500">MSCI World + EM, regionale ETFs</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="expert">
                                        <div className="flex flex-col">
                                            <span>Experte</span>
                                            <span className="text-xs text-gray-500">S&P 500, Nasdaq, spezifische Märkte</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="includeInflation" className="text-sm font-medium">Inflation berücksichtigen?</Label>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        Anpassung der Prognose um ~2,5% jährliche Inflation
                                    </p>
                                </div>
                                <Switch
                                    id="includeInflation"
                                    checked={formData.includeInflation}
                                    onCheckedChange={(checked) => setFormData((prev: ETFInvestmentData) => ({...prev, includeInflation: checked}))}
                                />
                            </div>
                        </Card>
                    </CardContent>
                </Card>

                <div className="md:col-span-2 space-y-6">
                    {results && (
                        <div className="space-y-6">
                            {/* Header with Risk Score */}
                            <div className="flex items-center justify-between">
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Ihre ETF-Strategie
                                </h2>
                                <div className="flex items-center gap-4">
                                    <Badge variant={results.riskScore > 7 ? "destructive" : results.riskScore > 4 ? "default" : "secondary"} className="text-lg px-4 py-2">
                                        Risiko-Score: {results.riskScore}/10
                                    </Badge>
                                </div>
                            </div>

                            {/* Asset Allocation Visualization */}
                            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <PieChart className="w-5 h-5" />
                                        Empfohlene Asset-Allokation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">Aktien (Equity)</span>
                                                    <span className="font-bold text-blue-600">{results.stockAllocation}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div
                                                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-700"
                                                        style={{ width: `${results.stockAllocation}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">Anleihen (Bonds)</span>
                                                    <span className="font-bold text-green-600">{results.bondAllocation}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div
                                                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-700"
                                                        style={{ width: `${results.bondAllocation}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <TrendingUp className="w-4 h-4 text-green-600" />
                                                        <span className="font-medium">Erwartete jährliche Rendite</span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setShowReturnDetails(!showReturnDetails)}
                                                        className="text-xs px-2 py-1 h-auto"
                                                    >
                                                        {showReturnDetails ? "Weniger" : "Details"}
                                                    </Button>
                                                </div>
                                                <span className="text-2xl font-bold text-green-600">
                                                    {(results.annualReturn * 100).toFixed(2)}%
                                                </span>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Basierend auf gewichteten historischen Durchschnitten der empfohlenen ETFs.
                                                    <span className="font-medium text-amber-600"> Tatsächliche Renditen können abweichen.</span>
                                                    <br />
                                                    <span className="font-medium text-emerald-600 italic text-xs"> Der Durchschnittliche Jährliche Return des breiten Aktienmarktes liegt bei ca. <b className="text-red-500/50 font-bold">6-8% p.a.</b> (ohne Inflationsberücksichtigung).</span>
                                                </p>

                                                {showReturnDetails && (
                                                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                                        <h5 className="text-sm font-medium mb-2">Rendite-Aufschlüsselung:</h5>
                                                        <div className="space-y-1">
                                                            {getReturnBreakdown(results.recommendations).map((item, index) => (
                                                                <div key={index} className="flex justify-between text-xs">
                                                                    <span className="truncate mr-2">{item.name}</span>
                                                                    <span className="text-right whitespace-nowrap">
                                                                        {item.weight.toFixed(1)}% × {item.expectedReturn.toFixed(1)}% = +{item.contribution.toFixed(2)}%
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                                                            <div className="flex justify-between text-xs font-medium">
                                                                <span>Gesamt:</span>
                                                                <span>{(results.annualReturn * 100).toFixed(2)}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex justify-center">
                                            <ResponsiveContainer width={250} height={250}>
                                                <RechartsPieChart>
                                                    <Pie
                                                        data={[
                                                            { name: "Aktien", value: results.stockAllocation, color: "#3b82f6" },
                                                            { name: "Anleihen", value: results.bondAllocation, color: "#10b981" }
                                                        ]}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        dataKey="value"
                                                        label={({ value }) => `${value}%`}
                                                        labelLine={false}
                                                    >
                                                        <Cell fill="#3b82f6" />
                                                        <Cell fill="#10b981" />
                                                    </Pie>
                                                    <Tooltip />
                                                </RechartsPieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Projection Results */}
                            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5" />
                                        Prognose & Performance
                                        <Button variant="outline" size="sm" onClick={() => setShowProjection(!showProjection)} className="ml-2">
                                            {showProjection ? (<><EyeClosed className="w-4 h-4" /> Verstecken</>) : (<><Eye className="w-4 h-4" /> Anzeigen</>)}
                                        </Button>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {showProjection ? (
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-6">
                                                <Card className="border border-blue-200">
                                                    <CardHeader className="pb-3">
                                                        <CardTitle className="text-lg text-blue-700">Nach 10 Jahren</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-2">
                                                        <div className="flex justify-between">
                                                            <span>Gesamte Investition:</span>
                                                            <span className="font-bold">{formatCurrency(results.projection10Years.totalInvestment)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Prognostizierter Wert:</span>
                                                            <span className="font-bold text-green-600">{formatCurrency(results.projection10Years.futureValue)}</span>
                                                        </div>
                                                        <Separator />
                                                        <div className="flex justify-between text-lg">
                                                            <span className="font-semibold">Gesamtgewinn:</span>
                                                            <span className="font-bold text-green-600">{formatCurrency(results.projection10Years.totalProfit)}</span>
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                <Card className="border border-purple-200">
                                                    <CardHeader className="pb-3">
                                                        <CardTitle className="text-lg text-purple-700">Nach 20 Jahren</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-2">
                                                        <div className="flex justify-between">
                                                            <span>Gesamte Investition:</span>
                                                            <span className="font-bold">{formatCurrency(results.projection20Years.totalInvestment)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Prognostizierter Wert:</span>
                                                            <span className="font-bold text-green-600">{formatCurrency(results.projection20Years.futureValue)}</span>
                                                        </div>
                                                        <Separator />
                                                        <div className="flex justify-between text-lg">
                                                            <span className="font-semibold">Gesamtgewinn:</span>
                                                            <span className="font-bold text-green-600">{formatCurrency(results.projection20Years.totalProfit)}</span>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            {/* Chart */}
                                            {results.projection20Years.chartData && (
                                                <div>
                                                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                                                        <BarChart className="w-4 h-4" />
                                                        Vermögensentwicklung (15 Jahre)
                                                    </h4>
                                                    <ResponsiveContainer width="100%" height={300}>
                                                        <AreaChart data={results.projection20Years.chartData}>
                                                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                                            <XAxis
                                                                dataKey="year"
                                                                tickFormatter={(value) => `Jahr ${value}`}
                                                            />
                                                            <YAxis
                                                                tickFormatter={(value) => formatCurrency(value)}
                                                                width={80}
                                                            />
                                                            <Tooltip
                                                                formatter={(value: number, name: string) => [
                                                                    formatCurrency(value),
                                                                    name === "value" ? "Gesamtwert" :
                                                                    name === "contributions" ? "Eingezahlt" : "Gewinne"
                                                                ]}
                                                                labelFormatter={(label) => `Jahr ${label}`}
                                                            />
                                                            <Area
                                                                type="monotone"
                                                                dataKey="contributions"
                                                                stackId="1"
                                                                stroke="#6366f1"
                                                                fill="#6366f1"
                                                                fillOpacity={0.6}
                                                            />
                                                            <Area
                                                                type="monotone"
                                                                dataKey="returns"
                                                                stackId="1"
                                                                stroke="#10b981"
                                                                fill="#10b981"
                                                                fillOpacity={0.8}
                                                            />
                                                        </AreaChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            )}
                                        </div>
                                    ) : (<ChartAreaIcon className="w-10 h-10 text-gray-500 mx-auto" />)}
                                </CardContent>
                            </Card>

                            {/* ETF Recommendations Cards */}
                            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart className="w-5 h-5" />
                                        ETF-Empfehlungen
                                        {isLoadingHistorical && (
                                            <Badge variant="outline" className="ml-2">
                                                Lade historische Daten...
                                            </Badge>
                                        )}
                                    </CardTitle>
                                    <CardDescription>
                                        Basierend auf Ihrem Risikoprofil und Ihren regionalen Präferenzen
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {(() => {
                                            // Group recommendations by asset type
                                            const stockRecommendations = results.recommendations.filter(rec =>
                                                !rec.name.toLowerCase().includes("bond") && !rec.name.toLowerCase().includes("anleihe")
                                            );
                                            const bondRecommendations = results.recommendations.filter(rec =>
                                                rec.name.toLowerCase().includes("bond") || rec.name.toLowerCase().includes("anleihe")
                                            );

                                            // Further group stock recommendations
                                            const multiETFStockRecommendations = formData.experience === "expert" ? stockRecommendations : stockRecommendations.filter(rec =>
                                                !rec.name.includes("FTSE All-World") && !rec.name.includes("MSCI ACWI IMI")
                                            );
                                            const singleETFAlternatives = formData.experience === "expert" ? [] : stockRecommendations.filter(rec =>
                                                rec.name.includes("FTSE All-World") || rec.name.includes("MSCI ACWI IMI")
                                            );

                                            const renderETFCard = (rec: ETFRecommendation, index: number) => {
                                                const historical = historicalPerformance.find(h => h.ticker === rec.ticker);
                                                return (
                                                    <Card key={`${rec.name}-${index}`} className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                                                        <CardContent className="p-4">
                                                            <div className="flex justify-between items-start mb-3">
                                                                <div>
                                                                    <h4 className="font-bold text-lg">{rec.name}</h4>
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{rec.description}</p>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <Badge variant="outline">{rec.ticker}</Badge>
                                                                        {rec.isin && <Badge variant="secondary" className="text-xs">{rec.isin}</Badge>}
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="text-2xl font-bold text-blue-600">
                                                                        {(rec.weight * 100).toFixed(1)}%
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">Gewichtung</div>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                                                                <div>
                                                                    <div className="text-sm text-gray-500">TER</div>
                                                                    <div className="font-semibold">{rec.ter?.toFixed(2)}%</div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm text-gray-500">Ø Rendite</div>
                                                                    <div className="font-semibold text-green-600">
                                                                        {historical ? `${historical.annualReturn.toFixed(1)}%` :
                                                                         rec.historicalReturn ? `${rec.historicalReturn}%` : "N/A"}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm text-gray-500">Volatilität</div>
                                                                    <div className="font-semibold text-orange-600">
                                                                        {historical ? `${historical.volatility.toFixed(1)}%` :
                                                                         rec.volatility ? `${rec.volatility}%` : "N/A"}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm text-gray-500">Max Drawdown</div>
                                                                    <div className="font-semibold text-red-600">
                                                                        {historical ? `${historical.maxDrawdown.toFixed(1)}%` : "N/A"}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {rec.justEtfUrl && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="w-full"
                                                                    onClick={() => window.open(rec.justEtfUrl, "_blank")}
                                                                >
                                                                    <ExternalLink className="w-4 h-4 mr-2" />
                                                                    Auf extraETF.com anzeigen
                                                                </Button>
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                );
                                            };

                                            return (
                                                <div className="space-y-8">
                                                    {stockRecommendations.length > 0 && (
                                                        <div>
                                                            <Separator className="my-4 bg-white/40"/>
                                                            <div className="mb-6 text-center">
                                                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                                                                    Aktienmarkt-Empfehlungen
                                                                </h3>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                                                    ETFs für Ihre Aktienallokation ({results.stockAllocation}% des Portfolios)
                                                                </p>
                                                            </div>

                                                            <div className="flex flex-wrap space-x-4 divide-x divide-gray-200">
                                                                {/* Single-ETF Alternatives */}
                                                                {singleETFAlternatives.length > 0 && (
                                                                    <div className="flex-5/12 pr-4">
                                                                        <div className="mb-4">
                                                                            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                                                                {formData.experience === "beginner"
                                                                                    ? "Empfohlene Optionen"
                                                                                    : "Einfache Ein-ETF-Lösung"
                                                                                }
                                                                            </h4>
                                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                                {formData.experience === "beginner"
                                                                                    ? "Beide ETFs bieten ähnliche globale Diversifikation"
                                                                                    : "Ein ETF für weltweite Diversifikation"
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                        <div className="space-y-4">
                                                                            {singleETFAlternatives.map((rec, index) => renderETFCard(rec, index))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Multi-ETF Strategy */}
                                                                {multiETFStockRecommendations.length > 0 && (
                                                                    <div className="flex-5/12">
                                                                        <div className="mb-4">
                                                                            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                                                                {formData.experience === "beginner" ? "Alternative Ansätze" : "Multi-ETF Strategie"}
                                                                            </h4>
                                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                                Regionale eigene Aufteilung für Fortgeschrittene
                                                                            </p>
                                                                        </div>
                                                                        <div className="space-y-4">
                                                                            {multiETFStockRecommendations.map((rec, index) => renderETFCard(rec, index))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Show all stock recommendations if no grouping is needed */}
                                                            {multiETFStockRecommendations.length === 0 && singleETFAlternatives.length === 0 && (
                                                                <div className="grid gap-4">
                                                                    {stockRecommendations.map((rec, index) => renderETFCard(rec, index))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {bondRecommendations.length > 0 && (
                                                        <div>
                                                            <Separator className="my-4 bg-white/40"/>
                                                            <div className="mb-6 text-center">
                                                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                                                                    Anleihen-Empfehlungen
                                                                </h3>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                                                    ETFs für Ihre Anleihenallokation ({results.bondAllocation}% des Portfolios)
                                                                </p>
                                                            </div>
                                                            <div className="grid gap-4">
                                                                {bondRecommendations.map((rec, index) => renderETFCard(rec, index))}
                                                            </div>
                                                        </div>
                                                    )}


                                                    {stockRecommendations.length === 0 && bondRecommendations.length === 0 && (
                                                        <div className="grid gap-4">
                                                            {results.recommendations.map((rec, index) => renderETFCard(rec, index))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </CardContent>
                            </Card>

                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="p-6 bg-gray-50 dark:bg-gray-900">
                <Card className="w-full border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                            <Info className="w-5 h-5" />
                            Wichtige Hinweise
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-amber-800 dark:text-amber-300 space-y-2">
                        <p>• Die hier dargestellten Empfehlungen sind unverbindlich und stellen keine Finanzberatung dar.</p>
                        <p>• Die vergangene Performance von Finanzprodukten ist kein Indikator für zukünftige Ergebnisse.</p>
                        <p>• Diversifikation ist ein wichtiger Grundsatz der Geldanlage. Streuen Sie Ihr investiertes Kapital breit.</p>
                        <p>• Überprüfen Sie Ihre Anlagestrategie regelmäßig und passen Sie sie bei Bedarf an Ihre Lebensumstände an.</p>
                        <p>• Häufige Umschichtungen oder Anpassungen der Sparrate können die Rendite beeinflussen.</p>
                        <p>• Historische Daten werden in Echtzeit von Yahoo Finance abgerufen und können Verzögerungen aufweisen.</p>
                    </CardContent>
                </Card>
            </CardFooter>
        </Card>
    );
};

export default ETFInvestmentCalculator;
