"use client";

import { Button, Group, Stack, Text } from "@mantine/core";
import Link from "next/link";
import type { UserListItem } from "@/types/users";
import ForwardLink from "../ui/ForwardLink";
import UserListItems from "./UserListItems";

export default function UserListClient({ users }: { users: UserListItem[] }) {
  return (
    <Stack gap="sm">
      <Group gap="sm" justify="flex-end">
        <Stack gap="xs" align="end">
          <ForwardLink href="/users/deleted" label="削除済み" />

          <Button
            component={Link}
            href={"/users/add"}
            size="sm"
            leftSection={<span>✐</span>}
          >
            新規作成
          </Button>
        </Stack>
      </Group>

      {users.length === 0 ? (
        <Text size="sm" c="dimmed">
          ユーザーが登録されていません
        </Text>
      ) : (
        <UserListItems users={users} />
      )}
    </Stack>
  );
}
