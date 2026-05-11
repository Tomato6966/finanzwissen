"use client"

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { AdvancedSavingsPeriod } from "@/lib/savings-plan";

interface AdvancedSavingsPlanInputProps {
    enabled: boolean;
    onEnabledChange: (enabled: boolean) => void;
    periods: AdvancedSavingsPeriod[];
    onPeriodsChange: (periods: AdvancedSavingsPeriod[]) => void;
    title?: string;
}

export function AdvancedSavingsPlanInput({
    enabled,
    onEnabledChange,
    periods,
    onPeriodsChange,
    title = "Erweiterte Sparrate",
}: AdvancedSavingsPlanInputProps) {
    const updatePeriod = (id: number, field: keyof AdvancedSavingsPeriod, value: number) => {
        onPeriodsChange(periods.map((period) => (
            period.id === id ? { ...period, [field]: value } : period
        )));
    };

    const addPeriod = () => {
        const lastPeriod = periods[periods.length - 1];
        const nextStart = (lastPeriod?.endYear ?? 0) + 1;
        onPeriodsChange([
            ...periods,
            { id: Date.now(), startYear: nextStart, endYear: nextStart + 4, monthlyAmount: 0 },
        ]);
    };

    const removePeriod = (id: number) => {
        onPeriodsChange(periods.filter((period) => period.id !== id));
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <Label htmlFor="advanced-savings-plan">{title}</Label>
                    <p className="text-xs text-muted-foreground">
                        Sparraten frei nach Jahren staffeln, z.B. 5 Jahre 2.000 Euro, danach 1.000 Euro, später 0 Euro.
                    </p>
                </div>
                <Switch id="advanced-savings-plan" checked={enabled} onCheckedChange={onEnabledChange} />
            </div>

            {enabled && (
                <Card className="border-cyan-200 bg-cyan-50/70 py-0 dark:border-cyan-900 dark:bg-cyan-950/30">
                    <CardContent className="space-y-3 p-3">
                        {periods.map((period) => (
                            <div key={period.id} className="rounded-md border bg-background p-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <Label htmlFor={`savings-start-${period.id}`}>Von Jahr</Label>
                                        <Input
                                            id={`savings-start-${period.id}`}
                                            min={0}
                                            type="number"
                                            value={period.startYear}
                                            onChange={(event) => updatePeriod(period.id, "startYear", Number(event.target.value) || 0)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={`savings-end-${period.id}`}>Bis Jahr</Label>
                                        <Input
                                            id={`savings-end-${period.id}`}
                                            min={period.startYear}
                                            type="number"
                                            value={period.endYear}
                                            onChange={(event) => updatePeriod(period.id, "endYear", Number(event.target.value) || 0)}
                                        />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <Label htmlFor={`savings-amount-${period.id}`}>Monatliche Sparrate (Euro)</Label>
                                    <Input
                                        id={`savings-amount-${period.id}`}
                                        min={0}
                                        type="number"
                                        value={period.monthlyAmount}
                                        onChange={(event) => updatePeriod(period.id, "monthlyAmount", Number(event.target.value) || 0)}
                                    />
                                </div>
                                {periods.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="mt-2 w-full text-red-600"
                                        onClick={() => removePeriod(period.id)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Periode entfernen
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button type="button" variant="outline" className="w-full" onClick={addPeriod}>
                            <Plus className="mr-2 h-4 w-4" />
                            Sparphase hinzufuegen
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
