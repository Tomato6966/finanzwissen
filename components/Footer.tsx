"use client";
import { Quote } from "lucide-react";
import Image from "next/image";

const Footer = () => (
    <footer className="bg-white dark:bg-card border-t dark:border-border bottom-0 h-full w-full flex-grow">

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/finanzwissen_community.png`}
                alt="FinanzWissen Logo"
                width={350}
                height={350}
                style={{ borderRadius: "25%", opacity: 0.1 }}
                className="absolute top-0 mt-8 left-0 object-cover -rotate-6"
            />
            <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/finanzwissen_community.png`}
                alt="FinanzWissen Logo"
                width={350}
                height={350}
                style={{ borderRadius: "25%", opacity: 0.1 }}
                className="absolute top-0 mt-8 right-0 object-cover rotate-6"
            />
            <div className="text-center">
                <div className="flex items-center space-x-2 justify-center mb-4">
                    <Image
                        className="w-8 h-8 mt-1"
                        src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/finanzwissen.png`}
                        width={120}
                        height={120}
                        alt="logo"
                    />
                    <span className="text-lg font-semibold">FinanzWissen</span>
                </div>
                <p className="text-gray-600 dark:text-muted-foreground">
                    Ein unabhängiges Projekt, das von engagierten Mitgliedern der <a href="https://www.youtube.com/c/Finanzfluss" className="text-blue-600 hover:underline">Finanzfluss</a> Community ins Leben gerufen wurde. Unser Ziel ist es, den Austausch von praktischem Finanzwissen zu fördern und eine Plattform für alle zu bieten, die ihre Finanzen selbst in die Hand nehmen möchten.
                </p>
                <p className="italic text-gray-500 dark:text-muted-foreground mt-2">
                    Wichtiger Hinweis: Dies ist ein unabhängiges Projekt. Wir stehen in keiner direkten Verbindung zur Marke oder den Betreibern von <a href="https://finanzfluss.de" className="text-blue-600 hover:underline">Finanzfluss</a>.
                </p>
                <p className="text-gray-500 dark:text-muted-foreground mt-6">
                    <a target="_blank" href="https://github.com/Tomato6966/finanzwissen" className="text-blue-500 dark:text-blue-300 text-lg bg-blue-300/30 dark:bg-blue-300/10 hover:bg-purple-300/50 dark:hover:bg-purple-300/20 p-4 rounded-lg hover:underline hover:text-purple-500 dark:hover:text-purple-300">♥️ GitHub Repository - Contribute / Share / Like</a>
                </p>
                <div className="text-sm text-gray-400 dark:text-muted-foreground mt-6 mx-auto leading-relaxed border-t-2 pt-2">
                    <strong className="flex items-center gap-2 w-full justify-center">
                    <Quote className="w-12 h-12" />
                        Haftungsausschluss:
                    </strong>
                    <blockquote className="relative">

                        <span className="h-full">Die auf dieser Website bereitgestellten Informationen stellen keine Anlageberatung oder Empfehlung zum Kauf oder Verkauf von Finanzinstrumenten dar. Alle Inhalte dienen ausschließlich der allgemeinen Information und ersetzen keine individuelle Beratung durch dafür qualifizierte Personen. Die Nutzung der Inhalte erfolgt auf eigene Verantwortung. Jegliche Haftung für Vermögensschäden, die durch die Nutzung der angebotenen Inhalte entstehen, ist ausgeschlossen.</span>
                    </blockquote>
                </div>
                <p className="text-sm text-gray-500 dark:text-muted-foreground mt-2 italic">
                    Weitere rechtliche Hinweise findest du in unserem <a href="/disclaimer" className="text-blue-600 hover:underline">Disclaimer</a>.
                </p>
            </div>
        </div>
    </footer>
);

export default Footer;
