"use client";

import { Grid, Group, Text } from "@mantine/core";
import type { ReactNode } from "react";

export const FormRow = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
}) => {
  return (
    <Grid gutter="sm" align="center">
      <Grid.Col span={{ base: 12, sm: 2 }}>
        <Group gap={6}>
          <Text size="sm" fw={600}>
            {label}
          </Text>
          {hint ?? null}
        </Group>
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 10 }}>{children}</Grid.Col>
    </Grid>
  );
};
export const RequiredFormRow = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
}) => {
  return (
    <Grid gutter="sm" align="center">
      <Grid.Col span={{ base: 12, sm: 2 }}>
        <Group gap={6}>
          <Text size="sm" fw={600}>
            {label}
            <Text component="span" c="red" size="sm">
              *
            </Text>
          </Text>
          {hint ?? null}
        </Group>
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 10 }}>{children}</Grid.Col>
    </Grid>
  );
};
