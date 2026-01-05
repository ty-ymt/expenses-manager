"use client";

import { Group, Stack, Text } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { BackLink } from "@/components/ui/BackLink";
import DateRangeFilterButton from "@/components/ui/Filter/DateRangeFilterButton";
import SearchBox from "@/components/ui/SearchBox";
import { PageTab, type TabItem } from "@/components/ui/Tabs/PageTab";
import { toJstDay } from "@/lib/date";
import type { ExpenseProjectListItem } from "@/lib/expenses/queries";
import { filterProjectsByQuery } from "@/lib/filters";
import { type DateRangeFilter, PROJECT_STATUS } from "@/types/projects";
import ExpenseProjectListItems from "./ExpenseProjectListItems";

const getCompletedYear = (p: ExpenseProjectListItem): string | null => {
  const dt = toJstDay(p.completed_at);
  return dt ? String(dt.year) : null;
};

const filterByCompletedAtRange = (
  projects: ExpenseProjectListItem[],
  range: DateRangeFilter,
) => {
  if (!range.from && !range.to) return projects;

  const from = toJstDay(range.from);
  const to = toJstDay(range.to);

  return projects.filter((p) => {
    const d = toJstDay(p.completed_at);
    if (!d) return false;
    if (from && d < from) return false;
    if (to && d > to) return false;
    return true;
  });
};

export const CompletedExpenseProjectList = ({
  projects,
}: {
  projects: ExpenseProjectListItem[];
}) => {
  const [range, setRange] = useState<DateRangeFilter>({ from: null, to: null });
  const [query, setQuery] = useState("");
  const isDateRangeFiltering = !!range.from || !!range.to;

  const baseProjects = useMemo(
    () =>
      projects.filter(
        (p) => p.status === PROJECT_STATUS.COMPLETED && !!p.completed_at,
      ),
    [projects],
  );

  const rangeFiltered = useMemo(
    () => filterByCompletedAtRange(baseProjects, range),
    [baseProjects, range],
  );

  const queryFiltered = useMemo(
    () => filterProjectsByQuery(rangeFiltered, query),
    [rangeFiltered, query],
  );

  const years = useMemo(() => {
    const set = new Set<string>();
    for (const p of queryFiltered) {
      const y = getCompletedYear(p);
      if (y) set.add(y);
    }
    return Array.from(set).sort((a, b) => Number(b) - Number(a));
  }, [queryFiltered]);

  const [activeYear, setActiveYear] = useState<string>("");

  useEffect(() => {
    if (!years.includes(activeYear)) {
      setActiveYear(years[0] ?? "");
    }
  }, [years, activeYear]);

  const countsByYear = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of queryFiltered) {
      const y = getCompletedYear(p);
      if (!y) continue;
      c[y] = (c[y] ?? 0) + 1;
    }
    return c;
  }, [queryFiltered]);

  const tabItems = useMemo<TabItem<string>[]>(() => {
    return years.map((y) => ({
      value: y,
      label: `${y}年`,
      count: countsByYear[y] ?? 0,
    }));
  }, [years, countsByYear]);

  const visible = useMemo(() => {
    if (!activeYear) return [];
    return queryFiltered.filter((p) => getCompletedYear(p) === activeYear);
  }, [queryFiltered, activeYear]);

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
        </Group>

        <BackLink defaultHref="/expenses" label="経費一覧へ戻る" />
      </Group>

      {tabItems.length === 0 ? (
        <Text size="sm" c="dimmed">
          {baseProjects.length === 0
            ? "完了した案件がありません"
            : "条件に合う案件が見つかりません"}
        </Text>
      ) : (
        <PageTab<string>
          value={activeYear}
          onChange={setActiveYear}
          items={tabItems}
          tabWidth={120}
          renderPanel={() => {
            if (visible.length === 0) {
              return (
                <Text size="md" c="dimmed">
                  条件に合う案件が見つかりません
                </Text>
              );
            }
            return (
              <ExpenseProjectListItems
                projects={visible}
                returnTo="/expenses/completed"
              />
            );
          }}
        />
      )}
    </Stack>
  );
};

export default CompletedExpenseProjectList;
