import { BookOpen, LucideProps, PiggyBank, Shield } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

import { ActiveTabKeys } from "../Context/PageContext";

export type QuickLink = {
    title: string;
    description: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    activePage: `/${ActiveTabKeys}` | `/calculators#${string}`;
    color: string;
};
export const quickLinks: QuickLink[] = [
    {
        title: "Finanzrechner nutzen",
        description: "Berechnen Sie Zinsen, Vorsorge, Sparziele, Budget-Analyse, und mehr",
        icon: PiggyBank,
        activePage: "/calculators#retirement",
        color: "bg-green-500",
    },
    {
        title: "Mindset, Strategien, ...",
        description: "Erfahren Sie mehr über Börsen-Strategien, Geld-Mindset und mehr",
        icon: BookOpen,
        activePage: "/mindset",
        color: "bg-purple-500",
    },
    {
        title: "Geldmanagement",
        description: "Lernen Sie mit Geld umzugehen",
        icon: BookOpen,
        activePage: "/moneymanagement",
        color: "bg-purple-500",
    },
    {
        title: "Tools & Vorlagen",
        description: "Praktische Hilfsmittel / Dateien herunterladen",
        icon: Shield,
        activePage: "/tools",
        color: "bg-orange-500",
    },
]
