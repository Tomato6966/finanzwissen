"use client"

import { HelpCircle, Home } from "lucide-react";
import LZString from "lz-string";
import React, { FC, useCallback, useEffect, useState } from "react";
import {
	Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

import { Button } from "@/components/ui/button";
import {
	Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { formatCurrency, formatCurrencyPrecise, handleFormChange, TooltipWrapper } from "./tools";

import type {
	MaxWithdrawalSettings, WithdrawalDataPoint, WithdrawalMode, WithDrawalInitialData
} from "../../lib/calculator-types";

export const WithdrawalPlanCalculator: FC<WithDrawalInitialData> = ({
    initialData
}) => {
    const [withdrawalMode, setWithdrawalMode] = useState<WithdrawalMode>('fixed');
    const [maxWithdrawalSettings, setMaxWithdrawalSettings] = useState<MaxWithdrawalSettings>({ strategy: 'endless', years: 20 });
    const [calculatedWithdrawal, setCalculatedWithdrawal] = useState<number>(0);
    const [withdrawalForm, setWithdrawalForm] = useState({ principal: 500000, withdrawal: 2000, rate: 5, tax: 18.75 });
    const [withdrawalData, setWithdrawalData] = useState<WithdrawalDataPoint[]>([]);
    const [shareMessage, setShareMessage] = useState<string | null>(null); // State for share message


    const serializeState = useCallback(() => {
        const state = {
            type: 'withdrawal',
            data: {
                withdrawalMode,
                maxWithdrawalSettings,
                withdrawalForm,
            }
        };
        const jsonString = JSON.stringify(state);
        return LZString.compressToEncodedURIComponent(jsonString);
    }, [withdrawalMode, maxWithdrawalSettings, withdrawalForm]);

    // Effect to read initial state from props on component mount
    useEffect(() => {
        if (initialData) {
            setWithdrawalMode(initialData.withdrawalMode || 'fixed');
            setMaxWithdrawalSettings(initialData.maxWithdrawalSettings || { strategy: 'endless', years: 20 });
            setWithdrawalForm(initialData.withdrawalForm || { principal: 500000, withdrawal: 2000, rate: 5, tax: 18.75 });
        }
    }, [initialData]);


    const calculateWithdrawalPlan = useCallback(() => {
        const { principal, withdrawal, rate, tax } = withdrawalForm;
        let balance = principal;
        const annualWithdrawal = withdrawal * 12;
        const data: WithdrawalDataPoint[] = [{ year: 0, balance }];
        let year = 0;
        while (balance > 0 && year < 100) {
            year++;
            const growth = balance * (rate / 100);
            const taxableGain = Math.max(0, growth - (annualWithdrawal * 0.3));
            const taxPaid = Math.max(0, taxableGain * (tax / 100));
            balance += growth - annualWithdrawal - taxPaid;
            if (balance < 0) balance = 0;
            data.push({ year, balance });
        }
        setWithdrawalData(data);
    }, [withdrawalForm]);

    useEffect(() => { calculateWithdrawalPlan(); }, [calculateWithdrawalPlan]);


    const calculateMaxWithdrawal = useCallback(() => {
        const { principal, rate } = withdrawalForm;
        const R_nominal = rate / 100;
        const R_real = R_nominal; // Assuming no inflation for this calculator as before

        let calculatedAmount = 0;
        if (withdrawalMode === 'max') {
            if (maxWithdrawalSettings.strategy === 'endless') {
                calculatedAmount = (principal * R_real / 12);
            } else {
                const n = maxWithdrawalSettings.years * 12;
                if (R_real !== 0) {
                    const monthlyRate = R_real / 12;
                    calculatedAmount = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
                } else {
                    calculatedAmount = principal / n;
                }
            }
        }
        setCalculatedWithdrawal(calculatedAmount);
    }, [withdrawalMode, maxWithdrawalSettings, withdrawalForm]);

    useEffect(() => {
        calculateMaxWithdrawal();
    }, [calculateMaxWithdrawal]);

    // eslint-disable-next-line
    const memoizedHandleFormChange = useCallback(handleFormChange(setWithdrawalForm), []);

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


    return (
        <Card className="w-full max-w-6xl shadow-xl rounded-lg overflow-hidden py-0">
            <CardHeader className="bg-primary text-primary-foreground p-6 rounded-t-lg flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-3xl font-bold flex items-center gap-4">
                        <Home /> Entnahmeplanrechner
                    </CardTitle>
                    <CardDescription className="text-primary-foreground opacity-90 text-sm mt-2">
                        Berechnen Sie, wie lange Ihr Kapital bei regelmäßigen Entnahmen reicht.
                    </CardDescription>
                </div>
                <Button onClick={handleShareConfig} className="ml-4" variant="secondary">
                    {shareMessage || "Share Config"}
                </Button>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-8 pb-6">
                <div className="md:col-span-1 space-y-4">
                    <div>
                        <Label htmlFor="principal">Startkapital (€)</Label>
                        <Input id="principal" name="principal" type="number" value={withdrawalForm.principal} onChange={memoizedHandleFormChange} />
                    </div>
                    <div>
                        <Label htmlFor="rate">Erwartete Rendite p.a. (%)</Label>
                        <Input id="rate" name="rate" type="number" step="0.1" value={withdrawalForm.rate} onChange={memoizedHandleFormChange} />
                    </div>
                    <div>
                        <Label htmlFor="tax" className="flex items-center gap-1">Effektiver Steuersatz auf Erträge (%)
                            <TooltipWrapper content="In Deutschland ca. 25% Kapitalertragsteuer (+ Soli & ggf. Kirchensteuer), abzüglich Teilfreistellung (30% bei Aktien-ETFs). Ein effektiver Satz von 18.75% ist eine gängige Annahme. In Österreich beträgt die KESt 27.5%. Dies ist keine Steuerberatung.">
                                <HelpCircle className="w-4 h-4 text-gray-400" />
                            </TooltipWrapper>
                        </Label>
                        <Input id="tax" name="tax" type="number" step="0.1" value={withdrawalForm.tax} onChange={memoizedHandleFormChange} />
                    </div>

                    <div className="flex items-center justify-between p-2 border-t mt-4 pt-4">
                        <Label htmlFor="withdrawalMode">Entnahme-Strategie</Label>
                        <div className="flex items-center gap-2">
                            <span className={withdrawalMode === 'fixed' ? 'font-semibold' : ''}>Fixe Summe</span>
                            <Switch
                                id="withdrawalMode"
                                checked={withdrawalMode === 'max'}
                                onCheckedChange={() => setWithdrawalMode(withdrawalMode === 'fixed' ? 'max' : 'fixed')}
                            />
                            <span className={withdrawalMode === 'max' ? 'font-semibold' : ''}>Maximale Entnahme</span>
                        </div>
                    </div>

                    {withdrawalMode === 'fixed' ? (
                        <div>
                            <Label htmlFor="withdrawal">Monatliche Entnahme (€)</Label>
                            <Input id="withdrawal" name="withdrawal" type="number" value={withdrawalForm.withdrawal} onChange={memoizedHandleFormChange} />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="consumptionStrategy">Kapitalverbrauch bis...</Label>
                                <div className="flex items-center gap-2">
                                    <span className={maxWithdrawalSettings.strategy === 'years' ? 'font-semibold' : ''}>Jahren</span>
                                    <Switch
                                        id="consumptionStrategy"
                                        checked={maxWithdrawalSettings.strategy === 'endless'}
                                        onCheckedChange={() => setMaxWithdrawalSettings({ ...maxWithdrawalSettings, strategy: maxWithdrawalSettings.strategy === 'years' ? 'endless' : 'years' })}
                                    />
                                    <span className={maxWithdrawalSettings.strategy === 'endless' ? 'font-semibold' : ''}>Endlos</span>
                                </div>
                            </div>
                            {maxWithdrawalSettings.strategy === 'years' && (
                                <div>
                                    <Label htmlFor="consumptionYears">Anzahl der Jahre</Label>
                                    <Input
                                        id="consumptionYears"
                                        name="consumptionYears"
                                        type="number"
                                        value={maxWithdrawalSettings.years}
                                        onChange={(e) => setMaxWithdrawalSettings({ ...maxWithdrawalSettings, years: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                            )}
                            <div className="p-2 border rounded-md">
                                <p className="text-sm text-gray-500">
                                    {maxWithdrawalSettings.strategy === 'years' ?
                                        `Maximale monatliche Entnahme für ${maxWithdrawalSettings.years} Jahre:` :
                                        'Maximale monatliche Entnahme (endlos):'
                                    }
                                </p>
                                <p className="font-bold text-lg">{formatCurrencyPrecise(calculatedWithdrawal)}</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="md:col-span-2">
                    {withdrawalMode === 'fixed' ? (<>
                        <h4 className="font-semibold mb-4">
                            Kapital von {formatCurrencyPrecise(withdrawalForm.principal)} reicht für ca. <u>{withdrawalData.length > 0 ? withdrawalData.length - 1 : 0} Jahre</u>, wenn monatlich netto {formatCurrencyPrecise(withdrawalForm.withdrawal)} ({formatCurrency(withdrawalForm.withdrawal * (1 + withdrawalForm.tax / 100))} brutto) entnommen wird
                        </h4>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={withdrawalData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" unit=" J" />
                                <YAxis tickFormatter={(val: number) => formatCurrency(val)} width={"auto"} />
                                <Tooltip formatter={(value: number) => formatCurrencyPrecise(value)} />
                                <Area type="monotone" dataKey="balance" stroke="#ef4444" fill="#fecaca" name="Restkapital" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </>)
                        : (<div className="w-full h-full flex justify-center items-center">
                            <h4 className="font-semibold mb-4 bg-blue-500 p-10 rounded-md">
                                Kapitalverlauf mit max. Entnahme von {formatCurrencyPrecise(calculatedWithdrawal)} / Monat
                            </h4>
                        </div>)}

                </div>
            </CardContent>
            <CardFooter className="p-6 text-sm text-gray-500 flex justify-between items-center">
                <p>
                    Hinweis: Dies ist ein Modell, keine Garantie. Die tatsächliche Rendite kann von der hier angegebenen Schätzung abweichen.
                </p>
            </CardFooter>
        </Card>
    );
};
