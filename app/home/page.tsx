"use client"

import {
	ArrowRight, BookOpen, ExternalLink, Lightbulb, PiggyBank, Target, TrendingUpDown
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { quickLinks } from "@/lib/HomePageConstants";
import { Separator } from "@radix-ui/react-separator";

import LinkButton from "../../components/ui/linkButton";

export default function HomePage() {
    return (
        <div>
            {/* Hero Section */}
            <div className="text-center py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-foreground mb-6">
                        Ihre Reise zur <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            finanziellen Freiheit
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-muted-foreground mb-8 leading-relaxed">
                        Lernen Sie die Grundlagen des Geldmanagements, investieren Sie intelligent und bauen Sie langfristig
                        Vermögen auf. Kostenlose Ressourcen, praktische Tools und Expertenwissen - alles an einem Ort.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickLinks.map((link, index) => (
                        <Card key={index} className="hover:shadow-lg transition-all duration-300 group hover:bg-gradient-to-br hover:from-blue-500/30 hover:to-purple-500/30">
                            <CardContent className="p-6">
                                <div className="flex flex-wrap justify-start items-center space-x-2">
                                    <div
                                        className={`w-12 h-12 ${link.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                                    >
                                        <link.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-card-foreground mb-2">{link.title}</h3>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-muted-foreground text-start mb-4 italic">{link.description}</p>

                                <LinkButton
                                    href={link.activePage}
                                    className="flex items-center text-sm font-medium"
                                    variant="default"
                                >
                                    Mehr erfahren
                                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </LinkButton>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <Separator className="border-2 my-8" />

            <div>
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-foreground mb-4">Ratschläge der Community</h2>
                    <p className="text-lg text-gray-600 dark:text-muted-foreground max-w-3xl mx-auto flex flex-wrap gap-8 justify-center">
                        <div className="text-gray-600 dark:text-muted-foreground w-full">
                            Community-Tipps, -Tutorials, -Strategien, ...
                        </div>
                        <div className="text-gray-600 dark:text-muted-foreground italic w-full">
                            Von der Community geteilte Strategien, Tipps und Erfahrungen.
                            Lerne von der FF-Community.
                            Erfahre von Strategien und mehr.
                        </div>
                        <LinkButton href="/community" variant="outline" className="text-gray-600 dark:text-muted-foreground">
                            <ExternalLink className="w-4 h-4 mr-2" /> Community-Tipps, -Tutorials, -Strategien, ...
                        </LinkButton>
                    </p>
                </div>
            </div>

            <Separator className="border-2 my-8" />

            <div className="bg-card rounded-2xl p-8 shadow-lg">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-foreground mb-4">Warum FinanzWissen?</h2>
                    <p className="text-lg text-gray-600 dark:text-muted-foreground">
                        Ihre All-in-One Plattform für finanzielle Bildung, finanzielle Strategien, Geldmanagement, finanzielle Rechner und mehr
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-card-foreground mb-2">Umfassende Bildung</h3>
                        <p className="text-gray-600 dark:text-muted-foreground">
                            Von Grundlagen bis zu fortgeschrittenen Strategien - lernen Sie in Ihrem eigenen Tempo
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-card-foreground mb-2">Praktische Tools</h3>
                        <p className="text-gray-600 dark:text-muted-foreground">
                            Rechner, Vorlagen und Analysen für bessere finanzielle Entscheidungen
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lightbulb className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-card-foreground mb-2">Community-Tipps</h3>
                        <p className="text-gray-600 dark:text-muted-foreground">
                            Von der Community geteilte Strategien, Tipps und Erfahrungen.
                        </p>
                    </div>
                </div>
            </div>

            <Separator className="border-2 my-8" />

            <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <h2 className="text-3xl font-bold mb-4">Bereit für Ihre finanzielle Transformation?</h2>
                <p className="text-xl mb-6 opacity-90">Starten Sie noch heute mit unseren kostenlosen Ressourcen und Tools</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <LinkButton href="/tools" size="lg" variant="secondary" className="text-lg px-8 py-3">
                        <BookOpen className="w-5 h-5 mr-2" />
                        Lernmaterialien & Tools erkunden
                    </LinkButton>
                    <LinkButton
                        size="lg"
                        variant="outline"
                        href="/calculators#budget-analysis"
                        className="text-lg px-8 py-3 border-white text-white hover:bg-white bg-transparent"
                    >
                        <PiggyBank className="w-5 h-5 mr-2" />
                        Budget analysieren
                    </LinkButton>
                    <LinkButton
                        size="lg"
                        variant="outline"
                        href="/calculators#budget-analysis"
                        className="text-lg px-8 py-3 border-white text-white hover:bg-white bg-transparent"
                    >
                        <TrendingUpDown className="w-5 h-5 mr-2" />
                        Alters-Vorsorge berechnen
                    </LinkButton>
                </div>
            </div>
        </div>
    )
}
