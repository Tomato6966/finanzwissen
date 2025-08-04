import { ArrowRightCircle, BarChart2 } from "lucide-react";
import React, { useState } from "react";
import {
	CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { formatCurrency, formatCurrencyPrecise, formatPercentage } from "./tools";

interface MonteCarloPathPoint {
    x: number;
    y: number;
}

interface MonteCarloStats {
    median: number;
    p10: number;
    p90: number;
    worst: number;
    best: number;
}

interface MonteCarloForm {
    principal: number;
    time: number; // Anlagedauer
    monthlyContribution: number; // Monatlicher Sparplan
    simulations: number;
    assets: { ticker: string; weight: number; drift: number; volatility: number; }[]; // Multiple assets with weights, drift, and volatility
}

interface MonteCarloResultMetrics {
    maxDrawdown: number;
    avgAnnualReturn: number;
    sharpeRatio: number;
}

interface MonteCarloResults {
    paths: MonteCarloPathPoint[][];
    percentileMetrics: {
        p10: MonteCarloResultMetrics;
        p25: MonteCarloResultMetrics;
        p50: MonteCarloResultMetrics;
        p75: MonteCarloResultMetrics;
        p90: MonteCarloResultMetrics;
    } | null;
    overallStats: MonteCarloStats | null; // Keep overall stats for end values
}

// Mock historical data for different tickers
const mockHistoricalPrices: { [key: string]: number[] } = {
    'SPY': [150, 151, 153, 150, 155, 154, 158, 160, 159, 162, 165, 163, 168, 170, 172, 175, 173, 178, 180, 182, 185, 183, 188, 190, 192, 195, 193, 198, 200, 202, 205, 203, 208, 210, 212, 215, 213, 218, 220, 222, 225, 223, 228, 230, 232, 235, 233, 238, 240, 242, 245, 243, 248, 250, 252, 255, 253, 258, 260, 262, 265, 263, 268, 270, 272, 275, 273, 278, 280, 282, 285, 283, 288, 290, 292, 295, 293, 298, 300, 302, 305, 303, 308, 310, 312, 315, 313, 318, 320, 322, 325, 323, 328, 330, 332, 335, 333, 338, 340, 342, 345, 343, 348, 350],
    'AAPL': [100, 101, 103, 100, 105, 104, 108, 110, 109, 112, 115, 113, 118, 120, 122, 125, 123, 128, 130, 132, 135, 133, 138, 140, 142, 145, 143, 148, 150, 152, 155, 153, 158, 160, 162, 165, 163, 168, 170, 172, 175, 173, 178, 180, 182, 185, 183, 188, 190, 192, 195, 193, 198, 200, 202, 205, 203, 208, 210, 212, 215, 213, 218, 220, 222, 225, 223, 228, 230, 232, 235, 233, 238, 240, 242, 245, 243, 248, 250, 252, 255, 253, 258, 260, 262, 265, 263, 268, 270, 272, 275, 273, 278, 280, 282, 285, 283, 288, 290, 292, 295, 293, 298, 300],
    'MSFT': [200, 202, 205, 203, 208, 207, 210, 212, 211, 215, 218, 216, 220, 223, 221, 225, 228, 226, 230, 233, 231, 235, 238, 236, 240, 243, 241, 245, 248, 246, 250, 253, 251, 255, 258, 256, 260, 263, 261, 265, 268, 266, 270, 273, 271, 275, 278, 276, 280, 283, 281, 285, 288, 286, 290, 293, 291, 295, 298, 296, 300, 303, 301, 305, 308, 306, 310, 313, 311, 315, 318, 316, 320, 323, 321, 325, 328, 326, 330, 333, 331, 335, 338, 336, 340, 343, 341, 345, 348, 346, 350, 353, 351, 355, 358, 356, 360, 363, 361, 365, 368, 366, 370],
};

const RISK_FREE_RATE = 2; // Example: 2% risk-free rate for Sharpe Ratio calculation

// --- Main App Component ---
export function MontecarloSimulation() {
    const [monteCarloForm, setMonteCarloForm] = useState<MonteCarloForm>({
        principal: 10000,
        time: 20,
        monthlyContribution: 0,
        simulations: 100,
        assets: [{ ticker: 'SPY', weight: 100, drift: 0, volatility: 0 }],
    });
    const [monteCarloResults, setMonteCarloResults] = useState<MonteCarloResults>({ paths: [], percentileMetrics: null, overallStats: null });
    const [isSimulating, setIsSimulating] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [simulationProgress, setSimulationProgress] = useState<number>(0);

    // Handles changes to the main form inputs
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMonteCarloForm(prevForm => ({ ...prevForm, [name]: parseFloat(value) || value }));
    };

    // Handles changes to asset ticker or weight
    const handleAssetChange = (index: number, field: 'ticker' | 'weight', value: string) => {
        const newAssets = [...monteCarloForm.assets];
        newAssets[index] = { ...newAssets[index], [field]: field === 'weight' ? parseFloat(value) : value };
        setMonteCarloForm(prevForm => ({ ...prevForm, assets: newAssets }));
    };

    // Adds a new asset row
    const addAsset = () => {
        setMonteCarloForm(prevForm => ({
            ...prevForm,
            assets: [...prevForm.assets, { ticker: '', weight: 0, drift: 0, volatility: 0 }]
        }));
    };

    // Removes an asset row
    const removeAsset = (index: number) => {
        const newAssets = monteCarloForm.assets.filter((_, i) => i !== index);
        setMonteCarloForm(prevForm => ({ ...prevForm, assets: newAssets }));
    };

    // Simulates an API call to get historical stock data for all assets
    const fetchHistoricalData = async () => {
        setIsFetching(true);
        const updatedAssets = await Promise.all(monteCarloForm.assets.map(async (asset) => {
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

            const prices = mockHistoricalPrices[asset.ticker.toUpperCase()] || mockHistoricalPrices['SPY']; // Fallback to SPY

            if (prices.length < 2) {
                console.warn(`Not enough historical data for ${asset.ticker} to calculate drift/volatility.`);
                return { ...asset, drift: 0, volatility: 0 };
            }

            const dailyReturns = prices.slice(1).map((price, i) => (price - prices[i]) / prices[i]);

            const sumReturns = dailyReturns.reduce((sum, r) => sum + r, 0);
            const meanDailyReturn = sumReturns / dailyReturns.length;
            const annualizedDrift = meanDailyReturn * 252 * 100; // Annualize and convert to percentage

            const squaredDeviations = dailyReturns.map(r => Math.pow(r - meanDailyReturn, 2));
            const variance = squaredDeviations.reduce((sum, sd) => sum + sd, 0) / (dailyReturns.length - 1);
            const stdDevDailyReturn = Math.sqrt(variance);
            const annualizedVolatility = stdDevDailyReturn * Math.sqrt(252) * 100; // Annualize and convert to percentage

            return {
                ...asset,
                drift: parseFloat(annualizedDrift.toFixed(2)),
                volatility: parseFloat(annualizedVolatility.toFixed(2)),
            };
        }));
        setMonteCarloForm(prevForm => ({ ...prevForm, assets: updatedAssets }));
        setIsFetching(false);
    };

    // Calculates portfolio drift and volatility based on asset weights
    const calculatePortfolioMetrics = () => {
        const totalWeight = monteCarloForm.assets.reduce((sum, asset) => sum + asset.weight, 0);
        if (totalWeight === 0) return { portfolioDrift: 0, portfolioVolatility: 0 };

        let weightedDrift = 0;
        let weightedVolatility = 0; // Simplified: assuming no correlation for now

        monteCarloForm.assets.forEach(asset => {
            const normalizedWeight = asset.weight / totalWeight;
            weightedDrift += normalizedWeight * asset.drift;
            weightedVolatility += normalizedWeight * asset.volatility; // This is a simplification
        });

        return { portfolioDrift: weightedDrift, portfolioVolatility: weightedVolatility };
    };

    // Runs the Monte Carlo simulation
    const runMonteCarlo = () => {
        setIsSimulating(true);
        setSimulationProgress(0);

        const { principal, time, monthlyContribution, simulations } = monteCarloForm;
        const { portfolioDrift, portfolioVolatility } = calculatePortfolioMetrics();

        const dt = 1 / 252; // Daily time step
        const mu = portfolioDrift / 100; // Annual drift
        const sigma = portfolioVolatility / 100; // Annual volatility
        const monthlyContributionDaily = monthlyContribution / 21; // Distribute monthly contribution over ~21 trading days

        const paths: MonteCarloPathPoint[][] = [];
        const endValues: number[] = [];
        const maxDrawdowns: number[] = [];
        const annualReturns: number[] = [];
        const sharpeRatios: number[] = [];

        for (let i = 0; i < simulations; i++) {
            const path: MonteCarloPathPoint[] = [{ x: 0, y: principal }];
            let currentValue = principal;
            let peakValue = principal;
            let currentMaxDrawdown = 0;
            const dailyValues = [principal];

            for (let t = 1; t <= time * 252; t++) {
                const Z = Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
                currentValue *= Math.exp((mu - Math.pow(sigma, 2) / 2) * dt + sigma * Math.sqrt(dt) * Z);

                // Add monthly contribution distributed daily
                currentValue += monthlyContributionDaily;

                dailyValues.push(currentValue);

                // Calculate max drawdown
                peakValue = Math.max(peakValue, currentValue);
                currentMaxDrawdown = Math.max(currentMaxDrawdown, (peakValue - currentValue) / peakValue);

                if (t % 21 === 0) { // Store monthly point for plotting
                    path.push({ x: t / 252, y: currentValue });
                }
            }
            paths.push(path);
            endValues.push(currentValue);
            maxDrawdowns.push(currentMaxDrawdown * 100); // Store as percentage

            // Calculate average annual return for this path
            const totalReturn = (currentValue - principal - (monthlyContribution * time * 12)) / (principal + (monthlyContribution * time * 12));
            const avgAnnualReturn = (Math.pow(1 + totalReturn, 1 / time) - 1) * 100;
            annualReturns.push(avgAnnualReturn);

            // Calculate Sharpe Ratio for this path
            // Need daily returns for standard deviation of returns
            const pathDailyReturns = dailyValues.slice(1).map((val, idx) => (val - dailyValues[idx]) / dailyValues[idx]);
            const pathMeanDailyReturn = pathDailyReturns.reduce((sum, r) => sum + r, 0) / pathDailyReturns.length;
            const pathStdDevDailyReturn = Math.sqrt(pathDailyReturns.map(r => Math.pow(r - pathMeanDailyReturn, 2)).reduce((sum, sd) => sum + sd, 0) / (pathDailyReturns.length - 1));
            const annualizedPathStdDev = pathStdDevDailyReturn * Math.sqrt(252);
            const annualizedExcessReturn = (avgAnnualReturn / 100) - (RISK_FREE_RATE / 100);
            const sharpe = annualizedPathStdDev > 0 ? annualizedExcessReturn / annualizedPathStdDev : 0;
            sharpeRatios.push(sharpe);

            // Update progress
            if ((i + 1) % (simulations / 10) === 0 || i === simulations - 1) {
                setSimulationProgress(Math.round(((i + 1) / simulations) * 100));
            }
        }

        // Calculate overall stats for end values
        endValues.sort((a, b) => a - b);
        const overallStats: MonteCarloStats = {
            median: endValues[Math.floor(simulations / 2)],
            p10: endValues[Math.floor(simulations * 0.1)],
            p90: endValues[Math.floor(simulations * 0.9)],
            worst: endValues[0],
            best: endValues[simulations - 1],
        };

        // Calculate percentile metrics
        const getPercentile = (arr: number[], percentile: number) => {
            arr.sort((a, b) => a - b);
            const index = (percentile / 100) * (arr.length - 1);
            return arr[Math.floor(index)];
        };

        const percentileMetrics = {
            p10: {
                maxDrawdown: getPercentile(maxDrawdowns, 10),
                avgAnnualReturn: getPercentile(annualReturns, 10),
                sharpeRatio: getPercentile(sharpeRatios, 10),
            },
            p25: {
                maxDrawdown: getPercentile(maxDrawdowns, 25),
                avgAnnualReturn: getPercentile(annualReturns, 25),
                sharpeRatio: getPercentile(sharpeRatios, 25),
            },
            p50: {
                maxDrawdown: getPercentile(maxDrawdowns, 50),
                avgAnnualReturn: getPercentile(annualReturns, 50),
                sharpeRatio: getPercentile(sharpeRatios, 50),
            },
            p75: {
                maxDrawdown: getPercentile(maxDrawdowns, 75),
                avgAnnualReturn: getPercentile(annualReturns, 75),
                sharpeRatio: getPercentile(sharpeRatios, 75),
            },
            p90: {
                maxDrawdown: getPercentile(maxDrawdowns, 90),
                avgAnnualReturn: getPercentile(annualReturns, 90),
                sharpeRatio: getPercentile(sharpeRatios, 90),
            },
        };

        setMonteCarloResults({ paths, percentileMetrics, overallStats });
        setIsSimulating(false);
        setSimulationProgress(0); // Reset progress
    };

    const totalWeight = monteCarloForm.assets.reduce((sum, asset) => sum + asset.weight, 0);
    const isWeightValid = totalWeight === 100;

    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="container max-w-6xl">
                <Card className="rounded-xl shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-800">
                            <BarChart2 className="w-6 h-6 text-indigo-600" />
                            Monte-Carlo-Simulation für Portfolio
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Simulieren Sie Tausende möglicher Zukünfte für Ihr Investmentportfolio, um die Wahrscheinlichkeiten besser zu verstehen.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-8">
                        {/* Input Form */}
                        <div className="md:col-span-1 space-y-4">
                            <div><Label>Anfangskapital (€)</Label><Input name="principal" type="number" value={monteCarloForm.principal} onChange={handleFormChange} /></div>
                            <div><Label>Anlagedauer (Jahre)</Label><Input name="time" type="number" value={monteCarloForm.time} onChange={handleFormChange} /></div>
                            <div><Label>Monatlicher Sparplan (€)</Label><Input name="monthlyContribution" type="number" value={monteCarloForm.monthlyContribution} onChange={handleFormChange} /></div>
                            <div><Label>Anzahl Simulationen</Label><Input name="simulations" type="number" value={monteCarloForm.simulations} onChange={handleFormChange} /></div>

                            <h3 className="text-lg font-semibold mt-6">Portfolio-Zusammensetzung</h3>
                            {monteCarloForm.assets.map((asset, index) => (
                                <div key={index} className="flex items-end gap-2">
                                    <div className="flex-grow">
                                        <Label>Aktiensymbol</Label>
                                        <Input
                                            type="text"
                                            value={asset.ticker}
                                            onChange={(e) => handleAssetChange(index, 'ticker', e.target.value)}
                                            placeholder="z.B. SPY"
                                        />
                                    </div>
                                    <div className="w-24">
                                        <Label>Gewicht (%)</Label>
                                        <Input
                                            type="number"
                                            value={asset.weight}
                                            onChange={(e) => handleAssetChange(index, 'weight', e.target.value)}
                                        />
                                    </div>
                                    <Button variant="destructive" onClick={() => removeAsset(index)} className="mb-0.5">
                                        X
                                    </Button>
                                </div>
                            ))}
                            <Button onClick={addAsset} className="w-full mt-2">Asset hinzufügen</Button>
                            {!isWeightValid && (
                                <p className="text-red-500 text-sm mt-2">Gesamtgewicht muss 100% betragen. Aktuell: {totalWeight}%</p>
                            )}

                            <Button onClick={fetchHistoricalData} disabled={isFetching} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">
                                {isFetching ? 'Lade Daten...' : <><ArrowRightCircle className="w-4 h-4 mr-2"/>Historische Daten holen</>}
                            </Button>

                            <Button
                                onClick={runMonteCarlo}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"
                                disabled={isSimulating || !isWeightValid || monteCarloForm.assets.some(a => a.drift === 0 && a.volatility === 0)}
                            >
                                {isSimulating ? `Simuliere... (${simulationProgress}%)` : 'Simulation starten'}
                            </Button>
                        </div>

                        {/* Results & Chart */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-semibold mb-2">Simulationsergebnisse</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="x" type="number" domain={[0, monteCarloForm.time]} unit=" J" />
                                    <YAxis tickFormatter={(val: number) => formatCurrency(val)} width={80} domain={['dataMin', 'dataMax']} />
                                    <Tooltip formatter={(value: number) => formatCurrencyPrecise(value)} />
                                    {monteCarloResults.paths.map((path, i) => (
                                        <Line
                                            key={i}
                                            data={path}
                                            dataKey="y"
                                            stroke="#d1d5db"
                                            dot={false}
                                            strokeWidth={0.5}
                                            isAnimationActive={false}
                                        />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                            {monteCarloResults.overallStats && (
                                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                                    <div className="p-3 bg-red-50 rounded-lg shadow-sm"><div className="text-sm text-red-700">Schlechtester Fall</div><div className="font-bold text-lg text-red-900">{formatCurrency(monteCarloResults.overallStats.worst)}</div></div>
                                    <div className="p-3 bg-gray-100 rounded-lg shadow-sm"><div className="text-sm text-gray-700">Median (50%)</div><div className="font-bold text-lg text-gray-900">{formatCurrency(monteCarloResults.overallStats.median)}</div></div>
                                    <div className="p-3 bg-green-50 rounded-lg shadow-sm"><div className="text-sm text-green-700">Bester Fall</div><div className="font-bold text-lg text-green-900">{formatCurrency(monteCarloResults.overallStats.best)}</div></div>
                                    <div className="p-3 bg-orange-50 rounded-lg shadow-sm col-span-2 md:col-span-3">
                                        <div className="text-sm text-orange-700">Wahrscheinlicher Bereich (10% - 90% Perzentil)</div>
                                        <div className="font-bold text-lg text-orange-900">{formatCurrency(monteCarloResults.overallStats.p10)} – {formatCurrency(monteCarloResults.overallStats.p90)}</div>
                                    </div>
                                </div>
                            )}

                            {monteCarloResults.percentileMetrics && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-2">Detaillierte Portfolio-Metriken nach Perzentil</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white rounded-lg shadow-sm">
                                            <thead>
                                                <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                                                    <th className="py-3 px-6 text-left">Perzentil</th>
                                                    <th className="py-3 px-6 text-left">Max Drawdown</th>
                                                    <th className="py-3 px-6 text-left">Ø Jährliche Rendite</th>
                                                    <th className="py-3 px-6 text-left">Sharpe Ratio</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-600 text-sm font-light">
                                                {Object.entries(monteCarloResults.percentileMetrics).map(([key, metrics]) => (
                                                    <tr key={key} className="border-b border-gray-200 hover:bg-gray-100">
                                                        <td className="py-3 px-6 text-left font-medium">{key.toUpperCase()}</td>
                                                        <td className="py-3 px-6 text-left">{formatPercentage(metrics.maxDrawdown)}</td>
                                                        <td className="py-3 px-6 text-left">{formatPercentage(metrics.avgAnnualReturn)}</td>
                                                        <td className="py-3 px-6 text-left">{metrics.sharpeRatio.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-4">
                                        *Hinweis: Die Volatilität des Portfolios wird hier vereinfacht als gewichteter Durchschnitt der Einzelvolatilitäten berechnet. Eine präzisere Berechnung würde die Korrelationen zwischen den Assets berücksichtigen.
                                        <br/>
                                        **Sharpe Ratio basiert auf einer risikofreien Rate von {RISK_FREE_RATE}%.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
