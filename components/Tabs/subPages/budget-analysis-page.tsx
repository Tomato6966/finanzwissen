"use client"

import { AlertCircle, Download, Sparkles, TrendingUp, Upload } from "lucide-react";
import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BudgetAnalysis() {
  const [budgetData, setBudgetData] = useState({
    income: "",
    housing: "",
    food: "",
    transportation: "",
    entertainment: "",
    savings: "",
    other: "",
  })

  const [analysis, setAnalysis] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setBudgetData((prev) => ({ ...prev, [field]: value }))
  }

  const generateAnalysis = async () => {
    setIsAnalyzing(true)

    // Simulate AI analysis
    setTimeout(() => {
      const income = Number.parseFloat(budgetData.income) || 0
      const totalExpenses =
        (Number.parseFloat(budgetData.housing) || 0) +
        (Number.parseFloat(budgetData.food) || 0) +
        (Number.parseFloat(budgetData.transportation) || 0) +
        (Number.parseFloat(budgetData.entertainment) || 0) +
        (Number.parseFloat(budgetData.other) || 0)

      const savings = Number.parseFloat(budgetData.savings) || 0
      const savingsRate = income > 0 ? (savings / income) * 100 : 0
      const housingRate = income > 0 ? ((Number.parseFloat(budgetData.housing) || 0) / income) * 100 : 0

      let level = "Anfänger"
      const recommendations = []

      if (savingsRate >= 20) {
        level = "Fortgeschritten"
        recommendations.push("Ausgezeichnete Sparquote! Erwägen Sie Investitionen in ETFs oder Aktien.")
      } else if (savingsRate >= 10) {
        level = "Gut"
        recommendations.push("Gute Sparquote. Versuchen Sie, diese auf 20% zu erhöhen.")
      } else {
        recommendations.push("Erhöhen Sie Ihre Sparquote auf mindestens 10% des Einkommens.")
      }

      if (housingRate > 30) {
        recommendations.push("Ihre Wohnkosten sind zu hoch (>30%). Suchen Sie nach günstigeren Alternativen.")
      }

      if (totalExpenses + savings > income) {
        recommendations.push("Sie geben mehr aus als Sie verdienen. Reduzieren Sie Ihre Ausgaben.")
      }

      const analysisText = `
**Ihr Finanz-Level: ${level}**

**Sparquote:** ${savingsRate.toFixed(1)}%
**Wohnkostenanteil:** ${housingRate.toFixed(1)}%

**Verbesserungsvorschläge:**
${recommendations.map((rec) => `• ${rec}`).join("\n")}

**Nächste Schritte:**
• Automatisieren Sie Ihre Sparpläne
• Überprüfen Sie regelmäßig Ihre Ausgaben
• Investieren Sie in Ihre finanzielle Bildung
      `

      setAnalysis(analysisText)
      setIsAnalyzing(false)
    }, 2000)
  }

  const totalIncome = Number.parseFloat(budgetData.income) || 0
  const expenses = [
    { name: "Wohnen", value: Number.parseFloat(budgetData.housing) || 0, color: "bg-blue-500" },
    { name: "Lebensmittel", value: Number.parseFloat(budgetData.food) || 0, color: "bg-green-500" },
    { name: "Transport", value: Number.parseFloat(budgetData.transportation) || 0, color: "bg-yellow-500" },
    { name: "Unterhaltung", value: Number.parseFloat(budgetData.entertainment) || 0, color: "bg-purple-500" },
    { name: "Sparen", value: Number.parseFloat(budgetData.savings) || 0, color: "bg-emerald-500" },
    { name: "Sonstiges", value: Number.parseFloat(budgetData.other) || 0, color: "bg-gray-500" },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Budgetanalyse</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Analysieren Sie Ihr Budget mit KI-Unterstützung und erhalten Sie personalisierte Verbesserungsvorschläge.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <Upload className="w-5 h-5 mr-2" />
              Budget eingeben
            </CardTitle>
            <CardDescription>Geben Sie Ihre monatlichen Einnahmen und Ausgaben ein</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="income">Monatliches Nettoeinkommen (€)</Label>
              <Input
                id="income"
                type="number"
                placeholder="3000"
                value={budgetData.income}
                onChange={(e) => handleInputChange("income", e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <Label htmlFor="housing">Wohnen (Miete, Nebenkosten) (€)</Label>
              <Input
                id="housing"
                type="number"
                placeholder="1000"
                value={budgetData.housing}
                onChange={(e) => handleInputChange("housing", e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <Label htmlFor="food">Lebensmittel (€)</Label>
              <Input
                id="food"
                type="number"
                placeholder="400"
                value={budgetData.food}
                onChange={(e) => handleInputChange("food", e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <Label htmlFor="transportation">Transport (€)</Label>
              <Input
                id="transportation"
                type="number"
                placeholder="200"
                value={budgetData.transportation}
                onChange={(e) => handleInputChange("transportation", e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <Label htmlFor="entertainment">Unterhaltung & Freizeit (€)</Label>
              <Input
                id="entertainment"
                type="number"
                placeholder="300"
                value={budgetData.entertainment}
                onChange={(e) => handleInputChange("entertainment", e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <Label htmlFor="savings">Sparen & Investieren (€)</Label>
              <Input
                id="savings"
                type="number"
                placeholder="500"
                value={budgetData.savings}
                onChange={(e) => handleInputChange("savings", e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <Label htmlFor="other">Sonstiges (€)</Label>
              <Input
                id="other"
                type="number"
                placeholder="200"
                value={budgetData.other}
                onChange={(e) => handleInputChange("other", e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <Button onClick={generateAnalysis} className="w-full" disabled={isAnalyzing || !budgetData.income}>
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analysiere...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  KI-Analyse starten
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Sankey Diagram Visualization */}
        <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <TrendingUp className="w-5 h-5 mr-2" />
              Budget-Visualisierung
            </CardTitle>
            <CardDescription>Sankey-Diagramm Ihrer Geldflüsse</CardDescription>
          </CardHeader>
          <CardContent>
            {totalIncome > 0 ? (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold">Monatseinkommen: {totalIncome.toLocaleString()}€</h3>
                </div>

                {expenses.map((expense, index) => {
                  const percentage = totalIncome > 0 ? (expense.value / totalIncome) * 100 : 0
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{expense.name}</span>
                        <span>
                          {expense.value.toLocaleString()}€ ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${expense.color}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Verbleibendes Budget:</span>
                    <span
                      className={`font-semibold ${
                        totalIncome - expenses.reduce((sum, exp) => sum + exp.value, 0) >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {(totalIncome - expenses.reduce((sum, exp) => sum + exp.value, 0)).toLocaleString()}€
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Geben Sie Ihr Einkommen ein, um die Visualisierung zu sehen</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis Results */}
      <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900 dark:text-white">
            <Sparkles className="w-5 h-5 mr-2" />
            KI-Analyse Ergebnisse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">{analysis}</pre>
          </div>

          <div className="mt-6 flex gap-4">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Analyse herunterladen
            </Button>
            <Button variant="outline">Detaillierten Report erstellen</Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Tipp:</strong> Für die beste Analyse sollten Sie Ihre tatsächlichen monatlichen Durchschnittswerte
          eingeben. Schauen Sie in Ihre Kontoauszüge der letzten 3 Monate für genaue Zahlen.
        </AlertDescription>
      </Alert>
    </div>
  )
}
