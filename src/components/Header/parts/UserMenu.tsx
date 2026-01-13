"use client";

import { Avatar, Box, Group, Menu, Text, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { UserMenuProps } from "@/types/header";

export const UserMenu = ({
  displayName,
  displayEmail,
  onSignOut,
}: UserMenuProps) => {
  const [opened, { toggle, close }] = useDisclosure(false);
  const initial = displayName.charAt(0);

  const handleSignOut = async () => {
    await onSignOut();
    close();
  };

  return (
    <Menu
      opened={opened}
      onChange={(v) => (v ? toggle() : close())}
      position="bottom-end"
      shadow="md"
      width={220}
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton
          onClick={toggle}
          aria-label="ユーザーメニューを開く"
          style={{ borderRadius: 8 }}
        >
          <Group gap="xs">
            <Avatar size="sm" radius="xl">
              {initial}
            </Avatar>
            <Text size="sm">{displayName}</Text>
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Box px="sm" py="xs">
          <Text size="sm" fw={600}>
            {displayName}
          </Text>
          {displayEmail && (
            <Text size="xs" c="dimmed">
              {displayEmail}
            </Text>
          )}
        </Box>

        <Menu.Divider />

        <Menu.Item color="red" onClick={handleSignOut}>
          Sign out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserMenu;
