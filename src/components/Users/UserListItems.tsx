"use client";

import { Badge, Group, Paper, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { USER_ROLE_LABEL, type UserListItem } from "@/types/users";

const roleColor = (role: UserListItem["role"]) =>
  role === "admin" ? "blue" : "gray";

export const UserListItems = ({ users }: { users: UserListItem[] }) => {
  return (
    <Stack gap="xs">
      {users.map((u) => (
        <Paper
          key={u.id}
          component={Link}
          href={`/users/${u.id}`}
          p="md"
          withBorder
          radius="sm"
          c="inherit"
          style={{ textDecoration: "none" }}
        >
          <Group justify="space-between" align="flex-start">
            <Stack gap={2}>
              <Text fw={700}>{u.name}</Text>
              <Text size="sm" c="dimmed">
                {u.email}
              </Text>
            </Stack>

            <Badge color={roleColor(u.role)} variant="light">
              {USER_ROLE_LABEL[u.role]}
            </Badge>
          </Group>
        </Paper>
      ))}
    </Stack>
  );
};

export default UserListItems;
