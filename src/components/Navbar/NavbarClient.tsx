"use client";

import { AppShellNavbar, NavLink, Stack } from "@mantine/core";
import { IconFolder, IconReceipt, IconUsers } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { HeaderMenuItem, MenuIcon } from "@/types/header";

const iconMap: Record<MenuIcon, React.ReactNode> = {
  projects: <IconFolder size={18} />,
  expenses: <IconReceipt size={18} />,
  users: <IconUsers size={18} />,
};

export const NavbarClient = ({
  menuItems,
}: {
  menuItems: HeaderMenuItem[];
}) => {
  const pathname = usePathname();

  return (
    <AppShellNavbar p="md">
      <Stack gap="xs">
        {menuItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <NavLink
              key={item.href}
              component={Link}
              href={item.href}
              label={item.label}
              active={isActive}
              leftSection={item.icon ? iconMap[item.icon] : undefined}
              py={6}
              fz="sm"
              fw={550}
              styles={(theme) => ({
                root: {
                  borderRadius: theme.radius.sm,
                  backgroundColor: isActive ? theme.colors.blue[0] : undefined,
                  color: isActive ? theme.colors.blue[7] : undefined,
                  "&:hover": {
                    backgroundColor: isActive
                      ? theme.colors.blue[1]
                      : theme.colors.gray[1],
                  },
                },
                label: {
                  color: "inherit",
                },
              })}
            />
          );
        })}
      </Stack>
    </AppShellNavbar>
  );
};

export default NavbarClient;
