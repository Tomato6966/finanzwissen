"use client";

import { usePathname } from "next/navigation";

export function useGetActiveTab():[string|undefined, string[]] {
    const pathname = usePathname();

    const basePath = String(process.env.NEXT_PUBLIC_BASE_PATH || "").replace("/", "");
    const paths = pathname.split("/").filter((x: string) => x.length > 0 && x !== basePath);

    return [ paths.shift(), paths ];
}
