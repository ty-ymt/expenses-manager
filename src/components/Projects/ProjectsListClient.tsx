"use client";

import { Button, Group, Paper, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import { formatDateRange } from "@/lib/date";
import { DEFAULT_STATUSES, filterProjectsByStatus } from "@/lib/filters";
import type { ProjectListItem, ProjectStatus } from "@/types/projects";
import { StatusFilterButton } from "../ui/StatusFilterButton";
import ProjectStatusBadge from "./ProjectStatusBadge";

export const ProjectListClient = ({
  projects,
}: {
  projects: ProjectListItem[];
}) => {
  const [selected, setSelected] = useState<ProjectStatus[]>(DEFAULT_STATUSES);

  const list = filterProjectsByStatus(projects, selected);
  const isFilteredOut = projects.length > 0 && list.length === 0;

  return (
    <Stack gap="sm">
      <Group justify="space-between" align="flex-end">
        <StatusFilterButton selected={selected} setSelected={setSelected} />

        <Button
          component={Link}
          href={"/projects/add"}
          size="sm"
          leftSection={<span>✐</span>}
        >
          新規作成
        </Button>
      </Group>
      <Stack gap="xs">
        {projects.length === 0 ? (
          <Text size="sm" c="dimmed">
            {isFilteredOut
              ? "条件に合う案件が見つかりません"
              : "案件が登録されていません"}
          </Text>
        ) : null}
      </Stack>

      {list.map((p) => (
        <Paper key={p.id} p="md" withBorder radius="sm" my={-3}>
          <Group justify="space-between" align="flex-start">
            <Stack gap={2}>
              <Text
                component={Link}
                href={`/projects/${p.id}`}
                fw={600}
                c="inherit"
                style={{ textDecoration: "none" }}
              >
                【{p.cd}】{p.name}
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

export default ProjectListClient;
