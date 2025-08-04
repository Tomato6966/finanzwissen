"use client";

import { useState } from "react";

import { ActiveTabKeys, PageContext } from "../Context/PageContext";

export default function PageRouter({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState<ActiveTabKeys>("home");
    return <PageContext.Provider value={{ isDarkMode, setIsDarkMode, activeTab, setActiveTab }}>
        {children}
    </PageContext.Provider>;
}
