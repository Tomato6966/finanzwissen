"use client";

import { VariantProps } from "class-variance-authority";
import Link from "next/link";
import { ReactNode } from "react";

import { Button, buttonVariants } from "@/components/ui/button";

interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

interface LinkButtonProps extends ButtonProps {
  href: string;
  children: ReactNode;
  target?: string;
  legacyBehavior?:boolean;
  linkClassName?:string;
  passHref?:boolean;
}

export default function LinkButton({ href, children, target, legacyBehavior, passHref, linkClassName, ...props }: LinkButtonProps) {
  return (
    <Link href={href} passHref={passHref ?? true} legacyBehavior={legacyBehavior ?? true} target={target} className={linkClassName}>
      <Button {...props}>
        {children}
      </Button>
    </Link>
  );
}
