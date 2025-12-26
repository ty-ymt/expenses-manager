"use client";

import { Button, Group, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  filterProjectsByDateOverlap,
  filterProjectsByStatus,
} from "@/lib/filters";
import {
  type DateRangeFilter,
  PROJECT_STATUS,
  PROJECT_STATUS_LABEL,
  PROJECT_STATUS_TABS,
  type ProjectListItem,
  type ProjectStatus,
  type ProjectStatusTab,
} from "@/types/projects";
import DateRangeFilterButton from "../ui/Filter/DateRangeFilterButton";
import { StatusFilterButton } from "../ui/Filter/StatusFilterButton";
import { PageTab, type TabItem } from "../ui/Tabs/PageTab";
import ProjectListItems from "./ProjectListItems";

export const ProjectListClient = ({
  projects,
}: {
  projects: ProjectListItem[];
}) => {
  const [activeTab, setActiveTab] = useState<ProjectStatusTab>("all");
  const [selected, setSelected] = useState<ProjectStatus[]>([]);
  const [range, setRange] = useState<DateRangeFilter>({ from: null, to: null });

  const isDateRangeFiltering = !!range.from || !!range.to;
  const isAllTab = activeTab === "all";
  const isStatusFiltering = isAllTab && selected.length > 0;

  const tabProjects = useMemo(
    () => projects.filter((p) => p.status !== PROJECT_STATUS.COMPLETED),
    [projects]
  );

  const dateFiltered = useMemo(
    () => filterProjectsByDateOverlap(projects, range),
    [projects, range]
  );

  const visibleProjects = useMemo(() => {
    if (activeTab === "all")
      return filterProjectsByStatus(dateFiltered, selected);
    return dateFiltered.filter((p) => p.status === activeTab);
  }, [activeTab, dateFiltered, selected]);

  const counts = useMemo(() => {
    const c: Record<ProjectStatusTab, number> = {
      all: dateFiltered.length,
      undecided: 0,
      not_started: 0,
      in_progress: 0,
      ended: 0,
      completed: 0,
    };

    for (const p of dateFiltered) {
      c[p.status] = (c[p.status] ?? 0) + 1;
    }
    return c;
  }, [dateFiltered]);

  const tabItems = useMemo((): TabItem<ProjectStatusTab>[] => {
    return [
      { value: "all", label: "すべて", count: counts.all },
      ...PROJECT_STATUS_TABS.map((s) => ({
        value: s as ProjectStatusTab,
        label: PROJECT_STATUS_LABEL[s],
        count: counts[s as ProjectStatusTab] ?? 0,
      })),
    ];
  }, [counts]);

  return (
    <Stack gap="sm">
      <Group justify="space-between" align="flex-end">
        <Group gap="sm" align="flex-end">
          <DateRangeFilterButton
            value={range}
            setValue={setRange}
            isDateRangeFiltering={isDateRangeFiltering}
          />
          <StatusFilterButton
            selected={selected}
            setSelected={setSelected}
            isStatusFiltering={isStatusFiltering}
            disabled={!isAllTab}
          />
        </Group>

        <Group gap="sm">
          <Button
            component={Link}
            href={"/projects/completed"}
            size="sm"
            variant="default"
          >
            完了案件
          </Button>

          <Button
            component={Link}
            href={"/projects/add"}
            size="sm"
            leftSection={<span>✐</span>}
          >
            新規作成
          </Button>
        </Group>
      </Group>

      <PageTab<ProjectStatusTab>
        value={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        tabWidth={128}
        renderPanel={() => {
          if (tabProjects.length === 0) {
            return (
              <Text size="sm" c="dimmed">
                案件が登録されていません
              </Text>
            );
          }

          if (visibleProjects.length === 0) {
            return (
              <Text size="md" c="dimmed">
                条件に合う案件が見つかりません
              </Text>
            );
          }
          return <ProjectListItems projects={visibleProjects} />;
        }}
      />
    </Stack>
  );
};

export default ProjectListClient;
