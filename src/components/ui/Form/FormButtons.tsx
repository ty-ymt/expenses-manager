"use client";

import { Button, type ButtonProps } from "@mantine/core";
import Link from "next/link";
import type { PropsWithChildren } from "react";

// type MantineButtonProps = ComponentProps<typeof Button>;

export const SubmitButton = ({
  children,
  ...props
}: PropsWithChildren<ButtonProps>) => {
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
}: PropsWithChildren<ButtonProps & { href: string }>) => {
  return (
    <Button component={Link} href={href} variant="default" size="sm" {...props}>
      {children}
    </Button>
  );
};

export const DangerButton = ({
  children,
  ...props
}: PropsWithChildren<ButtonProps>) => {
  return (
    <Button type="submit" color="red" size="sm" {...props}>
      {children}
    </Button>
  );
};
