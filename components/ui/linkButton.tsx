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
    <Link href={href} target={target} className={linkClassName}>
      {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
      }
      <Button {...props}>
        {children}
      </Button>
    </Link>
  );
}
