"use client";

import { Button, Group, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  filterProjectsByDateOverlap,
  filterProjectsByQuery,
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
import ForwardLink from "../ui/ForwardLink";
import SearchBox from "../ui/SearchBox";
import { PageTab, type TabItem } from "../ui/Tabs/PageTab";
import ProjectListItems from "./ProjectListItems";

export const ProjectListClient = ({
  projects,
}: {
  projects: ProjectListItem[];
}) => {
  // --------------------
  // state
  // --------------------
  const [activeTab, setActiveTab] = useState<ProjectStatusTab>("all");
  const [selected, setSelected] = useState<ProjectStatus[]>([]);
  const [range, setRange] = useState<DateRangeFilter>({ from: null, to: null });
  const [query, setQuery] = useState("");

  const isAllTab = activeTab === "all";
  const isDateRangeFiltering = !!range.from || !!range.to;
  const isStatusFiltering = isAllTab && selected.length > 0;

  // --------------------
  // base (完了案件は一覧には出さない)
  // --------------------
  const baseProjects = useMemo(
    () => projects.filter((p) => p.status !== PROJECT_STATUS.COMPLETED),
    [projects]
  );

  // --------------------
  // filters
  // --------------------
  const rangeFiltered = useMemo(
    () => filterProjectsByDateOverlap(baseProjects, range),
    [baseProjects, range]
  );

  const queryFiltered = useMemo(
    () => filterProjectsByQuery(rangeFiltered, query),
    [rangeFiltered, query]
  );

  const visibleProjects = useMemo(() => {
    if (activeTab === "all")
      return filterProjectsByStatus(queryFiltered, selected);
    return queryFiltered.filter((p) => p.status === activeTab);
  }, [activeTab, queryFiltered, selected]);

  // --------------------
  // tabs
  // --------------------
  const counts = useMemo(() => {
    const c: Record<ProjectStatusTab, number> = {
      all: queryFiltered.length,
      undecided: 0,
      not_started: 0,
      in_progress: 0,
      ended: 0,
      completed: 0,
    };

    for (const p of queryFiltered) {
      c[p.status] += 1;
    }
    return c;
  }, [queryFiltered]);

  const tabItems = useMemo((): TabItem<ProjectStatusTab>[] => {
    return [
      { value: "all", label: "すべて", count: counts.all },
      ...PROJECT_STATUS_TABS.map((s) => ({
        value: s,
        label: PROJECT_STATUS_LABEL[s],
        count: counts[s],
      })),
    ];
  }, [counts]);

  // --------------------
  // render
  // --------------------
  return (
    <Stack gap="sm">
      <Group justify="space-between" align="flex-end">
        <Group gap="sm" align="flex-end">
          <SearchBox value={query} onChange={setQuery} w={260} />
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

        <Stack gap="xs" align="end">
          <ForwardLink href="/projects/completed" label="完了済案件一覧" />

          <Button
            component={Link}
            href={"/projects/add"}
            size="sm"
            leftSection={<span>✐</span>}
          >
            新規作成
          </Button>
        </Stack>
      </Group>

      <PageTab<ProjectStatusTab>
        value={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        tabWidth={128}
        renderPanel={() => {
          if (baseProjects.length === 0) {
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
          return (
            <ProjectListItems projects={visibleProjects} returnTo="/projects" />
          );
        }}
      />
    </Stack>
  );
};

export default ProjectListClient;
