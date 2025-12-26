"use client";

import { Accordion, Badge, Group, Stack, Text } from "@mantine/core";
import {
  PROJECT_STATUS_LABEL,
  PROJECT_STATUS_ORDER,
  type ProjectListItem,
  type ProjectStatus,
} from "@/types/projects";
import ProjectListItems from "./ProjectListItems";

export const ProjectGroupedList = ({
  projects,
}: {
  projects: ProjectListItem[];
}) => {
  const grouped = new Map<ProjectStatus, ProjectListItem[]>();
  for (const s of PROJECT_STATUS_ORDER) grouped.set(s, []);
  for (const p of projects) {
    grouped.get(p.status)?.push(p);
  }

  return (
    <Stack gap={0}>
      {PROJECT_STATUS_ORDER.map((s) => {
        const list = grouped.get(s) ?? [];
        if (list.length === 0) return null;

        return (
          <Accordion
            key={s}
            multiple
            variant="contained"
            defaultValue={PROJECT_STATUS_ORDER}
            radius={26}
            styles={{
              item: {
                overflow: "hidden",
                marginBottom: 12,
              },
              control: {
                padding: "2px 20px",
              },
              panel: { padding: "0 12px" },
            }}
          >
            <Accordion.Item value={s}>
              <Accordion.Control>
                <Group justify="space-between" w="100%">
                  <Group gap="xs">
                    <Text fw={600}>{PROJECT_STATUS_LABEL[s]}</Text>
                    <Badge variant="light">{list.length}</Badge>
                  </Group>
                </Group>
              </Accordion.Control>

              <Accordion.Panel>
                <ProjectListItems projects={list} />
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        );
      })}
    </Stack>
  );
};
