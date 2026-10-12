"use client";

import {
  AlertTriangle,
  ArrowRight,
  BarChart2,
  BookOpen,
  CandlestickChart,
  CheckCircle,
  ExternalLink,
  Flame,
  Globe2,
  Layers,
  LineChart,
  Percent,
  PieChart,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LinkButton from "@/components/ui/linkButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Trading categories and comprehensive educational insights
const tradingInstruments = [
  {
    title: "Aktien & Equities",
    risk: "Mittel – Hoch",
    horizon: "Tage bis Wochen (Swing)",
    desc: "Kauf und Verkauf börsennotierter Unternehmensanteile. Fokus auf Quartalszahlen, Momentum und Liquidität.",
    icon: LineChart,
    badge: "Klassiker",
    color: "from-blue-500/15 to-indigo-500/15 border-blue-500/30",
  },
  {
    title: "ETFs & Index-Trading",
    risk: "Moderat",
    horizon: "Wochen bis Monate",
    desc: "Handel auf ganze Marktsektoren (z.B. S&P 500, Nasdaq-100, DAX) oder Rohstoff-Körbe ohne Einzeltitelrisiko.",
    icon: PieChart,
    badge: "Breite Streuung",
    color: "from-emerald-500/15 to-teal-500/15 border-emerald-500/30",
  },
  {
    title: "Derivate & Knock-Outs",
    risk: "Sehr Hoch",
    horizon: "Intraday / Stunden",
    desc: "Hebelprodukte (Zertifikate, Optionsscheine, CFDs). Ermöglicht Long- & Short-Wetten mit extremem Hebel und Totalverlustrisiko.",
    icon: Zap,
    badge: "Hebelprodukt",
    color: "from-amber-500/15 to-orange-500/15 border-amber-500/30",
  },
  {
    title: "Kryptowährungen",
    risk: "Sehr Hoch",
    horizon: "24/7 Markt",
    desc: "Extrem volatile digitale Vermögenswerte (BTC, ETH, Altcoins). Hohe Liquidität, aber regulatorische und Marktrisiken.",
    icon: Flame,
    badge: "24/7 Volatilität",
    color: "from-purple-500/15 to-pink-500/15 border-purple-500/30",
  },
];

const goldenRules = [
  {
    title: "1 % Risiko-Regel",
    text: "Riskiere niemals mehr als 1 % bis 2 % deines Gesamtkapitals auf einen einzelnen Trade. Position-Sizing schützt dein Überleben.",
    icon: Percent,
  },
  {
    title: "Stop-Loss ist Pflicht",
    text: "Definiere den Ausstiegspunkt vor dem Einstieg. Verharre niemals in hoffnungsvollen Verlustpositionen.",
    icon: ShieldAlert,
  },
  {
    title: "Chance-Risiko-Verhältnis (CRV)",
    text: "Gehe nur Trades ein, bei denen das Kurspotenzial mindestens das 2-fache des gesetzten Verlustrisikos beträgt (CRV ≥ 2:1).",
    icon: TrendingUp,
  },
  {
    title: "Trading-Tagebuch",
    text: "Dokumentiere Setup, Emotion, Einstieg, Exit und Learnings. Ohne Feedbackschleife gibt es keine statistische Verbesserung.",
    icon: BookOpen,
  },
];

const indicatorsGuide = [
  {
    name: "RSI (Relative Strength Index)",
    category: "Oszillator",
    use: "Misst Momentum & Überkauft/Überverkauft-Zonen (typisch: >70 überkauft, <30 überverkauft).",
    warning: "In starken Trends kann der RSI extrem lange überkauft bleiben.",
  },
  {
    name: "MACD (Moving Average Convergence)",
    category: "Trendfolge",
    use: "Signalisiert Trendwechsel durch Kreuzungen der Signallinie und Divergenzen zum Kursverlauf.",
    warning: "Hinkt in seitwärts laufenden Märkten (Chop) hinterher.",
  },
  {
    name: "EMA 20 / 50 / 200",
    category: "Gleitende Durchschnitte",
    use: "Dynamische Unterstützungs-/Widerstandszonen und Bestimmung des übergeordneten Haupttrends.",
    warning: "Wirkt als Orientierung für viele Marktteilnehmer – keine Garantie.",
  },
  {
    name: "Volumen & VWAP",
    category: "Volumen",
    use: "Zeigt, auf welchen Preisniveaus institutionelle Akteure signifikante Positionen aufbauen.",
    warning: "Ohne Volumensbestätigung sind Ausbrüche oft Bullen-/Bärenfallen.",
  },
];

const tradingTools = [
  {
    name: "TradingView",
    category: "Charting & Screeners",
    desc: "Weltstandard für Chartanalysen, Indikatoren, Watchlists und Paper Trading.",
    href: "https://www.tradingview.com/",
    badge: "Must-Have",
  },
  {
    name: "TradingTerminal",
    category: "Marktübersicht",
    desc: "Echtzeit-Nachrichten, Heatmaps, Earnings-Kalender und Screener für Trader.",
    href: "https://tradingterminal.com/",
    badge: "News & Data",
  },
  {
    name: "stock3 (ehemals GodmodeTrader)",
    category: "DACH-Markt",
    desc: "Sehr beliebte deutsche Plattform für Charting, Expertenanalysen und Derivate-Suche.",
    href: "https://stock3.com/",
    badge: "DACH",
  },
  {
    name: "Finviz",
    category: "Aktien-Screener",
    desc: "Leistungsstarker US-Aktien-Screener mit Sektoren-Heatmaps und Fundamentalfiltern.",
    href: "https://finviz.com/",
    badge: "Free Screener",
  },
];

export default function TradingPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-10 sm:space-y-14 py-4 sm:py-6">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-b from-card/80 to-card/40 p-6 sm:p-10 md:p-12 shadow-xl backdrop-blur-md">
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative max-w-3xl space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <CandlestickChart className="h-3.5 w-3.5" />
            <span>Markt-Know-How & Analyse</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Trading-Informationen, <br />
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-amber-500 bg-clip-text text-transparent">
              Risikomanagement & Märkte.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Trading unterscheidet sich grundlegend von passivem Buy-and-Hold: Hier stehen
            Wahrscheinlichkeiten, striktes Risikomanagement und Marktpsychologie im Mittelpunkt.
            Verstehe die Instrumente, Regeln und Werkzeuge, bevor du Kapital riskierst.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              onClick={() => setActiveTab("rules")}
              className="gap-2 bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
            >
              <ShieldAlert className="h-4 w-4" />
              Risiko-Regeln
            </Button>
            <Button
              onClick={() => setActiveTab("tools")}
              variant="outline"
              className="gap-2 border-border/80 hover:bg-accent"
            >
              <BarChart2 className="h-4 w-4" />
              Trading-Tools
            </Button>
          </div>
        </div>

        {/* RISK WARNING BANNER */}
        <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 text-amber-900 dark:text-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="text-sm space-y-1">
              <strong className="font-semibold text-amber-950 dark:text-amber-100">
                Wichtiger Risikohinweis zum Trading:
              </strong>
              <p className="opacity-90 leading-relaxed">
                Der Handel mit Finanzinstrumenten (insbesondere mit Hebel, CFDs oder Derivaten)
                birgt erhebliche Risiken und kann zum vollständigen Verlust des eingesetzten Kapitals
                führen. Statistiken zeigen, dass zwischen 70 % und 80 % der Privatanleger beim aktiven
                Trading Geld verlieren. Die hier bereitgestellten Inhalte dienen ausschließlich der
                Bildung und stellen keine Anlageberatung dar.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TABS NAVIGATION */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full max-w-2xl mx-auto h-auto p-1.5 bg-muted/70 rounded-xl">
          <TabsTrigger value="overview" className="py-2.5 text-xs sm:text-sm font-medium">
            Instrumente
          </TabsTrigger>
          <TabsTrigger value="rules" className="py-2.5 text-xs sm:text-sm font-medium">
            Risikomanagement
          </TabsTrigger>
          <TabsTrigger value="indicators" className="py-2.5 text-xs sm:text-sm font-medium">
            Indikatoren & Setups
          </TabsTrigger>
          <TabsTrigger value="tools" className="py-2.5 text-xs sm:text-sm font-medium">
            Plattformen & Tools
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: INSTRUMENTS */}
        <TabsContent value="overview" className="mt-8 space-y-8 outline-none">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Handelbare Instrumente im Überblick</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Jede Assetklasse verhält sich anders in Bezug auf Volatilität, Kostenstruktur und Risikoprofil.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tradingInstruments.map((item) => (
              <Card
                key={item.title}
                className={`relative overflow-hidden border bg-gradient-to-br ${item.color} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="rounded-lg bg-card/80 p-2.5 shadow-xs">
                      <item.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <Badge variant="secondary" className="text-[11px] font-semibold">
                      {item.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-3">{item.title}</CardTitle>
                  <CardDescription className="text-xs">
                    Zeithorizont: {item.horizon}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Risikograd:</span>
                    <span className="font-semibold text-foreground">{item.risk}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* TRADING VS INVESTING COMPARISON TABLE */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Der fundamentale Unterschied: Investieren vs. Trading
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground">
                    <th className="py-3 px-4 font-semibold">Merkmal</th>
                    <th className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">Langfristiges Investieren</th>
                    <th className="py-3 px-4 font-semibold text-indigo-600 dark:text-indigo-400">Aktives Trading</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  <tr>
                    <td className="py-3 px-4 font-medium">Zeithorizont</td>
                    <td className="py-3 px-4 text-muted-foreground">Jahre bis Jahrzehnte (Buy & Hold)</td>
                    <td className="py-3 px-4 text-muted-foreground">Minuten, Stunden, Tage bis Wochen</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Ertragsquelle</td>
                    <td className="py-3 px-4 text-muted-foreground">Wirtschaftswachstum, Dividenden, Reinvestition</td>
                    <td className="py-3 px-4 text-muted-foreground">Kursschwankungen & Volatilität (Long & Short)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Zeitaufwand</td>
                    <td className="py-3 px-4 text-muted-foreground">Passiv / 1–2 Stunden pro Quartal</td>
                    <td className="py-3 px-4 text-muted-foreground">Aktiv / Mehrere Stunden täglich oder wöchentlich</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Steuern & Gebühren</td>
                    <td className="py-3 px-4 text-muted-foreground">Steuerstundung, minimale Transaktionskosten</td>
                    <td className="py-3 px-4 text-muted-foreground">Häufige Realisierung (Spreads, Ordergebühren, Steuer)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Psychologie</td>
                    <td className="py-3 px-4 text-muted-foreground">Ruhe & Geduld (Aussitzen von Markttiefs)</td>
                    <td className="py-3 px-4 text-muted-foreground">Disziplin, schnelles Verlust-Schneiden, Emotionslosigkeit</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: RISK MANAGEMENT */}
        <TabsContent value="rules" className="mt-8 space-y-8 outline-none">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Die 4 Goldenen Gesetze des Risikomanagements</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Erfolgreiche Trader zeichnen sich nicht durch die höchste Trefferquote aus, sondern durch striktes Risikomanagement.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {goldenRules.map((rule, idx) => (
              <Card key={rule.title} className="border border-border/60 bg-card/60 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                      <rule.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{rule.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{rule.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CRV MATH BOX */}
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Percent className="h-5 w-5 text-primary" />
              Mathematische Realität: Trefferquote vs. CRV
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Selbst mit einer scheinbar niedrigen Trefferquote von nur <strong>40 %</strong> bist du
              hochprofitabel, wenn dein durchschnittlicher Gewinn doppelt so hoch ist wie dein Verlust (CRV 2:1):
            </p>
            <div className="grid gap-3 sm:grid-cols-3 pt-2">
              <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
                <span className="text-xs text-muted-foreground block">10 Trades mit 100 € Risiko</span>
                <span className="text-xl font-bold text-foreground mt-1 block">4 Gewinner / 6 Verlierer</span>
              </div>
              <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
                <span className="text-xs text-muted-foreground block">Gewinnsumme (4 × 200 €)</span>
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">+800 €</span>
              </div>
              <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
                <span className="text-xs text-muted-foreground block">Netto-Ergebnis (nach 6 × -100 €)</span>
                <span className="text-xl font-bold text-primary mt-1 block">+200 € Profit</span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: INDICATORS */}
        <TabsContent value="indicators" className="mt-8 space-y-8 outline-none">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Populäre technische Indikatoren</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Indikatoren sind Ableitungen von Preis und Volumen. Verwende sie als Filter, nicht als blinde Kaufgarantie.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {indicatorsGuide.map((ind) => (
              <Card key={ind.name} className="border border-border/60 bg-card/60 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {ind.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-base mt-2">{ind.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-foreground leading-relaxed">
                    <strong className="text-muted-foreground text-xs uppercase block mb-0.5">Einsatz:</strong>
                    {ind.use}
                  </p>
                  <p className="text-amber-800 dark:text-amber-300 bg-amber-500/10 p-2.5 rounded-lg text-xs leading-relaxed">
                    <strong className="block font-semibold">Fallstrick:</strong>
                    {ind.warning}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 4: PLATFORMS & TOOLS */}
        <TabsContent value="tools" className="mt-8 space-y-8 outline-none">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Empfohlene Trading-Plattformen & Screener</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Professionelle Chart-Software und Marktübersichten für fundierte Marktanalysen.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tradingTools.map((tool) => (
              <Card key={tool.name} className="flex flex-col border border-border/60 bg-card hover:border-primary/40 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {tool.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                  <CardDescription className="text-xs">{tool.category}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">{tool.desc}</p>
                  <LinkButton
                    href={tool.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    className="w-full justify-center text-xs gap-1.5"
                  >
                    <span>Plattform öffnen</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </LinkButton>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* BACKLINK TO CALCULATORS */}
          <div className="rounded-2xl border border-border/60 bg-muted/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-semibold text-foreground">Ergänzende Rechner & Szenarien</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Nutze unsere Monte-Carlo-Simulation und den Zinseszins-Rechner, um statistische Verteilungen zu simulieren.
              </p>
            </div>
            <LinkButton href="/calculators#montecarlo" className="shrink-0 gap-2">
              <span>Zu den Rechnern</span>
              <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
