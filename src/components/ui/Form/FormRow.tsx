"use client";

import { Grid, Group, Text } from "@mantine/core";
import type { ReactNode } from "react";

export const FormRow = ({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: ReactNode;
  children: ReactNode;
}) => {
  return (
    <Grid gutter="sm" align="center">
      <Grid.Col span={{ base: 12, sm: 2 }}>
        <Group gap={6}>
          <Text size="sm" fw={600}>
            {label}
            {required ? (
              <Text component="span" c="red">
                *
              </Text>
            ) : null}
          </Text>
          {hint ?? null}
        </Group>
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 10 }}>{children}</Grid.Col>
    </Grid>
  );
};
