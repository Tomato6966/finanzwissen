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
            className="pointer-events-none fixed inset-0 -z-20 overflow-hidden mouse-glow"
            style={{
                ["--glow-x" as string]: "50%",
                ["--glow-y" as string]: "50%",
            }}
        >
            {/* Very soft ambient background tint */}
            <div
                className="absolute rounded-full blur-3xl opacity-10 dark:opacity-15 pointer-events-none"
                style={{
                    width: "800px",
                    height: "800px",
                    left: "var(--glow-x)",
                    top: "var(--glow-y)",
                    transform: "translate(-50%, -50%)",
                    background:
                        "radial-gradient(circle, var(--color-primary, #3b82f6) 0%, rgba(99, 102, 241, 0.3) 40%, transparent 75%)",
                    transition: "none",
                }}
            />
        </div>
    );
}
