"use client";
import * as d3 from "d3";
import { sankey, SankeyLink, sankeyLinkHorizontal } from "d3-sankey";
// @ts-check
import { AlertCircle, Share2, Sparkles, TrendingUp, Upload, X } from "lucide-react";
import LZString from "lz-string"; // For URL compression/decompression
import { useEffect, useRef, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Switch } from "../../components/ui/switch";

// Define TypeScript interface for a single budget item
interface BudgetItem {
    id: string; // Unique ID for each budget item (e.g., "income", "housing", or "custom-123")
    name: string; // Display name (e.g., "Monatliches Nettoeinkommen", "Wohnen")
    value: string; // String to hold user input (will be parsed to number for calculations)
    type: 'income' | 'expense'; // Categorize as income or expense
    isRemovable: boolean; // Flag to indicate if the item can be removed by the user
    color?: string; // Optional color for visualization (e.g., for bar chart or Sankey nodes)
}

// Define types for D3 Sankey diagram
interface SankeyNodeData {
    id: string;
    x0?: number;
    x1?: number;
    y0?: number;
    y1?: number;
    value?: number;
    [key: string]: unknown;
}

interface SankeyLinkData {
    source: SankeyNodeData;
    target: SankeyNodeData;
    value: number;
    width?: number;
}

// Initial budget categories, now as dynamic items that can be removed
const initialBudgetItems: BudgetItem[] = [
    { id: "income", name: "Monatliches Nettoeinkommen", value: "", type: "income", isRemovable: false },
    { id: "housing", name: "Wohnen (Miete, Nebenkosten)", value: "", type: "expense", isRemovable: true, color: "bg-blue-500" },
    { id: "food", name: "Lebensmittel", value: "", type: "expense", isRemovable: true, color: "bg-green-500" },
    { id: "transportation", name: "Transport", value: "", type: "expense", isRemovable: true, color: "bg-yellow-500" },
    { id: "entertainment", name: "Unterhaltung & Freizeit", value: "", type: "expense", isRemovable: true, color: "bg-pink-500" },
    { id: "savings", name: "Sparen & Investieren", value: "", type: "expense", isRemovable: true, color: "bg-purple-500" },
    { id: "other", name: "Sonstiges", value: "", type: "expense", isRemovable: true, color: "bg-gray-500" },
];

export default function BudgetAnalysis() {
    const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(initialBudgetItems);
    const [visualizationType, setVisualizationType] = useState<'bar' | 'sankey'>('bar');
    const [message, setMessage] = useState<string>('');
    const sankeyRef = useRef<SVGSVGElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const shareData = urlParams.get('share'); // Get the 'share' parameter from the URL
        if (shareData) {
            try {
                // Decompress and parse the JSON data from the URL
                const decodedData = LZString.decompressFromEncodedURIComponent(shareData);
                if (decodedData) {
                    const parsedData = JSON.parse(decodedData);
                    // Set the state with the loaded data, ensuring it's an array for budgetItems
                    if (Array.isArray(parsedData.budgetItems)) {
                        setBudgetItems(parsedData.budgetItems);
                    }
                    setVisualizationType(parsedData.visualizationType || 'bar');
                }
            } catch (e) {
                console.error("Failed to decode shared data:", e);
            } finally {
                // Remove the 'share' parameter from the URL to clean it up
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.delete('share');
                window.history.replaceState({}, document.title, newUrl.toString());
            }
        }
    }, []); // Empty dependency array means this runs once on mount

    // Handler for changes in any budget input field (name or value)
    const handleBudgetItemChange = (id: string, field: 'name' | 'value', value: string) => {
        setBudgetItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
        );
    };

    // Handler to add a new custom expense field
    const addBudgetItem = () => {
        setBudgetItems((prev) => [
            ...prev,
            // Generate a unique ID for the new item
            { id: `custom-${Date.now()}`, name: "", value: "", type: "expense", isRemovable: true, color: "bg-indigo-500" },
        ]);
    };

    // Handler to remove a budget item
    const removeBudgetItem = (id: string) => {
        setBudgetItems((prev) => prev.filter((item) => item.id !== id));
    };

    // Function to display a temporary message to the user
    const showMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
    };

    // Handler to copy the AI prompt to the clipboard based on selected AI type
    const handleCopyPrompt = (aiType: 'chatgpt' | 'gemini' | 'claude') => {
        // Extract income and expenses from the unified budgetItems state
        const incomeItem = budgetItems.find(item => item.type === 'income');
        const income = Number.parseFloat(incomeItem?.value || "0") || 0;

        const expenseItems = budgetItems.filter(item => item.type === 'expense');
        const expenseDetails = expenseItems
            .map(item => `${item.name || "Unbenannte Ausgabe"}: ${Number.parseFloat(item.value) || 0}€`)
            .join("\n");

        let prompt = "";

        // Assemble the core budget details string dynamically
        const budgetDetails = `
Monatliches Nettoeinkommen: ${income}€
${expenseDetails}
`;

        // Generate specific prompts for different AI models
        switch (aiType) {
            case "chatgpt":
                prompt = `Ich möchte eine detaillierte Budgetanalyse basierend auf meinen monatlichen Einnahmen und Ausgaben. Bitte gib mir personalisierte Verbesserungsvorschläge, identifiziere Stärken und Schwächen und schätze mein Finanz-Level ein (z.B. Anfänger, Gut, Fortgeschritten). Berücksichtige auch eine Sparquote und den Wohnkostenanteil am Einkommen. Formatiere die Ausgabe übersichtlich mit Überschriften und Stichpunkten.

Mein Budget:
${budgetDetails}

Bitte beachte:
- Sei prägnant und direkt.
- Gib konkrete, umsetzbare Ratschläge.
- Vermeide Floskeln und unnötige Einleitungen.`;
                break;
            case "gemini":
                prompt = `Führe eine umfassende Finanzanalyse meines Budgets durch. Ermittle mein aktuelles Finanz-Level (Anfänger, Gut, Fortgeschritten), berechne meine Sparquote und den Anteil der Wohnkosten am Einkommen. Gib mir anschließend konkrete, umsetzbare Empfehlungen zur Optimierung meiner Finanzen und nenne die nächsten Schritte, die ich unternehmen sollte. Die Antwort sollte im Markdown-Format sein und folgende Abschnitte enthalten:

**Ihr Finanz-Level:**
**Sparquote:**
**Wohnkostenanteil:**
**Verbesserungsvorschläge:**
**Nächste Schritte:**

Mein Budget:
${budgetDetails}`;
                break;
            case "claude":
                prompt = `Analysiere mein monatliches Budget und erstelle eine strukturierte Übersicht mit Handlungsempfehlungen. Bewerte mein Finanzmanagement und ordne es einem Level zu (z.B. Anfänger, Gut, Fortgeschritten). Berechne die Sparquote und den Prozentsatz der Wohnkosten. Deine Analyse sollte klar, präzise und umsetzbar sein. Verwende eine professionelle, aber verständliche Sprache.

Budgetdaten:
${budgetDetails}

Erwartete Ausgabe:
- Finanz-Level
- Kennzahlen (Sparquote, Wohnkostenanteil)
- Detaillierte Empfehlungen zur Budgetoptimierung
- Konkrete nächste Schritte`;
                break;
        }

        // Copy prompt to clipboard using a temporary textarea for broader compatibility
        const textArea = document.createElement('textarea');
        textArea.value = prompt;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showMessage(`Prompt für ${aiType.toUpperCase()} in die Zwischenablage kopiert!`);
        } catch (err) {
            console.error('Fehler beim Kopieren des Prompts:', err);
            showMessage('Kopieren fehlgeschlagen!');
        }
        document.body.removeChild(textArea);
    };

    // Handler to generate and copy a shareable URL
    const handleShare = () => {
        // Data to be encoded in the URL
        const dataToShare = {
            budgetItems, // Now sharing the unified budgetItems array
            visualizationType,
        };
        // Compress and encode the JSON data
        const encodedData = LZString.compressToEncodedURIComponent(
            JSON.stringify(dataToShare)
        );
        // Construct the shareable URL
        const shareUrl = `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH || ''}${window.location.pathname}?share=${encodedData}`;

        // Copy the share URL to clipboard
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showMessage('Link in die Zwischenablage kopiert!');
        } catch (err) {
            console.error('Fehler beim Kopieren des Links:', err);
            showMessage('Kopieren fehlgeschlagen!');
        }
        document.body.removeChild(textArea);
    };

    // Calculate total income and prepare expense data for visualization
    const incomeItem = budgetItems.find(item => item.type === 'income');
    const totalIncome = Number.parseFloat(incomeItem?.value || "0") || 0;

    // Filter for expense items and prepare them for visualization
    const allExpensesForVisualization = budgetItems
        .filter(item => item.type === 'expense')
        .map((exp) => ({
            name: exp.name || "Unbenannte Ausgabe", // Default name if not provided
            value: Number.parseFloat(exp.value) || 0,
            color: exp.color || "bg-indigo-500", // Use item's defined color or a default
        }));

    // Calculate total expenses and remaining budget
    const totalExpensesValue = allExpensesForVisualization.reduce((sum, exp) => sum + exp.value, 0);
    const remainingBudget = totalIncome - totalExpensesValue;

    // Helper to get a consistent hex color for Sankey nodes and links based on Tailwind class
    const getSankeyColor = (tailwindClass: string) => {
        const colorMap: { [key: string]: string } = {
            "bg-blue-500": "#3B82F6", // blue-500
            "bg-green-500": "#22C55E", // green-500
            "bg-yellow-500": "#F59E0B", // yellow-500
            "bg-pink-500": "#EC4899", // pink-500
            "bg-purple-500": "#A855F7", // purple-500
            "bg-gray-500": "#6B7280", // gray-500
            "bg-indigo-500": "#6366F1", // indigo-500
        };
        return colorMap[tailwindClass] || "#9CA3AF"; // Default gray if not found
    };

    // useEffect hook for rendering the Sankey Diagram
    useEffect(() => {
        if (visualizationType === 'sankey' && sankeyRef.current && totalIncome > 0) {
            const svg = d3.select(sankeyRef.current);
            svg.selectAll("*").remove(); // Clear previous rendering

            const parentContainer = svg.node()?.parentElement;
            const width = parentContainer?.getBoundingClientRect().width || 800;
            // Dynamic height based on number of nodes for better spacing
            const dynamicHeightFactor = 50; // Increased factor for more vertical space
            const baseHeight = 200; // Minimum height
            const numNodesInSankey = budgetItems.filter(item => item.type === 'expense' && (Number.parseFloat(item.value) || 0) > 0).length + 1 + (remainingBudget > 0 ? 1 : 0);
            const height = Math.max(baseHeight, numNodesInSankey * dynamicHeightFactor);

            svg.attr("viewBox", [0, 0, width, height])
                .attr("preserveAspectRatio", "xMinYMin meet"); // Ensure responsiveness

            // Define stable IDs for nodes
            const incomeNodeId = "income";
            const remainingNodeId = "remaining";

            // Filter expenses that have a value greater than 0 to be included in the Sankey
            const expenseItemsForSankey = budgetItems.filter(
                (item) => item.type === 'expense' && (Number.parseFloat(item.value) || 0) > 0
            );

            // Prepare nodes using stable IDs
            const nodesData: SankeyNodeData[] = [
                { id: incomeNodeId },
                ...expenseItemsForSankey.map((item) => ({ id: item.id })),
            ];
            if (remainingBudget > 0) {
                nodesData.push({ id: remainingNodeId });
            }

            // Prepare links using stable IDs
            const linksData = expenseItemsForSankey.map((item) => ({
                source: incomeNodeId,
                target: item.id,
                value: Number.parseFloat(item.value) || 0,
            } as unknown)) as SankeyLinkData[];
            if (remainingBudget > 0) {
                linksData.push({
                    source: incomeNodeId,
                    target: remainingNodeId,
                    value: remainingBudget,
                } as SankeyLink<SankeyNodeData, SankeyLinkData>);
            }

            // Create a map for easy lookup of display names and colors by their stable ID
            const itemDataMap = new Map<string, { name: string; color: string }>();
            budgetItems.forEach((item) => {
                itemDataMap.set(item.id, {
                    name: item.name || (item.type === 'income' ? 'Einkommen' : 'Unbenannte Ausgabe'),
                    color: getSankeyColor(item.color || 'bg-gray-500'),
                });
            });
            // Add special nodes for Sankey
            itemDataMap.set(remainingNodeId, { name: 'Verbleibend', color: '#2196F3' }); // Blue for remaining
            // Override income color for better visualization
            itemDataMap.set(incomeNodeId, { name: 'Einkommen', color: '#4CAF50' }); // Green for income

            const sankeyGenerator = sankey<SankeyNodeData, SankeyLinkData>()
                .nodeId((d: SankeyNodeData) => d.id)
                .nodeWidth(20) // Slightly wider nodes
                .nodePadding(15) // More padding between nodes
                .extent([[1, 1], [width - 1, height - 6]]);

            const { nodes, links } = sankeyGenerator({
                nodes: nodesData.map(d => ({ ...d })),
                links: linksData.map(d => ({ ...(d as SankeyLink<SankeyNodeData, SankeyLinkData>) })),
            });

            // --- Tooltip setup ---
            const tooltip = d3.select(tooltipRef.current)
                .style("position", "absolute")
                .style("visibility", "hidden")
                .style("background-color", "rgba(0,0,0,0.8)")
                .style("color", "white")
                .style("padding", "8px")
                .style("border-radius", "4px")
                .style("font-size", "12px")
                .style("pointer-events", "none"); // Important for mouse events to pass through

            // --- Highlighting functions ---
            function highlightPath(d: SankeyNodeData | SankeyLinkData | null, type: 'node' | 'link', highlight: boolean) {
                svg.selectAll<SVGPathElement, SankeyLinkData>(".sankey-link")
                  .transition()
                  .duration(200)
                  .style("stroke-opacity", (linkD) => {
                    if (highlight && d) {
                      if (type === 'node') {
                        const nodeData = d as SankeyNodeData;
                        return (linkD.source.id === nodeData.id || linkD.target.id === nodeData.id) ? 0.8 : 0.1;
                      } else {
                        const linkData = d as SankeyLinkData;
                        return (linkD.source.id === linkData.source.id && linkD.target.id === linkData.target.id) ? 0.8 : 0.1;
                      }
                    }
                    return 0.5;
                  });

                svg.selectAll<SVGRectElement, SankeyNodeData>(".sankey-node rect")
                  .transition()
                  .duration(200)
                  .style("fill-opacity", (nodeD) => {
                    if (highlight && d) {
                      if (type === 'node') {
                        const nodeData = d as SankeyNodeData;
                        return (
                          nodeD.id === nodeData.id ||
                          links.some(link => link.source.id === nodeD.id && link.target.id === nodeData.id) ||
                          links.some(link => link.target.id === nodeD.id && link.source.id === nodeData.id)
                        ) ? 1 : 0.5;
                      } else {
                        const linkData = d as SankeyLinkData;
                        return (nodeD.id === linkData.source.id || nodeD.id === linkData.target.id) ? 1 : 0.5;
                      }
                    }
                    return 0.9;
                  });
            }

            // Render links
            svg.append("g")
                .attr("fill", "none")
                .attr("stroke-opacity", 0.5)
                .selectAll("path")
                .data(links)
                .join("path")
                .attr("class", "sankey-link") // Add class for selection
                .attr("d", sankeyLinkHorizontal())
                .attr("stroke-width", (d) => Math.max(1, d.width || 0))
                .attr("stroke", (d) => {
                    const targetNode = d.target as SankeyNodeData;
                    return itemDataMap.get(targetNode.id)?.color || '#9CA3AF';
                })
                .on("mouseover", function(event: MouseEvent, d) {
                    highlightPath(d as SankeyLinkData, 'link', true);
                    tooltip.html(`<strong>${itemDataMap.get(d.source.id)?.name} &rarr; ${itemDataMap.get(d.target.id)?.name}</strong><br/>${(d.value || 0).toLocaleString()}€`)
                        .style("visibility", "visible")
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function() {
                    highlightPath(null, 'link', false); // Pass null to reset all
                    tooltip.style("visibility", "hidden");
                });

            // Render nodes
            const node = svg.append("g")
                .selectAll("g")
                .data(nodes)
                .join("g")
                .attr("class", "sankey-node") // Add class for selection
                .attr("transform", (d) => `translate(${d.x0 || 0},${d.y0 || 0})`)
                .on("mouseover", function(event: MouseEvent, d) {
                    highlightPath(d as SankeyNodeData, 'node', true);
                    tooltip.html(`<strong>${itemDataMap.get(d.id)?.name}</strong><br/>${(d.value || 0).toLocaleString()}€`)
                        .style("visibility", "visible")
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function() {
                    highlightPath(null, 'node', false); // Pass null to reset all
                    tooltip.style("visibility", "hidden");
                });

            node.append("rect")
                .attr("height", (d) => Math.max(0, (d.y1 || 0) - (d.y0 || 0)))
                .attr("width", (d) => (d.x1 || 0) - (d.x0 || 0))
                .attr("fill", (d) => itemDataMap.get(d.id)?.color || '#9CA3AF')
                .attr("stroke", "#333") // Add a subtle stroke
                .attr("stroke-width", 1)
                .style("cursor", "pointer"); // Indicate interactivity

            node.append("text")
                .attr("x", (d) => (d.x0 || 0) < width / 2 ? (d.x1 || 0) + 8 : (d.x0 || 0) - 8) // Adjusted offset
                .attr("y", (d) => ((d.y1 || 0) + (d.y0 || 0)) / 2)
                .attr("dy", "0.35em")
                .attr("text-anchor", (d) => (d.x0 || 0) < width / 2 ? "start" : "end")
                .text((d) => `${itemDataMap.get(d.id)?.name || d.id} (${(d.value || 0).toLocaleString()}€)`)
                .attr("fill", (d) => {
                    // Choose text color based on node color for better contrast
                    const nodeColor = itemDataMap.get(d.id)?.color;
                    if (nodeColor === '#F59E0B' || nodeColor === '#EC4899') { // Yellow or Pink
                        return '#333'; // Darker text for light colors
                    }
                    return "white"; // White text for darker colors
                })
                .attr("font-size", "14px") // Slightly larger font
                .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.6)"); // Add text shadow for readability

            // Handle window resize to redraw Sankey
            const handleResize = () => {
                // Trigger a re-render by updating a state that useEffect depends on
                // This is a simple way to force re-render, a more sophisticated way might involve
                // debouncing or throttling the resize event.
                setBudgetItems([...budgetItems]);
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);

        }
    }, [visualizationType, budgetItems, totalIncome, remainingBudget]);


    return (
        <div className="space-y-8 p-4 md:p-8 lg:p-12 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-inter">
            {/* Global styles for Inter font and Sankey diagram elements */}
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
                body { font-family: 'Inter', sans-serif; }
                .sankey-link {
                    fill: none;
                    transition: stroke-opacity 0.2s ease-in-out;
                }
                .sankey-node rect {
                    fill-opacity: 0.9;
                    shape-rendering: crispEdges;
                    transition: fill-opacity 0.2s ease-in-out;
                }
                .sankey-node text {
                    pointer-events: none;
                }
                `}
            </style>
            {/* Page Title and Description */}
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">Budgetanalyse</h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Analysieren Sie Ihr Budget mit KI-Unterstützung und erhalten Sie personalisierte Verbesserungsvorschläge.
                </p>
            </div>

            {/* Temporary message display (e.g., "Copied!") */}
            {message && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
                    {message}
                </div>
            )}

            {/* Tooltip div */}
            <div ref={tooltipRef} className="absolute z-[1001] hidden"></div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Form Card */}
                <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="flex items-center text-gray-900 dark:text-gray-50">
                            <Upload className="w-5 h-5 mr-2" />
                            Budget eingeben
                        </CardTitle>
                        <CardDescription className="dark:text-gray-400">Geben Sie Ihre monatlichen Einnahmen und Ausgaben ein</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {budgetItems.map((item) => (
                            <div key={item.id} className="flex items-end space-x-2">
                                <div className="flex-grow">
                                    {item.type === 'income' ? (
                                        <>
                                            <Label htmlFor={item.id}>{item.name} (€)</Label>
                                            <Input
                                                id={item.id}
                                                type="number"
                                                placeholder="3000"
                                                value={item.value}
                                                onChange={(e) => handleBudgetItemChange(item.id, "value", e.target.value)}
                                                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50"
                                            />
                                        </>
                                    ) : (
                                        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                                            <div className="flex-grow">
                                                <Label htmlFor={`name-${item.id}`}>Name der Ausgabe</Label>
                                                <Input
                                                    id={`name-${item.id}`}
                                                    type="text"
                                                    placeholder="Z.B. Abonnements"
                                                    value={item.name}
                                                    onChange={(e) => handleBudgetItemChange(item.id, "name", e.target.value)}
                                                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50"
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <Label htmlFor={`value-${item.id}`}>Betrag (€)</Label>
                                                <Input
                                                    id={`value-${item.id}`}
                                                    type="number"
                                                    placeholder="100"
                                                    value={item.value}
                                                    onChange={(e) => handleBudgetItemChange(item.id, "value", e.target.value)}
                                                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {item.isRemovable && (
                                    <Button onClick={() => removeBudgetItem(item.id)} variant="secondary" className="px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600">
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                        <div className="w-full flex justify-center items-center space-x-2">
                            <Button onClick={addBudgetItem} variant="secondary" className="flex-9/12 dark:bg-gray-700 dark:text-gray-50 dark:hover:bg-gray-600 dark:border-gray-600">
                                + Weitere Ausgabe hinzufügen
                            </Button>
                            <Button onClick={handleShare} className="flex 3/12 bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-600">
                                <Share2 className="w-4 h-4 mr-2" />
                                Share Config
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Visualization Card */}
                <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="flex items-center text-gray-900 dark:text-gray-50">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            Budget-Visualisierung
                        </CardTitle>
                        <CardDescription className="dark:text-gray-400">Visualisierung Ihrer Geldflüsse</CardDescription>
                        {/* Visualization Type Toggle */}
                        <div className="mt-4 flex items-center justify-center space-x-4">
                            <Label htmlFor="sankey-switch" className="dark:text-gray-400">Balkendiagramm</Label>
                            <Switch
                                id="sankey-switch"
                                checked={visualizationType === 'sankey'}
                                onCheckedChange={(checked) => setVisualizationType(checked ? 'sankey' : 'bar')}
                                className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300 dark:data-[state=checked]:bg-blue-500 dark:data-[state=unchecked]:bg-gray-600"
                            />
                            <Label htmlFor="sankey-switch" className="dark:text-gray-400">Sankey-Diagramm</Label>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {totalIncome > 0 ? (
                            <div className="space-y-4">
                                <div className="text-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Monatseinkommen: {totalIncome.toLocaleString()}€</h3>
                                </div>

                                {visualizationType === 'bar' ? (
                                    // Bar Chart Visualization
                                    <>
                                        {allExpensesForVisualization.map((expense, index) => {
                                            const percentage = totalIncome > 0 ? (expense.value / totalIncome) * 100 : 0;
                                            return (
                                                <div key={index} className="space-y-2">
                                                    <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                                                        <span>{expense.name}</span>
                                                        <span>
                                                            {expense.value.toLocaleString()}€ ({percentage.toFixed(1)}%)
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                                        <div
                                                            className={`h-3 rounded-full ${expense.color || 'bg-indigo-500'}`}
                                                            style={{ width: `${Math.min(percentage, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </>
                                ) : (
                                    // Sankey Diagram Visualization
                                    <div className={`flex flex-col items-center justify-center`}>
                                        <svg ref={sankeyRef} className="w-full h-auto"></svg>
                                        {remainingBudget < 0 && (
                                            <p className="text-red-600 dark:text-red-400 font-semibold mt-4">
                                                Budgetdefizit: {Math.abs(remainingBudget).toLocaleString()}€
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Remaining Budget Display */}
                                <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                                        <span>Verbleibendes Budget:</span>
                                        <span
                                            className={`font-semibold ${remainingBudget >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                                }`}
                                        >
                                            {remainingBudget.toLocaleString()}€
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Placeholder when no income is entered
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Geben Sie Ihr Einkommen ein, um die Visualisierung zu sehen</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* AI Analysis Instructions Card */}
            <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                    <CardTitle className="flex items-center text-gray-900 dark:text-gray-50 text-2xl">
                        <Sparkles className="w-5 h-5 mr-2" />
                        KI-Analyse nutzen:
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row items-center justify-between p-6">
                    <div className="prose max-w-none dark:text-gray-400 md:w-2/3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">KI-Analyse nutzen:</h3>
                        <p className="text-sm mb-4">
                            Um eine detaillierte Budgetanalyse von einer KI zu erhalten, gehen Sie wie folgt vor:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                            <li>
                                Geben Sie Ihre monatlichen Einnahmen und Ausgaben in die Felder auf der linken Seite ein.
                            </li>
                            <li>
                                Klicken Sie auf einen der Buttons unten, um einen optimierten Prompt für die jeweilige KI in Ihre Zwischenablage zu kopieren.
                            </li>
                            <li>
                                Öffnen Sie die Webseite oder App der ausgewählten KI (z.B. ChatGPT, Google Gemini, Claude).
                            </li>
                            <li>
                                Fügen Sie den kopierten Prompt in das Eingabefeld der KI ein und senden Sie ihn ab.
                            </li>
                            <li>
                                Die KI wird Ihnen dann eine personalisierte Budgetanalyse mit Verbesserungsvorschlägen liefern.
                            </li>
                        </ol>
                        <p className="text-sm mt-4">
                            Die Prompts sind so formuliert, dass sie die KI optimal anleiten, um eine relevante und strukturierte Antwort zu generieren.
                        </p>
                    </div>
                    <div className="md:w-1/3 flex justify-center items-center mt-6 md:mt-0">
                        {/* Placeholder image for AI illustration */}
                        <img
                            src="https://placehold.co/200x200/4a4a4a/ffffff?text=AI" // Darker background for dark mode compatibility
                            alt="AI Illustration"
                            width={200}
                            height={200}
                            className="object-contain rounded-full shadow-md"
                        />
                    </div>
                    {/* AI Prompt Buttons and Share Button */}
                    <div className="mt-6 flex flex-wrap gap-4 w-full justify-center md:justify-start">
                        <Button onClick={() => handleCopyPrompt('chatgpt')} variant="secondary" className="dark:bg-gray-700 dark:text-gray-50 dark:hover:bg-gray-600 dark:border-gray-600">
                            Prompt für ChatGPT kopieren
                        </Button>
                        <Button onClick={() => handleCopyPrompt('gemini')} variant="secondary" className="dark:bg-gray-700 dark:text-gray-50 dark:hover:bg-gray-600 dark:border-gray-600">
                            Prompt für Gemini kopieren
                        </Button>
                        <Button onClick={() => handleCopyPrompt('claude')} variant="secondary" className="dark:bg-gray-700 dark:text-gray-50 dark:hover:bg-gray-600 dark:border-gray-600">
                            Prompt für Claude kopieren
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Tip Alert */}
            <Alert className="bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription>
                    <strong>Tipp:</strong> Für die beste Analyse sollten Sie Ihre tatsächlichen monatlichen Durchschnittswerte
                    eingeben. Schauen Sie in Ihre Kontoauszüge der letzten 3 Monate für genaue Zahlen.
                </AlertDescription>
            </Alert>
        </div>
    );
}
