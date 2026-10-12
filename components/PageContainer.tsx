"use client";

import React, { useContext } from "react";
import { PageContext } from "@/Context/PageContext";

export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isWideMode } = useContext(PageContext);

  return (
    <main
      className={`mx-auto py-4 sm:py-8 safe-padding transition-all duration-300 ${
        isWideMode
          ? "w-full max-w-[108rem] px-4 sm:px-6 lg:px-8"
          : "max-w-7xl px-4 sm:px-6 lg:px-8"
      }`}
    >
      {children}
    </main>
  );
}
