
import {
	Banknote, BarChart3, BookOpen, Calculator, FileText, Lightbulb, PieChart, TrendingUp
} from "lucide-react";

export type ToolCategory = {
    id: string,
    title: string,
    icon: React.ElementType,
    items: { title: string, description: string, image: string, link: { href: string, isExternal: boolean, download?: boolean } }[]
}

// Define all categories and their respective tools/resources
export const TOOL_CATEGORIES: ToolCategory[] = [
    {
        id: "portfolio-trackers",
        title: "Portfolio-Trackers",
        icon: BarChart3,
        items: [
            {
                title: "Parqet",
                description: "Intuitiver Portfolio-Tracker für Aktien, ETFs und Kryptos.",
                image: "https://i.imgur.com/xSD4Jve.png",
                link: { href: "https://parqet.com/", isExternal: true },
            },
            {
                title: "Getquin",
                description: "Sozialer Portfolio-Tracker mit Community-Funktionen.",
                image: "https://i.imgur.com/EbmjieL.png",
                link: { href: "https://getquin.com/", isExternal: true },
            },
            {
                title: "ExtraETF",
                description: "ETF-Portfolio-Tracking und Analyse-Tools.",
                image: "https://i.imgur.com/kbHbSQ9.png",
                link: { href: "https://app.extraetf.com/", isExternal: true },
            },
            {
                title: "Copilot",
                description: "Umfassende Finanz-App für Budgetierung und Vermögensübersicht.",
                image: "https://i.imgur.com/8XBKcom.png",
                link: { href: "https://finanzfluss.de/copilot", isExternal: true },
            },
            {
                title: "Portfolio Performance",
                description: "Kostenlose Desktop-Software für detaillierte Portfolio-Analyse.",
                image: "https://i.imgur.com/aDhri4u.png",
                link: { href: "https://www.portfolio-performance.info/", isExternal: true },
            },
            {
                title: "Simply Wall.st",
                description: "Umfassende Finanz-App für Budgetierung und Vermögensübersicht.",
                image: "https://simplywall.st/static/videos/simplywall-portfolio-feature.mp4",
                link: { href: "https://www.simplywall.st/", isExternal: true },
            }
        ],
    },
    {
        id: "brokers",
        title: "Brokers",
        icon: Banknote,
        items: [
            {
                title: "Scalable Capital",
                description: "Günstiger Neo-Online-Broker mit breitem ETF-Angebot und Sparplänen.",
                image: "https://i.imgur.com/3eUun0Xt.png",
                link: { href: "https://scalable.capital/", isExternal: true },
            },
            {
                title: "Trade Republic",
                description: "Mobile-First Neo-Broker für Aktien, ETFs und Derivate.",
                image: "https://i.imgur.com/IJ0PP79.png",
                link: { href: "https://traderepublic.com/", isExternal: true },
            },
            {
                title: "Consorsbank",
                description: "Traditionelle Bank mit umfassendem Brokerage-Angebot.",
                image: "https://i.imgur.com/RelYsfN.png",
                link: { href: "https://www.consorsbank.de/", isExternal: true },
            },
            {
                title: "ING",
                description: "Direktbank mit eigenem Brokerage für Wertpapiere.",
                image: "https://i.imgur.com/6B081hY.png",
                link: { href: "https://www.ing.de/wertpapiere/", isExternal: true },
            },
            {
                title: "Comdirect",
                description: "Online-Broker der Commerzbank mit breitem Leistungsspektrum.",
                image: "https://i.imgur.com/8kfsrPV.png",
                link: { href: "https://www.comdirect.de/", isExternal: true },
            },
            {
                title: "Flatex-DE",
                description: "Full-Service-Broker mit breitem Leistungsspektrum für Deutschland.",
                image: "https://i.imgur.com/rytCMYJ.png",
                link: { href: "https://www.flatex.de/", isExternal: true },
            },
            {
                title: "Flatex-AT",
                description: "Full-Service-Broker mit breitem Leistungsspektrum für Österreich.",
                image: "https://i.imgur.com/rytCMYJ.png",
                link: { href: "https://www.flatex.at/", isExternal: true },
            },
            {
                title: "Finanzen.net/zero",
                description: "Neo-Broker mit breitem Leistungsspektrum für Deutschland und Österreich.",
                image: "https://i.imgur.com/bWVcZKZ.png",
                link: { href: "https://www.finanzen.net/zero", isExternal: true },
            },
        ],
    },
    {
        id: "portfolio-analyze-simulations",
        title: "Portfolio-Analyse / Simulationen",
        icon: PieChart,
        items: [
            {
                title: "FI Simulator (Monte Carlo Simulation)",
                description: "Kostenloses Tool zur Analyse der Diversifikation und Risikostruktur Ihres Portfolios.",
                image: "https://i.imgur.com/SadhYY0.png",
                link: { href: "https://predict-fi.com/en", isExternal: true },
            },
            {
                title: "Portfolio Viewer",
                description: "Simulieren Sie Ihr Portfolio mit verschiedenen Szenarien.",
                image: "https://i.imgur.com/qS6R2Jn.png",
                link: { href: "https://www.portfolio-viewer.com/", isExternal: true },
            },
            {
                title: "Portfolio Simulator (Community Made)",
                description: "Portfolio Simulator vom Community Mitglied, zum Simulieren und Testen von einzlenen Positionen, Sparplänen und co. mit realen-historischen Daten",
                image: "https://github.com/Tomato6966/investment-portfolio-simulator/raw/main/docs/dark-mode.png",
                link: { href: "https://tomato6966.github.io/investment-portfolio-simulator/", isExternal: true },
            },
            {
                title: "Monte Carlo Simulation",
                description: "Monte Carlo Simulation für Ihr Portfolio",
                image: "https://i.imgur.com/LYLoee4.png",
                link: { href: (process.env.NEXT_PUBLIC_BASE_PATH || "") + "/calculators#montecarlo", isExternal: false },
            }

        ],
    },
    {
        id: "stocks-etf-analysis",
        title: "Aktien und ETF Analyse",
        icon: TrendingUp,
        items: [
            {
                title: "JustETF",
                description: "Umfassende Datenbank und Vergleichstools für ETFs.",
                image: "https://i.imgur.com/PwnNdk9.png",
                link: { href: "https://www.justetf.com/", isExternal: true },
            },
            {
                title: "extraetf",
                description: "Fundierte Analysen und Ratings für Aktien und Fonds.",
                image: "https://i.imgur.com/Mg8HeQ1.png",
                link: { href: "https://www.morningstar.de/", isExternal: true },
            },
            {
                title: "TradingView",
                description: "Leistungsstarke Charting-Plattform für technische Analysen.",
                image: "https://i.imgur.com/E0DdLEN.png",
                link: { href: "https://www.tradingview.com/", isExternal: true },
            },
            {
                title: "stock3",
                description: "Stock-Analysis-Tools, Deutsche-alternative zu TradingView",
                image: "https://i.imgur.com/qgks6So.png",
                link: { href: "https://stock3.com/", isExternal: true },
            },
            {
                title: "Finanzen.net",
                description: "Aktuelle Kurse, Nachrichten und Analysen zu Aktien, ETFs und mehr.",
                image: "https://i.imgur.com/z7vGLC8.png",
                link: { href: "https://www.finanzen.net/", isExternal: true },
            },
        ],
    },
    {
        id: "budget-trackers-managers",
        title: "Budget-Trackers / -Managers",
        icon: Calculator,
        items: [
            {
                title: "YNAB (You Need A Budget)",
                description: "Beliebte App zur Budgetierung und Finanzplanung nach der Zero-Based-Budgeting-Methode.",
                image: "https://i.imgur.com/JtyhS9G.png",
                link: { href: "https://www.youneedabudget.com/", isExternal: true },
            },
            {
                title: "Finanzguru",
                description: "KI-gestützte Finanz-App, die Verträge erkennt und Sparpotenziale aufzeigt.",
                image: "https://i.imgur.com/8k3GsNV.png",
                link: { href: "https://finanzguru.de/", isExternal: true },
            },
        ],
    },
    {
        id: "knowledge",
        title: "Knowledge",
        icon: Lightbulb,
        items: [
            {
                title: "Finanzfluss Ratgeber (ETF-Handbuch)",
                description: "Umfassende Ratgeber für ETF-Investoren. Und weitere Ratgeber zu diversen Finanz-Themen.",
                image: "https://i.imgur.com/gQzsZz8.png",
                link: { href: "https://www.finanzfluss.de/etf-handbuch/", isExternal: true },
            },
            {
                title: "Finanzfluss Vergleiche (Depot-Broker-Vergleich)",
                description: "Vergleiche der deutschen Broker. Und weitere Ratgeber zu diversen Finanz-Themen.",
                image: "https://i.imgur.com/JFwuo1d.png",
                link: { href: "https://www.finanzfluss.de/vergleich/depot/", isExternal: true },
            },
        ],
    },
    {
        id: "excel-templates",
        title: "Excel-Templates",
        icon: FileText,
        items: [
            {
                title: "Haushaltsplan Excel-Vorlage",
                description: "Umfassende Excel-Vorlage zur Verwaltung Ihrer monatlichen Einnahmen und Ausgaben.",
                image: (process.env.NEXT_PUBLIC_BASE_PATH || "") + "/placeholder.svg",
                link: { href: "#", isExternal: false, download: true },
            },
        ],
    },
    {
        id: "manuals-magazines",
        title: "Handbücher & Magazine",
        icon: BookOpen,
        items: [
            {
                title: "Finanztest (Stiftung Warentest)",
                description: "Das führende deutsche Verbrauchermagazin für Finanzprodukte und Dienstleistungen.",
                image: "https://imgur.com/k0QPjcK",
                link: { href: "https://www.test.de/finanztest/", isExternal: true },
            },
            {
                title: "Broker-Test (Österreich)",
                description: "Das führende österreichische Verbrauchermagazin für Finanzprodukte und Dienstleistungen.",
                image: "https://imgur.com/MEXtFXj",
                link: { href: "https://www.broker-test.at/", isExternal: true },
            },
            {
                title: "Handelsblatt",
                description: "Deutschlands führende Wirtschafts- und Finanzzeitung.",
                image: "https://imgur.com/MzUw9iO",
                link: { href: "https://www.handelsblatt.com/", isExternal: true },
            },
            {
                title: "Capital",
                description: "Magazin für Wirtschaft und Lifestyle mit Fokus auf Geldanlage.",
                image: "https://imgur.com/i29TpcL",
                link: { href: "https://www.capital.de/", isExternal: true },
            },
            {
                title: "Börse Online",
                description: "Magazin und Online-Portal für Anleger mit Fokus auf Aktien und Märkte.",
                image: "https://imgur.com/h5HMpYv",
                link: { href: "https://www.boerse-online.de/", isExternal: true },
            },
        ],
    },
];
