"use client";

import { Button, Divider, Group, Popover, Stack, Text } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useEffect, useMemo, useState } from "react";
import { INPUT_DATE_FORMAT } from "@/lib/date";
import type { DateRangeFilter } from "@/types/projects";
import FilterButton from "./FilterButton";

export const DateRangeFilterButton = ({
  value,
  setValue,
  label = "期間",
  isDateRangeFiltering,
}: {
  value: DateRangeFilter;
  setValue: React.Dispatch<React.SetStateAction<DateRangeFilter>>;
  label?: string;
  isDateRangeFiltering: boolean;
}) => {
  const [opened, setOpened] = useState(false);
  const [draft, setDraft] = useState<DateRangeFilter>(value);

  useEffect(() => {
    if (opened) setDraft(value);
  }, [opened, value]);

  const hasChanged = draft.from !== value.from || draft.to !== value.to;

  const canApply = useMemo(() => {
    if (draft.from && draft.to && draft.from > draft.to) return false;
    return true;
  }, [draft.from, draft.to]);

  const clearDraft = () => setDraft({ from: null, to: null });

  const apply = () => {
    if (!canApply) return;
    setValue(draft);
    setOpened(false);
  };

  const clearApplied = () => setValue({ from: null, to: null });

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom-start"
      shadow="md"
      radius={12}
      withinPortal
    >
      <Popover.Target>
        <FilterButton
          label={label}
          isFiltering={isDateRangeFiltering}
          onClick={() => setOpened((v) => !v)}
          onClear={clearApplied}
        />
      </Popover.Target>

      <Popover.Dropdown
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <Stack gap="xs" w={260}>
          <Group justify="space-between">
            <Text size="sm" fw={600}>
              集計期間
            </Text>
          </Group>

          <Divider />

          <Group grow align="flex-end" gap="sm">
            <DateInput
              label="集計開始日"
              value={draft.from}
              onChange={(v) => setDraft((prev) => ({ ...prev, from: v }))}
              clearable
              valueFormat={INPUT_DATE_FORMAT}
            />
            <DateInput
              label="集計終了日"
              value={draft.to}
              onChange={(v) => setDraft((prev) => ({ ...prev, to: v }))}
              clearable
              valueFormat={INPUT_DATE_FORMAT}
              minDate={draft.from ?? undefined}
            />
          </Group>

          <Group mt="xs" justify="flex-end">
            <Button
              size="xs"
              w={70}
              onClick={apply}
              disabled={!hasChanged || !canApply}
            >
              適用
            </Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};

export default DateRangeFilterButton;
