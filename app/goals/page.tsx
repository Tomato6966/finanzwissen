import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function GoalsPage() {
    return (
        <div className="space-y-8">
            <span className="bg-red-500 text-white"> TO BE FILLED ?!? </span>
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Ziele & Prioritäten setzen</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Definieren Sie klare finanzielle Ziele und erstellen Sie einen Plan zu deren Erreichung.
                </p>
            </div>

            <Card className="hover:shadow-lg transition-shadow mb-8">
                <CardHeader>
                    <CardTitle className="text-blue-600">SMART Ziele formulieren</CardTitle>
                    <CardDescription>Machen Sie Ihre finanziellen Ziele konkret und erreichbar</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-5 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-bold text-blue-600 mb-2">S</h4>
                            <h5 className="font-semibold mb-1">Spezifisch</h5>
                            <p className="text-xs text-gray-600">Klar definiert</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <h4 className="font-bold text-green-600 mb-2">M</h4>
                            <h5 className="font-semibold mb-1">Messbar</h5>
                            <p className="text-xs text-gray-600">Quantifizierbar</p>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <h4 className="font-bold text-yellow-600 mb-2">A</h4>
                            <h5 className="font-semibold mb-1">Attraktiv</h5>
                            <p className="text-xs text-gray-600">Motivierend</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <h4 className="font-bold text-purple-600 mb-2">R</h4>
                            <h5 className="font-semibold mb-1">Realistisch</h5>
                            <p className="text-xs text-gray-600">Erreichbar</p>
                        </div>
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                            <h4 className="font-bold text-red-600 mb-2">T</h4>
                            <h5 className="font-semibold mb-1">Terminiert</h5>
                            <p className="text-xs text-gray-600">Zeitlich begrenzt</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-3 gap-8">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-green-600">Kurzfristige Ziele</CardTitle>
                        <CardDescription>0-2 Jahre</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-3 bg-green-50 rounded-lg">
                                <h5 className="font-semibold">Notgroschen aufbauen</h5>
                                <p className="text-sm text-gray-600">3-6 Monatsausgaben sparen</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <h5 className="font-semibold">Schulden tilgen</h5>
                                <p className="text-sm text-gray-600">Hochverzinste Kredite zuerst</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <h5 className="font-semibold">Urlaub finanzieren</h5>
                                <p className="text-sm text-gray-600">Ohne neue Schulden</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-blue-600">Mittelfristige Ziele</CardTitle>
                        <CardDescription>2-10 Jahre</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <h5 className="font-semibold">Eigenkapital für Immobilie</h5>
                                <p className="text-sm text-gray-600">20% des Kaufpreises</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <h5 className="font-semibold">Auto-Ersatz</h5>
                                <p className="text-sm text-gray-600">Ohne Finanzierung</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <h5 className="font-semibold">Weiterbildung</h5>
                                <p className="text-sm text-gray-600">Investition in sich selbst</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-purple-600">Langfristige Ziele</CardTitle>
                        <CardDescription>10+ Jahre</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <h5 className="font-semibold">Altersvorsorge</h5>
                                <p className="text-sm text-gray-600">Rente mit 67 oder früher</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <h5 className="font-semibold">Finanzielle Unabhängigkeit</h5>
                                <p className="text-sm text-gray-600">Passives Einkommen &gt; Ausgaben</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <h5 className="font-semibold">Immobilie abbezahlen</h5>
                                <p className="text-sm text-gray-600">Schuldenfreies Eigenheim</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="text-orange-600">Beispiel: SMART Ziel formulieren</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-red-600 mb-3">❌ Schlecht formuliert:</h4>
                            <p className="text-gray-700 italic">&quot;Ich möchte mehr Geld sparen.&quot;</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-green-600 mb-3">✅ SMART formuliert:</h4>
                            <p className="text-gray-700">
                            &quot;Ich spare bis zum 31.12.2024 <strong>10.000€</strong> für meinen Notgroschen, indem ich jeden
                                Monat <strong>500€</strong> automatisch auf ein separates Tagesgeldkonto überweise.&quot;
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
