"use client";

import { Group, Text } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import Link from "next/link";

export const BackLink = ({
  href,
  label = "一覧へ戻る",
}: {
  href: string;
  label?: string;
}) => {
  return (
    <Link href={href} style={{ textDecoration: "none", cursor: "pointer" }}>
      <Group gap={4}>
        <IconChevronLeft size={16} />
        <Text size="sm" c="dimmed">
          {label}
        </Text>
      </Group>
    </Link>
  );
};
