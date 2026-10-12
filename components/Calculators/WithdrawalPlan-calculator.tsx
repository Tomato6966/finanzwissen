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
import { copyShareUrlToClipboard, getShareUrl } from "@/lib/share-utils";
import { CalculatorBanner } from "./CalculatorBanner";
import { CalculatorHeader } from "./CalculatorHeader";

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
    const handleShareConfig = async () => {
        const serialized = serializeState();
        const shareUrl = getShareUrl('withdrawal', serialized);
        const copied = await copyShareUrlToClipboard(shareUrl);
        if (copied) {
            setShareMessage("Link kopiert!");
        } else {
            setShareMessage("Kopieren fehlgeschlagen!");
        }
        setTimeout(() => setShareMessage(null), 3000);
    };


    const validationError = React.useMemo(() => {
        if (withdrawalForm.principal <= 0) return "Das Startkapital muss größer als 0 € sein.";
        if (withdrawalMode === 'fixed' && withdrawalForm.withdrawal <= 0) return "Die monatliche Entnahme muss größer als 0 € sein.";
        return null;
    }, [withdrawalForm, withdrawalMode]);

    return (
        <Card className="w-full shadow-xl rounded-2xl overflow-hidden py-0 border-border/70 dark:bg-card/90 backdrop-blur-md">
            <CalculatorHeader
                title="Entnahmeplanrechner"
                description="Berechnen Sie, wie lange Ihr Kapital bei regelmäßigen Entnahmen und stetiger Rendite reicht."
                icon={Home}
                badge="Rente & FIRE"
                shareMessage={shareMessage}
                onShare={handleShareConfig}
            />

            <div className="p-6 sm:p-7 space-y-6">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 space-y-4 rounded-xl border border-border/50 bg-card/50 dark:bg-card/30 p-4 sm:p-5">
                        <div className="space-y-1.5">
                            <Label htmlFor="principal" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Startkapital (€)</Label>
                            <Input min={0} id="principal" name="principal" type="number" value={withdrawalForm.principal} onChange={memoizedHandleFormChange} />
                        </div>
                    <div>
                        <Label htmlFor="rate">Erwartete Rendite p.a. (%)</Label>
                        <Input min={0} id="rate" name="rate" type="number" step="0.1" value={withdrawalForm.rate} onChange={memoizedHandleFormChange} />
                    </div>
                    <div>
                        <Label htmlFor="tax" className="flex items-center gap-1">Effektiver Steuersatz auf Erträge (%)
                            <TooltipWrapper content="In Deutschland ca. 25% Kapitalertragsteuer (+ Soli & ggf. Kirchensteuer), abzüglich Teilfreistellung (30% bei Aktien-ETFs). Ein effektiver Satz von 18.75% ist eine gängige Annahme. In Österreich beträgt die KESt 27.5%. Dies ist keine Steuerberatung.">
                                <HelpCircle className="w-4 h-4 text-gray-400" />
                            </TooltipWrapper>
                        </Label>
                        <Input min={0} id="tax" name="tax" type="number" step="0.1" value={withdrawalForm.tax} onChange={memoizedHandleFormChange} />
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
                            <Input min={0} id="withdrawal" name="withdrawal" type="number" value={withdrawalForm.withdrawal} onChange={memoizedHandleFormChange} />
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
                <div className="md:col-span-2 space-y-4">
                    {validationError && (
                        <CalculatorBanner
                            type="error"
                            message={validationError}
                        />
                    )}
                    {withdrawalMode === 'fixed' ? (
                        <>
                            <div className="rounded-xl border border-border/50 bg-card/40 p-4 backdrop-blur-xs">
                                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Kapitalreichweite</span>
                                <h4 className="text-xl font-bold text-foreground mt-1">
                                    Reicht für ca. <span className="text-primary font-black underline underline-offset-4">{withdrawalData.length > 0 ? withdrawalData.length - 1 : 0} Jahre</span> bei {formatCurrencyPrecise(withdrawalForm.withdrawal)} / Monat
                                </h4>
                            </div>

                            <div className="rounded-xl border border-border/60 bg-card/60 dark:bg-card/30 p-4 sm:p-5 backdrop-blur-xs">
                                <ResponsiveContainer width="100%" height={380}>
                                    <AreaChart data={withdrawalData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="withdrawalGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                                        <XAxis dataKey="year" unit=" J" tickLine={false} axisLine={{ strokeOpacity: 0.2 }} tick={{ fill: 'currentColor', opacity: 0.6, fontSize: 11 }} />
                                        <YAxis tickFormatter={(val: number) => formatCurrency(val)} width={75} tickLine={false} axisLine={{ strokeOpacity: 0.2 }} tick={{ fill: 'currentColor', opacity: 0.6, fontSize: 11 }} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(15, 23, 42, 0.92)',
                                                borderColor: 'rgba(255, 255, 255, 0.15)',
                                                borderRadius: '0.75rem',
                                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                                                color: '#fff',
                                                fontSize: '12px'
                                            }}
                                            formatter={(value) => [`${formatCurrencyPrecise(value as number)}`, "Restkapital"]}
                                        />
                                        <Area type="monotone" dataKey="balance" stroke="#ef4444" strokeWidth={2.5} fill="url(#withdrawalGradient)" name="Restkapital" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full min-h-[300px] flex flex-col justify-center items-center rounded-xl border border-border/50 bg-card/40 p-8 text-center">
                            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Nachhaltige Entnahme</span>
                            <div className="text-3xl sm:text-4xl font-extrabold text-primary my-2">
                                {formatCurrencyPrecise(calculatedWithdrawal)}
                            </div>
                            <p className="text-sm text-muted-foreground max-w-md">
                                {maxWithdrawalSettings.strategy === 'years'
                                    ? `Dieser Betrag kann monatlich über einen Zeitraum von ${maxWithdrawalSettings.years} Jahren entnommen werden, bis das Kapital verzehrt ist.`
                                    : "Dieser Betrag kann monatlich unbegrenzt entnommen werden, ohne den realen Kapitalstock anzugreifen."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            </div>

            <CardFooter className="px-6 py-4 text-xs text-muted-foreground border-t border-border/40 flex justify-between items-center bg-card/30">
                <p>
                    Hinweis: Modellrechnung unter Annahme einer gleichmäßigen Rendite. Das Sequence-of-Returns-Risiko ist hierbei nicht berücksichtigt.
                </p>
            </CardFooter>
        </Card>
    );
};
