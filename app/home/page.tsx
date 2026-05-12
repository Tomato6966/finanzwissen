"use client";

import {
  ArrowRight,
  Banknote,
  BarChart3,
  BookOpen,
  Brain,
  Calculator,
  ExternalLink,
  Flame,
  Gauge,
  Home,
  Landmark,
  LineChart,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  TimerReset,
  TrendingDown,
  TrendingUp,
  WandSparkles,
} from "lucide-react";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LinkButton from "@/components/ui/linkButton";

const featuredTools = [
  {
    title: "Parqet",
    description: "Portfolio-Tracker für Aktien, ETFs und Kryptos",
    category: "Portfolio-Tracker",
    accent: "text-blue-500",
    bgAccent: "bg-blue-500/10",
    borderAccent: "hover:border-blue-500/30",
    icon: BarChart3,
    href: "https://parqet.com/",
  },
  {
    title: "Scalable Capital",
    description: "Neo-Broker mit breitem ETF-Angebot und Sparplänen",
    category: "Broker",
    accent: "text-emerald-500",
    bgAccent: "bg-emerald-500/10",
    borderAccent: "hover:border-emerald-500/30",
    icon: Banknote,
    href: "https://scalable.capital/",
  },
  {
    title: "JustETF",
    description: "Datenbank und Vergleichstools für ETFs",
    category: "ETF Analyse",
    accent: "text-purple-500",
    bgAccent: "bg-purple-500/10",
    borderAccent: "hover:border-purple-500/30",
    icon: TrendingUp,
    href: "https://www.justetf.com/",
  },
  {
    title: "YNAB",
    description: "Zero-Based-Budgeting für deine Finanzen",
    category: "Budget-Tracker",
    accent: "text-rose-500",
    bgAccent: "bg-rose-500/10",
    borderAccent: "hover:border-rose-500/30",
    icon: Calculator,
    href: "https://www.youneedabudget.com/",
  },
  {
    title: "FIRE Simulator",
    description: "Wann kannst du in Rente gehen? Simulationen",
    category: "Simulation",
    accent: "text-orange-500",
    bgAccent: "bg-orange-500/10",
    borderAccent: "hover:border-orange-500/30",
    icon: Flame,
    href: "https://wealthcalc.netlify.app/",
  },
  {
    title: "TradingView",
    description: "Charting-Plattform für technische Analysen",
    category: "Analyse",
    accent: "text-cyan-500",
    bgAccent: "bg-cyan-500/10",
    borderAccent: "hover:border-cyan-500/30",
    icon: LineChart,
    href: "https://www.tradingview.com/",
  },
  {
    title: "Finanzguru",
    description: "KI-gestützte Finanz-App mit Sparpotenzialen",
    category: "Budget-Manager",
    accent: "text-indigo-500",
    bgAccent: "bg-indigo-500/10",
    borderAccent: "hover:border-indigo-500/30",
    icon: PiggyBank,
    href: "https://finanzguru.de/",
  },
  {
    title: "Finanztest",
    description: "Verbrauchermagazin für Finanzprodukte",
    category: "Magazin",
    accent: "text-amber-500",
    bgAccent: "bg-amber-500/10",
    borderAccent: "hover:border-amber-500/30",
    icon: BookOpen,
    href: "https://www.test.de/finanztest/",
  },
  {
    title: "Curvo",
    description: "Portfolio-Backtesting mit historischen Daten",
    category: "Backtest",
    accent: "text-pink-500",
    bgAccent: "bg-pink-500/10",
    borderAccent: "hover:border-pink-500/30",
    icon: TrendingUp,
    href: "https://curvo.eu/backtest/en",
  },
  {
    title: "Trading Terminal",
    description: "Täglicher Marktüberblick und Analyse",
    category: "Marktanalyse",
    accent: "text-teal-500",
    bgAccent: "bg-teal-500/10",
    borderAccent: "hover:border-teal-500/30",
    icon: LineChart,
    href: "https://tradingterminal.com/",
  },
  {
    title: "SimplyWallSt",
    description: "Fundamentale Aktienanalyse mit visuellen Reports",
    category: "Fundamental-Analyse",
    accent: "text-slate-500",
    bgAccent: "bg-slate-500/10",
    borderAccent: "hover:border-slate-500/30",
    icon: ShieldCheck,
    href: "https://simplywall.st/stocks/us/software/nyse-now/servicenow/valuation",
  },
];

const calculatorDock = [
  {
    title: "Vorsorge",
    description:
      "Rentenalter, Netto-Rente und notwendige Sparrate mit frei planbaren Sparphasen.",
    href: "/calculators#retirement",
    icon: PiggyBank,
    accent: "text-cyan-600",
    borderAccent: "hover:border-cyan-500/40",
  },
  {
    title: "FIRE Timeline",
    description:
      "Coast FIRE und Full FIRE mit Inflation, Entnahmerate, Pension/Rente und Zusatzeinkommen.",
    href: "/calculators#fire-timeline",
    icon: Flame,
    accent: "text-orange-600",
    borderAccent: "hover:border-orange-500/40",
  },
  {
    title: "FinanzWizard",
    description:
      "Portfolio-Backtest mit Yahoo-Finance-Daten direkt im Browser ueber Proxy.",
    href: "/calculators#finanzwizard",
    icon: WandSparkles,
    accent: "text-violet-600",
    borderAccent: "hover:border-violet-500/40",
  },
  {
    title: "Gesellschaftsvergleich",
    description:
      "Vergleiche Vermögen und Bruttojahreseinkommen grob nach AT, DE oder DACH.",
    href: "/calculators#society-comparison",
    icon: Gauge,
    accent: "text-emerald-600",
    borderAccent: "hover:border-emerald-500/40",
  },
  {
    title: "Notgroschen",
    description:
      "Individueller Notgroschen statt pauschaler 3-6 Monate. Vermeide Cash-Drag und Unterversorgung.",
    href: "/calculators#emergency-fund",
    icon: ShieldCheck,
    accent: "text-teal-600",
    borderAccent: "hover:border-teal-500/40",
  },
  {
    title: "Rentenlücke",
    description:
      "Sieh, wie viel gesetzliche Rente du erwirtschaften kannst und welche Lücke du privat schließen musst.",
    href: "/calculators#pension-gap",
    icon: TrendingDown,
    accent: "text-rose-600",
    borderAccent: "hover:border-rose-500/40",
  },
  {
    title: "Inflation",
    description:
      "Berechne reale Kaufkraft und das nominale Gegenstück für langfristige Ziele.",
    href: "/calculators#inflation",
    icon: TrendingDown,
    accent: "text-slate-600",
    borderAccent: "hover:border-slate-500/40",
  },
  {
    title: "Kredit",
    description:
      "Tilgung, Gesamtkosten und Zinslast. Optional: Vergleiche Umschuldung.",
    href: "/calculators#loan",
    icon: Banknote,
    accent: "text-amber-600",
    borderAccent: "hover:border-amber-500/40",
  },
  {
    title: "Kaufen / Mieten",
    description:
      "Vergleiche Gesamtkosten Eigentum mit Miete + investierter Differenz über Jahrzehnte.",
    href: "/calculators#buy-or-rent",
    icon: Home,
    accent: "text-indigo-600",
    borderAccent: "hover:border-indigo-500/40",
  },
];

const knowledgeCards = [
  {
    title: "ETF vs. Einzelaktien",
    text: "ETFs kaufen breite Marktrendite und reduzieren Klumpenrisiko. Einzelaktien können outperformen, verlangen aber Analyse, Disziplin und Fehlerbudget.",
    icon: ShieldCheck,
  },
  {
    title: "Market Timing?",
    text: "Timing klingt rational, scheitert aber oft an wenigen sehr starken Börsentagen. Eine Ziel-Allokation plus Rebalancing ist robuster als Bauchgefühl.",
    icon: TimerReset,
  },
  {
    title: "Lump Sum vs. Sparplan",
    text: "Historisch gewinnt die Einmalanlage oft, weil Kapital früher investiert ist. Sparpläne helfen, Risiko psychologisch und cashflow-seitig zu glätten.",
    icon: LineChart,
  },
  {
    title: "Wealth Gap",
    text: "Vermögen entsteht nicht nur aus Einkommen: Eigentum, Erbschaften, Zeit im Markt, Bildung und Sparquote wirken über Jahrzehnte zusammen.",
    icon: Landmark,
  },
  {
    title: "Steuerliche Grundlagen",
    text: "Sparer-Pauschbetrag, Freistellungsauftrag, Teilfreistellung und Verlustverrechnungstopf sind die größten Hebel für nach Steuer-Optimierung.",
    icon: Calculator,
  },
  {
    title: "Thesaurierend vs. Ausschüttend",
    text: "Seit der Steuerreform 2018 und der Vorabpauschale ist das Steuerargument für ausschüttende Fonds meist obsolet. Thesaurierend profitiert von steuerstundender Zinseszins-Wirkung.",
    icon: LineChart,
  },
  {
    title: "Verhaltensökonomik",
    text: "Loss Aversion, Mental Accounting und Sunk Cost Fallacy sind stärkere Einflüsse auf Vermögen als Rendite. Automatisierung schlägt Willenskraft.",
    icon: Brain,
  },
];

const infographicCards = [
  {
    label: "1",
    title: "Cashflow",
    text: "Erst kennen, dann optimieren: Einkommen, Fixkosten, variable Kosten, Sparrate.",
  },
  {
    label: "2",
    title: "Notgroschen",
    text: "Liquidität schützt davor, Investments im falschen Moment verkaufen zu müssen.",
  },
  {
    label: "3",
    title: "Breit investieren",
    text: "Globale Streuung senkt Einzeltitel-, Branchen- und Länderklumpen.",
  },
  {
    label: "4",
    title: "Automatisieren",
    text: "Sparplan, Rebalancing-Regel und Review-Termine machen Verhalten planbar.",
  },
];

export default function HomePage() {
  return (
    <div className="-mx-4 -my-8 min-h-screen bg-background text-foreground sm:-mx-6 lg:-mx-8">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-blue-500/[0.03]" />
        <div className="relative mx-auto grid max-w-7xl gap-6 sm:gap-8 px-4 py-10 sm:py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              FinanzWissen Cockpit
            </div>
            <h1 className="max-w-4xl text-3xl sm:text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Finanzielle Entscheidungen{" "}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
                klarer, schneller und messbarer
              </span>{" "}
              treffen.
            </h1>
            <p className="mt-4 sm:mt-5 max-w-2xl text-base sm:text-lg leading-7 sm:leading-8 text-muted-foreground">
              Rechner, Tools, Infografiken und Basiswissen – alles an einem Ort.
              Starte mit der Vorsorgeplanung, entdecke nützliche Tools und baue
              dein Finanzwissen Schritt für Schritt auf.
            </p>
            <div className="mt-5 sm:mt-7 flex flex-wrap gap-2 sm:gap-3">
              <LinkButton
                href="/calculators#retirement"
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Vorsorge rechnen
              </LinkButton>
              <LinkButton
                href="/tools"
                size="lg"
                variant="outline"
                className="border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <BarChart3 className="mr-2 h-5 w-5" />
                Tools entdecken
              </LinkButton>
            </div>
          </div>
          <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-md p-4 sm:p-5 shadow-xl transition-all duration-300 ease-out hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30">
            <div
              className="pointer-events-none absolute inset-0 opacity-10"
              aria-hidden="true"
              style={{
                backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/finanzwissen_community.png)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
            <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
              <div className="flex items-center justify-center rounded-xl border border-border/40 bg-muted/20 p-4 transition-all duration-300 ease-out hover:scale-105 hover:border-primary/30 hover:bg-muted/30">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/finanzwissen_community.png`}
                  alt="FinanzWissen Community"
                  width={96}
                  height={96}
                  className="rounded-md object-contain"
                />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                  Live Modules
                </p>
                <h2 className="mt-1.5 text-lg sm:text-xl font-semibold">
                  Rechner zuerst, Theorie griffbereit.
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Tools für echte Entscheidungen: Sparphasen, Entnahme, Backtests
                  und Vergleichswerte.
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Vorsorge", "FIRE", "Backtest", "Vergleich", "Notgroschen", "Rentenlücke", "Inflation", "Kredit", "Kaufen/Mieten"].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-full border border-border/40 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-all duration-300 ease-out hover:scale-105 hover:bg-primary/20 hover:border-primary/30 cursor-default"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-auto grid grid-cols-2 gap-3 border-t border-border/40 pt-4">
              {[
                { icon: Calculator, label: "15+", sub: "Rechner" },
                { icon: BarChart3, label: "30+", sub: "Tools" },
                { icon: BookOpen, label: "7+", sub: "Wissensmodule" },
                { icon: Brain, label: "1", sub: "Community" },
              ].map((stat) => (
                <div key={stat.sub} className="flex items-center gap-2.5 rounded-lg border border-border/30 bg-muted/10 px-3 py-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                    <stat.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-none text-foreground">{stat.label}</p>
                    <p className="text-[11px] leading-tight text-muted-foreground">{stat.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CALCULATOR DOCK */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Rechner Direktzugriff</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Die wichtigsten Rechner für deine Finanzplanung – ohne Umweg.
            </p>
          </div>
          <LinkButton
            href="/calculators"
            variant="outline"
            className="hidden border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground sm:inline-flex shrink-0"
          >
            Alle Rechner
            <ArrowRight className="ml-2 h-4 w-4" />
          </LinkButton>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {calculatorDock.map((item) => (
            <Card
              key={item.title}
              className={`group relative overflow-hidden h-full border-border/40 bg-card/60 backdrop-blur-sm text-card-foreground transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 ${item.borderAccent}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <item.icon className={`h-8 w-8 shrink-0 ${item.accent}`} />
                  <CardTitle>{item.title}</CardTitle>
                </div>
                <CardDescription className="text-muted-foreground">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <LinkButton
                  href={item.href}
                  className="w-full justify-between"
                >
                  Öffnen
                  <ArrowRight className="h-4 w-4" />
                </LinkButton>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* TOOLS & RESSOURCEN */}
      <section className="border-y border-border/50 bg-muted/20 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Tools & Ressourcen</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Handverlesene externe Tools für Portfolio-Tracking, Broker-Vergleiche,
                Budget-Management und Finanzanalyse.
              </p>
            </div>
            <LinkButton
              href="/tools"
              variant="outline"
              className="hidden border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground sm:inline-flex shrink-0"
            >
              Alle Tools
              <ArrowRight className="ml-2 h-4 w-4" />
            </LinkButton>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredTools.map((tool) => (
              <div
                key={tool.title}
                className={`group relative flex flex-col overflow-hidden rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-4 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 ${tool.borderAccent}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tool.bgAccent} border border-border/40`}>
                    <tool.icon className={`h-5 w-5 ${tool.accent}`} />
                  </div>
                  <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {tool.title}
                  </h3>
                  <span className="inline-flex shrink-0 items-center rounded-full border border-border/30 bg-primary/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {tool.category}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="mt-1 grow text-xs leading-5 text-muted-foreground line-clamp-2">
                  {tool.description}
                </p>
                <div className="mt-auto pt-3">
                  <LinkButton
                    href={tool.href}
                    target="_blank"
                    className="w-full justify-between px-5 py-2"
                  >
                    Öffnen
                    <ArrowRight className="h-4 w-4" />
                  </LinkButton>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <LinkButton
              href="/tools"
              variant="outline"
              className="border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Alle Tools & Ressourcen
              <ArrowRight className="ml-2 h-4 w-4" />
            </LinkButton>
          </div>
        </div>
      </section>

      {/* LERNEN & VERSTEHEN */}
      <section className="border-y border-border/50 bg-muted/20 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Infografik: Vermögen bauen</h2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                Eine kurze, direkt nutzbare Reihenfolge statt langer Theorie.
              </p>
              <div className="mt-5 grid gap-3">
                {infographicCards.map((item) => (
                  <div
                    key={item.label}
                    className="group relative overflow-hidden grid grid-cols-[44px_1fr] gap-3 rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-4 transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-lg font-bold text-primary-foreground">
                      {item.label}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-5 flex items-center gap-3">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold">Basis-Knowhow</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {knowledgeCards.map((item) => (
                  <Card
                    key={item.title}
                    className="group relative overflow-hidden border-border/40 bg-card/60 backdrop-blur-sm text-card-foreground transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <item.icon className="h-7 w-7 shrink-0 text-primary" />
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm leading-6 text-muted-foreground">
                      {item.text}
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <LinkButton
                  href="/mindset"
                  variant="outline"
                  className="border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <Brain className="mr-2 h-4 w-4" />
                  Strategien lesen
                </LinkButton>
                <LinkButton
                  href="/community"
                  variant="default"
                  className="bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-200 px-6"
                >
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Community-Wissen
                </LinkButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
