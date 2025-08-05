"use client";

import { usePathname } from "next/navigation";

export function useGetActiveTab():[string|undefined, string[]] {
    const pathname = usePathname();

    const paths = pathname.split("/").filter((x:string) => x.length > 0);
    return [ paths.shift(), paths ];
}
