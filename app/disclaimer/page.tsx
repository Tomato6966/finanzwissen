"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DisclaimerPage() {
    return (
        <div className="space-y-8">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-foreground mb-4">
                    Rechtlicher Hinweis (Disclaimer)
                </h2>
                <p className="text-xl text-gray-600 dark:text-muted-foreground max-w-3xl mx-auto">
                    Transparenz und Verantwortung: Was du über die Nutzung dieser Website wissen solltest.
                </p>
            </div>

            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="text-red-600">Keine Anlageberatung</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4 text-sm leading-relaxed">
                    <p>
                        Die auf dieser Website bereitgestellten Inhalte dienen ausschließlich zu allgemeinen
                        Informationszwecken. Sie stellen **weder eine Anlageberatung, Steuerberatung, noch eine
                        Empfehlung** zum Kauf oder Verkauf von Finanzinstrumenten dar.
                    </p>
                    <p>
                        Wir geben keine individuellen Handlungsempfehlungen. Die dargestellten Inhalte spiegeln
                        persönliche Meinungen oder öffentlich zugängliche Informationen wider und ersetzen keine
                        professionelle Beratung.
                    </p>
                </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="text-blue-600">Eigenverantwortung</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4 text-sm leading-relaxed">
                    <p>
                        Jeder Nutzer handelt auf eigene Verantwortung. Bevor du finanzielle Entscheidungen triffst,
                        solltest du deine persönliche Situation sorgfältig analysieren und ggf. professionelle Beratung
                        (z. B. durch einen Steuerberater oder Finanzexperten) in Anspruch nehmen.
                    </p>
                    <p>
                        Die Betreiber dieser Website übernehmen **keine Haftung für finanzielle Verluste oder Schäden**, die aus der Nutzung der bereitgestellten Informationen entstehen.
                    </p>
                </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="text-green-600">Keine Garantie auf Richtigkeit</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4 text-sm leading-relaxed">
                    <p>
                        Wir bemühen uns, die Inhalte aktuell, korrekt und verständlich zu halten – dennoch können sich
                        Informationen ändern oder Fehler enthalten sein. Es wird keine Garantie für die Richtigkeit,
                        Vollständigkeit oder Aktualität der Inhalte übernommen.
                    </p>
                </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="text-purple-600">Unabhängigkeit & Transparenz</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4 text-sm leading-relaxed">
                    <p>
                        Dieses Projekt ist ein **unabhängiges Community-Projekt**, das aus Interesse an finanzieller
                        Bildung entstanden ist. Es besteht **keine Verbindung zu offiziellen Marken, Institutionen oder Anbietern**.
                    </p>
                    <p>
                        Sollten dennoch markenrechtliche, urheberrechtliche oder datenschutzrechtliche Bedenken bestehen,
                        bitten wir um eine kurze Nachricht – wir kümmern uns schnellstmöglich darum.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
