"use client"
import { CalculatorBanner } from "./CalculatorBanner";
import { CalculatorHeader } from "./CalculatorHeader";

import {  AlertCircle, Calendar, Target, Trash , PiggyBank } from "lucide-react";
import LZString from "lz-string";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
	Area, AreaChart, CartesianGrid, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

import { Button } from "@/components/ui/button";
import {
	Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Switch } from "../ui/switch";
import { formatCurrency, formatCurrencyPrecise, handleFormChange } from "./tools";
import { copyShareUrlToClipboard, getShareUrl } from "@/lib/share-utils";

interface Goal {
    id: number;
    title: string;
    value: number;
}

interface GoalForm {
    principal: number;
    contribution: number;
    rate: number;
}

interface GoalData {
    timeline: { month: number; balance: number }[];
    reached: { id: number; title: string; value: number; months: number; date: string }[];
    unreachable: Goal[];
}

interface FinancialGoalsCalculatorProps {
    initialData: { showGoalLines: boolean, goals: Goal[], goalForm: GoalForm } | null;
}

// Main function to calculate future value and goal timelines
const calculateFutureValue = (form: GoalForm, goals: Goal[]): GoalData => {
    const { principal, contribution, rate } = form;
    const monthlyRate = rate / 100 / 12; // Annual rate to monthly rate
    let balance = principal;
    const timeline = [];
    const reached: GoalData['reached'] = [];

    // Sort goals by value to check them sequentially, making the loop more efficient
    const sortedGoals = [...goals].sort((a, b) => a.value - b.value);

    let nextGoalIndex = 0;

    // Simulate for up to 50 years (600 months)
    for (let month = 0; month <= 600; month++) {
        balance = balance * (1 + monthlyRate) + contribution;
        timeline.push({ month, balance });

        // Check for the next goal in the sorted list
        if (nextGoalIndex < sortedGoals.length) {
            const currentGoal = sortedGoals[nextGoalIndex];
            if (balance >= currentGoal.value && currentGoal.value > 0) {
                // Calculate the exact date the goal is reached
                const futureDate = new Date();
                futureDate.setMonth(futureDate.getMonth() + month);
                const formatter = new Intl.DateTimeFormat('de-DE', { year: 'numeric', month: 'long' });

                reached.push({
                    id: currentGoal.id,
                    title: currentGoal.title,
                    value: currentGoal.value,
                    months: month,
                    date: formatter.format(futureDate),
                });
                nextGoalIndex++; // Move to the next goal
            }
        }
    }

    // Any remaining goals are unreachable
    const unreachable = sortedGoals.slice(nextGoalIndex);

    return {
        timeline,
        reached,
        unreachable,
    };
};

export const FinancialGoalsCalculator: FC<FinancialGoalsCalculatorProps> = ({
    initialData,
}) => {
    // Initial state for form inputs
    const [goalForm, setGoalForm] = useState<GoalForm>({
        principal: 1000,
        contribution: 100,
        rate: 5,
    });

    const [goals, setGoals] = useState<Goal[]>([
        { id: 1, title: 'Neues Auto', value: 20000 },
        { id: 2, title: 'Urlaubskasse', value: 5000 },
        { id: 3, title: 'Haus Anzahlung', value: 50000 },
    ]);

    const [showGoalLines, setShowGoalLines] = useState(true);
    const [shareMessage, setShareMessage] = useState<string | null>(null);


    const serializeState = useCallback(() => {
        const state = {
            type: 'goals',
            data: {
                goalForm,
                goals,
                showGoalLines,
            }
        };
        const jsonString = JSON.stringify(state);
        return LZString.compressToEncodedURIComponent(jsonString);
    }, [goalForm, goals, showGoalLines]);

    // Effect to read initial state from props
    useEffect(() => {
        if (initialData) {
            setGoalForm(initialData.goalForm || { principal: 1000, contribution: 100, rate: 5 });
            setGoals(initialData.goals || [{ id: 1, title: 'Neues Auto', value: 20000 }]);
            setShowGoalLines(initialData.showGoalLines ?? true);
        }
    }, [initialData]);

    // Memoize the calculation for performance
    const goalData = useMemo(() => {
        return calculateFutureValue(goalForm, goals);
    }, [goalForm, goals]);

    // eslint-disable-next-line
    const memoizedHandleFormChange = useCallback(handleFormChange(setGoalForm), []);

    // Handle share config button click
    const handleShareConfig = async () => {
        const serialized = serializeState();
        const shareUrl = getShareUrl('goals', serialized);
        const copied = await copyShareUrlToClipboard(shareUrl);
        if (copied) {
            setShareMessage("Link kopiert!");
        } else {
            setShareMessage("Kopieren fehlgeschlagen!");
        }
        setTimeout(() => setShareMessage(null), 3000);
    };

    // Handler for updating individual goal properties
    const handleGoalChange = (index: number, field: keyof Omit<Goal, 'id'>, value: string) => {
        const newGoals = [...goals];
        // Parse the value as a float for the 'value' field, otherwise keep as string
        if (field === 'value') {
            newGoals[index][field] = parseFloat(value) || 0;
        } else {
            newGoals[index][field] = value;
        }
        setGoals(newGoals);
    };

    // Handler to remove a goal
    const removeGoal = (id: number) => {
        setGoals(goals.filter(g => g.id !== id));
    };

    // Handler to add a new goal
    const addGoal = () => {
        setGoals([...goals, { id: Date.now(), title: '', value: 0 }]);
    };

    const validationError = useMemo(() => {
        if (goalForm.principal < 0) return "Das Startkapital darf nicht negativ sein.";
        if (goalForm.contribution <= 0 && goalForm.principal <= 0) return "Bitte geben Sie ein Startkapital oder eine monatliche Sparrate an.";
        if (goalData.unreachable.length > 0) return `Hinweis: ${goalData.unreachable.length} Ziel(e) können mit der aktuellen Sparrate nicht innerhalb von 50 Jahren erreicht werden.`;
        return null;
    }, [goalForm, goalData.unreachable]);

    return (
        <Card className="w-full shadow-xl rounded-2xl overflow-hidden py-0 border-border/70 dark:bg-card/90 backdrop-blur-md">
            <CalculatorHeader
                title="Sparzielrechner"
                description="Berechnen Sie, wie lange Sie sparen müssen oder welche Sparrate nötig ist, um Ihre finanziellen Ziele zu erreichen."
                icon={PiggyBank}
                badge="Vermögen"
                shareMessage={shareMessage}
                onShare={handleShareConfig}
            />

            <div className="p-6 sm:p-7 space-y-6">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Picker-Maske (Left Column) */}
                    <div className="md:col-span-1 space-y-5 rounded-xl border border-border/50 bg-card/50 dark:bg-card/30 p-4 sm:p-5">
                        <div className="border-b border-border/40 pb-3">
                            <h3 className="text-base font-semibold text-foreground">
                                Sparparameter
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Definieren Sie Ihr Budget und Ihre Sparziele.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="principal" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Startkapital (€)</Label>
                                <Input min={0} id="principal" name="principal" type="number" value={goalForm.principal} onChange={memoizedHandleFormChange} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="contribution" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Monatliche Sparrate (€)</Label>
                                <Input min={0} id="contribution" name="contribution" type="number" value={goalForm.contribution} onChange={memoizedHandleFormChange} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="rate" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Erwartete Rendite p.a. (%)</Label>
                                <Input min={0} id="rate" name="rate" type="number" step="0.1" value={goalForm.rate} onChange={memoizedHandleFormChange} />
                            </div>
                        </div>

                        {/* Goal Management Section */}
                        <div className="space-y-3 pt-3 border-t border-border/40">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ihre Sparziele</Label>
                                <span className="text-xs text-primary font-bold">{goals.length} {goals.length === 1 ? 'Ziel' : 'Ziele'}</span>
                            </div>

                            <div className="space-y-2.5">
                                {goals.map((goal, index) => (
                                    <div key={goal.id} className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/50 p-2">
                                        <Input
                                            value={goal.title}
                                            onChange={(e) => handleGoalChange(index, 'title', e.target.value)}
                                            placeholder="Titel"
                                            className="h-8 text-xs flex-1"
                                        />
                                        <Input
                                            type="number"
                                            value={goal.value}
                                            onChange={(e) => handleGoalChange(index, 'value', e.target.value)}
                                            placeholder="Wert (€)"
                                            className="h-8 text-xs w-24"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeGoal(goal.id)}
                                            className="h-8 w-8 text-destructive hover:text-destructive/80 shrink-0"
                                            title="Ziel löschen"
                                        >
                                            <Trash size={14} />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <Button onClick={addGoal} variant="outline" size="sm" className="w-full text-xs font-semibold border-dashed">
                                + Weiteres Ziel hinzufügen
                            </Button>
                        </div>
                    </div>

                    {/* Visualisierung-Maske (Right Column) */}
                    <div className="md:col-span-2 space-y-4">
                        {validationError && (
                            <CalculatorBanner
                                type={validationError.startsWith("Hinweis") ? "warning" : "error"}
                                message={validationError}
                            />
                        )}

                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 rounded-xl border border-border/50 bg-card/40 p-4 backdrop-blur-xs">
                            <div>
                                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Fortschritt</span>
                                <h4 className="text-xl font-bold text-foreground mt-0.5">
                                    <span className="text-primary font-extrabold">{goalData.reached.length}</span> von {goals.length} Zielen erreicht
                                </h4>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="goal-lines-toggle"
                                    checked={showGoalLines}
                                    onCheckedChange={setShowGoalLines}
                                />
                                <Label htmlFor="goal-lines-toggle" className="text-xs cursor-pointer font-medium">Ziellinien anzeigen</Label>
                            </div>
                        </div>

                        <div className="rounded-xl border border-border/60 bg-card/60 dark:bg-card/30 p-4 sm:p-5 backdrop-blur-xs">
                            <ResponsiveContainer width="100%" height={380}>
                                <AreaChart data={goalData.timeline} margin={{ top: 15, right: 15, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="goalsGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#0284c7" stopOpacity={0.02}/>
                                        </linearGradient>
                                        <filter id="bubble-glow" x="-50%" y="-50%" width="200%" height="200%">
                                            <feDropShadow dx={0} dy={2} stdDeviation={4} floodColor="#15803d" floodOpacity={0.35} />
                                        </filter>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                                    <XAxis
                                        dataKey="month"
                                        tickFormatter={(val: number) => `${(val / 12).toFixed(0)}J`}
                                        stroke="currentColor"
                                        className="text-xs opacity-60"
                                    />
                                    <YAxis
                                        tickFormatter={(val: number) => formatCurrency(val)}
                                        width={85}
                                        stroke="currentColor"
                                        className="text-xs opacity-60"
                                    />
                                    <Tooltip
                                        formatter={(value) => formatCurrencyPrecise(value as number)}
                                        labelFormatter={(label) => `Monat ${label} (${(Number(label) / 12).toFixed(1)} Jahre)`}
                                        contentStyle={{
                                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            color: '#fff',
                                            backdropFilter: 'blur(8px)'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="balance"
                                        stroke="#0284c7"
                                        strokeWidth={2.5}
                                        fill="url(#goalsGradient)"
                                        name="Gesamtvermögen"
                                    />
                                    {showGoalLines &&
                                        goals.map((goal) => (
                                            <ReferenceLine
                                                key={goal.id}
                                                y={goal.value}
                                                stroke="#8884d8"
                                                strokeDasharray="4 4"
                                                ifOverflow="extendDomain"
                                                label={{ value: goal.title, position: 'insideTopLeft', fill: '#8884d8', fontSize: 11 }}
                                            />
                                        ))}
                                    {showGoalLines &&
                                        goalData.reached.map((r) => (
                                            <ReferenceLine
                                                key={`v-line-${r.id}`}
                                                x={r.months}
                                                stroke="#10b981"
                                                strokeWidth={1.5}
                                                strokeDasharray="4 4"
                                                ifOverflow="extendDomain"
                                            />
                                        ))}
                                    {showGoalLines &&
                                        goalData.reached.map((r) => {
                                            const point = goalData.timeline[r.months];
                                            return (
                                                <ReferenceDot
                                                    key={`bubble-${r.id}`}
                                                    x={r.months}
                                                    y={point?.balance ?? r.value}
                                                    r={8}
                                                    fill="#22c55e"
                                                    stroke="#15803d"
                                                    strokeWidth={2}
                                                />
                                            );
                                        })}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Milestones list */}
                        <div className="grid sm:grid-cols-2 gap-3">
                            {goalData.reached.length > 0 && (
                                <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 space-y-2">
                                    <h5 className="font-semibold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                        <Calendar size={14} /> Erreichte Meilensteine
                                    </h5>
                                    <div className="space-y-1.5 text-xs">
                                        {goalData.reached.map(r => (
                                            <div key={r.id} className="flex justify-between items-center">
                                                <span className="font-medium text-foreground">{r.title} ({formatCurrency(r.value)}):</span>
                                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{r.date}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {goalData.unreachable.length > 0 && (
                                <div className="rounded-xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 p-4 space-y-2">
                                    <h5 className="font-semibold text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                                        <AlertCircle size={14} /> Unerreichbare Ziele
                                    </h5>
                                    <div className="space-y-1.5 text-xs">
                                        {goalData.unreachable.map(r => (
                                            <div key={r.id} className="flex justify-between items-center">
                                                <span className="text-muted-foreground">{r.title}:</span>
                                                <span className="text-amber-600 dark:text-amber-400 font-medium">&gt; 50 Jahre</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <CardFooter className="px-6 py-4 text-xs text-muted-foreground border-t border-border/40 flex justify-between items-center bg-card/30">
                <p>
                    Hinweis: Modellrechnung basierend auf einer konstanten monatlichen Sparrate und Rendite. Keine Anlageberatung.
                </p>
            </CardFooter>
        </Card>
    );
};
