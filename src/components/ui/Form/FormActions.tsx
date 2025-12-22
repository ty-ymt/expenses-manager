"use client";

import { Group } from "@mantine/core";
import type { PropsWithChildren } from "react";

export const FormActions = ({
  children,
  justify = "flex-end",
}: PropsWithChildren<{
  justify?: "flex-end" | "space-between" | "flex-start" | "center";
}>) => {
  return (
    <Group justify={justify} mt="xs" gap="sm">
      {children}
    </Group>
  );
};

export default FormActions;
