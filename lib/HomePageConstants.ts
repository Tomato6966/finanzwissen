import { BookOpen, LucideProps, PiggyBank, Shield, TrendingUp } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

import { ActiveTabKeys } from "../Context/PageContext";

export const pdfResources = [
    {
        title: "Finanz-Grundlagen für Einsteiger",
        description: "Der komplette Leitfaden für Ihren Start in die Finanzwelt",
        category: "Grundlagen",
        image: "/placeholder.svg?height=200&width=300",
        downloadUrl: "#",
        topics: ["Budgetplanung", "Erste Schritte", "Grundbegriffe"],
    },
    {
        title: "ETF-Investieren leicht gemacht",
        description: "Alles was Sie über ETFs wissen müssen - von A bis Z",
        category: "Investieren",
        image: "/placeholder.svg?height=200&width=300",
        downloadUrl: "#",
        topics: ["ETF-Auswahl", "Diversifikation", "Kosten"],
    },
    {
        title: "Sparen & Geld vermehren",
        description: "Praktische Strategien um Ihr Geld zu vermehren",
        category: "Sparen",
        image: "/placeholder.svg?height=200&width=300",
        downloadUrl: "#",
        topics: ["Sparstrategien", "Zinseszins", "Automatisierung"],
    },
    {
        title: "Geld für Sie arbeiten lassen",
        description: "Passives Einkommen aufbauen und finanzielle Freiheit erreichen",
        category: "Passives Einkommen",
        image: "/placeholder.svg?height=200&width=300",
        downloadUrl: "#",
        topics: ["Dividenden", "Immobilien", "Online-Business"],
    },
    {
        title: "Money Management Masterclass",
        description: "Professionelle Techniken für optimales Geldmanagement",
        category: "Management",
        image: "/placeholder.svg?height=200&width=300",
        downloadUrl: "#",
        topics: ["Cashflow", "Risikomanagement", "Portfolio"],
    },
    {
        title: "Für jeden geeignet: Universelle Finanzregeln",
        description: "Zeitlose Prinzipien die für jeden funktionieren",
        category: "Universal",
        image: "/placeholder.svg?height=200&width=300",
        downloadUrl: "#",
        topics: ["50/30/20 Regel", "Notgroschen", "Schuldenabbau"],
    },
]

export type QuickLink = {
    title: string;
    description: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    activePage: `/${ActiveTabKeys}`;
    color: string;
};
export const quickLinks: QuickLink[] = [
    {
        title: "Budgetanalyse starten",
        description: "Analysieren Sie Ihr Budget mit KI",
        icon: TrendingUp,
        activePage: "/budget-analysis",
        color: "bg-blue-500",
    },
    {
        title: "Finanzrechner nutzen",
        description: "Berechnen Sie Zinsen, Kredite & mehr",
        icon: PiggyBank,
        activePage: "/calculators",
        color: "bg-green-500",
    },
    {
        title: "Lernmaterialien",
        description: "Erweitern Sie Ihr Finanzwissen",
        icon: BookOpen,
        activePage: "/mindset",
        color: "bg-purple-500",
    },
    {
        title: "Tools & Vorlagen",
        description: "Praktische Hilfsmittel herunterladen",
        icon: Shield,
        activePage: "/tools",
        color: "bg-orange-500",
    },
]
