"use client";

import {
  ArrowRight,
  Banknote,
  BarChart3,
  BookOpen,
  Brain,
  Calculator,
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

const calculatorDock = [
  {
    title: "Vorsorge",
    description:
      "Rentenalter, Netto-Rente und notwendige Sparrate mit frei planbaren Sparphasen.",
    href: "/calculators#retirement",
    icon: PiggyBank,
    accent: "text-cyan-600",
  },
  {
    title: "FIRE Timeline",
    description:
      "Coast FIRE und Full FIRE mit Inflation, Entnahmerate, Pension/Rente und Zusatzeinkommen.",
    href: "/calculators#fire-timeline",
    icon: Flame,
    accent: "text-orange-600",
  },
  {
    title: "FinanzWizard",
    description:
      "Portfolio-Backtest mit Yahoo-Finance-Daten direkt im Browser ueber Proxy.",
    href: "/calculators#finanzwizard",
    icon: WandSparkles,
    accent: "text-violet-600",
  },
  {
    title: "Gesellschaftsvergleich",
    description:
      "Vergleiche Vermögen und Bruttojahreseinkommen grob nach AT, DE oder DACH.",
    href: "/calculators#society-comparison",
    icon: Gauge,
    accent: "text-emerald-600",
  },
  {
    title: "Notgroschen",
    description:
      "Individueller Notgroschen statt pauschaler 3-6 Monate. Vermeide Cash-Drag und Unterversorgung.",
    href: "/calculators#emergency-fund",
    icon: ShieldCheck,
    accent: "text-teal-600",
  },
  {
    title: "Rentenlücke",
    description:
      "Sieh, wie viel gesetzliche Rente du erwirtschaften kannst und welche Lücke du privat schließen musst.",
    href: "/calculators#pension-gap",
    icon: TrendingDown,
    accent: "text-rose-600",
  },
  {
    title: "Inflation",
    description:
      "Berechne reale Kaufkraft und das nominale Gegenstück für langfristige Ziele.",
    href: "/calculators#inflation",
    icon: TrendingDown,
    accent: "text-slate-600",
  },
  {
    title: "Kredit",
    description:
      "Tilgung, Gesamtkosten und Zinslast. Optional: Vergleiche Umschuldung.",
    href: "/calculators#loan",
    icon: Banknote,
    accent: "text-amber-600",
  },
  {
    title: "Kaufen / Mieten",
    description:
      "Vergleiche Gesamtkosten Eigentum mit Miete + investierter Differenz über Jahrzehnte.",
    href: "/calculators#buy-or-rent",
    icon: Home,
    accent: "text-indigo-600",
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
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            FinanzWissen Cockpit
          </div>
          <h1 className="max-w-4xl text-4xl font-bold leading-tight text-foreground md:text-6xl">
            Finanzielle Entscheidungen klarer, schneller und messbarer treffen.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            Rechner, Infografiken und Basiswissen sitzen jetzt direkt auf der
            Startseite. Starte mit Vorsorge oder FIRE, prüfe Portfolios im
            FinanzWizard und ordne Einkommen oder Vermögen ein.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <LinkButton
              href="/calculators#retirement"
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Calculator className="mr-2 h-5 w-5" />
              Vorsorge rechnen
            </LinkButton>
            <LinkButton
              href="/calculators#fire-timeline"
              size="lg"
              variant="outline"
              className="border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Flame className="mr-2 h-5 w-5" />
              FIRE Timeline
            </LinkButton>
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-md p-5 shadow-xl transition-all duration-300 ease-out hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30">
          <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
            <div className="flex items-center justify-center rounded-xl border border-border/40 bg-muted/20 p-4 transition-all duration-300 ease-out hover:scale-105 hover:border-primary/30 hover:bg-muted/30">
              <Image
                src="/images/finanzwissen_community.png"
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
              <h2 className="mt-1.5 text-xl font-semibold">
                Rechner zuerst, Theorie griffbereit.
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Tools für echte Entscheidungen: Sparphasen, Entnahme, Backtests
                und Vergleichswerte.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "Vorsorge",
              "FIRE",
              "Backtest",
              "Vergleich",
              "Notgroschen",
              "Rentenlücke",
              "Inflation",
              "Kredit",
              "Kaufen/Mieten",
            ].map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full border border-border/40 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-all duration-300 ease-out hover:scale-105 hover:bg-primary/20 hover:border-primary/30 cursor-default"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border/50 bg-muted/20 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Rechner Direktzugriff</h2>
              <p className="text-sm text-muted-foreground">
                Die wichtigsten Rechner liegen jetzt ohne Umweg im ersten
                Screen-Bereich.
              </p>
            </div>
            <LinkButton
              href="/calculators"
              variant="outline"
              className="hidden border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground sm:inline-flex"
            >
              Alle Rechner
              <ArrowRight className="ml-2 h-4 w-4" />
            </LinkButton>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {calculatorDock.map((item) => (
              <Card
                key={item.title}
                className="group relative overflow-hidden h-full border-border/40 bg-card/60 backdrop-blur-sm text-card-foreground transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30"
              >
                <CardHeader className="pb-2">
                  <item.icon className={`h-8 w-8 ${item.accent}`} />
                  <CardTitle>{item.title}</CardTitle>
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
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <h2 className="text-2xl font-bold">Infografik: Vermögen bauen</h2>
          <p className="mt-2 text-muted-foreground">
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
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Basis-Knowhow</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {knowledgeCards.map((item) => (
              <Card
                key={item.title}
                className="group relative overflow-hidden border-border/40 bg-card/60 backdrop-blur-sm text-card-foreground transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30"
              >
                <CardHeader className="pb-2">
                  <item.icon className="h-7 w-7 text-primary" />
                  <CardTitle className="text-lg">{item.title}</CardTitle>
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
              variant="outline"
              className="border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Community-Wissen
            </LinkButton>
          </div>
        </div>
      </section>
    </div>
  );
}
