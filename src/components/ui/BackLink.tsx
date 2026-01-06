"use client";

import { Group, Text } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const BackLink = ({
  defaultHref,
  label = "一覧へ戻る",
}: {
  defaultHref: string;
  label?: string;
}) => {
  const [href, setHref] = useState(defaultHref);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const returnTo = sp.get("returnTo");
    if (returnTo) setHref(returnTo);
  }, []);

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
