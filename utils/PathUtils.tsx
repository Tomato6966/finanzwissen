"use client";

import { usePathname } from "next/navigation";

export function useGetActiveTab():[string|undefined, string[]] {
    const pathname = usePathname();

    const paths = pathname.split("/");
    return [ paths.shift(), paths ];
}
