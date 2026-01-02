"use client";

import { ActionIcon, Group, Text } from "@mantine/core";
import type { TablerIcon } from "@tabler/icons-react";
import Link from "next/link";

export const TextLink = ({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon?: TablerIcon;
}) => {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <Group gap={6} wrap="nowrap">
        {Icon && (
          <ActionIcon variant="subtle" size="sm">
            <Icon size={16} />
          </ActionIcon>
        )}
        <Text size="sm" c="dimmed" fw={600}>
          {label}
        </Text>
      </Group>
    </Link>
  );
};

export default TextLink;
