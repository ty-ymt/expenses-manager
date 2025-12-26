"use client";

import {
  Checkbox,
  Divider,
  Group,
  Popover,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { STATUS_OPTIONS } from "@/lib/filters";
import { PROJECT_STATUS_LABEL, type ProjectStatus } from "@/types/projects";
import FilterButton from "./FilterButton";

export const StatusFilterButton = ({
  selected,
  setSelected,
  isStatusFiltering,
  label = "ステータス",
  disabled = false,
}: {
  selected: ProjectStatus[];
  setSelected: React.Dispatch<React.SetStateAction<ProjectStatus[]>>;
  isStatusFiltering: boolean;
  label?: string;
  disabled?: boolean;
}) => {
  const [opened, setOpened] = useState(false);
  if (disabled && opened) setOpened(false);

  const allChecked = selected.length === STATUS_OPTIONS.length;
  const indeterminate = selected.length > 0 && !allChecked;

  const toggleOne = (v: ProjectStatus) => {
    setSelected((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );
  };

  const toggleAll = () => {
    setSelected(allChecked ? [] : STATUS_OPTIONS);
  };

  const clear = () => setSelected([]);

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom-start"
      shadow="md"
      withinPortal
      radius={12}
      disabled={disabled}
    >
      <Popover.Target>
        <FilterButton
          label={label}
          isFiltering={isStatusFiltering}
          onClick={() => setOpened((v) => !v)}
          disabled={disabled}
          onClear={disabled ? undefined : clear}
        />
      </Popover.Target>

      <Popover.Dropdown>
        <Stack gap="xs" w={100}>
          <Group
            justify="space-between"
            align="center"
            style={{ cursor: "pointer" }}
            onClick={toggleAll}
          >
            <Group gap="xs" wrap="nowrap">
              <Checkbox
                checked={allChecked}
                indeterminate={indeterminate}
                readOnly
                tabIndex={-1}
              />
              <Text size="sm">すべて</Text>
            </Group>
          </Group>

          <Divider />

          <ScrollArea>
            <Stack gap={6}>
              {STATUS_OPTIONS.map((s) => {
                const checked = selected.includes(s);
                return (
                  <Group
                    key={s}
                    justify="space-between"
                    align="center"
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleOne(s)}
                  >
                    <Group gap="xs" wrap="nowrap">
                      <Checkbox checked={checked} readOnly tabIndex={-1} />
                      <Text size="sm">{PROJECT_STATUS_LABEL[s]}</Text>
                    </Group>
                  </Group>
                );
              })}
            </Stack>
          </ScrollArea>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};

export default StatusFilterButton;
