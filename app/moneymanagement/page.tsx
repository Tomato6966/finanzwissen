import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HouseHoldPage() {
    return <div className="space-y-8">
        <span className="bg-red-500 text-white"> TO BE FILLED ?!? </span>
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-foreground mb-4">Haushalt & Überblick schaffen</h2>
            <p className="text-xl text-gray-600 dark:text-muted-foreground max-w-3xl mx-auto">
                Verschaffen Sie sich einen klaren Überblick über Ihre Finanzen und schaffen Sie die Grundlage für
                finanzielle Stabilität.
            </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow dark:bg-card dark:border-border">
                <CardHeader>
                    <CardTitle className="text-blue-600">Einnahmen/Ausgaben tracken</CardTitle>
                    <CardDescription>Behalten Sie den Überblick über Ihr Geld</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <h4 className="font-semibold">Empfohlene Tools:</h4>
                        <div className="grid grid-cols-1 gap-3">
                            <div className="p-3 bg-blue-50 dark:bg-muted rounded-lg">
                                <h5 className="font-medium">Apps</h5>
                                <p className="text-sm text-muted-foreground">YNAB, Mint, MoneyControl, Finanzguru</p>
                            </div>
                            <div className="p-3 bg-green-50 dark:bg-muted rounded-lg">
                                <h5 className="font-medium">Excel/Google Sheets</h5>
                                <p className="text-sm text-muted-foreground">Individuelle Anpassung möglich</p>
                            </div>
                            <div className="p-3 bg-purple-50 dark:bg-muted rounded-lg">
                                <h5 className="font-medium">Notion</h5>
                                <p className="text-sm text-muted-foreground">All-in-One Lösung mit Templates</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow dark:bg-card dark:border-border">
                <CardHeader>
                    <CardTitle className="text-green-600">Fixkosten identifizieren</CardTitle>
                    <CardDescription>Regelmäßige Ausgaben im Blick behalten</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <h4 className="font-semibold">Typische Fixkosten:</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                Miete/Hypothek
                            </div>
                            <div className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                Versicherungen
                            </div>
                            <div className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                Strom/Gas/Wasser
                            </div>
                            <div className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                Internet/Handy
                            </div>
                            <div className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                Abonnements
                            </div>
                            <div className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                Kredite/Raten
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2 hover:shadow-lg transition-shadow dark:bg-card dark:border-border">
                <CardHeader>
                    <CardTitle className="text-orange-600">Notgroschen definieren</CardTitle>
                    <CardDescription>Ihr finanzielles Sicherheitsnetz für unvorhergesehene Ausgaben</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                            <h4 className="font-semibold text-orange-600 mb-2">3 Monate</h4>
                            <p className="text-sm text-muted-foreground">Minimum für Singles mit sicherem Job</p>
                        </div>
                        <div className="text-center p-4 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                            <h4 className="font-semibold text-orange-600 mb-2">4-5 Monate</h4>
                            <p className="text-sm text-muted-foreground">Empfohlen für Familien oder unsichere Jobs</p>
                        </div>
                        <div className="text-center p-4 bg-orange-200 dark:bg-orange-800/20 rounded-lg">
                            <h4 className="font-semibold text-orange-600 mb-2">6+ Monate</h4>
                            <p className="text-sm text-muted-foreground">Für Selbstständige oder sehr unsichere Situationen</p>
                        </div>
                    </div>
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-2">🛠 Tool: Beispiel-Haushaltsplan</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                            Laden Sie unsere kostenlose Haushaltsplan-Vorlage herunter und passen Sie sie an Ihre Bedürfnisse
                            an.
                        </p>
                        <Button className="w-full sm:w-auto">Haushaltsplan herunterladen</Button>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-foreground mb-4">Ziele & Prioritäten setzen</h2>
                <p className="text-xl text-gray-600 dark:text-muted-foreground max-w-3xl mx-auto">
                    Definieren Sie klare finanzielle Ziele und erstellen Sie einen Plan zu deren Erreichung.
                </p>
            </div>

            <Card className="hover:shadow-lg transition-shadow mb-8 dark:bg-card dark:border-border">
                <CardHeader>
                    <CardTitle className="text-blue-600">SMART Ziele formulieren</CardTitle>
                    <CardDescription>Machen Sie Ihre finanziellen Ziele konkret und erreichbar</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-5 gap-4">
                        <div className="text-center p-4 bg-blue-50 dark:bg-muted rounded-lg">
                            <h4 className="font-bold text-blue-600 mb-2">S</h4>
                            <h5 className="font-semibold mb-1">Spezifisch</h5>
                            <p className="text-xs text-muted-foreground">Klar definiert</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 dark:bg-muted rounded-lg">
                            <h4 className="font-bold text-green-600 mb-2">M</h4>
                            <h5 className="font-semibold mb-1">Messbar</h5>
                            <p className="text-xs text-muted-foreground">Quantifizierbar</p>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 dark:bg-muted rounded-lg">
                            <h4 className="font-bold text-yellow-600 mb-2">A</h4>
                            <h5 className="font-semibold mb-1">Attraktiv</h5>
                            <p className="text-xs text-muted-foreground">Motivierend</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 dark:bg-muted rounded-lg">
                            <h4 className="font-bold text-purple-600 mb-2">R</h4>
                            <h5 className="font-semibold mb-1">Realistisch</h5>
                            <p className="text-xs text-muted-foreground">Erreichbar</p>
                        </div>
                        <div className="text-center p-4 bg-red-50 dark:bg-muted rounded-lg">
                            <h4 className="font-bold text-red-600 mb-2">T</h4>
                            <h5 className="font-semibold mb-1">Terminiert</h5>
                            <p className="text-xs text-muted-foreground">Zeitlich begrenzt</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-3 gap-8">
                <Card className="hover:shadow-lg transition-shadow dark:bg-card dark:border-border">
                    <CardHeader>
                        <CardTitle className="text-green-600">Kurzfristige Ziele</CardTitle>
                        <CardDescription>0-2 Jahre</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-3 bg-green-50 dark:bg-muted rounded-lg">
                                <h5 className="font-semibold">Notgroschen aufbauen</h5>
                                <p className="text-sm text-muted-foreground">3-6 Monatsausgaben sparen</p>
                            </div>
                            <div className="p-3 bg-green-50 dark:bg-muted rounded-lg">
                                <h5 className="font-semibold">Schulden tilgen</h5>
                                <p className="text-sm text-muted-foreground">Hochverzinste Kredite zuerst</p>
                            </div>
                            <div className="p-3 bg-green-50 dark:bg-muted rounded-lg">
                                <h5 className="font-semibold">Urlaub finanzieren</h5>
                                <p className="text-sm text-muted-foreground">Ohne neue Schulden</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow dark:bg-card dark:border-border">
                    <CardHeader>
                        <CardTitle className="text-blue-600">Mittelfristige Ziele</CardTitle>
                        <CardDescription>2-10 Jahre</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-3 bg-blue-50 dark:bg-muted rounded-lg">
                                <h5 className="font-semibold">Eigenkapital für Immobilie</h5>
                                <p className="text-sm text-muted-foreground">20% des Kaufpreises</p>
                            </div>
                            <div className="p-3 bg-blue-50 dark:bg-muted rounded-lg">
                                <h5 className="font-semibold">Auto-Ersatz</h5>
                                <p className="text-sm text-muted-foreground">Ohne Finanzierung</p>
                            </div>
                            <div className="p-3 bg-blue-50 dark:bg-muted rounded-lg">
                                <h5 className="font-semibold">Weiterbildung</h5>
                                <p className="text-sm text-muted-foreground">Investition in sich selbst</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow dark:bg-card dark:border-border">
                    <CardHeader>
                        <CardTitle className="text-purple-600">Langfristige Ziele</CardTitle>
                        <CardDescription>10+ Jahre</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-3 bg-purple-50 dark:bg-muted rounded-lg">
                                <h5 className="font-semibold">Altersvorsorge</h5>
                                <p className="text-sm text-muted-foreground">Rente mit 67 oder früher</p>
                            </div>
                            <div className="p-3 bg-purple-50 dark:bg-muted rounded-lg">
                                <h5 className="font-semibold">Finanzielle Unabhängigkeit</h5>
                                <p className="text-sm text-muted-foreground">Passives Einkommen &gt; Ausgaben</p>
                            </div>
                            <div className="p-3 bg-purple-50 dark:bg-muted rounded-lg">
                                <h5 className="font-semibold">Immobilie abbezahlen</h5>
                                <p className="text-sm text-muted-foreground">Schuldenfreies Eigenheim</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="hover:shadow-lg transition-shadow dark:bg-card dark:border-border">
                <CardHeader>
                    <CardTitle className="text-orange-600">Beispiel: SMART Ziel formulieren</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-red-600 mb-3">❌ Schlecht formuliert:</h4>
                            <p className="text-muted-foreground italic">&quot;Ich möchte mehr Geld sparen.&quot;</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-green-600 mb-3">✅ SMART formuliert:</h4>
                            <p className="text-muted-foreground">
                            &quot;Ich spare bis zum 31.12.2024 <strong>10.000€</strong> für meinen Notgroschen, indem ich jeden
                                Monat <strong>500€</strong> automatisch auf ein separates Tagesgeldkonto überweise.&quot;
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
    </div>;
}
