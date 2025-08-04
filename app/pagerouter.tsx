"use client";

import { useState } from "react";

import { PageContext } from "../Context/PageContext";

export default function PageRouter({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState("home");
    return <PageContext.Provider value={{ isDarkMode, setIsDarkMode, activeTab, setActiveTab }}>
        {children}
    </PageContext.Provider>;
}
