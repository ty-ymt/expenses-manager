"use client";

import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  Popover,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { IconChevronDown, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { DEFAULT_STATUSES, STATUS_OPTIONS } from "@/lib/filters";
import { PROJECT_STATUS_LABEL, type ProjectStatus } from "@/types/projects";

export const StatusFilterButton = ({
  selected,
  setSelected,
  label = "ステータス",
}: {
  selected: ProjectStatus[];
  setSelected: React.Dispatch<React.SetStateAction<ProjectStatus[]>>;
  label?: string;
}) => {
  const [opened, setOpened] = useState(false);

  const isDefault =
    selected.length === DEFAULT_STATUSES.length &&
    DEFAULT_STATUSES.every((s) => selected.includes(s));

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

  const clearToDefault = () => setSelected(DEFAULT_STATUSES);

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom-start"
      shadow="md"
      withinPortal
    >
      <Popover.Target>
        <Box pos="relative" display="inline-block">
          <Button
            variant={isDefault ? "outline" : "filled"}
            color={isDefault ? "gray" : "blue"}
            rightSection={<IconChevronDown size={16} />}
            onClick={() => setOpened((v) => !v)}
          >
            {label}
          </Button>

          {!isDefault && (
            <ActionIcon
              size="sm"
              radius="xl"
              variant="filled"
              color="red"
              pos="absolute"
              top={-6}
              right={-6}
              aria-label="フィルターをクリア"
              onClick={(e) => {
                e.stopPropagation();
                clearToDefault();
              }}
            >
              <IconX size={14} />
            </ActionIcon>
          )}
        </Box>
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
