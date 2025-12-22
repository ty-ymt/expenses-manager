"use client";

import { AppShellHeader, Group, Text, UnstyledButton } from "@mantine/core";
import Link from "next/link";
import type { UserMenuItem } from "@/types/header";
import { useShell } from "../Shell/ShellClient";
import BurgerIcon from "../ui/BurgerIcon";
import UserMenu from "./parts/UserMenu";

export const HeaderClient = ({
  displayName,
  displayEmail,
}: //onSignOut,
UserMenuItem) => {
  const { opened, toggle } = useShell();

  return (
    <AppShellHeader>
      <Group h="100%" px="md" justify="space-between">
        <Group gap="xs">
          <UnstyledButton
            onClick={toggle}
            aria-label="メニューを開閉"
            style={{
              display: "grid",
              placeItems: "center",
              width: 36,
              height: 36,
              corderRadius: 8,
              cursor: "pointer",
            }}
          >
            <BurgerIcon opened={opened} />
          </UnstyledButton>

          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Text fw={600} size="lg" style={{ cursor: "pointer" }}>
              Expenses Manager
            </Text>
          </Link>
        </Group>

        <UserMenu
          displayName={displayName}
          displayEmail={displayEmail}
          //onSignOut={onSignOut}
        />
      </Group>
    </AppShellHeader>
  );
};

export default HeaderClient;
