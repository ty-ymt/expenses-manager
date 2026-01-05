"use client";

import { Group, Text } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const BackLink = ({
  defaultHref,
  label = "一覧へ戻る",
}: {
  defaultHref: string;
  label?: string;
}) => {
  const sp = useSearchParams();
  const returnTo = sp.get("returnTo");

  const href = returnTo ? decodeURIComponent(returnTo) : defaultHref;
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
