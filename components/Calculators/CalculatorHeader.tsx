"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface CalculatorHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
  shareMessage?: string | null;
  onShare?: () => void;
  actions?: React.ReactNode;
}

export function CalculatorHeader({
  title,
  description,
  icon: Icon,
  badge,
  shareMessage,
  onShare,
  actions,
}: CalculatorHeaderProps) {
  return (
    <CardHeader className="relative overflow-hidden border-b border-border/40 bg-gradient-to-r from-card/90 via-card to-card/90 dark:from-card/60 dark:to-card/40 backdrop-blur-md p-5 sm:p-6 rounded-t-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary border border-primary/20 shadow-xs">
              <Icon className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <span>{title}</span>
              {badge && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {badge}
                </span>
              )}
            </CardTitle>
          </div>
          <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
            {description}
          </CardDescription>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          {actions}
          {onShare && (
            <Button
              onClick={onShare}
              variant="outline"
              size="sm"
              className="h-8.5 rounded-lg border-border/70 bg-background/50 hover:bg-accent/80 hover:text-accent-foreground text-xs font-medium shadow-2xs backdrop-blur-xs transition-all"
            >
              {shareMessage || "Share Config"}
            </Button>
          )}
        </div>
      </div>
    </CardHeader>
  );
}
