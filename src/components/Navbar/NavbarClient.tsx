"use client";

import {
  AppShellNavbar,
  type MantineTheme,
  NavLink,
  Stack,
} from "@mantine/core";
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

  const renderItem = (item: HeaderMenuItem) => {
    const isParent = !!item.children?.length;
    const hasActiveChild =
      item.children?.some((c) => c.href && pathname.startsWith(c.href)) ??
      false;

    const commonProps = {
      label: item.label,
      leftSection: item.icon ? iconMap[item.icon] : undefined,
      defaultOpened: hasActiveChild,
      py: 6,
      fz: "sm" as const,
      fw: 550,
      children: item.children?.map(renderItem),
    };

    const parentStyles = (theme: MantineTheme) => ({
      root: {
        borderRadius: theme.radius.sm,
        backgroundColor: hasActiveChild ? theme.colors.gray[1] : undefined,
        "&:hover": {
          backgroundColor: theme.colors.gray[1],
        },
      },
      label: {
        color: "inherit",
      },
    });

    if (!item.href) {
      return (
        <NavLink
          key={item.label}
          {...commonProps}
          defaultOpened={isParent && hasActiveChild}
          styles={parentStyles}
        />
      );
    }

    return (
      <NavLink
        key={item.label}
        {...commonProps}
        component={Link}
        href={item.href}
      >
        {item.children?.map(renderItem)}
      </NavLink>
    );
  };

  return (
    <AppShellNavbar p="md">
      <Stack gap="xs">{menuItems.map(renderItem)}</Stack>
    </AppShellNavbar>
  );
};

export default NavbarClient;
