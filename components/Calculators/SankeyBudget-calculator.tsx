"use client";

import React, { useId, useMemo, useState } from "react";
import { sankey, sankeyJustify, sankeyLinkHorizontal } from "d3-sankey";
import {
    Plus,
    Trash2,
    Save,
    RotateCcw,
    Download,
    TrendingUp,
    PiggyBank,
    Wallet,
    AlertCircle,
    CheckCircle2,
    PieChart,
    ChevronDown,
    ChevronUp,
    Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/components/useCustomLocalStorage";

export interface BudgetItem {
    id: string;
    name: string;
    amount: number;
}

export interface BudgetState {
    incomes: BudgetItem[];
    fixedExpenses: BudgetItem[];
    variableExpenses: BudgetItem[];
    savings: BudgetItem[];
}

const DEFAULT_BUDGET: BudgetState = {
    incomes: [
        { id: "inc-1", name: "Hauptberuf / Netto", amount: 2850 },
        { id: "inc-2", name: "Nebenjob / Bonus", amount: 350 },
    ],
    fixedExpenses: [
        { id: "fix-1", name: "Wohnen & Warmmiete", amount: 950 },
        { id: "fix-2", name: "Strom & Internet", amount: 130 },
        { id: "fix-3", name: "Versicherungen & Mobilität", amount: 220 },
        { id: "fix-4", name: "Abos & Verträge", amount: 50 },
    ],
    variableExpenses: [
        { id: "var-1", name: "Lebensmittel & Drogerie", amount: 480 },
        { id: "var-2", name: "Freizeit & Gastronomie", amount: 320 },
        { id: "var-3", name: "Shopping & Sonstiges", amount: 190 },
    ],
    savings: [
        { id: "sav-1", name: "ETF-Sparplan (Weltportfolio)", amount: 650 },
        { id: "sav-2", name: "Notgroschen / Rücklagen", amount: 150 },
    ],
};

const COLOR_PALETTE = {
    income: {
        node: "#10b981", // emerald
        gradientFrom: "#10b981",
        gradientTo: "#3b82f6",
    },
    hub: {
        node: "#3b82f6", // blue
    },
    fixed: {
        node: "#ef4444", // red/rose
        gradientFrom: "#3b82f6",
        gradientTo: "#f43f5e",
    },
    variable: {
        node: "#f59e0b", // amber
        gradientFrom: "#3b82f6",
        gradientTo: "#f59e0b",
    },
    saving: {
        node: "#8b5cf6", // purple/indigo
        gradientFrom: "#3b82f6",
        gradientTo: "#8b5cf6",
    },
    surplus: {
        node: "#06b6d4", // cyan
        gradientFrom: "#3b82f6",
        gradientTo: "#06b6d4",
    },
};

export default function SankeyBudgetCalculator() {
    const [budget, setBudget] = useLocalStorage<BudgetState>(
        "finanzwissen_budget_sankey_v1",
        DEFAULT_BUDGET
    );

    const [savedNotice, setSavedNotice] = useState(false);
    const [activeTab, setActiveTab] = useState<"chart" | "edit">("chart");
    const [showPresets, setShowPresets] = useState(false);
    const svgId = useId();

    // Calculations
    const totalIncome = useMemo(
        () => budget.incomes.reduce((s, i) => s + (Number(i.amount) || 0), 0),
        [budget.incomes]
    );

    const totalFixed = useMemo(
        () => budget.fixedExpenses.reduce((s, i) => s + (Number(i.amount) || 0), 0),
        [budget.fixedExpenses]
    );

    const totalVariable = useMemo(
        () => budget.variableExpenses.reduce((s, i) => s + (Number(i.amount) || 0), 0),
        [budget.variableExpenses]
    );

    const totalSavings = useMemo(
        () => budget.savings.reduce((s, i) => s + (Number(i.amount) || 0), 0),
        [budget.savings]
    );

    const totalAllocated = totalFixed + totalVariable + totalSavings;
    const surplusOrDeficit = totalIncome - totalAllocated;

    // Rules 50 / 30 / 20 comparisons
    const fixedRatio = totalIncome > 0 ? (totalFixed / totalIncome) * 100 : 0;
    const variableRatio = totalIncome > 0 ? (totalVariable / totalIncome) * 100 : 0;
    const savingsRatio = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

    // Item handlers
    const updateItem = (
        category: keyof BudgetState,
        id: string,
        field: "name" | "amount",
        value: string | number
    ) => {
        setBudget({
            ...budget,
            [category]: budget[category].map((item) =>
                item.id === id
                    ? {
                          ...item,
                          [field]: field === "amount" ? Math.max(0, Number(value) || 0) : value,
                      }
                    : item
            ),
        });
    };

    const addItem = (category: keyof BudgetState) => {
        const newItem: BudgetItem = {
            id: `${category}-${Date.now()}`,
            name: "Neuer Posten",
            amount: 100,
        };
        setBudget({
            ...budget,
            [category]: [...budget[category], newItem],
        });
    };

    const removeItem = (category: keyof BudgetState, id: string) => {
        setBudget({
            ...budget,
            [category]: budget[category].filter((item) => item.id !== id),
        });
    };

    const handleSaveNotice = () => {
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 2500);
    };

    const resetToDefault = () => {
        if (confirm("Möchtest du das Budget wirklich auf die Standardwerte zurücksetzen?")) {
            setBudget(DEFAULT_BUDGET);
        }
    };

    const apply503020Preset = () => {
        const income = totalIncome > 0 ? totalIncome : 3000;
        setBudget({
            incomes: [{ id: "inc-1", name: "Hauptberuf / Netto", amount: income }],
            fixedExpenses: [
                { id: "fix-1", name: "Miete & Wohnen (50%)", amount: Math.round(income * 0.35) },
                { id: "fix-2", name: "Fixkosten & Mobilität", amount: Math.round(income * 0.15) },
            ],
            variableExpenses: [
                { id: "var-1", name: "Lebensmittel & Alltag", amount: Math.round(income * 0.18) },
                { id: "var-2", name: "Freizeit & Spaß (30%)", amount: Math.round(income * 0.12) },
            ],
            savings: [
                { id: "sav-1", name: "ETF Sparplan & Vorsorge (20%)", amount: Math.round(income * 0.20) },
            ],
        });
        setShowPresets(false);
    };

    // D3 Sankey Layout Construction
    const sankeyData = useMemo(() => {
        if (totalIncome <= 0) return null;

        interface SNode {
            id: string;
            name: string;
            color: string;
            value?: number;
            x0?: number;
            x1?: number;
            y0?: number;
            y1?: number;
        }

        interface SLink {
            source: number;
            target: number;
            value: number;
            colorFrom: string;
            colorTo: string;
            width?: number;
            y0?: number;
            y1?: number;
        }

        const nodes: SNode[] = [];
        const links: SLink[] = [];

        // 1. Incomes (Tier 0)
        budget.incomes.forEach((inc) => {
            if (inc.amount > 0) {
                nodes.push({
                    id: inc.id,
                    name: `${inc.name} (${inc.amount.toLocaleString("de-DE")} €)`,
                    color: COLOR_PALETTE.income.node,
                });
            }
        });

        // 2. Central Hub: Netto-Einkommen (Tier 1)
        const hubIndex = nodes.length;
        nodes.push({
            id: "hub-netto",
            name: `Gesamteinkommen (${totalIncome.toLocaleString("de-DE")} €)`,
            color: COLOR_PALETTE.hub.node,
        });

        // Link Incomes -> Hub
        budget.incomes.forEach((inc, idx) => {
            if (inc.amount > 0) {
                links.push({
                    source: idx,
                    target: hubIndex,
                    value: inc.amount,
                    colorFrom: COLOR_PALETTE.income.gradientFrom,
                    colorTo: COLOR_PALETTE.income.gradientTo,
                });
            }
        });

        // 3. Category Groups (Tier 2)
        let fixedGroupIndex = -1;
        let varGroupIndex = -1;
        let saveGroupIndex = -1;
        let surplusGroupIndex = -1;

        if (totalFixed > 0) {
            fixedGroupIndex = nodes.length;
            nodes.push({
                id: "group-fixed",
                name: `Fixkosten (${totalFixed.toLocaleString("de-DE")} € · ${fixedRatio.toFixed(0)}%)`,
                color: COLOR_PALETTE.fixed.node,
            });
            links.push({
                source: hubIndex,
                target: fixedGroupIndex,
                value: totalFixed,
                colorFrom: COLOR_PALETTE.hub.node,
                colorTo: COLOR_PALETTE.fixed.gradientTo,
            });
        }

        if (totalVariable > 0) {
            varGroupIndex = nodes.length;
            nodes.push({
                id: "group-var",
                name: `Lifestyle & Konsum (${totalVariable.toLocaleString("de-DE")} € · ${variableRatio.toFixed(0)}%)`,
                color: COLOR_PALETTE.variable.node,
            });
            links.push({
                source: hubIndex,
                target: varGroupIndex,
                value: totalVariable,
                colorFrom: COLOR_PALETTE.hub.node,
                colorTo: COLOR_PALETTE.variable.gradientTo,
            });
        }

        if (totalSavings > 0) {
            saveGroupIndex = nodes.length;
            nodes.push({
                id: "group-savings",
                name: `Sparen & Investieren (${totalSavings.toLocaleString("de-DE")} € · ${savingsRatio.toFixed(0)}%)`,
                color: COLOR_PALETTE.saving.node,
            });
            links.push({
                source: hubIndex,
                target: saveGroupIndex,
                value: totalSavings,
                colorFrom: COLOR_PALETTE.hub.node,
                colorTo: COLOR_PALETTE.saving.gradientTo,
            });
        }

        if (surplusOrDeficit > 0) {
            surplusGroupIndex = nodes.length;
            nodes.push({
                id: "group-surplus",
                name: `Freier Überschuss (${surplusOrDeficit.toLocaleString("de-DE")} €)`,
                color: COLOR_PALETTE.surplus.node,
            });
            links.push({
                source: hubIndex,
                target: surplusGroupIndex,
                value: surplusOrDeficit,
                colorFrom: COLOR_PALETTE.hub.node,
                colorTo: COLOR_PALETTE.surplus.gradientTo,
            });
        }

        // 4. Sub-items (Tier 3)
        if (fixedGroupIndex !== -1) {
            budget.fixedExpenses.forEach((item) => {
                if (item.amount > 0) {
                    const subIdx = nodes.length;
                    nodes.push({
                        id: item.id,
                        name: `${item.name} (${item.amount.toLocaleString("de-DE")} €)`,
                        color: "#fb7185",
                    });
                    links.push({
                        source: fixedGroupIndex,
                        target: subIdx,
                        value: item.amount,
                        colorFrom: COLOR_PALETTE.fixed.node,
                        colorTo: "#fb7185",
                    });
                }
            });
        }

        if (varGroupIndex !== -1) {
            budget.variableExpenses.forEach((item) => {
                if (item.amount > 0) {
                    const subIdx = nodes.length;
                    nodes.push({
                        id: item.id,
                        name: `${item.name} (${item.amount.toLocaleString("de-DE")} €)`,
                        color: "#fbbf24",
                    });
                    links.push({
                        source: varGroupIndex,
                        target: subIdx,
                        value: item.amount,
                        colorFrom: COLOR_PALETTE.variable.node,
                        colorTo: "#fbbf24",
                    });
                }
            });
        }

        if (saveGroupIndex !== -1) {
            budget.savings.forEach((item) => {
                if (item.amount > 0) {
                    const subIdx = nodes.length;
                    nodes.push({
                        id: item.id,
                        name: `${item.name} (${item.amount.toLocaleString("de-DE")} €)`,
                        color: "#a78bfa",
                    });
                    links.push({
                        source: saveGroupIndex,
                        target: subIdx,
                        value: item.amount,
                        colorFrom: COLOR_PALETTE.saving.node,
                        colorTo: "#a78bfa",
                    });
                }
            });
        }

        // SVG Dimensions
        const width = 1000;
        const height = Math.max(520, nodes.length * 28);

        const sankeyGenerator = sankey<SNode, SLink>()
            .nodeWidth(16)
            .nodePadding(18)
            .nodeAlign(sankeyJustify)
            .extent([
                [180, 25],
                [width - 240, height - 25],
            ]);

        try {
            const graph = sankeyGenerator({
                nodes: nodes.map((n) => ({ ...n })),
                links: links.map((l) => ({ ...l })),
            });
            return { graph, width, height };
        } catch (e) {
            console.error("Sankey calculation error:", e);
            return null;
        }
    }, [budget, totalIncome, totalFixed, totalVariable, totalSavings, surplusOrDeficit, fixedRatio, variableRatio, savingsRatio]);

    return (
        <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-xl overflow-hidden">
            <CardHeader className="border-b border-border/40 pb-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <Badge className="bg-primary/10 text-primary border-primary/30">
                                Interaktiver Rechner
                            </Badge>
                            <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                                Lokal gespeichert
                            </Badge>
                        </div>
                        <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                            <Wallet className="h-6 w-6 text-primary" />
                            Sankey-Budgetplaner &amp; Cashflow
                        </CardTitle>
                        <CardDescription className="text-sm sm:text-base mt-1">
                            Visualisiere exakt, woher dein Geld kommt und wohin jeder Euro fließt.
                            Deine Daten bleiben zu 100% privat im Browser gespeichert.
                        </CardDescription>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <Button
                            variant={activeTab === "chart" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveTab("chart")}
                        >
                            <PieChart className="h-4 w-4 mr-1.5" />
                            Diagramm
                        </Button>
                        <Button
                            variant={activeTab === "edit" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveTab("edit")}
                        >
                            Eingaben bearbeiten
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSaveNotice}
                            className="text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                        >
                            <Save className="h-4 w-4 mr-1.5" />
                            {savedNotice ? "Gespeichert!" : "Speichern"}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetToDefault}
                            title="Zurücksetzen"
                        >
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Key Metrics Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-border/30">
                    <div className="rounded-xl border border-border/40 bg-muted/20 p-3">
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Netto-Einkommen</p>
                        <p className="text-xl font-bold text-emerald-500 mt-1">
                            {totalIncome.toLocaleString("de-DE")} €
                        </p>
                        <p className="text-[11px] text-muted-foreground">Basis aller Ströme</p>
                    </div>
                    <div className="rounded-xl border border-border/40 bg-muted/20 p-3">
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Fixkosten</p>
                        <p className="text-xl font-bold text-rose-500 mt-1">
                            {totalFixed.toLocaleString("de-DE")} €
                        </p>
                        <p className="text-[11px] text-muted-foreground">{fixedRatio.toFixed(1)} % vom Netto (Ziel: &le; 50%)</p>
                    </div>
                    <div className="rounded-xl border border-border/40 bg-muted/20 p-3">
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Lifestyle &amp; Konsum</p>
                        <p className="text-xl font-bold text-amber-500 mt-1">
                            {totalVariable.toLocaleString("de-DE")} €
                        </p>
                        <p className="text-[11px] text-muted-foreground">{variableRatio.toFixed(1)} % vom Netto (Ziel: &le; 30%)</p>
                    </div>
                    <div className="rounded-xl border border-border/40 bg-muted/20 p-3">
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Sparen &amp; ETF</p>
                        <p className="text-xl font-bold text-purple-500 mt-1">
                            {totalSavings.toLocaleString("de-DE")} €
                        </p>
                        <p className="text-[11px] text-muted-foreground">{savingsRatio.toFixed(1)} % Sparquote (Ziel: &ge; 20%)</p>
                    </div>
                </div>

                {/* Status Callout if deficit or surplus */}
                {surplusOrDeficit < 0 ? (
                    <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-600 dark:text-rose-400">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>
                            <strong>Achtung: Budget überzogen!</strong> Deine Ausgaben und Sparraten übersteigen deine Einnahmen um {Math.abs(surplusOrDeficit).toLocaleString("de-DE")} € / Monat.
                        </span>
                    </div>
                ) : surplusOrDeficit > 0 ? (
                    <div className="mt-3 flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-2.5 text-xs text-cyan-600 dark:text-cyan-400">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>
                            <strong>Freier Puffer:</strong> Du hast noch {surplusOrDeficit.toLocaleString("de-DE")} € / Monat ({((surplusOrDeficit / totalIncome) * 100).toFixed(1)}%) unverteilt. Ideal für Sonderzahlungen oder Erhöhung der ETF-Sparrate!
                        </span>
                    </div>
                ) : null}
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-6">
                {/* DIAGRAMM ANSICHT */}
                {activeTab === "chart" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-muted-foreground pb-2">
                            <span className="flex items-center gap-1.5">
                                <Info className="h-3.5 w-3.5" />
                                Horizontale Flussbreite entspricht dem relativen monatlichen Betrag.
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowPresets(!showPresets)}
                                className="text-xs h-7 text-primary"
                            >
                                Vorlage laden {showPresets ? <ChevronUp className="h-3.5 w-3.5 ml-1" /> : <ChevronDown className="h-3.5 w-3.5 ml-1" />}
                            </Button>
                        </div>

                        {showPresets && (
                            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                                <div>
                                    <p className="font-semibold text-foreground">50/30/20-Regel Vorlage anwenden?</p>
                                    <p className="text-muted-foreground mt-0.5">
                                        Passt dein aktuelles Einkommen automatisch auf 50% Fixkosten, 30% Lifestyle und 20% Sparen an.
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={apply503020Preset} className="text-xs h-8">
                                        50/30/20 anwenden
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setShowPresets(false)} className="text-xs h-8">
                                        Abbrechen
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Responsive SVG Sankey Container */}
                        <div className="w-full overflow-x-auto rounded-xl border border-border/40 bg-muted/10 p-2 sm:p-4">
                            {sankeyData ? (
                                <svg
                                    viewBox={`0 0 ${sankeyData.width} ${sankeyData.height}`}
                                    className="w-full h-auto min-w-[760px] font-sans select-none"
                                    style={{ maxHeight: "680px" }}
                                >
                                    <defs>
                                        {sankeyData.graph.links.map((link, i) => {
                                            const gradId = `${svgId}-link-grad-${i}`;
                                            return (
                                                <linearGradient
                                                    key={gradId}
                                                    id={gradId}
                                                    gradientUnits="userSpaceOnUse"
                                                    x1={(link.source as any).x1}
                                                    y1={(link.y0 ?? 0)}
                                                    x2={(link.target as any).x0}
                                                    y2={(link.y1 ?? 0)}
                                                >
                                                    <stop offset="0%" stopColor={(link as any).colorFrom || "#3b82f6"} stopOpacity="0.45" />
                                                    <stop offset="100%" stopColor={(link as any).colorTo || "#8b5cf6"} stopOpacity="0.45" />
                                                </linearGradient>
                                            );
                                        })}
                                    </defs>

                                    {/* Links */}
                                    <g fill="none">
                                        {sankeyData.graph.links.map((link, i) => {
                                            const pathD = sankeyLinkHorizontal()(link as any);
                                            const gradId = `${svgId}-link-grad-${i}`;
                                            return (
                                                <path
                                                    key={i}
                                                    d={pathD || undefined}
                                                    stroke={`url(#${gradId})`}
                                                    strokeWidth={Math.max(1, link.width || 0)}
                                                    className="transition-all duration-300 hover:stroke-opacity-80 cursor-pointer"
                                                >
                                                    <title>{`${(link.source as any).name} → ${(link.target as any).name}: ${link.value.toLocaleString("de-DE")} €`}</title>
                                                </path>
                                            );
                                        })}
                                    </g>

                                    {/* Nodes */}
                                    <g>
                                        {sankeyData.graph.nodes.map((node, i) => {
                                            const x0 = node.x0 ?? 0;
                                            const x1 = node.x1 ?? 0;
                                            const y0 = node.y0 ?? 0;
                                            const y1 = node.y1 ?? 0;
                                            const nodeWidth = x1 - x0;
                                            const nodeHeight = Math.max(4, y1 - y0);

                                            // Text positioning: nodes on left half put text left or right
                                            const isRightSide = x0 > sankeyData.width / 2;
                                            const textX = isRightSide ? x1 + 8 : x0 - 8;
                                            const textAnchor = isRightSide ? "start" : "end";

                                            return (
                                                <g key={i} className="group">
                                                    <rect
                                                        x={x0}
                                                        y={y0}
                                                        width={nodeWidth}
                                                        height={nodeHeight}
                                                        fill={node.color}
                                                        rx={3}
                                                        className="transition-transform duration-200 group-hover:brightness-110 cursor-pointer"
                                                    >
                                                        <title>{`${node.name}`}</title>
                                                    </rect>
                                                    <text
                                                        x={textX}
                                                        y={y0 + nodeHeight / 2}
                                                        dy="0.35em"
                                                        textAnchor={textAnchor}
                                                        className="fill-foreground text-[11px] font-medium pointer-events-none drop-shadow-sm"
                                                    >
                                                        {node.name}
                                                    </text>
                                                </g>
                                            );
                                        })}
                                    </g>
                                </svg>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground text-sm">
                                    Bitte gib mindestens eine Einnahmequelle mit einem Betrag &gt; 0 ein.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* EINGABEN BEARBEITEN ANSICHT */}
                {activeTab === "edit" && (
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* 1. Einnahmen */}
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02] p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                                    <h4 className="font-semibold text-foreground text-sm">1. Einnahmen (Netto)</h4>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addItem("incomes")}
                                    className="h-7 text-xs border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                                >
                                    <Plus className="h-3.5 w-3.5 mr-1" /> Neu
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {budget.incomes.map((item) => (
                                    <div key={item.id} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={item.name}
                                            onChange={(e) => updateItem("incomes", item.id, "name", e.target.value)}
                                            className="grow rounded-md border border-border/50 bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-primary"
                                            placeholder="Bezeichnung"
                                        />
                                        <div className="relative w-28">
                                            <input
                                                type="number"
                                                value={item.amount || ""}
                                                onChange={(e) => updateItem("incomes", item.id, "amount", e.target.value)}
                                                className="w-full rounded-md border border-border/50 bg-background px-2.5 py-1.5 text-xs text-foreground text-right pr-6 focus:outline-primary font-mono"
                                                placeholder="0"
                                            />
                                            <span className="absolute right-2 top-1.5 text-xs text-muted-foreground">€</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeItem("incomes", item.id)}
                                            className="h-7 w-7 p-0 text-muted-foreground hover:text-rose-500"
                                            disabled={budget.incomes.length <= 1}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 pt-2 border-t border-border/30 flex justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                <span>Summe Einnahmen:</span>
                                <span>{totalIncome.toLocaleString("de-DE")} €</span>
                            </div>
                        </div>

                        {/* 2. Fixkosten */}
                        <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.02] p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-rose-500" />
                                    <h4 className="font-semibold text-foreground text-sm">2. Fixkosten</h4>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addItem("fixedExpenses")}
                                    className="h-7 text-xs border-rose-500/30 text-rose-600 dark:text-rose-400"
                                >
                                    <Plus className="h-3.5 w-3.5 mr-1" /> Neu
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {budget.fixedExpenses.map((item) => (
                                    <div key={item.id} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={item.name}
                                            onChange={(e) => updateItem("fixedExpenses", item.id, "name", e.target.value)}
                                            className="grow rounded-md border border-border/50 bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-primary"
                                            placeholder="Bezeichnung"
                                        />
                                        <div className="relative w-28">
                                            <input
                                                type="number"
                                                value={item.amount || ""}
                                                onChange={(e) => updateItem("fixedExpenses", item.id, "amount", e.target.value)}
                                                className="w-full rounded-md border border-border/50 bg-background px-2.5 py-1.5 text-xs text-foreground text-right pr-6 focus:outline-primary font-mono"
                                                placeholder="0"
                                            />
                                            <span className="absolute right-2 top-1.5 text-xs text-muted-foreground">€</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeItem("fixedExpenses", item.id)}
                                            className="h-7 w-7 p-0 text-muted-foreground hover:text-rose-500"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 pt-2 border-t border-border/30 flex justify-between text-xs font-semibold text-rose-600 dark:text-rose-400">
                                <span>Summe Fixkosten:</span>
                                <span>{totalFixed.toLocaleString("de-DE")} €</span>
                            </div>
                        </div>

                        {/* 3. Variable Ausgaben */}
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.02] p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-amber-500" />
                                    <h4 className="font-semibold text-foreground text-sm">3. Lifestyle &amp; Variable Kosten</h4>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addItem("variableExpenses")}
                                    className="h-7 text-xs border-amber-500/30 text-amber-600 dark:text-amber-400"
                                >
                                    <Plus className="h-3.5 w-3.5 mr-1" /> Neu
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {budget.variableExpenses.map((item) => (
                                    <div key={item.id} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={item.name}
                                            onChange={(e) => updateItem("variableExpenses", item.id, "name", e.target.value)}
                                            className="grow rounded-md border border-border/50 bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-primary"
                                            placeholder="Bezeichnung"
                                        />
                                        <div className="relative w-28">
                                            <input
                                                type="number"
                                                value={item.amount || ""}
                                                onChange={(e) => updateItem("variableExpenses", item.id, "amount", e.target.value)}
                                                className="w-full rounded-md border border-border/50 bg-background px-2.5 py-1.5 text-xs text-foreground text-right pr-6 focus:outline-primary font-mono"
                                                placeholder="0"
                                            />
                                            <span className="absolute right-2 top-1.5 text-xs text-muted-foreground">€</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeItem("variableExpenses", item.id)}
                                            className="h-7 w-7 p-0 text-muted-foreground hover:text-rose-500"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 pt-2 border-t border-border/30 flex justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
                                <span>Summe Variable:</span>
                                <span>{totalVariable.toLocaleString("de-DE")} €</span>
                            </div>
                        </div>

                        {/* 4. Sparen & Investieren */}
                        <div className="rounded-xl border border-purple-500/20 bg-purple-500/[0.02] p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-purple-500" />
                                    <h4 className="font-semibold text-foreground text-sm">4. Sparen &amp; Investieren</h4>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addItem("savings")}
                                    className="h-7 text-xs border-purple-500/30 text-purple-600 dark:text-purple-400"
                                >
                                    <Plus className="h-3.5 w-3.5 mr-1" /> Neu
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {budget.savings.map((item) => (
                                    <div key={item.id} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={item.name}
                                            onChange={(e) => updateItem("savings", item.id, "name", e.target.value)}
                                            className="grow rounded-md border border-border/50 bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-primary"
                                            placeholder="Bezeichnung"
                                        />
                                        <div className="relative w-28">
                                            <input
                                                type="number"
                                                value={item.amount || ""}
                                                onChange={(e) => updateItem("savings", item.id, "amount", e.target.value)}
                                                className="w-full rounded-md border border-border/50 bg-background px-2.5 py-1.5 text-xs text-foreground text-right pr-6 focus:outline-primary font-mono"
                                                placeholder="0"
                                            />
                                            <span className="absolute right-2 top-1.5 text-xs text-muted-foreground">€</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeItem("savings", item.id)}
                                            className="h-7 w-7 p-0 text-muted-foreground hover:text-rose-500"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 pt-2 border-t border-border/30 flex justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
                                <span>Summe Sparen:</span>
                                <span>{totalSavings.toLocaleString("de-DE")} €</span>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
