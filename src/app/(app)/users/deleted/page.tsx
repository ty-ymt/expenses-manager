import { Group, Stack, Text, Title } from "@mantine/core";
import DeletedUserListClient from "@/components/Users/DeletedUserListClient";
import { BackLink } from "@/components/ui/BackLink";
import { getDeletedUsers } from "@/lib/users/queries";

export default async function DeletedUsersPage() {
  const users = await getDeletedUsers();

  return (
    <Stack gap="sm">
      <Group justify="space-between" align="flex-end">
        <Title order={2}>削除済みユーザー</Title>
        <BackLink defaultHref="/users" label="一覧へ戻る" />
      </Group>

      {users.length === 0 ? (
        <Text size="sm" c="dimmed">
          削除済みユーザーがありません
        </Text>
      ) : (
        <DeletedUserListClient users={users} />
      )}
    </Stack>
  );
}
