"use client";

import { Button } from "@mantine/core";
import Link from "next/link";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type NativeButtonAttrs = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "color"
> & { loading?: boolean };

export const SubmitButton = ({
  children,
  ...props
}: PropsWithChildren<NativeButtonAttrs>) => {
  return (
    <Button type="submit" size="sm" {...props}>
      {children}
    </Button>
  );
};

export const CancelLinkButton = ({
  href,
  children,
  ...props
}: PropsWithChildren<Omit<NativeButtonAttrs, "type"> & { href: string }>) => {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <Button variant="default" size="sm" {...props}>
        {children}
      </Button>
    </Link>
  );
};

export const DangerButton = ({
  children,
  type = "button",
  ...props
}: PropsWithChildren<NativeButtonAttrs>) => {
  return (
    <Button type={type} color="red" size="sm" {...props}>
      {children}
    </Button>
  );
};
