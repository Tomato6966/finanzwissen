"use client"

import type React from "react"

import { Calculator, GraduationCap, Home, PiggyBank, TrendingUp } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Calculators() {
  const [compoundResult, setCompoundResult] = useState<number | null>(null)
  const [loanResult, setLoanResult] = useState<{ monthly: number; total: number } | null>(null)
  const [retirementResult, setRetirementResult] = useState<number | null>(null)

  const calculateCompoundInterest = (principal: number, rate: number, time: number, compound: number) => {
    return principal * Math.pow(1 + rate / compound, compound * time)
  }

  const calculateLoan = (principal: number, rate: number, years: number) => {
    const monthlyRate = rate / 12 / 100
    const numPayments = years * 12
    const monthly =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    return {
      monthly: monthly,
      total: monthly * numPayments,
    }
  }

  const handleCompoundCalculation = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const principal = Number.parseFloat(formData.get("principal") as string) || 0
    const rate = Number.parseFloat(formData.get("rate") as string) / 100 || 0
    const time = Number.parseFloat(formData.get("time") as string) || 0
    const compound = Number.parseFloat(formData.get("compound") as string) || 1

    const result = calculateCompoundInterest(principal, rate, time, compound)
    setCompoundResult(result)
  }

  const handleLoanCalculation = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const principal = Number.parseFloat(formData.get("loanAmount") as string) || 0
    const rate = Number.parseFloat(formData.get("loanRate") as string) || 0
    const years = Number.parseFloat(formData.get("loanYears") as string) || 0

    if (principal > 0 && rate > 0 && years > 0) {
      const result = calculateLoan(principal, rate, years)
      setLoanResult(result)
    }
  }

  const handleRetirementCalculation = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const currentAge = Number.parseFloat(formData.get("currentAge") as string) || 0
    const retirementAge = Number.parseFloat(formData.get("retirementAge") as string) || 67
    const monthlyContribution = Number.parseFloat(formData.get("monthlyContribution") as string) || 0
    const expectedReturn = Number.parseFloat(formData.get("expectedReturn") as string) / 100 || 0.07

    const years = retirementAge - currentAge
    const months = years * 12
    const monthlyReturn = expectedReturn / 12

    // Future value of annuity formula
    const futureValue = monthlyContribution * ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn)

    setRetirementResult(futureValue)
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Finanzrechner</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Nutzen Sie unsere Rechner für wichtige finanzielle Entscheidungen und Planungen.
        </p>
      </div>

      <Tabs defaultValue="compound" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="compound" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Zinseszins</span>
          </TabsTrigger>
          <TabsTrigger value="loan" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Kredit</span>
          </TabsTrigger>
          <TabsTrigger value="retirement" className="flex items-center gap-2">
            <PiggyBank className="w-4 h-4" />
            <span className="hidden sm:inline">Rente</span>
          </TabsTrigger>
          <TabsTrigger value="savings" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            <span className="hidden sm:inline">Sparziel</span>
          </TabsTrigger>
          <TabsTrigger value="investment" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <span className="hidden sm:inline">Investment</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compound" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Zinseszinsrechner
              </CardTitle>
              <CardDescription>Berechnen Sie, wie sich Ihr Geld über Zeit mit Zinseszins entwickelt</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-8">
                <form onSubmit={handleCompoundCalculation} className="space-y-4">
                  <div>
                    <Label htmlFor="principal">Anfangskapital (€)</Label>
                    <Input id="principal" name="principal" type="number" placeholder="10000" required />
                  </div>

                  <div>
                    <Label htmlFor="rate">Jährlicher Zinssatz (%)</Label>
                    <Input id="rate" name="rate" type="number" step="0.1" placeholder="7" required />
                  </div>

                  <div>
                    <Label htmlFor="time">Anlagedauer (Jahre)</Label>
                    <Input id="time" name="time" type="number" placeholder="20" required />
                  </div>

                  <div>
                    <Label htmlFor="compound">Zinszahlungen pro Jahr</Label>
                    <Input id="compound" name="compound" type="number" placeholder="1" defaultValue="1" required />
                  </div>

                  <Button type="submit" className="w-full">
                    Berechnen
                  </Button>
                </form>

                {compoundResult && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Ergebnis:</h3>
                    <div className="p-6 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {compoundResult.toLocaleString("de-DE", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </div>
                      <p className="text-sm text-gray-600">Endwert nach Zinseszins</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="font-semibold">Gewinn:</div>
                        <div className="text-green-600">
                          +
                          {(compoundResult - 10000).toLocaleString("de-DE", {
                            style: "currency",
                            currency: "EUR",
                          })}
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="font-semibold">Rendite:</div>
                        <div className="text-blue-600">{(((compoundResult - 10000) / 10000) * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loan" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="w-5 h-5 mr-2" />
                Kreditrechner
              </CardTitle>
              <CardDescription>Berechnen Sie Ihre monatliche Rate und Gesamtkosten für einen Kredit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-8">
                <form onSubmit={handleLoanCalculation} className="space-y-4">
                  <div>
                    <Label htmlFor="loanAmount">Kreditsumme (€)</Label>
                    <Input id="loanAmount" name="loanAmount" type="number" placeholder="200000" required />
                  </div>

                  <div>
                    <Label htmlFor="loanRate">Zinssatz pro Jahr (%)</Label>
                    <Input id="loanRate" name="loanRate" type="number" step="0.01" placeholder="3.5" required />
                  </div>

                  <div>
                    <Label htmlFor="loanYears">Laufzeit (Jahre)</Label>
                    <Input id="loanYears" name="loanYears" type="number" placeholder="20" required />
                  </div>

                  <Button type="submit" className="w-full">
                    Berechnen
                  </Button>
                </form>

                {loanResult && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Ergebnis:</h3>
                    <div className="p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {loanResult.monthly.toLocaleString("de-DE", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </div>
                      <p className="text-sm text-gray-600">Monatliche Rate</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 text-sm">
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="font-semibold">Gesamtkosten:</div>
                        <div className="text-red-600">
                          {loanResult.total.toLocaleString("de-DE", {
                            style: "currency",
                            currency: "EUR",
                          })}
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="font-semibold">Zinsen gesamt:</div>
                        <div className="text-orange-600">
                          {(loanResult.total - 200000).toLocaleString("de-DE", {
                            style: "currency",
                            currency: "EUR",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retirement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PiggyBank className="w-5 h-5 mr-2" />
                Rentenrechner
              </CardTitle>
              <CardDescription>Berechnen Sie Ihr Rentenvermögen bei regelmäßigen Einzahlungen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-8">
                <form onSubmit={handleRetirementCalculation} className="space-y-4">
                  <div>
                    <Label htmlFor="currentAge">Aktuelles Alter</Label>
                    <Input id="currentAge" name="currentAge" type="number" placeholder="30" required />
                  </div>

                  <div>
                    <Label htmlFor="retirementAge">Rentenalter</Label>
                    <Input
                      id="retirementAge"
                      name="retirementAge"
                      type="number"
                      placeholder="67"
                      defaultValue="67"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="monthlyContribution">Monatliche Einzahlung (€)</Label>
                    <Input
                      id="monthlyContribution"
                      name="monthlyContribution"
                      type="number"
                      placeholder="500"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="expectedReturn">Erwartete jährliche Rendite (%)</Label>
                    <Input
                      id="expectedReturn"
                      name="expectedReturn"
                      type="number"
                      step="0.1"
                      placeholder="7"
                      defaultValue="7"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Berechnen
                  </Button>
                </form>

                {retirementResult && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Ergebnis:</h3>
                    <div className="p-6 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {retirementResult.toLocaleString("de-DE", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </div>
                      <p className="text-sm text-gray-600">Rentenvermögen bei Renteneintritt</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 text-sm">
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="font-semibold">Eingezahlt gesamt:</div>
                        <div className="text-blue-600">
                          {(500 * 12 * (67 - 30)).toLocaleString("de-DE", {
                            style: "currency",
                            currency: "EUR",
                          })}
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="font-semibold">Zinserträge:</div>
                        <div className="text-green-600">
                          +
                          {(retirementResult - 500 * 12 * (67 - 30)).toLocaleString("de-DE", {
                            style: "currency",
                            currency: "EUR",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="savings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Sparzielrechner
              </CardTitle>
              <CardDescription>
                Kommende Funktion: Berechnen Sie, wie viel Sie sparen müssen, um Ihr Ziel zu erreichen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Bald verfügbar</h3>
                <p>Dieser Rechner wird in Kürze hinzugefügt.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Investment-Rechner
              </CardTitle>
              <CardDescription>Kommende Funktion: Analysieren Sie verschiedene Investmentstrategien</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Bald verfügbar</h3>
                <p>Dieser Rechner wird in Kürze hinzugefügt.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
