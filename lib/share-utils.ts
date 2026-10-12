import LZString from "lz-string";

export function getShareUrl(calculatorType: string, serializedState: string): string {
    if (typeof window === "undefined") return "";

    // Normalize path to calculators route, respecting basePath if present
    const origin = window.location.origin;
    const pathname = window.location.pathname;

    let targetPath = pathname;
    if (!targetPath.includes("/calculators")) {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
        targetPath = `${basePath}/calculators`;
    }

    // Strip trailing query parameters
    const cleanPath = targetPath.split("?")[0];
    return `${origin}${cleanPath}?share=${serializedState}#${calculatorType}`;
}

export async function copyShareUrlToClipboard(url: string): Promise<boolean> {
    if (typeof window === "undefined") return false;

    try {
        if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(url);
            return true;
        }
    } catch {
        // Continue to fallback
    }

    try {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textarea);
        return successful;
    } catch (err) {
        console.error("Failed to copy share link fallback:", err);
        return false;
    }
}
