"use client";

import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    baseAlpha: number;
}

export default function ConnectedDots() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        let animationFrameId: number;
        let width = 0;
        let height = 0;
        let particles: Particle[] = [];

        // Interaction state
        let mouseX = -9999;
        let mouseY = -9999;
        let isHovered = false;

        // Check reduced motion preference
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        // Check if dark mode is active
        const isDark = () =>
            document.documentElement.classList.contains("dark");

        const updateDimensions = () => {
            if (!canvas) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            ctx.resetTransform?.();
            ctx.scale(dpr, dpr);

            initParticles();
        };

        const initParticles = () => {
            // Density: ~1 particle per 25,000 px^2, bounded between 35 and 80
            const particleCount = Math.max(
                35,
                Math.min(80, Math.floor((width * height) / 25000))
            );

            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.35,
                    vy: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.35,
                    radius: Math.random() * 1.5 + 1.2,
                    baseAlpha: Math.random() * 0.25 + 0.25,
                });
            }
        };

        const onMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isHovered = true;
        };

        const onMouseLeave = () => {
            mouseX = -9999;
            mouseY = -9999;
            isHovered = false;
        };

        const onResize = () => {
            updateDimensions();
        };

        // Render loop
        const maxDistance = 130;
        const mouseRadius = 180;

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            const darkMode = isDark();
            // Colors: electric blue / cyan dots & links, softer in light mode
            const dotRgb = darkMode ? "79, 140, 255" : "59, 130, 246";
            const lineRgb = darkMode ? "79, 140, 255" : "96, 165, 250";
            const mouseLineRgb = darkMode ? "99, 102, 241" : "37, 99, 235";

            const count = particles.length;

            // 1. Move & draw particles
            for (let i = 0; i < count; i++) {
                const p = particles[i];

                if (!prefersReducedMotion) {
                    p.x += p.vx;
                    p.y += p.vy;

                    // Bounce gently off boundaries
                    if (p.x < 0) {
                        p.x = 0;
                        p.vx *= -1;
                    } else if (p.x > width) {
                        p.x = width;
                        p.vx *= -1;
                    }

                    if (p.y < 0) {
                        p.y = 0;
                        p.vy *= -1;
                    } else if (p.y > height) {
                        p.y = height;
                        p.vy *= -1;
                    }
                }

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${dotRgb}, ${darkMode ? p.baseAlpha * 0.7 : p.baseAlpha * 0.5})`;
                ctx.fill();

                // Connect to other nearby particles
                for (let j = i + 1; j < count; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < maxDistance) {
                        const alpha =
                            (1 - dist / maxDistance) *
                            (darkMode ? 0.22 : 0.16);
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(${lineRgb}, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }

                // Connect to mouse if within reach
                if (isHovered) {
                    const mdx = p.x - mouseX;
                    const mdy = p.y - mouseY;
                    const mouseDist = Math.hypot(mdx, mdy);

                    if (mouseDist < mouseRadius) {
                        const mAlpha =
                            (1 - mouseDist / mouseRadius) *
                            (darkMode ? 0.45 : 0.35);
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouseX, mouseY);
                        ctx.strokeStyle = `rgba(${mouseLineRgb}, ${mAlpha})`;
                        ctx.lineWidth = 1.2;
                        ctx.stroke();

                        // Gentle push effect when mouse gets very close
                        if (!prefersReducedMotion && mouseDist < 60) {
                            const angle = Math.atan2(mdy, mdx);
                            p.x += Math.cos(angle) * 0.5;
                            p.y += Math.sin(angle) * 0.5;
                        }
                    }
                }
            }

            // Draw a subtle soft node at cursor location if hovered
            if (isHovered) {
                ctx.beginPath();
                ctx.arc(mouseX, mouseY, 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${mouseLineRgb}, ${darkMode ? 0.6 : 0.5})`;
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        window.addEventListener("resize", onResize);
        window.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseleave", onMouseLeave);

        updateDimensions();
        animationFrameId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener("resize", onResize);
            window.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseleave", onMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-70 transition-opacity duration-700"
        />
    );
}
