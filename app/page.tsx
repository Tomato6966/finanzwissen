"use client"

import { useContext } from "react";

import Footer from "../components/Footer";
import Header from "../components/Header";
import {
	BudgetAnalysis, Calculators, GoalsPage, HomePage, HouseHoldPage, MindSetPage, ToolsPage
} from "../components/Tabs/index";
import { PageContext } from "../Context/PageContext";

export default function FinancialLiteracyWebsite() {
    const { isDarkMode, activeTab } = useContext(PageContext);

    return (
        <div
            className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "dark bg-gray-900" : "bg-gradient-to-br from-blue-50 to-indigo-100"}`}
        >
            {/* Header */}
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === "home" && <HomePage />}
                {activeTab === "tools" && <ToolsPage />}
                {activeTab === "mindset" && <MindSetPage />}

                {activeTab === "household" && <HouseHoldPage />}

                {activeTab === "goals" && <GoalsPage />}

                {activeTab === "budget-analysis" && <BudgetAnalysis />}
                {activeTab === "calculators" && <Calculators />}
            </main>

            <Footer />
        </div>
    )
}
