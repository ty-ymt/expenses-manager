"use client";

import { Group, Paper, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { formatDateRange } from "@/lib/date";
import type { ProjectListItem } from "@/types/projects";
import ProjectStatusBadge from "./ProjectStatusBadge";

export const ProjectListItems = ({
  projects,
  from = "projects",
}: {
  projects: ProjectListItem[];
  from?: "projects" | "completed";
}) => {
  return (
    <Stack gap="xs">
      {projects.map((p) => (
        <Paper
          component={Link}
          href={`/projects/${p.id}?from=${from}`}
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

            <ProjectStatusBadge status={p.status} />
          </Group>
        </Paper>
      ))}
    </Stack>
  );
};

export default ProjectListItems;
