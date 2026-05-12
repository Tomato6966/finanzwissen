"use client";

import { useEffect, useRef } from "react";

export default function MouseGlow() {
    const glowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const glow = glowRef.current;
        if (!glow) return;

        let rafId: number;
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;

        const onMouseMove = (e: MouseEvent) => {
            targetX = e.clientX;
            targetY = e.clientY;
        };

        const animate = () => {
            currentX += (targetX - currentX) * 0.12;
            currentY += (targetY - currentY) * 0.12;
            glow.style.setProperty("--glow-x", `${currentX}px`);
            glow.style.setProperty("--glow-y", `${currentY}px`);
            rafId = requestAnimationFrame(animate);
        };

        window.addEventListener("mousemove", onMouseMove);
        rafId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <div
            ref={glowRef}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 -z-10 overflow-hidden mouse-glow"
            style={{
                ["--glow-x" as string]: "50%",
                ["--glow-y" as string]: "50%",
            }}
        >
            {/* Primary strip */}
            <div
                className="absolute rounded-full blur-3xl opacity-35 dark:opacity-25"
                style={{
                    width: "800px",
                    height: "800px",
                    left: "var(--glow-x)",
                    top: "var(--glow-y)",
                    transform: "translate(-50%, -50%)",
                    background:
                        "radial-gradient(circle, hsl(var(--primary) / 0.35) 0%, transparent 70%)",
                    transition: "none",
                }}
            />
            {/* Secondary accent strip */}
            <div
                className="absolute rounded-full blur-3xl opacity-25 dark:opacity-18"
                style={{
                    width: "700px",
                    height: "700px",
                    left: "calc(var(--glow-x) + 120px)",
                    top: "calc(var(--glow-y) - 80px)",
                    transform: "translate(-50%, -50%)",
                    background:
                        "radial-gradient(circle, hsl(var(--secondary) / 0.45) 0%, transparent 70%)",
                    transition: "none",
                }}
            />
            {/* Cyan accent strip */}
            <div
                className="absolute rounded-full blur-3xl opacity-20 dark:opacity-15"
                style={{
                    width: "600px",
                    height: "600px",
                    left: "calc(var(--glow-x) - 100px)",
                    top: "calc(var(--glow-y) + 60px)",
                    transform: "translate(-50%, -50%)",
                    background:
                        "radial-gradient(circle, oklch(0.6 0.12 200 / 0.3) 0%, transparent 70%)",
                    transition: "none",
                }}
            />
        </div>
    );
}
