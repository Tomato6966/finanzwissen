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
}

export default function LinkButton({ href, children, target, ...props }: LinkButtonProps) {
  return (
    <Link href={href} passHref legacyBehavior target={target}>
      <Button {...props}>
        {children}
      </Button>
    </Link>
  );
}
