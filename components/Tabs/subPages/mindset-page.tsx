"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MindSetPage() {
    return <div className="space-y-8">
    <div className="text-center mb-12">
        <span className="bg-red-500 text-white"> TO BE FILLED ?!? </span>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Mindset & Überblick</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Der erste Schritt zu finanzieller Freiheit beginnt mit dem richtigen Mindset und einem klaren Überblick
            über Ihre finanzielle Situation.
        </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8">
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="text-blue-600">Warum finanzielle Bildung wichtig ist</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Finanzielle Unabhängigkeit erreichen
                    </li>
                    <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Bessere Entscheidungen bei Geld treffen
                    </li>
                    <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Schutz vor finanziellen Krisen
                    </li>
                    <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Langfristige Ziele verwirklichen
                    </li>
                </ul>
            </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="text-green-600">&quot;Reich sein&quot; vs. &quot;reich wirken&quot;</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-green-600 mb-2">Reich sein:</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Hohe Sparquote</li>
                            <li>• Investitionen in Vermögenswerte</li>
                            <li>• Langfristige Planung</li>
                            <li>• Bescheidener Lebensstil</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-red-600 mb-2">Reich wirken:</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Hohe Ausgaben für Status</li>
                            <li>• Schulden für Luxusgüter</li>
                            <li>• Kurzfristiges Denken</li>
                            <li>• Lifestyle-Inflation</li>
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="text-purple-600">Einkommen, Vermögen & Cashflow</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-purple-600 mb-1">Einkommen</h4>
                        <p className="text-sm text-gray-700">Geld, das Sie aktiv verdienen (Gehalt, Freelancing)</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-purple-600 mb-1">Vermögen</h4>
                        <p className="text-sm text-gray-700">Alles was Sie besitzen (Immobilien, Aktien, Sparguthaben)</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-purple-600 mb-1">Cashflow</h4>
                        <p className="text-sm text-gray-700">
                            Passives Einkommen aus Vermögenswerten (Dividenden, Mieten)
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</div>;
}
