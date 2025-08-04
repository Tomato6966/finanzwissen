"use client"

import {
	BarChart3, Calculator, Download, ExternalLink, FileText, Lightbulb, PieChart, Shield, Target,
	TrendingUp
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ToolsPage() {
  const templates = [
    {
      title: "Haushaltsplan Excel-Vorlage",
      description: "Umfassende Excel-Vorlage zur Verwaltung Ihrer monatlichen Einnahmen und Ausgaben",
      category: "Budgetplanung",
      format: "Excel (.xlsx)",
      image: "/placeholder.svg?height=200&width=300",
      downloadUrl: "#",
      features: ["Automatische Berechnungen", "Kategorisierung", "Grafische Auswertung"],
    },
    {
      title: "Notgroschen-Rechner",
      description: "Berechnen Sie die optimale Höhe Ihres Notgroschens basierend auf Ihren Ausgaben",
      category: "Notfallplanung",
      format: "Excel (.xlsx)",
      image: "/placeholder.svg?height=200&width=300",
      downloadUrl: "#",
      features: ["Personalisierte Berechnung", "Szenario-Analyse", "Sparziel-Tracking"],
    },
    {
      title: "Schulden-Tilgungsplan",
      description: "Strategische Planung zur optimalen Tilgung Ihrer Schulden",
      category: "Schuldenmanagement",
      format: "Excel (.xlsx)",
      image: "/placeholder.svg?height=200&width=300",
      downloadUrl: "#",
      features: ["Schneeball-Methode", "Avalanche-Methode", "Zinseinsparungen"],
    },
    {
      title: "Investment-Tracker",
      description: "Verfolgen Sie Ihre Investitionen und deren Performance über Zeit",
      category: "Investieren",
      format: "Excel (.xlsx)",
      image: "/placeholder.svg?height=200&width=300",
      downloadUrl: "#",
      features: ["Portfolio-Übersicht", "Performance-Tracking", "Diversifikations-Analyse"],
    },
    {
      title: "Finanzielle Ziele Planer",
      description: "SMART-Ziele definieren und den Fortschritt verfolgen",
      category: "Zielsetzung",
      format: "PDF + Excel",
      image: "/placeholder.svg?height=200&width=300",
      downloadUrl: "#",
      features: ["SMART-Kriterien", "Meilenstein-Tracking", "Motivations-Tools"],
    },
    {
      title: "Renten-Rechner Deluxe",
      description: "Detaillierte Rentenplanung mit verschiedenen Szenarien",
      category: "Altersvorsorge",
      format: "Excel (.xlsx)",
      image: "/placeholder.svg?height=200&width=300",
      downloadUrl: "#",
      features: ["Mehrere Szenarien", "Inflationsberücksichtigung", "Grafische Darstellung"],
    },
  ]

  const webTools = [
    {
      title: "KI-Budget-Analyzer",
      description: "Lassen Sie Ihr Budget von künstlicher Intelligenz analysieren",
      icon: BarChart3,
      href: "#budget-analysis",
      color: "bg-blue-500",
      features: ["Sankey-Diagramm", "Personalisierte Tipps", "Verbesserungsvorschläge"],
    },
    {
      title: "Zinseszins-Rechner",
      description: "Berechnen Sie die Macht des Zinseszinses für Ihre Investments",
      icon: TrendingUp,
      href: "#calculators",
      color: "bg-green-500",
      features: ["Verschiedene Szenarien", "Grafische Darstellung", "Export-Funktion"],
    },
    {
      title: "Kredit-Vergleichsrechner",
      description: "Vergleichen Sie verschiedene Kreditangebote und finden Sie das beste",
      icon: Calculator,
      href: "#calculators",
      color: "bg-purple-500",
      features: ["Mehrere Angebote", "Gesamtkosten-Vergleich", "Tilgungsplan"],
    },
    {
      title: "ETF-Sparplan Simulator",
      description: "Simulieren Sie verschiedene ETF-Sparpläne und deren Entwicklung",
      icon: PieChart,
      href: "#calculators",
      color: "bg-orange-500",
      features: ["Historische Daten", "Verschiedene ETFs", "Risiko-Analyse"],
    },
  ]

  const resources = [
    {
      title: "Finanz-Checklisten",
      description: "Praktische Checklisten für verschiedene finanzielle Situationen",
      items: [
        "Erste Wohnung Checkliste",
        "Gehaltsverhandlung Vorbereitung",
        "Steuererklärung Hilfe",
        "Versicherungs-Check",
      ],
    },
    {
      title: "Vorlagen & Formulare",
      description: "Professionelle Vorlagen für Ihre finanziellen Dokumente",
      items: ["Haushaltsplan Vorlage", "Ausgaben-Tracker", "Sparziel-Planer", "Investment-Journal"],
    },
    {
      title: "Lernmaterialien",
      description: "Zusätzliche Ressourcen zur Vertiefung Ihres Finanzwissens",
      items: ["Glossar Finanzbegriffe", "FAQ Sammlung", "Video-Tutorials", "Podcast-Empfehlungen"],
    },
  ]

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Tools & Ressourcen</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Praktische Tools, Vorlagen und Rechner für Ihre finanzielle Planung. Alle Ressourcen sind kostenlos und sofort
          einsatzbereit.
        </p>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Vorlagen & Downloads
          </TabsTrigger>
          <TabsTrigger value="webtools" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Online-Tools
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Zusätzliche Ressourcen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 group overflow-hidden hover:bg-gradient-to-br hover:from-blue-500/30 hover:to-purple-500/30">
                <div className="relative overflow-hidden">
                  <img
                    src={template.image || "/placeholder.svg"}
                    alt={template.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-white/90 text-gray-900">{template.category}</Badge>
                  <Badge className="absolute top-3 right-3 bg-blue-600 text-white">{template.format}</Badge>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {template.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">{template.description}</CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3 mb-4">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Features:</h4>
                    <ul className="space-y-1">
                      {template.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Herunterladen
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webtools" className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            {webTools.map((tool, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 group hover:bg-gradient-to-br hover:from-blue-500/30 hover:to-purple-500/30">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <tool.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {tool.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300">{tool.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3 mb-4">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Features:</h4>
                    <ul className="space-y-1">
                      {tool.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full">
                    Tool öffnen
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-500/30 hover:to-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    {resource.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">{resource.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2">
                    {resource.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="text-sm text-gray-600 dark:text-gray-300 flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    Alle anzeigen
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Popular Downloads Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Beliebteste Downloads</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Die am häufigsten heruntergeladenen Tools unserer Community
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Haushaltsplan</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Excel-Vorlage</p>
            <Button size="sm" className="w-full">
              <Download className="w-3 h-3 mr-1" />
              Download
            </Button>
          </div>

          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Sparziel-Planer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">PDF + Excel</p>
            <Button size="sm" className="w-full">
              <Download className="w-3 h-3 mr-1" />
              Download
            </Button>
          </div>

          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Investment-Tracker</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Excel-Vorlage</p>
            <Button size="sm" className="w-full">
              <Download className="w-3 h-3 mr-1" />
              Download
            </Button>
          </div>

          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Notgroschen-Rechner</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Excel-Vorlage</p>
            <Button size="sm" className="w-full">
              <Download className="w-3 h-3 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
