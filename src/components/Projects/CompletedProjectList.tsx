"use client";

import { Group, Stack, Text } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { toJstDay } from "@/lib/date";
import {
  type DateRangeFilter,
  PROJECT_STATUS,
  type ProjectListItem,
} from "@/types/projects";
import { BackLink } from "../ui/BackLink";
import DateRangeFilterButton from "../ui/Filter/DateRangeFilterButton";
import { PageTab, type TabItem } from "../ui/Tabs/PageTab";
import ProjectListItems from "./ProjectListItems";

const getCompletedYear = (p: ProjectListItem): number | null => {
  const dt = toJstDay(p.completed_at);
  return dt ? dt.year : null;
};

const filterByCompletedAtRange = (
  projects: ProjectListItem[],
  range: DateRangeFilter
) => {
  if (!range.from && !range.to) return projects;

  const from = toJstDay(range.from) ?? null;
  const to = toJstDay(range.to) ?? null;

  return projects.filter((p) => {
    const d = toJstDay(p.completed_at) ?? null;
    if (!d) return false;

    if (from && d < from) return false;
    if (to && d > to) return false;
    return true;
  });
};

export const CompletedProjectListClient = ({
  projects,
}: {
  projects: ProjectListItem[];
}) => {
  const [range, setRange] = useState<DateRangeFilter>({ from: null, to: null });
  const isDateRangeFiltering = !!range.from || !!range.to;

  const completed = useMemo(
    () =>
      projects.filter(
        (p) => p.status === PROJECT_STATUS.COMPLETED && !!p.completed_at
      ),
    [projects]
  );

  const dateFiltered = useMemo(
    () => filterByCompletedAtRange(completed, range),
    [completed, range]
  );

  const years = useMemo(() => {
    const set = new Set<number>();
    for (const p of dateFiltered) {
      const y = getCompletedYear(p);
      if (y) set.add(y);
    }
    return Array.from(set)
      .sort((a, b) => b - a)
      .map(String);
  }, [dateFiltered]);

  const [activeYear, setActiveYear] = useState<string>(years[0] ?? null);

  useEffect(() => {
    if (!activeYear || !years.includes(activeYear)) {
      setActiveYear(years[0] ?? null);
    }
  }, [years, activeYear]);

  const safeActiveYear = years.includes(activeYear)
    ? activeYear
    : years[0] ?? "";

  const countsByYear = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of dateFiltered) {
      const y = getCompletedYear(p);
      if (!y) continue;
      const key = String(y);
      c[key] = (c[key] ?? 0) + 1;
    }
    return c;
  }, [dateFiltered]);

  const tabItems = useMemo<TabItem<string>[]>(() => {
    return years.map((y) => ({
      value: String(y),
      label: `${y}年`,
      count: countsByYear[y] ?? 0,
    }));
  }, [years, countsByYear]);

  const visible = useMemo(() => {
    if (!safeActiveYear) return [];
    return dateFiltered.filter(
      (p) => String(getCompletedYear(p)) === safeActiveYear
    );
  }, [dateFiltered, safeActiveYear]);

  return (
    <Stack gap="sm">
      <Group justify="space-between" align="flex-end">
        <DateRangeFilterButton
          value={range}
          setValue={setRange}
          isDateRangeFiltering={isDateRangeFiltering}
        />

        <BackLink label="案件一覧へ戻る" />
      </Group>

      <PageTab<string>
        value={safeActiveYear}
        onChange={setActiveYear}
        items={tabItems}
        tabWidth={120}
        renderPanel={() => {
          if (completed.length === 0) {
            return (
              <Text size="sm" c="dimmed">
                完了した案件がありません
              </Text>
            );
          }

          if (dateFiltered.length === 0) {
            return (
              <Text size="md" c="dimmed">
                条件に合う案件が見つかりません
              </Text>
            );
          }

          if (!safeActiveYear) {
            return (
              <Text size="md" c="dimmed">
                表示する年がありません
              </Text>
            );
          }

          if (visible.length === 0) {
            return (
              <Text size="md" c="dimmed">
                {safeActiveYear === "不明" ? "不明" : `${safeActiveYear}年`}
                の完了案件がありません
              </Text>
            );
          }
          return <ProjectListItems projects={visible} from="completed" />;
        }}
      />
    </Stack>
  );
};

export default CompletedProjectListClient;
