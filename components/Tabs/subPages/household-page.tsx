import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function HouseHoldPage() {
    return <div className="space-y-8">
        <span className="bg-red-500 text-white"> TO BE FILLED ?!? </span>
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Haushalt & Überblick schaffen</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Verschaffen Sie sich einen klaren Überblick über Ihre Finanzen und schaffen Sie die Grundlage für
                finanzielle Stabilität.
            </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="text-blue-600">Einnahmen/Ausgaben tracken</CardTitle>
                    <CardDescription>Behalten Sie den Überblick über Ihr Geld</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <h4 className="font-semibold">Empfohlene Tools:</h4>
                        <div className="grid grid-cols-1 gap-3">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <h5 className="font-medium">Apps</h5>
                                <p className="text-sm text-gray-600">YNAB, Mint, MoneyControl, Finanzguru</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <h5 className="font-medium">Excel/Google Sheets</h5>
                                <p className="text-sm text-gray-600">Individuelle Anpassung möglich</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <h5 className="font-medium">Notion</h5>
                                <p className="text-sm text-gray-600">All-in-One Lösung mit Templates</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
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

            <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="text-orange-600">Notgroschen definieren</CardTitle>
                    <CardDescription>Ihr finanzielles Sicherheitsnetz für unvorhergesehene Ausgaben</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <h4 className="font-semibold text-orange-600 mb-2">3 Monate</h4>
                            <p className="text-sm text-gray-700">Minimum für Singles mit sicherem Job</p>
                        </div>
                        <div className="text-center p-4 bg-orange-100 rounded-lg">
                            <h4 className="font-semibold text-orange-600 mb-2">4-5 Monate</h4>
                            <p className="text-sm text-gray-700">Empfohlen für Familien oder unsichere Jobs</p>
                        </div>
                        <div className="text-center p-4 bg-orange-200 rounded-lg">
                            <h4 className="font-semibold text-orange-600 mb-2">6+ Monate</h4>
                            <p className="text-sm text-gray-700">Für Selbstständige oder sehr unsichere Situationen</p>
                        </div>
                    </div>
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold mb-2">🛠 Tool: Beispiel-Haushaltsplan</h4>
                        <p className="text-sm text-gray-700 mb-3">
                            Laden Sie unsere kostenlose Haushaltsplan-Vorlage herunter und passen Sie sie an Ihre Bedürfnisse
                            an.
                        </p>
                        <Button className="w-full sm:w-auto">Haushaltsplan herunterladen</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>;
}
