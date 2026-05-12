"use client"

import { ArrowRightCircle, BarChart2, X } from "lucide-react";
import LZString from "lz-string";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

import { Button } from "@/components/ui/button";
import {
	Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MonteCarloData, MonteCarloForm, MonteCarloResults } from "@/lib/calculator-types";
import {
	Asset as YahooAsset, EQUITY_TYPES, getHistoricalData, searchAssets
} from "@/lib/yahoofinanceService";

import { formatCurrency, formatCurrencyPrecise, formatPercentage } from "./tools";

const RISK_FREE_RATE = 2; // Example: 2% risk-free rate for Sharpe Ratio calculation
const MAX_DISPLAY_PATHS = 15; // Maximum number of paths to display in the chart

interface MonteCarloSimulationProps {
    initialData: MonteCarloData | null;
}

export function MontecarloSimulation({ initialData }: MonteCarloSimulationProps) {
    const [monteCarloForm, setMonteCarloForm] = useState<MonteCarloForm>({
        principal: 10000,
        time: 20,
        monthlyContribution: 0,
        simulations: 100,
        assets: [{ ticker: 'SPY', name: 'SPDR S&P 500 ETF Trust', weight: 100, drift: 0, volatility: 0 }],
    });
    const [monteCarloResults, setMonteCarloResults] = useState<MonteCarloResults>({ paths: [], percentileMetrics: null, overallStats: null, totalContributions: 0 });
    const [isSimulating, setIsSimulating] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [simulationProgress, setSimulationProgress] = useState<number>(0);
    const [searchResults, setSearchResults] = useState<YahooAsset[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeSearchIndex, setActiveSearchIndex] = useState<number | null>(null);
    const [shareMessage, setShareMessage] = useState<string | null>(null);


    const workerRef = useRef<Worker>(null);

    const serializeState = useCallback(() => {
        const cloned = structuredClone(monteCarloForm);
        cloned.assets = cloned.assets.map(a => ({ ticker: a.ticker, name: a.name, weight: a.weight, drift: 0, volatility: 0 }))
        const state = {
            type: 'montecarlo',
            data: {
                monteCarloForm: cloned,
            }
        };
        const jsonString = JSON.stringify(state);
        return LZString.compressToEncodedURIComponent(jsonString);
    }, [monteCarloForm]);

    useEffect(() => {
        if (initialData) {
            setMonteCarloForm(initialData.monteCarloForm || {
                principal: 10000,
                time: 20,
                monthlyContribution: 0,
                simulations: 100,
                assets: [{ ticker: 'SPY', name: 'SPDR S&P 500 ETF Trust', weight: 100, drift: 0, volatility: 0 }],
            });
            setMonteCarloResults({ paths: [], percentileMetrics: null, overallStats: null, totalContributions: 0 });
        }
    }, [initialData]);


    // Initialize and clean up the Web Worker
    useEffect(() => {
        workerRef.current = new Worker(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/workers/montecarlo.worker.js`);

        workerRef.current.onmessage = (e) => {
            if (e.data.type === 'progress') {
                setSimulationProgress(e.data.progress);
            } else if (e.data.type === 'result') {
                setMonteCarloResults(e.data);
                setIsSimulating(false);
                setSimulationProgress(0); // Reset progress
            }
        };

        workerRef.current.onerror = (error) => {
            console.error("Web Worker error:", error);
            setIsSimulating(false);
            setSimulationProgress(0);
        };

        return () => {
            workerRef.current?.terminate(); // Terminate worker on component unmount
        };
    }, []); // Empty dependency array means this runs once on mount and cleanup on unmount


    // Handle share config button click
    const handleShareConfig = () => {
        const serialized = serializeState();
        const shareUrl = `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH || ''}/calculators?share=${serialized}`;
        try {
            document.execCommand('copy'); // Fallback for older browsers
            navigator.clipboard.writeText(shareUrl).then(() => {
                setShareMessage("Link kopiert!");
                setTimeout(() => setShareMessage(null), 3000);
            }).catch(() => {
                // Fallback if writeText fails (e.g., not in secure context or permissions)
                const textarea = document.createElement('textarea');
                textarea.value = shareUrl;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                setShareMessage("Link kopiert! (Fallback)");
                setTimeout(() => setShareMessage(null), 3000);
            });
        } catch (err) {
            console.error('Failed to copy text: ', err);
            setShareMessage("Kopieren fehlgeschlagen!");
            setTimeout(() => setShareMessage(null), 3000);
        }
    };


    // Handles changes to the main form inputs
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMonteCarloForm(prevForm => ({ ...prevForm, [name]: parseFloat(value) || value }));
    };

    // Handles changes to asset ticker or weight
    const handleAssetChange = (index: number, field: 'ticker' | 'weight' | 'name', value: string | number) => {
        const newAssets = [...monteCarloForm.assets];
        if (field === 'ticker') {
            newAssets[index] = { ...newAssets[index], ticker: value as string, name: '' }; // Clear name when ticker changes
            setSearchQuery(value as string); // Update search query
            setActiveSearchIndex(index); // Set active search index
            handleSearch(value as string); // Trigger search
        } else if (field === 'weight') {
            newAssets[index] = { ...newAssets[index], weight: value as number };
        } else if (field === 'name') {
            newAssets[index] = { ...newAssets[index], name: value as string };
        }
        setMonteCarloForm(prevForm => ({ ...prevForm, assets: newAssets }));
    };

    // Selects an asset from search results
    const selectAssetFromSearch = (index: number, asset: YahooAsset) => {
        const newAssets = [...monteCarloForm.assets];
        newAssets[index] = { ...newAssets[index], ticker: asset.symbol, name: asset.name };
        setMonteCarloForm(prevForm => ({ ...prevForm, assets: newAssets }));
        setSearchResults([]); // Clear search results
        setSearchQuery(''); // Clear search query
        setActiveSearchIndex(null); // Clear active search index
    };

    // Adds a new asset row
    const addAsset = () => {
        setMonteCarloForm(prevForm => ({
            ...prevForm,
            assets: [...prevForm.assets, { ticker: '', name: '', weight: 0, drift: 0, volatility: 0 }]
        }));
    };

    // Removes an asset row
    const removeAsset = (index: number) => {
        const newAssets = monteCarloForm.assets.filter((_, i) => i !== index);
        setMonteCarloForm(prevForm => ({ ...prevForm, assets: newAssets }));
        if (activeSearchIndex === index) { // If the removed asset was the one being searched for
            setSearchResults([]);
            setSearchQuery('');
            setActiveSearchIndex(null);
        }
    };

    // Handles ticker search
    const handleSearch = async (query: string) => {
        if (query.length < 2) { // Only search if query is at least 2 characters
            setSearchResults([]);
            return;
        }
        try {
            const results = await searchAssets(query, EQUITY_TYPES["Etf or Stock"]); // Search for stocks and ETFs
            setSearchResults(results);
        } catch (error) {
            console.error("Error during asset search:", error);
            setSearchResults([]);
        }
    };

    // Fetches historical data for all assets using Yahoo Finance API
    const fetchHistoricalData = async () => {
        setIsFetching(true);
        const endDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(endDate.getFullYear() - 5); // Get last 5 years of data for calculation

        const updatedAssets = await Promise.all(monteCarloForm.assets.map(async (asset) => {
            if (!asset.ticker) {
                console.warn(`Skipping historical data fetch for asset with no ticker.`);
                return { ...asset, drift: 0, volatility: 0 };
            }
            try {
                const data = await getHistoricalData(asset.ticker, startDate, endDate, "1d");
                const prices = Array.from(data.historicalData.values());

                if (prices.length < 2) {
                    console.warn(`Not enough historical data for ${asset.ticker} to calculate drift/volatility.`);
                    return { ...asset, drift: 0, volatility: 0 };
                }

                // Calculate daily returns
                const dailyReturns = prices.slice(1).map((price, i) => (price - prices[i]) / prices[i]);

                // Calculate mean daily return (drift)
                const sumReturns = dailyReturns.reduce((sum, r) => sum + r, 0);
                const meanDailyReturn = sumReturns / dailyReturns.length;
                const annualizedDrift = meanDailyReturn * 252 * 100; // Annualize and convert to percentage

                // Calculate standard deviation of daily returns (volatility)
                const squaredDeviations = dailyReturns.map(r => Math.pow(r - meanDailyReturn, 2));
                const variance = squaredDeviations.reduce((sum, sd) => sum + sd, 0) / (dailyReturns.length - 1);
                const stdDevDailyReturn = Math.sqrt(variance);
                const annualizedVolatility = stdDevDailyReturn * Math.sqrt(252) * 100; // Annualize and convert to percentage

                return {
                    ...asset,
                    drift: parseFloat(annualizedDrift.toFixed(2)),
                    volatility: parseFloat(annualizedVolatility.toFixed(2)),
                    name: data.longName || asset.name // Update name if available from API
                };
            } catch (error) {
                console.error(`Error fetching data for ${asset.ticker}:`, error);
                return { ...asset, drift: 0, volatility: 0 }; // Reset if error
            }
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

    // Runs the Monte Carlo simulation using the Web Worker
    const runMonteCarlo = () => {
        if (!workerRef.current) {
            console.error("Web Worker not initialized.");
            return;
        }

        setIsSimulating(true);
        setSimulationProgress(0);
        setMonteCarloResults({ paths: [], percentileMetrics: null, overallStats: null, totalContributions: 0 }); // Clear previous results

        const { principal, time, monthlyContribution, simulations } = monteCarloForm;
        const { portfolioDrift, portfolioVolatility } = calculatePortfolioMetrics();

        // Post the simulation parameters to the worker
        workerRef.current.postMessage({
            principal: Number(principal),
            time: Number(time),
            monthlyContribution: Number(monthlyContribution),
            simulations: Number(simulations),
            portfolioDrift: portfolioDrift,
            portfolioVolatility: portfolioVolatility,
            RISK_FREE_RATE: RISK_FREE_RATE,
            MAX_DISPLAY_PATHS: MAX_DISPLAY_PATHS // Pass the new constant to the worker
        });
    };

    const totalWeight = monteCarloForm.assets.reduce((sum, asset) => sum + asset.weight, 0);
    const isWeightValid = totalWeight === 100;

    return (
        <Card className="w-full max-w-6xl shadow-xl rounded-lg overflow-hidden py-0 dark:bg-card">
            <CardHeader className="bg-primary text-primary-foreground p-6 rounded-t-lg flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-3xl font-bold flex items-center gap-4">
                        <BarChart2 /> Monte-Carlo-Simulation für Portfolio
                    </CardTitle>
                    <CardDescription className="text-primary-foreground opacity-90 text-sm mt-2">
                        Simulieren Sie Tausende möglicher Zukünfte für Ihr Investmentportfolio, um die Wahrscheinlichkeiten besser zu verstehen.
                        <p className="text-xs italic text-primary-foreground opacity-90 mt-2 ml-4">
                            Hinweis: Die Simulation ist browser optimiert. Eine richtige MC-Simulation braucht 10000-50000 Simulationsiterationen. <br />
                            Dafür kann man ein dediziertes PYTHON tool auf windows/linux/mac nutzen, hier eine Repository dafür: <a href="https://github.com/Tomato6966/python-monte-carlo-simulation" target="_blank" className="text-orange-300 hover:text-orange-500 opacity-90">python-monte-carlo-simulation</a>
                        </p>
                    </CardDescription>
                </div>
                <Button onClick={handleShareConfig} className="ml-4" variant="secondary">
                    {shareMessage || "Share Config"}
                </Button>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-8">
                {/* Input Form */}
                <div className="md:col-span-1 space-y-4">
                    <div><Label>Anfangskapital (€)</Label><Input min={0} name="principal" type="number" value={monteCarloForm.principal} onChange={handleFormChange} /></div>
                    <div><Label>Anlagedauer (Jahre)</Label><Input min={0} name="time" type="number" value={monteCarloForm.time} onChange={handleFormChange} /></div>
                    <div><Label>Monatlicher Sparplan (€)</Label><Input min={0} name="monthlyContribution" type="number" value={monteCarloForm.monthlyContribution} onChange={handleFormChange} /></div>
                    <div><Label>Anzahl Simulationen</Label><Input max={150} min={MAX_DISPLAY_PATHS} name="simulations" type="number" value={monteCarloForm.simulations} onChange={handleFormChange} /></div>

                    <h3 className="text-lg font-semibold mt-6">Portfolio-Zusammensetzung</h3>
                    {monteCarloForm.assets.map((asset, index) => (
                        <div key={index} className="relative flex flex-wrap items-end gap-2 mb-4 p-2 border rounded-md bg-muted">
                            <div className="flex-1">
                                <Label>Aktiensymbol / Name</Label>
                                <Input
                                    type="text"
                                    value={activeSearchIndex === index ? searchQuery : asset.ticker || asset.name}
                                    onChange={(e) => handleAssetChange(index, 'ticker', e.target.value)}
                                    placeholder="z.B. SPY oder Apple"
                                    onFocus={() => setActiveSearchIndex(index)}
                                    onBlur={() => setTimeout(() => setActiveSearchIndex(null), 100)} // Delay to allow click on search results
                                />
                                {activeSearchIndex === index && searchResults.length > 0 && (
                                    <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                                        {searchResults.map((result) => (
                                            <li
                                                key={result.symbol}
                                                className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                                                onMouseDown={() => selectAssetFromSearch(index, result)} // Use onMouseDown to prevent blur before click
                                            >
                                                <span>{result.symbol} - {result.name}</span>
                                                <span className="text-xs text-gray-500">{result.quoteType}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="w-24">
                                <Label>Gewicht (%)</Label>
                                <Input
                                    type="number"
                                    value={asset.weight}
                                    onChange={(e) => handleAssetChange(index, 'weight', Number(e.target.value))}
                                />
                            </div>
                            <Button variant="destructive" onClick={() => removeAsset(index)} className="mb-0.5 p-2 h-auto">
                                <X className="w-4 h-4" />
                            </Button>
                            {asset.ticker && (asset.drift !== 0 || asset.volatility !== 0) && (
                                <div className="top-1 right-12 text-xs text-gray-500">
                                    Rendite: {asset.drift.toFixed(2)}% | Vol: {asset.volatility.toFixed(2)}%
                                </div>
                            )}
                        </div>
                    ))}
                    <Button onClick={addAsset} className="w-full mt-2">Asset hinzufügen</Button>
                    {!isWeightValid && (
                        <p className="text-red-500 text-sm mt-2">Gesamtgewicht muss 100% betragen. Aktuell: {totalWeight}%</p>
                    )}

                    <Button onClick={fetchHistoricalData} disabled={isFetching} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">
                        {isFetching ? 'Lade Daten...' : <><ArrowRightCircle className="w-4 h-4 mr-2" />Historische Daten holen</>}
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
                    <span className="text-xs text-muted-foreground italic">(Es werden nur {MAX_DISPLAY_PATHS} Varianten angezeigt, aus performance gründen)</span>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis width="auto" dataKey="x" type="number" domain={[0, monteCarloForm.time]} unit=" J" />
                            <YAxis width="auto" tickFormatter={(val: number) => formatCurrency(val)} domain={['dataMin', 'dataMax']} />
                            <Tooltip formatter={(value) => formatCurrencyPrecise(value as number)} />
                            {/* Render only the selected paths */}
                            {monteCarloResults.paths.map((path, i) => (
                                <Line
                                    key={i}
                                    data={path}
                                    dataKey="y"
                                    stroke="#cad5e2"
                                    dot={false}
                                    strokeWidth={0.5}
                                    isAnimationActive={false}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                    {monteCarloResults.overallStats && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                            <div className="p-3 bg-red-50 rounded-lg shadow-sm"><div className="text-sm text-red-700">Schlechtester Fall</div>
                                <div className="flex flex-wrap font-bold text-lg text-red-900 justify-center">
                                    {formatCurrency(monteCarloResults.overallStats.worst)}
                                    <span className="text-xs opacity-50 w-full">
                                        ({monteCarloResults.overallStats.worst < monteCarloResults.totalContributions ? "-" : "+"} {formatPercentage((monteCarloResults.overallStats.worst / monteCarloResults.totalContributions - 1) * 100)})
                                    </span>
                                </div>
                            </div>
                            <div className="p-3 bg-gray-100 rounded-lg shadow-sm"><div className="text-sm text-gray-700">Median (50%)</div>
                                <div className="flex flex-wrap font-bold text-lg text-gray-900 justify-center">
                                    {formatCurrency(monteCarloResults.overallStats.median)}
                                    <span className="text-xs opacity-50 w-full">
                                        ({monteCarloResults.overallStats.median < monteCarloResults.totalContributions ? "-" : "+"} {formatPercentage((monteCarloResults.overallStats.median / monteCarloResults.totalContributions - 1) * 100)})
                                    </span>
                                </div>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg shadow-sm"><div className="text-sm text-green-700">Bester Fall</div>
                                <div className="flex flex-wrap font-bold text-lg text-green-900 justify-center">
                                    {formatCurrency(monteCarloResults.overallStats.best)}
                                    <span className="text-xs opacity-50 w-full">
                                        ({monteCarloResults.overallStats.best < monteCarloResults.totalContributions ? "-" : "+"} {formatPercentage((monteCarloResults.overallStats.best / monteCarloResults.totalContributions - 1) * 100)})
                                    </span>
                                </div>
                            </div>
                            <div className="p-3 bg-orange-50 rounded-lg shadow-sm col-span-2 md:col-span-3">
                                <div className="text-sm text-orange-700">Wahrscheinlicher Bereich (10% - 90% Perzentil)</div>
                                <div className="font-bold text-lg text-orange-900">{formatCurrency(monteCarloResults.overallStats.p10)} – {formatCurrency(monteCarloResults.overallStats.p90)}</div>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg shadow-sm col-span-2 md:col-span-3">
                                <div className="text-sm text-blue-700">Gesamte Einzahlungen</div>
                                <div className="font-bold text-lg text-blue-900">{formatCurrency(monteCarloResults.totalContributions)}</div>
                            </div>
                        </div>
                    )}

                    {monteCarloResults.percentileMetrics && (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-2">Detaillierte Portfolio-Metriken nach Perzentil</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-card rounded-lg shadow-sm">
                                    <thead>
                                        <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                                            <th className="py-3 px-6 text-left">Perzentil</th>
                                            <th className="py-3 px-6 text-left">Max Drawdown</th>
                                            <th className="py-3 px-6 text-left">Ø Jährliche Rendite</th>
                                            <th className="py-3 px-6 text-left">Sharpe Ratio</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-muted-foreground text-sm font-light">
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
                            <p className="text-sm text-muted-foreground mt-4">
                                *Hinweis: Die Volatilität des Portfolios wird hier vereinfacht als gewichteter Durchschnitt der Einzelvolatilitäten berechnet. Eine präzisere Berechnung würde die Korrelationen zwischen den Assets berücksichtigen.
                                <br />
                                **Sharpe Ratio basiert auf einer risikofreien Rate von {RISK_FREE_RATE}%.
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="p-6 text-sm text-muted-foreground flex justify-between items-center">
                <p>
                    Hinweis: Dies ist ein Modell, keine Garantie. Die tatsächliche Rendite kann von der hier angegebenen Schätzung abweichen.
                </p>
            </CardFooter>
        </Card>
    );
}
