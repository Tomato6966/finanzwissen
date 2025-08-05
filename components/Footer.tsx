"use client";
import Image from "next/image";

export default function Footer() {
    return <footer className="bg-white dark:bg-card border-t dark:border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            </div>
        </div>
    </footer>;
}
