"use client"

import {
	ArrowRight, BookOpen, Download, ExternalLink, Lightbulb, Target, TrendingUp
} from "lucide-react";
import Image from "next/image";
import { useContext } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";

import { PageContext } from "../../../Context/PageContext";
import { pdfResources, quickLinks } from "../../../lib/HomePageConstants";

export function HomePage() {
    const { setActiveTab } = useContext(PageContext);

    return (
        <div>
            {/* Hero Section */}
            <div className="text-center py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                        Ihre Reise zur <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            finanziellen Freiheit
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
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
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{link.title}</h3>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 text-start mb-4 italic">{link.description}</p>

                                <Button
                                    onClick={() => setActiveTab(link.activePage)}
                                    className="flex items-center text-sm font-medium"
                                    variant="default"
                                >
                                    Mehr erfahren
                                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <Separator className="border-2 my-8" />

            <div>
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Kostenlose PDF-Ressourcen</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Laden Sie unsere umfassenden Leitfäden herunter und starten Sie Ihre finanzielle Bildungsreise noch heute.
                        Alle PDFs sind kostenlos und sofort verfügbar.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pdfResources.map((resource, index) => (
                        <Card
                            key={index}
                            className="hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col justify-between min-h-[420px] hover:bg-gradient-to-br hover:from-blue-500/30 hover:to-purple-500/30"
                        >
                            <div>
                                <div className="relative overflow-hidden">
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}${resource.image || "/placeholder.svg"}`}
                                        alt={resource.title}
                                        width={800}
                                        height={192}
                                        className="h-48 w-full object-fill group-hover:scale-105 transition-transform duration-300"
                                        unoptimized
                                    />
                                    <Badge className="absolute top-3 left-3 bg-white/90 text-gray-900">
                                        {resource.category}
                                    </Badge>
                                </div>

                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg text-gray-900 dark:text-white group-hover:text-blue-600 group-hover:font-bold dark:group-hover:text-blue-400 transition-colors">
                                        {resource.title}
                                    </CardTitle>
                                    <CardDescription className="text-gray-600 dark:text-gray-300">
                                        {resource.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {resource.topics.map((topic, topicIndex) => (
                                            <Badge key={topicIndex} variant="secondary" className="text-xs">
                                                {topic}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </div>

                            <div className="px-6 pb-6">
                                <div className="flex gap-2">
                                    <Button className="flex-1" size="sm">
                                        <Download className="w-4 h-4 mr-2" />
                                        PDF herunterladen
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <ExternalLink className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            <Separator className="border-2 my-8" />

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Warum FinanzWissen?</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Ihre All-in-One Plattform für finanzielle Bildung und praktische Tools
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Umfassende Bildung</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Von Grundlagen bis zu fortgeschrittenen Strategien - lernen Sie in Ihrem eigenen Tempo
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Praktische Tools</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Rechner, Vorlagen und KI-gestützte Analysen für bessere finanzielle Entscheidungen
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lightbulb className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Personalisiert</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Individuelle Empfehlungen und Analysen basierend auf Ihrer persönlichen Situation
                        </p>
                    </div>
                </div>
            </div>

            <Separator className="border-2 my-8" />

            <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <h2 className="text-3xl font-bold mb-4">Bereit für Ihre finanzielle Transformation?</h2>
                <p className="text-xl mb-6 opacity-90">Starten Sie noch heute mit unseren kostenlosen Ressourcen und Tools</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => setActiveTab("tools")} size="lg" variant="secondary" className="text-lg px-8 py-3">
                        <BookOpen className="w-5 h-5 mr-2" />
                        Lernmaterialien & Tools erkunden
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => setActiveTab("budget-analysis")}
                        className="text-lg px-8 py-3 border-white text-white hover:bg-white bg-transparent"
                    >
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Budget analysieren
                    </Button>
                </div>
            </div>
        </div>
    )
}
