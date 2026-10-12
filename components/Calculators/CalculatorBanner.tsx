"use client";

import React from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

export interface CalculatorBannerProps {
  type?: "error" | "warning" | "info" | "success";
  title?: string;
  message: string;
  onDismiss?: () => void;
  actionText?: string;
  onAction?: () => void;
}

export function CalculatorBanner({
  type = "error",
  title,
  message,
  onDismiss,
  actionText,
  onAction,
}: CalculatorBannerProps) {
  const styles = {
    error: {
      container: "border-red-500/30 bg-red-500/10 text-red-200 dark:bg-red-950/40 dark:border-red-500/30",
      icon: <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />,
      accent: "text-red-300 font-semibold",
    },
    warning: {
      container: "border-amber-500/30 bg-amber-500/10 text-amber-200 dark:bg-amber-950/40 dark:border-amber-500/30",
      icon: <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />,
      accent: "text-amber-300 font-semibold",
    },
    info: {
      container: "border-blue-500/30 bg-blue-500/10 text-blue-200 dark:bg-blue-950/40 dark:border-blue-500/30",
      icon: <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />,
      accent: "text-blue-300 font-semibold",
    },
    success: {
      container: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-500/30",
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />,
      accent: "text-emerald-300 font-semibold",
    },
  }[type];

  return (
    <div
      role="alert"
      className={`w-full rounded-xl border p-3 sm:p-3.5 backdrop-blur-md shadow-xs transition-all flex items-start justify-between gap-3 ${styles.container}`}
    >
      <div className="flex items-start gap-2.5 min-w-0">
        {styles.icon}
        <div className="text-xs sm:text-sm leading-relaxed min-w-0">
          {title && <span className={`${styles.accent} mr-1.5`}>{title}:</span>}
          <span>{message}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {actionText && onAction && (
          <button
            onClick={onAction}
            className="text-xs font-medium underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            {actionText}
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="rounded-md p-1 opacity-70 hover:opacity-100 hover:bg-white/10 transition-colors"
            aria-label="Schließen"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
