"use client";

import { Group, Text } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";

export const ForwardLink = ({
  href,
  label,
}: {
  href: string;
  label: string;
}) => {
  return (
    <Link href={href} style={{ textDecoration: "none", cursor: "pointer" }}>
      <Group gap={4} wrap="nowrap">
        <Text size="sm" c="dimmed">
          {label}
        </Text>
        <IconChevronRight size={16} />
      </Group>
    </Link>
  );
};

export default ForwardLink;
