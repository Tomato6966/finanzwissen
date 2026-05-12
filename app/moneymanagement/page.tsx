"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowRight,
    BookOpen,
    CheckCircle,
    Clock,
    Coins,
    Flame,
    Home,
    Lightbulb,
    PiggyBank,
    Sparkles,
    Target,
    TrendingUp,
    Users,
    Wallet,
    Zap,
} from "lucide-react";

const StepCard = ({
    number,
    icon: Icon,
    title,
    description,
    color,
}: {
    number: string;
    icon: React.ElementType;
    title: string;
    description: string;
    color: string;
}) => (
    <div
        className={`p-5 rounded-xl border ${color === "blue" ? "border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/10" : color === "green" ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/10" : color === "purple" ? "border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/10" : color === "orange" ? "border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/10" : "border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/10"}`}
    >
        <div className="flex items-center gap-3 mb-3">
            <div
                className={`p-2 rounded-lg ${color === "blue" ? "bg-blue-100 dark:bg-blue-900/30" : color === "green" ? "bg-green-100 dark:bg-green-900/30" : color === "purple" ? "bg-purple-100 dark:bg-purple-900/30" : color === "orange" ? "bg-orange-100 dark:bg-orange-900/30" : "bg-teal-100 dark:bg-teal-900/30"}`}
            >
                <Icon
                    className={`w-5 h-5 ${color === "blue" ? "text-blue-600" : color === "green" ? "text-green-600" : color === "purple" ? "text-purple-600" : color === "orange" ? "text-orange-600" : "text-teal-600"}`}
                />
            </div>
            <span
                className={`text-xs font-semibold uppercase tracking-wide ${color === "blue" ? "text-blue-600" : color === "green" ? "text-green-600" : color === "purple" ? "text-purple-600" : color === "orange" ? "text-orange-600" : "text-teal-600"}`}
            >
                Schritt {number}
            </span>
        </div>
        <h4 className="font-semibold text-foreground mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
);

const VariantCard = ({
    icon: Icon,
    title,
    description,
    capital,
    color,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    capital: string;
    color: string;
}) => (
    <div className="p-5 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${color === "amber" ? "bg-amber-100 dark:bg-amber-900/30" : color === "purple" ? "bg-purple-100 dark:bg-purple-900/30" : color === "blue" ? "bg-blue-100 dark:bg-blue-900/30" : "bg-green-100 dark:bg-green-900/30"}`}>
                <Icon className={`w-5 h-5 ${color === "amber" ? "text-amber-600" : color === "purple" ? "text-purple-600" : color === "blue" ? "text-blue-600" : "text-green-600"}`} />
            </div>
            <h4 className="font-semibold text-foreground">{title}</h4>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{description}</p>
        <div className="text-xs text-muted-foreground">
            Benötigtes Kapital: <span className="font-semibold text-foreground">{capital}</span>
        </div>
    </div>
);

export default function MoneyManagementPage() {
    return (
        <div className="space-y-12">
            {/* Hero */}
            <div className="text-center max-w-4xl mx-auto">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-primary/10 rounded-2xl">
                        <Wallet className="w-14 h-14 text-primary" />
                    </div>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
                    Geldmanagement
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    Die Kontrolle über deine Finanzen zu &uuml;bernehmen ist der erste Schritt zu
                    finanzieller Freiheit. Hier lernst du, wie du ein Budget erstellst, Kosten
                    optimierst und deine Sparziele erreichst.
                </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="haushalt" className="w-full">
                <div className="flex justify-center mb-6 sm:mb-10">
                    <TabsList className="flex sm:grid w-full max-w-2xl sm:grid-cols-3 gap-1">
                        <TabsTrigger value="haushalt">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Haushalt
                        </TabsTrigger>
                        <TabsTrigger value="fire">
                            <Flame className="w-4 h-4 mr-2" />
                            FIRE &amp; Sparen
                        </TabsTrigger>
                        <TabsTrigger value="optimierung">
                            <Zap className="w-4 h-4 mr-2" />
                            Kosten optimieren
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* ==================== TAB 1: HAUSHALT ==================== */}
                <TabsContent value="haushalt" className="space-y-8">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                                <CardTitle className="text-blue-600">
                                    Warum ein Haushaltsbuch?
                                </CardTitle>
                            </div>
                            <CardDescription>
                                &quot;Wo bleibt blo&szlig; mein Geld?&quot; &ndash; Die h&auml;ufigste
                                Finanzfrage &uuml;berhaupt.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-muted-foreground space-y-3 text-sm leading-relaxed">
                            <p>
                                Ein Haushaltsbuch (auch Budgetplaner, Einnahmen-Ausgaben-&Uuml;bersicht
                                oder Money Diary) schafft Klarheit &uuml;ber deine Finanzen. Es hilft
                                dir, Ausgabenmuster zu erkennen, Sparpotenziale aufzudecken und
                                bewusster mit Geld umzugehen.
                            </p>
                            <div className="grid md:grid-cols-3 gap-4 mt-4">
                                <div className="p-4 bg-blue-50 dark:bg-blue-950/10 rounded-xl text-center">
                                    <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                                    <h5 className="font-semibold text-foreground mb-1">Klarheit</h5>
                                    <p className="text-xs">Erkenne, wof&uuml;r du wirklich Geld ausgibst</p>
                                </div>
                                <div className="p-4 bg-green-50 dark:bg-green-950/10 rounded-xl text-center">
                                    <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                    <h5 className="font-semibold text-foreground mb-1">Kontrolle</h5>
                                    <p className="text-xs">Steuere aktiv gegen, wo n&ouml;tig</p>
                                </div>
                                <div className="p-4 bg-purple-50 dark:bg-purple-950/10 rounded-xl text-center">
                                    <PiggyBank className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                                    <h5 className="font-semibold text-foreground mb-1">Sparpotenzial</h5>
                                    <p className="text-xs">Finde &uuml;bersehene Einsparm&ouml;glichkeiten</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div>
                        <h3 className="text-2xl font-bold text-foreground mb-6">Der 5-Schritte-Plan</h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <StepCard
                                number="1"
                                icon={Target}
                                title="Einnahmen erfassen"
                                description="Nur die regelm&auml;&szlig;igen Netto-Einnahmen z&auml;hlen: Nettogehalt, Kindergeld, Nebeneink&uuml;nfte. Einmalzahlungen bleiben au&szlig;en vor."
                                color="blue"
                            />
                            <StepCard
                                number="2"
                                icon={Home}
                                title="Feste Ausgaben ermitteln"
                                description="Miete, Versicherungen, Strom, Internet, Abos &ndash; alle regelm&auml;&szlig;igen, kaum ver&auml;nderbaren Kosten erfassen."
                                color="green"
                            />
                            <StepCard
                                number="3"
                                icon={Wallet}
                                title="Variables Budget berechnen"
                                description="Verf&uuml;gbares Budget = Einnahmen &minus; Fixkosten. Teile durch 4 f&uuml;r ein Wochenbudget f&uuml;r variable Kosten."
                                color="purple"
                            />
                            <StepCard
                                number="4"
                                icon={BookOpen}
                                title="Ausgaben tracken (30&ndash;90 Tage)"
                                description="Notiere alle Ausgaben &ndash; auch Kleinstbetr&auml;ge. Kategorien: Essen, Freizeit, Kleidung, Verkehr, Au&szlig;er-Haus."
                                color="orange"
                            />
                            <StepCard
                                number="5"
                                icon={CheckCircle}
                                title="Monatliche Bilanz ziehen"
                                description="Verf&uuml;gbares Budget minus tats&auml;chliche Ausgaben. Positiv? Sparen. Negativ? Gr&ouml;&szlig;te Posten identifizieren."
                                color="teal"
                            />
                        </div>
                    </div>

                    <Card className="hover:shadow-lg transition-shadow border-blue-200 dark:border-blue-800">
                        <CardHeader>
                            <CardTitle className="text-blue-600">Die 50/30/20-Regel</CardTitle>
                            <CardDescription>
                                Bew&auml;hrte Faustregel f&uuml;r die Budgetaufteilung nach Elizabeth
                                Warren
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="p-5 bg-blue-50 dark:bg-blue-950/10 rounded-xl text-center">
                                    <div className="text-3xl font-bold text-blue-600 mb-1">50%</div>
                                    <h5 className="font-semibold text-foreground mb-1">Grundausgaben</h5>
                                    <p className="text-xs text-muted-foreground">
                                        Miete, Strom, Lebensmittel, Versicherungen
                                    </p>
                                </div>
                                <div className="p-5 bg-green-50 dark:bg-green-950/10 rounded-xl text-center">
                                    <div className="text-3xl font-bold text-green-600 mb-1">30%</div>
                                    <h5 className="font-semibold text-foreground mb-1">Lifestyle</h5>
                                    <p className="text-xs text-muted-foreground">
                                        Restaurant, Reisen, Hobbys, Shopping
                                    </p>
                                </div>
                                <div className="p-5 bg-purple-50 dark:bg-purple-950/10 rounded-xl text-center">
                                    <div className="text-3xl font-bold text-purple-600 mb-1">20%</div>
                                    <h5 className="font-semibold text-foreground mb-1">Sparen &amp; Tilgen</h5>
                                    <p className="text-xs text-muted-foreground">
                                        Notgroschen, ETFs, Kredite, Altersvorsorge
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-4 text-center italic">
                                Beispiel bei 3.000 &euro; Netto: 1.500 &euro; Grundausgaben / 900 &euro;
                                Lifestyle / 600 &euro; Sparen
                            </p>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-orange-600">Notgroschen aufbauen</CardTitle>
                                <CardDescription>
                                    Dein finanzielles Sicherheitsnetz
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/10 rounded-lg">
                                            <div className="text-lg font-bold text-orange-600">3</div>
                                            <p className="text-xs text-muted-foreground">Monate Minimum</p>
                                        </div>
                                        <div className="text-center p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                                            <div className="text-lg font-bold text-orange-600">4&ndash;5</div>
                                            <p className="text-xs text-muted-foreground">Monate empfohlen</p>
                                        </div>
                                        <div className="text-center p-3 bg-orange-200 dark:bg-orange-800/20 rounded-lg">
                                            <div className="text-lg font-bold text-orange-600">6+</div>
                                            <p className="text-xs text-muted-foreground">Monate f&uuml;r Selbstst.</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Der Notgroschen geh&ouml;rt auf ein separates Tagesgeldkonto
                                        &ndash; schnell verf&uuml;gbar, aber nicht im Girokonto
                                        verf&uuml;hrbar.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-purple-600">Tools &amp; Methoden</CardTitle>
                                <CardDescription>Digital oder analog &ndash; was passt zu dir?</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-950/10 rounded-lg">
                                        <h5 className="font-semibold text-sm">Apps</h5>
                                        <p className="text-xs text-muted-foreground">
                                            Finanzguru, YNAB, Outbank, EveryDollar &ndash; automatische
                                            Kategorisierung, Banking-Anbindung
                                        </p>
                                    </div>
                                    <div className="p-3 bg-green-50 dark:bg-green-950/10 rounded-lg">
                                        <h5 className="font-semibold text-sm">Excel / Google Sheets</h5>
                                        <p className="text-xs text-muted-foreground">
                                            Kostenlos, flexibel, unabh&auml;ngig &ndash; mit Vorlagen schnell
                                            starten
                                        </p>
                                    </div>
                                    <div className="p-3 bg-amber-50 dark:bg-amber-950/10 rounded-lg">
                                        <h5 className="font-semibold text-sm">Umschlagmethode</h5>
                                        <p className="text-xs text-muted-foreground">
                                            Bargeld in Umschl&auml;ge pro Kategorie &ndash; f&ouml;rdert
                                            sp&uuml;rbare Ausgabenkontrolle
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* ==================== TAB 2: FIRE ==================== */}
                <TabsContent value="fire" className="space-y-8">
                    <Card className="hover:shadow-lg transition-shadow border-amber-200 dark:border-amber-800">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Flame className="w-6 h-6 text-amber-600" />
                                <CardTitle className="text-amber-600">Was ist FIRE?</CardTitle>
                            </div>
                            <CardDescription>
                                Financial Independence, Retire Early &ndash; Finanzielle
                                Unabh&auml;ngigkeit, fr&uuml;her Ruhestand
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                            <p>
                                Die Kernidee: Durch hohe Sparquoten (40&ndash;70 % des Einkommens) und
                                konsequentes Investieren ein Verm&ouml;gen aufbauen, das gro&szlig; genug
                                ist, um dauerhaft deine Lebenshaltungskosten zu decken &ndash; ohne
                                arbeiten zu m&uuml;ssen.
                            </p>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="p-4 bg-amber-50 dark:bg-amber-950/10 rounded-xl text-center">
                                    <Sparkles className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                                    <h5 className="font-semibold text-foreground mb-1">Freiheit</h5>
                                    <p className="text-xs">Arbeit wird optional statt obligatorisch</p>
                                </div>
                                <div className="p-4 bg-amber-50 dark:bg-amber-950/10 rounded-xl text-center">
                                    <Users className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                                    <h5 className="font-semibold text-foreground mb-1">Selbstbestimmung</h5>
                                    <p className="text-xs">Leben nach eigenen Regeln</p>
                                </div>
                                <div className="p-4 bg-amber-50 dark:bg-amber-950/10 rounded-xl text-center">
                                    <Coins className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                                    <h5 className="font-semibold text-foreground mb-1">Sparquote</h5>
                                    <p className="text-xs">Der entscheidende Hebel f&uuml;r Unabh&auml;ngigkeit</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-amber-600">Die 4%-Regel &amp; deine FIRE-Zahl</CardTitle>
                            <CardDescription>
                                Wie viel Kapital brauchst du f&uuml;r finanzielle Unabh&auml;ngigkeit?
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h5 className="font-semibold text-foreground mb-3">FIRE-Formel</h5>
                                    <div className="p-4 bg-muted rounded-xl text-center">
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Ben&ouml;tigtes Kapital =
                                        </p>
                                        <p className="text-2xl font-bold text-amber-600">
                                            Jahresausgaben &times; 25
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            (bzw. Jahresausgaben &divide; 0,04)
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <h5 className="font-semibold text-foreground mb-3">Beispiele</h5>
                                    <div className="space-y-2">
                                        {[
                                            { ausgaben: "20.000 &euro;", kapital: "500.000 &euro;" },
                                            { ausgaben: "30.000 &euro;", kapital: "750.000 &euro;" },
                                            { ausgaben: "40.000 &euro;", kapital: "1.000.000 &euro;" },
                                            { ausgaben: "50.000 &euro;", kapital: "1.250.000 &euro;" },
                                        ].map((row, i) => (
                                            <div
                                                key={i}
                                                className="flex justify-between items-center p-2 px-3 bg-muted rounded-lg text-sm"
                                            >
                                                <span className="text-muted-foreground">{row.ausgaben} Ausgaben</span>
                                                <ArrowRight className="w-4 h-4 text-muted-foreground mx-2" />
                                                <span className="font-semibold text-foreground">{row.kapital}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-4">
                                <strong>Hinweis:</strong> Die 4%-Regel basiert auf US-Daten. F&uuml;r
                                Deutschland empfehlen Experten eine konservative Entnahmerate von
                                3&ndash;3,5 % aufgrund von Steuern und Krankenversicherungskosten.
                            </p>
                        </CardContent>
                    </Card>

                    <div>
                        <h3 className="text-2xl font-bold text-foreground mb-6">FIRE-Varianten</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <VariantCard
                                icon={PiggyBank}
                                title="Lean FIRE"
                                description="Minimalistischer Lebensstil mit geringen Ausgaben. Frugalismus steht im Fokus &ndash; bewusst verzichten, um fr&uuml;h frei zu sein."
                                capital="375.000 &ndash; 750.000 &euro;"
                                color="amber"
                            />
                            <VariantCard
                                icon={Sparkles}
                                title="Fat FIRE"
                                description="Komfortabler Ruhestand mit h&ouml;heren Ausgaben. F&uuml;r Gutverdiener, die ihren Lebensstandard halten m&ouml;chten."
                                capital="ab 2.000.000 &euro;"
                                color="purple"
                            />
                            <VariantCard
                                icon={Clock}
                                title="Barista FIRE"
                                description="Wechsel in Teilzeit statt Voll-Ruhestand. Das Portfolio deckt ca. 50 % der Ausgaben, ein Teilzeitjob den Rest."
                                capital="individuell"
                                color="blue"
                            />
                            <VariantCard
                                icon={TrendingUp}
                                title="Coast FIRE"
                                description="Fr&uuml;h ein Kapital ansparen, das durch Zinseszins bis zur Rente auf die FIRE-Zahl anw&auml;chst. Danach nur noch den Lebensunterhalt decken."
                                capital="individuell"
                                color="green"
                            />
                        </div>
                    </div>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-amber-600">
                                Die Sparquote als Hebel
                            </CardTitle>
                            <CardDescription>
                                Je h&ouml;her deine Sparquote, desto schneller erreichst du FIRE
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    {[
                                        { quote: "10 %", jahre: "~51 Jahre" },
                                        { quote: "20 %", jahre: "~37 Jahre" },
                                        { quote: "30 %", jahre: "~28 Jahre" },
                                        { quote: "40 %", jahre: "~22 Jahre" },
                                    ].map((row, i) => (
                                        <div
                                            key={i}
                                            className="flex justify-between items-center p-2 px-3 bg-muted rounded-lg text-sm"
                                        >
                                            <span className="text-muted-foreground">{row.quote} Sparquote</span>
                                            <span className="font-semibold text-foreground">{row.jahre}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    {[
                                        { quote: "50 %", jahre: "~17 Jahre" },
                                        { quote: "60 %", jahre: "~12,5 Jahre" },
                                        { quote: "70 %", jahre: "~8,5 Jahre" },
                                        { quote: "80 %", jahre: "~5,5 Jahre" },
                                    ].map((row, i) => (
                                        <div
                                            key={i}
                                            className="flex justify-between items-center p-2 px-3 bg-muted rounded-lg text-sm"
                                        >
                                            <span className="text-muted-foreground">{row.quote} Sparquote</span>
                                            <span className="font-semibold text-foreground">{row.jahre}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-4">
                                Bei angenommener 7 % Rendite. Quelle: Nettoeinkommen minus Ausgaben =
                                Sparrate. Die &quot;Live below your means&quot;-Philosophie ist der
                                Schl&uuml;ssel.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow border-amber-200 dark:border-amber-800">
                        <CardHeader>
                            <CardTitle className="text-amber-600">FIRE in Deutschland</CardTitle>
                            <CardDescription>Besonderheiten f&uuml;r den deutschen Markt</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h5 className="font-semibold text-red-600 mb-3">Herausforderungen</h5>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                                            H&ouml;here Steuer- und Abgabenlast als in den USA
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                                            Abgeltungssteuer (26,375 %) auf Kapitalertr&auml;ge
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                                            Krankenversicherungspflicht als Privatier
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-semibold text-green-600 mb-3">Chancen</h5>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                            Gesetzliche Rente als Basis-Sicherheit ab 67
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                            G&uuml;nstigere KV als in den USA
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                            Soziales Sicherheitsnetz als Ultima Ratio
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ==================== TAB 3: KOSTEN OPTIMIEREN ==================== */}
                <TabsContent value="optimierung" className="space-y-8">
                    <Card className="hover:shadow-lg transition-shadow border-green-200 dark:border-green-800">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Lightbulb className="w-6 h-6 text-green-600" />
                                <CardTitle className="text-green-600">Der Mindset-Shift</CardTitle>
                            </div>
                            <CardDescription>
                                Sparen bedeutet nicht Verzicht &ndash; sondern bewusster Konsum
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                            <p>
                                Jeder gesparte Euro ist steuerfrei, w&auml;hrend ein verdienter Euro
                                versteuert werden muss. Fixkosten zu senken wirkt dauerhaft &ndash; eine
                                einmalige Anpassung spart dir jeden Monat Geld. Der &quot;Latte-Faktor&quot;:
                                Kleine, regelm&auml;&szlig;ige Ausgaben summieren sich &uuml;ber Jahre zu
                f&uuml;nfstelligen Betr&auml;gen.
                            </p>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="p-4 bg-green-50 dark:bg-green-950/10 rounded-xl text-center">
                                    <h5 className="font-semibold text-green-600 mb-1">30-Tage-Regel</h5>
                                    <p className="text-xs">Gro&szlig;e Anschaffungen 30 Tage bedenken</p>
                                </div>
                                <div className="p-4 bg-green-50 dark:bg-green-950/10 rounded-xl text-center">
                                    <h5 className="font-semibold text-green-600 mb-1">Stundenlohn-Rechnung</h5>
                                    <p className="text-xs">Wie viele Stunden Arbeit kostet der Artikel?</p>
                                </div>
                                <div className="p-4 bg-green-50 dark:bg-green-950/10 rounded-xl text-center">
                                    <h5 className="font-semibold text-green-600 mb-1">Bewusst g&ouml;nnen</h5>
                                    <p className="text-xs">F&uuml;r Dinge ausgeben, die wirklich z&auml;hlen</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-green-600">Abo- &amp; Vertrags-Audit</CardTitle>
                            <CardDescription>
                                Der gr&ouml;&szlig;te Hebel f&uuml;r schnelle Einsparungen
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="p-4 bg-blue-50 dark:bg-blue-950/10 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">1</span>
                                        <h5 className="font-semibold text-sm">Alle Abos finden</h5>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Kontoausz&uuml;ge, PayPal, Amazon, App-Store pr&uuml;fen.
                                        E-Mail nach &quot;Abo&quot;, &quot;Rechnung&quot; durchsuchen.
                                    </p>
                                </div>
                                <div className="p-4 bg-green-50 dark:bg-green-950/10 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white text-xs font-bold">2</span>
                                        <h5 className="font-semibold text-sm">Jedes Abo pr&uuml;fen</h5>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Nutze ich es aktiv? Gibt es ein g&uuml;nstigeres &Auml;quivalent?
                                        Familien-/Jahresabo m&ouml;glich?
                                    </p>
                                </div>
                                <div className="p-4 bg-orange-50 dark:bg-orange-950/10 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-600 text-white text-xs font-bold">3</span>
                                        <h5 className="font-semibold text-sm">K&uuml;ndigen oder verhandeln</h5>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        K&uuml;ndigungsbutton nutzen, Bestandskunden-Tarife pr&uuml;fen,
                                        Erinnerung im Kalender notieren.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-green-600">Versicherungen optimieren</CardTitle>
                                <CardDescription>Richtige Absicherung ohne &Uuml;berversicherung</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="p-3 bg-green-50 dark:bg-green-950/10 rounded-lg">
                                    <h5 className="font-semibold text-green-600 mb-1">Unverzichtbar</h5>
                                    <p className="text-xs text-muted-foreground">
                                        Private Haftpflicht, BU, Kfz-Haftpflicht
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-50 dark:bg-blue-950/10 rounded-lg">
                                    <h5 className="font-semibold text-blue-600 mb-1">Sinnvoll</h5>
                                    <p className="text-xs text-muted-foreground">
                                        Hausrat, Rechtsschutz, Zahnzusatz
                                    </p>
                                </div>
                                <div className="p-3 bg-red-50 dark:bg-red-950/10 rounded-lg">
                                    <h5 className="font-semibold text-red-600 mb-1">Meist &uuml;berfl&uuml;ssig</h5>
                                    <p className="text-xs text-muted-foreground">
                                        Handy-, Reisegep&auml;ck-, Glasbruch-, Brillenversicherung
                                    </p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    <strong>Tipp:</strong> J&auml;hrliche Zahlung statt monatlich spart
                                    4&ndash;9 %. Selbstbeteiligung erh&ouml;hen senkt den Beitrag massiv.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-green-600">Energie &amp; Lebensmittel</CardTitle>
                                <CardDescription>Allt&auml;gliche Einsparpotenziale</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="p-3 bg-amber-50 dark:bg-amber-950/10 rounded-lg">
                                    <h5 className="font-semibold text-amber-600 mb-1">Energie</h5>
                                    <p className="text-xs text-muted-foreground">
                                        J&auml;hrlicher Anbieterwechsel spart 250&ndash;500 &euro;.
                                        1 &deg;C weniger = 6 % Heizkostenersparnis. Standby vermeiden.
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-50 dark:bg-purple-950/10 rounded-lg">
                                    <h5 className="font-semibold text-purple-600 mb-1">Telefon &amp; Internet</h5>
                                    <p className="text-xs text-muted-foreground">
                                        Nach Mindestlaufzeit k&uuml;ndigen &amp; wechseln spart 10&ndash;20
                                        &euro;/Monat (120&ndash;240 &euro;/Jahr).
                                    </p>
                                </div>
                                <div className="p-3 bg-green-50 dark:bg-green-950/10 rounded-lg">
                                    <h5 className="font-semibold text-green-600 mb-1">Lebensmittel</h5>
                                    <p className="text-xs text-muted-foreground">
                                        Wochenplan, Einkaufsliste, Eigenmarken, saisonal kaufen &ndash;
                                        bis zu 50 &euro;/Monat pro Person sparen. Too-Good-To-Go nutzen.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="hover:shadow-lg transition-shadow border-green-200 dark:border-green-800">
                        <CardHeader>
                            <CardTitle className="text-green-600">
                                Jahreszahlung statt Monatszahlung
                            </CardTitle>
                            <CardDescription>
                                Der untersch&auml;tzte Hebel f&uuml;r dauerhafte Ersparnis
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <h5 className="font-semibold text-sm text-foreground mb-2">Typische Aufschl&auml;ge bei Monatszahlung</h5>
                                    {[
                                        { vertrag: "Kfz-Versicherung", aufschlag: "4&ndash;9 %" },
                                        { vertrag: "Privathaftpflicht", aufschlag: "~6 %" },
                                        { vertrag: "Hausratversicherung", aufschlag: "~4 %" },
                                        { vertrag: "Streaming-Dienste", aufschlag: "15&ndash;25 %" },
                                        { vertrag: "Fitnessstudio", aufschlag: "1&ndash;2 Monatsbeitr&auml;ge" },
                                    ].map((row, i) => (
                                        <div
                                            key={i}
                                            className="flex justify-between items-center p-2 px-3 bg-muted rounded-lg text-sm"
                                        >
                                            <span className="text-muted-foreground">{row.vertrag}</span>
                                            <span className="font-semibold text-foreground">{row.aufschlag}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col justify-center">
                                    <div className="p-5 bg-green-50 dark:bg-green-950/10 rounded-xl text-center">
                                        <h5 className="font-semibold text-green-600 mb-2">Beispiel Kfz-Versicherung</h5>
                                        <div className="flex justify-center items-center gap-4 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">J&auml;hrlich</p>
                                                <p className="text-2xl font-bold text-green-600">500 &euro;</p>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-muted-foreground" />
                                            <div>
                                                <p className="text-muted-foreground">Monatlich</p>
                                                <p className="text-2xl font-bold text-red-600">543 &euro;</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Effektiver Zins: ~16 % p.a. f&uuml;r die monatliche Zahlweise
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-green-600">Gesamtersparnis pro Jahr</CardTitle>
                            <CardDescription>
                                So viel kannst du durch optimiertes Geldmanagement sparen
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {[
                                    { massnahme: "Strom-/Gas-Anbieterwechsel", ersparnis: "250&ndash;500 &euro;" },
                                    { massnahme: "Versicherungs-Check + Wechsel", ersparnis: "200&ndash;500 &euro;" },
                                    { massnahme: "Telefon/Internet optimieren", ersparnis: "120&ndash;240 &euro;" },
                                    { massnahme: "Abos reduzieren", ersparnis: "100&ndash;250 &euro;" },
                                    { massnahme: "Kfz-Versicherung wechseln", ersparnis: "200&ndash;500 &euro;" },
                                    { massnahme: "Lebensmittel optimieren", ersparnis: "360&ndash;600 &euro;" },
                                    { massnahme: "J&auml;hrliche Zahlung (alle Vers.)", ersparnis: "100&ndash;300 &euro;" },
                                ].map((row, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between items-center p-2 px-3 bg-muted rounded-lg text-sm"
                                    >
                                        <span className="text-muted-foreground">{row.massnahme}</span>
                                        <span className="font-semibold text-green-600">{row.ersparnis}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center p-3 px-4 bg-green-100 dark:bg-green-900/20 rounded-xl text-sm font-bold mt-2">
                                    <span className="text-green-800 dark:text-green-300">Gesamtpotenzial</span>
                                    <span className="text-green-800 dark:text-green-300">
                                        1.300&ndash;2.900 &euro; / Jahr
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 p-4 bg-muted rounded-xl">
                                <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    N&auml;chste Schritte
                                </h5>
                                <p className="text-sm text-muted-foreground">
                                    Starte mit einem Abo-Audit &uuml;ber deine Kontoausz&uuml;ge der
                                    letzten 90 Tage. Pr&uuml;fe dann deine Versicherungen auf
                                    Doppelversicherungen und wechsle zu j&auml;hrlicher Zahlung.
                                    Parallel dazu den Strom- und Gasanbieter vergleichen.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
