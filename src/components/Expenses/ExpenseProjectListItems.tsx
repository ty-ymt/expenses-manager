"use client";

import { Group, Paper, Stack, Text } from "@mantine/core";
import Link from "next/link";
import ProjectStatusBadge from "@/components/Projects/ProjectStatusBadge";
import { formatDateRange } from "@/lib/date";
import type { ExpenseProjectListItem } from "@/lib/expenses/queries";

const formatJPY = (value: string) => {
  const n = Number(value);
  const safe = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
  }).format(safe);
};

export const ExpenseProjectListItems = ({
  projects,
  returnTo,
}: {
  projects: ExpenseProjectListItem[];
  returnTo: string;
}) => {
  const rt = encodeURIComponent(returnTo);
  return (
    <Stack gap="xs">
      {projects.map((p) => (
        <Paper
          component={Link}
          href={`/expenses/${p.id}?returnTo=${rt}`}
          key={p.id}
          p="md"
          withBorder
          radius="sm"
          c="inherit"
          style={{ textDecoration: "none" }}
        >
          <Group justify="space-between" align="flex-start">
            <Stack gap={2}>
              <Text fw={600} c="inherit">
                【{p.cd}】 {p.name}
              </Text>
              <Text size="sm" c="dimmed">
                {formatDateRange(p.start_dt, p.end_dt)}
              </Text>
            </Stack>

            <Stack gap={6} align="flex-end">
              <ProjectStatusBadge status={p.status} />
              <Text fw={700}>{formatJPY(p.expense_total)}</Text>
            </Stack>
          </Group>
        </Paper>
      ))}
    </Stack>
  );
};

export default ExpenseProjectListItems;
