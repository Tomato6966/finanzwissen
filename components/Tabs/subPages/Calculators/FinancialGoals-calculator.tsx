/* eslint-disable */
"use client"

import { AlertCircle, Calendar, Target, Trash } from "lucide-react";
import React, { FC, useMemo, useState } from "react";
import {
	Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

import { Button } from "@/components/ui/button";
import {
	Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Switch } from "../../../ui/switch";
import { formatCurrency, formatCurrencyPrecise, handleFormChange } from "./tools";

// Define the shape of a single goal
interface Goal {
    id: number;
    title: string;
    value: number;
}

// Define the shape of the form data
interface GoalForm {
    principal: number;
    contribution: number;
    rate: number;
}

// Define the shape of the calculated data
interface GoalData {
    timeline: { month: number; balance: number }[];
    reached: { id: number; title: string; value: number; months: number; date: string }[];
    unreachable: Goal[];
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

export const FinancialGoalsCalculator: FC = () => {
    // Initial state for form inputs
    const [goalForm, setGoalForm] = useState<GoalForm>({
        principal: 1000,
        contribution: 100,
        rate: 5,
    });

    // Initial state for the list of financial goals
    const [goals, setGoals] = useState<Goal[]>([
        { id: 1, title: 'Neues Auto', value: 20000 },
        { id: 2, title: 'Urlaubskasse', value: 5000 },
        { id: 3, title: 'Haus Anzahlung', value: 50000 },
    ]);

    // State for toggling the goal lines on the chart
    const [showGoalLines, setShowGoalLines] = useState(true);

    // Memoize the calculation for performance
    const goalData = useMemo(() => {
        return calculateFutureValue(goalForm, goals);
    }, [goalForm, goals]);

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

    return (
        <Card className="w-full max-w-6xl shadow-xl rounded-lg overflow-hidden py-0">
            <CardHeader className="bg-primary text-primary-foreground p-6 rounded-t-lg">
                <CardTitle className="text-3xl font-bold flex items-center gap-4">
                    <Target /> Sparzielrechner
                </CardTitle>
                <CardDescription className="text-primary-foreground opacity-90 text-sm">
                    Verfolgen Sie mehrere Sparziele und sehen Sie, wann Sie diese erreichen.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid lg:grid-cols-3 gap-8 pb-6 p-6">
                {/* Input Controls for the Calculator */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="space-y-4">
                        <h4 className="font-bold text-lg">Finanzielle Eckdaten</h4>
                        <div>
                            <Label htmlFor="principal">Startkapital (€)</Label>
                            <Input id="principal" name="principal" type="number" value={goalForm.principal} onChange={handleFormChange(setGoalForm)} />
                        </div>
                        <div>
                            <Label htmlFor="contribution">Monatliche Sparrate (€)</Label>
                            <Input id="contribution" name="contribution" type="number" value={goalForm.contribution} onChange={handleFormChange(setGoalForm)} />
                        </div>
                        <div>
                            <Label htmlFor="rate">Erwartete Rendite p.a. (%)</Label>
                            <Input id="rate" name="rate" type="number" value={goalForm.rate} onChange={handleFormChange(setGoalForm)} />
                        </div>
                    </div>

                    {/* Goal Management Section */}
                    <div className="space-y-4 pt-4">
                        <h4 className="font-bold text-lg">Ihre Sparziele</h4>
                        <div className="space-y-2">
                            {goals.map((goal, index) => (
                                <div key={goal.id} className="flex items-center gap-2">
                                    <Input
                                        value={goal.title}
                                        onChange={(e) => handleGoalChange(index, 'title', e.target.value)}
                                        placeholder="Titel"
                                    />
                                    <Input
                                        type="number"
                                        value={goal.value}
                                        onChange={(e) => handleGoalChange(index, 'value', e.target.value)}
                                        placeholder="Wert (€)"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeGoal(goal.id)}
                                        className="text-red-500 hover:text-red-700"
                                        title="Ziel löschen"
                                    >
                                        <Trash size={16} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button onClick={addGoal} className="w-full">Ziel hinzufügen</Button>
                    </div>
                </div>

                {/* Visualization and Results Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <h4 className="font-bold text-lg">Vermögensentwicklung</h4>
                            <div className="flex items-center space-x-2">
                                <Label htmlFor="goal-lines-toggle">Ziel-Linien anzeigen</Label>
                                <Switch
                                    id="goal-lines-toggle"
                                    checked={showGoalLines}
                                    onCheckedChange={setShowGoalLines}
                                />
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={500}>
                            <AreaChart data={goalData.timeline}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="month"
                                    tickFormatter={(val: number) => (val / 12).toFixed(1)}
                                    unit=" J"
                                    label={{ value: 'Zeit (Jahre)', position: 'insideBottom', offset: -5 }}
                                />
                                <YAxis
                                    tickFormatter={(val: number) => formatCurrency(val)}
                                    width={100}
                                    label={{ value: 'Vermögen (€)', angle: -90, position: 'insideLeft', offset: 10 }}
                                />
                                <Tooltip
                                    formatter={(value: number, name: string) => {
                                        return formatCurrencyPrecise(value);
                                    }}
                                    labelFormatter={(label: number) => `Monat ${label} (${(label / 12).toFixed(1)} Jahre)`}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="balance"
                                    stroke="#0369a1"
                                    fill="#e0f2fe"
                                    name="Gesamtvermögen"
                                />
                                {showGoalLines &&
                                    goals.map((goal) => (
                                        <ReferenceLine
                                            key={goal.id}
                                            y={goal.value}
                                            stroke="#8884d8"
                                            strokeDasharray="5 5"
                                            ifOverflow="extendDomain"
                                            label={{ value: goal.title, position: 'insideTopLeft' }}
                                        />
                                    ))}
                                    {showGoalLines &&
                                        goalData.reached.map((r) => (
                                            <ReferenceLine
                                                key={`v-line-${r.id}`}
                                                x={r.months}
                                                stroke="#8884d8"
                                                strokeWidth={1}
                                                strokeDasharray="5 5"
                                                ifOverflow="extendDomain"
                                                label={{
                                                    value: r.title,
                                                    position: 'top',
                                                    fill: '#dc2626',
                                                    fontWeight: 'bold',
                                                    fontSize: '12',
                                                    dy: -10,
                                                }}
                                            />
                                        ))}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Reached and Unreachable Goals Section */}
                    <div className="mt-4 space-y-4">
                        <h4 className="font-bold text-lg">Ihre Ziele im Überblick</h4>
                        {goalData.reached.length > 0 && (
                            <div className="space-y-2">
                                <h5 className="font-semibold text-green-700 flex items-center gap-2">
                                    <Calendar size={18} /> Erreichte Ziele
                                </h5>
                                <ul className="list-disc pl-5 space-y-1">
                                    {goalData.reached.map(r => (
                                        <li key={r.id}>
                                            <strong>{r.title}</strong> ({formatCurrency(r.value)}) wird voraussichtlich am{' '}
                                            <strong>{r.date}</strong> erreicht.
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {goalData.unreachable.length > 0 && (
                            <div className="space-y-2">
                                <h5 className="font-semibold text-orange-700 flex items-center gap-2">
                                    <AlertCircle size={18} /> Unerreichbare Ziele
                                </h5>
                                <p className="text-sm text-gray-600">
                                    Mit der aktuellen Sparrate und Rendite werden die folgenden Ziele innerhalb von 50 Jahren nicht erreicht.
                                    Passen Sie Ihre Eingaben an, um die Zeit zu verkürzen.
                                </p>
                                <ul className="list-disc pl-5 space-y-1">
                                    {goalData.unreachable.map(r => (
                                        <li key={r.id}>
                                            <strong>{r.title}</strong> ({formatCurrency(r.value)})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {goalData.reached.length === 0 && goalData.unreachable.length === 0 && (
                            <p className="text-gray-500">Fügen Sie Ziele hinzu, um die Ergebnisse zu sehen.</p>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-6 text-sm text-gray-500">
                <p>
                    Hinweis: Dies ist ein Modell, keine Garantie. Die tatsächliche Rendite kann von der hier angegebenen Schätzung abweichen.
                </p>
            </CardFooter>
        </Card>
    );
};
