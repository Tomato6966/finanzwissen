"use client";

import {
  ArrowRight,
  ArrowLeftRight,
  BadgeCheck,
  BookOpen,
  Brain,
  CheckCircle2,
  Coins,
  Eye,
  Heart,
  Lightbulb,
  ListChecks,
  PiggyBank,
  Quote,
  RefreshCw,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LinkButton from "@/components/ui/linkButton";

const glaubenssaetze = [
  {
    negativ: "Geld ist böse / Geld verdirbt den Charakter",
    positiv: "Geld ist neutral – ein Werkzeug für Freiheit und Gutes",
    erklaerung: "Geld hat keine Moral. Es verstärkt nur, was bereits in dir ist. Mit mehr Geld kannst du mehr Gutes bewirken.",
  },
  {
    negativ: "Über Geld spricht man nicht",
    positiv: "Finanzielle Offenheit schafft Klarheit und Verbindung",
    erklaerung: "Transparenz über Finanzen führt zu besseren Entscheidungen. Die Tabuisierung hält uns unwissend.",
  },
  {
    negativ: "Sparen ist Verzicht",
    positiv: "Sparen ist Versorgung meines zukünftigen Ichs",
    erklaerung: "Jeder Euro, den du heute zurücklegst, arbeitet für dein morgen. Du beschenkst dein zukünftiges Ich.",
  },
  {
    negativ: "Aktien sind Zocken / viel zu riskant",
    positiv: "Nicht-Investieren ist das größte Risiko (Inflationsverlust)",
    erklaerung: "Bei 2 % Inflation verliert dein Sparbuch real an Wert. Ein breit gestreuter ETF ist historisch die sicherere Wahl.",
  },
  {
    negativ: "Ich bin nicht gut mit Geld",
    positiv: "Finanzwissen kann ich lernen, wie jede andere Fähigkeit",
    erklaerung: "Niemand wird mit Finanzverständnis geboren. Es ist eine Fähigkeit – und die kannst du dir Schritt für Schritt aneignen.",
  },
  {
    negativ: "Reiche sind unethisch",
    positiv: "Wohlstand erlaubt mir, mehr Gutes zu tun",
    erklaerung: "Finanzielle Mittel geben dir die Freiheit, das zu unterstützen, was dir wichtig ist – ob Familie, Bildung oder soziale Projekte.",
  },
  {
    negativ: "Investieren ist nur was für Reiche",
    positiv: "Schon 50 € im Monat machen den Unterschied",
    erklaerung: "Dank ETF-Sparplänen und günstigen Brokern kann jeder ab 1 € pro Monat investieren. Der Zinseszins erledigt den Rest.",
  },
];

const geldtypen = [
  {
    titel: "Der Status-Suchende",
    icon: Eye,
    farbe: "text-rose-500",
    bgFarbe: "bg-rose-500/10",
    borderFarbe: "border-rose-500/20 hover:border-rose-500/40",
    gradient: "from-rose-500/20",
    kennzeichen: "Geld = Status. Ausgaben für Prestige (Auto, Kleidung, Marken).",
    risiko: "Konsumschulden, Leben über Verhältnisse, keine Vermögensbildung.",
    loesung: "Werte definieren, Budget mit erlaubtem Konsum, Cashflow-Plan erstellen.",
  },
  {
    titel: "Der Geld-Anbetende",
    icon: Coins,
    farbe: "text-amber-500",
    bgFarbe: "bg-amber-500/10",
    borderFarbe: "border-amber-500/20 hover:border-amber-500/40",
    gradient: "from-amber-500/20",
    kennzeichen: "Geld = Lösung aller Probleme. Workaholic, nie genug.",
    risiko: "Burnout, Beziehungsprobleme, innere Leere.",
    loesung: "Glück nicht an Geldbetrag knüpfen, Dankbarkeitsjournal, Work-Life-Balance.",
  },
  {
    titel: "Der Wachsame / Vorsichtige",
    icon: Shield,
    farbe: "text-blue-500",
    bgFarbe: "bg-blue-500/10",
    borderFarbe: "border-blue-500/20 hover:border-blue-500/40",
    gradient: "from-blue-500/20",
    kennzeichen: "Hat alles im Griff, immer Überblick, spart diszipliniert.",
    risiko: "Angst vor Ausgaben, schlechtes Gewissen nach jedem Kauf, verpasst Rendite.",
    loesung: "Geld ausgeben ist erlaubt. Spaß-Budget freigeben, sich bewusst belohnen.",
  },
  {
    titel: "Der Vermeidende",
    icon: Eye,
    farbe: "text-slate-500",
    bgFarbe: "bg-slate-500/10",
    borderFarbe: "border-slate-500/20 hover:border-slate-500/40",
    gradient: "from-slate-500/20",
    kennzeichen: "Ignoriert Geld, fühlt sich überfordert, schiebt Finanzen auf.",
    risiko: "Überschuldung, verpasste Chancen, Kontoverluste.",
    loesung: "Basis-Finanzwissen aufbauen, automatisierte Prozesse, kleine Erfolgsschritte feiern.",
  },
];

const mindsetShifts = [
  { von: "Geld ist böse", zu: "Geld ist neutral – ein Werkzeug" },
  { von: "Über Geld spricht man nicht", zu: "Finanzielle Offenheit schafft Klarheit" },
  { von: "Sparen ist Verzicht", zu: "Sparen ist Versorgung meines zukünftigen Ichs" },
  { von: "Ich bin nicht gut mit Geld", zu: "Finanzwissen kann ich lernen" },
  { von: "Aktien sind Zocken", zu: "Nicht-Investieren ist das größere Risiko" },
  { von: "Reiche sind unethisch", zu: "Wohlstand erlaubt mir, Gutes zu tun" },
  { von: "Das Geld reicht nie", zu: "Es gibt genug – ich darf Wohlstand anziehen" },
];

const strategien = [
  {
    titel: "4-Töpfe-Modell",
    beschreibung: "Verteile dein Einkommen auf vier strategische Töpfe:",
    farbe: "text-emerald-500",
    bgFarbe: "bg-emerald-500/10",
    punkte: [
      { label: "Tägliches Leben", sub: "Miete, Essen, Versicherungen", anteil: "50–60 %" },
      { label: "Finanzielle Freiheit", sub: "ETF-Sparplan, Altersvorsorge", anteil: "10–20 %" },
      { label: "Spaß & Leben", sub: "Reisen, Hobbys, Luxus", anteil: "10–20 %" },
      { label: "Notfall-Reserve", sub: "3–6 Monatsausgaben liquide", anteil: "~10 %" },
    ],
  },
  {
    titel: "Pay Yourself First",
    beschreibung: "Überweise direkt am Gehaltstag 10–20 % auf ein separates Investitionskonto – bevor du Rechnungen bezahlst.",
    farbe: "text-violet-500",
    bgFarbe: "bg-violet-500/10",
    punkte: [
      { label: "Konto 1", sub: "Monatsausgaben (Girokonto)", anteil: "70–80 %" },
      { label: "Konto 2", sub: "Finanzielle Freiheit (Depot/ETF)", anteil: "10–20 %" },
      { label: "Konto 3", sub: "Spaß & Träume (Tagesgeld)", anteil: "5–10 %" },
    ],
  },
  {
    titel: "50/30/20-Regel",
    beschreibung: "Einfacher Budgetierungsrahmen für den Überblick:",
    farbe: "text-orange-500",
    bgFarbe: "bg-orange-500/10",
    punkte: [
      { label: "Fixkosten", sub: "Miete, Strom, Versicherungen, Abos", anteil: "50 %" },
      { label: "Lifestyle", sub: "Freizeit, Essen gehen, Shopping", anteil: "30 %" },
      { label: "Sparen & Investieren", sub: "ETF, Tagesgeld, Schuldentilgung", anteil: "20 %" },
    ],
  },
  {
    titel: "Schulden-Ampel",
    beschreibung: "Schnelle Orientierung für deine Schuldensituation:",
    farbe: "text-red-500",
    bgFarbe: "bg-red-500/10",
    punkte: [
      { label: "Grün", sub: "Keine Schulden, Notgroschen vorhanden", anteil: "" },
      { label: "Gelb", sub: "Konsumschulden vorhanden, aber Tilgungsplan", anteil: "" },
      { label: "Rot", sub: "Überschuldung → Professionelle Hilfe suchen", anteil: "" },
    ],
  },
];

const uebungen = [
  {
    titel: "Glaubenssätze-Reframing",
    icon: RefreshCw,
    farbe: "text-purple-500",
    bgFarbe: "bg-purple-500/10",
    schritte: [
      "Schreibe alle Gedanken zu Geld auf, die dir in den Sinn kommen.",
      "Hinterfrage sie kritisch: Ist das wirklich wahr? Woher kommt dieser Glaube?",
      "Formuliere eine positive Alternative (siehe Glaubenssätze oben).",
      "Wiederhole die neue Affirmation täglich für 30 Tage.",
    ],
  },
  {
    titel: "Geld-Journaling",
    icon: BookOpen,
    farbe: "text-teal-500",
    bgFarbe: "bg-teal-500/10",
    schritte: [
      "Notiere 3 Dinge, für die du finanziell dankbar bist.",
      "Schreibe jede Ausgabe auf + das Gefühl dabei (Angst, Freude, Schuld?).",
      "Beschreibe deinen idealen Geldtag: Was würdest du tun, wenn Geld keine Rolle spielte?",
      "Reflektiere monatlich: Was hat sich in deinem Mindset verändert?",
    ],
  },
  {
    titel: "Visualisierung",
    icon: Eye,
    farbe: "text-amber-500",
    bgFarbe: "bg-amber-500/10",
    schritte: [
      "Erstelle ein Vision Board mit deinen finanziellen Zielen (Bilder, Zahlen).",
      "5 Minuten täglich: Stell dir vor, wie sich finanzielle Freiheit anfühlt.",
      "Visualisiere konkrete Szenarien: schuldenfrei sein, das erste Depot sehen.",
      "Kombiniere Visualisierung mit Affirmationen für maximale Wirkung.",
    ],
  },
  {
    titel: "5-Minuten-Regel",
    icon: Zap,
    farbe: "text-blue-500",
    bgFarbe: "bg-blue-500/10",
    schritte: [
      "Täglich nur 5 Minuten mit deinen Finanzen beschäftigen.",
      "Kontostand checken, eine Affirmation lesen, eine kleine Handlung setzen.",
      "Überforderung vermeiden – Konsistenz schlägt Intensität.",
      "Steigere nach 30 Tagen auf 10 Minuten pro Tag.",
    ],
  },
];

const empfehlungen = [
  {
    titel: "Bodo Schäfer",
    subtitle: "Der Weg zur finanziellen Freiheit",
    text: "Der Klassiker für den deutschsprachigen Raum. Über 10 Millionen verkaufte Exemplare. Bodo Schäfer zeigt konkret, wie jeder Wohlstand erreichen kann – mit Fokus auf Mindset, Sparquote und multiple Einkommensquellen.",
    bgFarbe: "bg-blue-500/5",
    borderFarbe: "border-blue-500/20",
  },
  {
    titel: "Madame Moneypenny",
    subtitle: "Wie Frauen ihre finanzielle Unabhängigkeit erreichen",
    text: "Natasha von Siemens fokussiert auf Glaubenssätze, positives Money Mindset und konkretes Investment-Wissen speziell für Frauen. Sehr praktisch, psychologisch fundiert und ermutigend.",
    bgFarbe: "bg-pink-500/5",
    borderFarbe: "border-pink-500/20",
  },
  {
    titel: "Morgan Housel",
    subtitle: "Über Geld denkt man anders (The Psychology of Money)",
    text: "Keine Formeln, nur Geschichten. Dieses Buch erklärt, warum wir uns bei Geld oft irrational verhalten – und wie wir trotzdem kluge Entscheidungen treffen. Ideal für Einsteiger, die Psychologie und Finanzen verbinden wollen.",
    bgFarbe: "bg-amber-500/5",
    borderFarbe: "border-amber-500/20",
  },
  {
    titel: "Gisela Enders",
    subtitle: "Finanzielle Freiheit – wie Menschen leben, die nicht mehr arbeiten müssen",
    text: "Gisela Enders hat finanziell freie Menschen interviewt und beschreibt konkret, wie es wirklich ist, von seinem Vermögen zu leben. Fokus auf Frugalismus, Geld-Mindset und Lebensgestaltung.",
    bgFarbe: "bg-emerald-500/5",
    borderFarbe: "border-emerald-500/20",
  },
];

export default function MindSetPage() {
  return (
    <div className="space-y-16 pb-16">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-amber-500/5 via-transparent to-purple-500/5 p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative">
          <Badge variant="outline" className="mb-4 border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Brain className="mr-1 h-3.5 w-3.5" />
            Grundlagen
          </Badge>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Geld-Mindset: Der{" "}
            <span className="bg-gradient-to-r from-amber-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Schlüssel zu finanzieller Freiheit
            </span>
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Deine Einstellung zu Geld bestimmt deine finanziellen Ergebnisse – mehr als jedes Einkommen oder jede
            Strategie. Lerne deine Geld-Glaubenssätze kennen, verstehe deinen Geldtyp und baue ein Mindset auf,
            das Vermögen anzieht statt blockiert.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton
              href="#glaubenssaetze"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Lightbulb className="mr-2 h-4 w-4" />
              Glaubenssätze entdecken
            </LinkButton>
            <LinkButton
              href="#geldtypen"
              variant="outline"
              className="border-border bg-transparent text-foreground hover:bg-accent"
            >
              <Users className="mr-2 h-4 w-4" />
              Mein Geldtyp
            </LinkButton>
            <LinkButton
              href="/moneymanagement"
              variant="outline"
              className="border-border bg-transparent text-foreground hover:bg-accent"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Haushaltsbudget & Tipps
            </LinkButton>
          </div>
        </div>
      </section>

      {/* GLAUBENSSÄTZE */}
      <section id="glaubenssaetze" className="scroll-mt-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold">Die 7 größten Geld-Glaubenssätze der Deutschen</h2>
          <p className="mt-2 text-muted-foreground">
            Diese Überzeugungen halten Millionen davon ab, ihr volles finanzielles Potenzial zu entfalten.
            Erkennst du dich wieder?
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {glaubenssaetze.map((item) => (
            <Card
              key={item.negativ}
              className="group border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/5"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                    <span className="text-xs text-red-500 font-bold">!</span>
                  </div>
                  <CardTitle className="text-base leading-snug text-foreground">
                    &bdquo;{item.negativ}&ldquo;
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <ArrowLeftRight className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    {item.positiv}
                  </p>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {item.erklaerung}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* GELDTYPEN */}
      <section id="geldtypen" className="scroll-mt-8">
        <div className="mb-8 text-center">
          <Badge variant="outline" className="mb-2 border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Users className="mr-1 h-3.5 w-3.5" />
            Selbsttest
          </Badge>
          <h2 className="text-3xl font-bold">Welcher Geldtyp bist du?</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Nach Brad Klontz&apos; Forschung gibt es vier Geldpersönlichkeiten. Jeder Typ hat Stärken und blinde
            Flecken. Je besser du deinen Typ kennst, desto gezielter kannst du an dir arbeiten.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {geldtypen.map((typ) => {
            const Icon = typ.icon;
            return (
              <Card
                key={typ.titel}
                className={`group relative overflow-hidden border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-lg ${typ.borderFarbe}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${typ.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${typ.bgFarbe} border border-border/40`}>
                      <Icon className={`h-5 w-5 ${typ.farbe}`} />
                    </div>
                    <CardTitle className={`text-lg ${typ.farbe}`}>{typ.titel}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Kennzeichen</p>
                    <p className="text-sm text-foreground">{typ.kennzeichen}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-red-500 mb-1">Risiko</p>
                    <p className="text-sm text-muted-foreground">{typ.risiko}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-green-500 mb-1">Lösung</p>
                    <p className="text-sm text-muted-foreground">{typ.loesung}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* MINDSET-SHIFTS */}
      <section className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-amber-500/5 via-purple-500/5 to-blue-500/5 p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative">
          <div className="mb-8 text-center">
            <Badge variant="outline" className="mb-2 border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <RefreshCw className="mr-1 h-3.5 w-3.5" />
              Transformation
            </Badge>
            <h2 className="text-3xl font-bold">Die 7 wichtigsten Mindset-Shifts</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              Der Wechsel von einem limitierenden zu einem empowernden Glaubenssatz ist der erste und
              wichtigste Schritt auf deinem Weg zu finanzieller Souveränität.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mindsetShifts.map((shift) => (
              <div
                key={shift.von}
                className="group rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-4 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/5"
              >
                <div className="flex items-start gap-2 text-sm">
                  <span className="rounded-md bg-red-500/10 px-2 py-1 text-xs font-medium text-red-500 line-through shrink-0">
                    {shift.von}
                  </span>
                </div>
                <ArrowRight className="my-2 h-4 w-4 text-muted-foreground" />
                <div className="flex items-start gap-2 text-sm">
                  <span className="rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500 shrink-0">
                    {shift.zu}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÜBUNGEN */}
      <section>
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold">Praktische Übungen für dein Geld-Mindset</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Mindset-Arbeit ist kein passives Wünschen – sie erfordert tägliche Praxis. Diese vier Übungen
            helfen dir, neue Denkmuster zu verankern.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {uebungen.map((uebung) => {
            const Icon = uebung.icon;
            return (
              <Card
                key={uebung.titel}
                className="group border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${uebung.bgFarbe} border border-border/40`}>
                      <Icon className={`h-5 w-5 ${uebung.farbe}`} />
                    </div>
                    <CardTitle className="text-lg">{uebung.titel}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {uebung.schritte.map((schritt, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${uebung.bgFarbe} text-xs font-medium ${uebung.farbe}`}>
                          {idx + 1}
                        </span>
                        {schritt}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* STRATEGIEN */}
      <section className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 p-8 md:p-12">
        <div className="relative">
          <div className="mb-8 text-center">
            <Badge variant="outline" className="mb-2 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Target className="mr-1 h-3.5 w-3.5" />
              Geld-Strategien
            </Badge>
            <h2 className="text-3xl font-bold">Möglichkeiten & Strategien für dein Geld</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              Das richtige Mindset braucht ein praktisches Fundament. Diese bewährten Strategien helfen dir,
              dein Geld systematisch zu verwalten, zu vermehren und zu schützen.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {strategien.map((strategie) => {
              return (
                <Card
                  key={strategie.titel}
                  className="group border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <CardHeader>
                    <CardTitle className={`text-lg ${strategie.farbe}`}>{strategie.titel}</CardTitle>
                    <CardDescription>{strategie.beschreibung}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {strategie.punkte.map((punkt) => (
                        <div key={punkt.label} className="flex items-center justify-between rounded-lg border border-border/30 bg-muted/20 p-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">{punkt.label}</p>
                            <p className="text-xs text-muted-foreground">{punkt.sub}</p>
                          </div>
                          {punkt.anteil && (
                            <span className={`shrink-0 rounded-md ${strategie.bgFarbe} px-2 py-1 text-xs font-bold ${strategie.farbe}`}>
                              {punkt.anteil}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* EMPFEHLUNGEN */}
      <section>
        <div className="mb-8 text-center">
          <Badge variant="outline" className="mb-2 border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Star className="mr-1 h-3.5 w-3.5" />
            Lese-Tipps
          </Badge>
          <h2 className="text-3xl font-bold">Empfohlene Bücher & Autor:innen</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Diese Bücher haben tausenden Menschen im DACH-Raum geholfen, ihr Geld-Mindset zu verändern und
            finanzielle Klarheit zu gewinnen.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {empfehlungen.map((buch) => (
            <Card
              key={buch.titel}
              className={`group border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-lg ${buch.borderFarbe}`}
            >
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-card border border-border/40">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{buch.titel}</CardTitle>
                    <CardDescription className="italic">{buch.subtitle}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{buch.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl border border-border/40 bg-gradient-to-br from-primary/5 via-purple-500/5 to-amber-500/5 p-8 md:p-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Bereit für den nächsten Schritt?</h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
            Mindset ist die Basis – aber erst die konkrete Umsetzung schafft Vermögen. Starte mit
            einem soliden Haushaltsplan oder unserer Vorsorgeplanung.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <LinkButton
              href="/moneymanagement"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Haushalt & Überblick
            </LinkButton>
            <LinkButton
              href="/calculators#retirement"
              variant="outline"
              className="border-border bg-transparent text-foreground hover:bg-accent"
            >
              <PiggyBank className="mr-2 h-4 w-4" />
              Vorsorge planen
            </LinkButton>
            <LinkButton
              href="/tools"
              variant="outline"
              className="border-border bg-transparent text-foreground hover:bg-accent"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Tools entdecken
            </LinkButton>
          </div>
        </div>
      </section>
    </div>
  );
}
