"use client";

import { Button, Group, Paper, Stack, Text } from "@mantine/core";
import { restoreUserAction } from "@/lib/users/actions";
import type { UserListItem } from "@/types/users";

export const DeletedUserListClient = ({ users }: { users: UserListItem[] }) => {
  return (
    <Stack gap="xs">
      {users.map((u) => (
        <Paper key={u.id} p="md" withBorder radius="sm">
          <Group justify="space-between" align="center">
            <Stack gap={2}>
              <Text fw={700}>{u.name}</Text>
              <Text size="sm" c="dimmed">
                {u.email}
              </Text>
            </Stack>

            <Button
              size="xs"
              variant="default"
              onClick={async () => {
                await restoreUserAction(u.id);
              }}
            >
              復活
            </Button>
          </Group>
        </Paper>
      ))}
    </Stack>
  );
};

export default DeletedUserListClient;
