"use client";

import { Group, Text } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const BackLink = ({ label = "一覧へ戻る" }: { label?: string }) => {
  const sp = useSearchParams();
  const from = sp.get("from");

  const href = from === "completed" ? "/projects/completed" : "/projects";
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
