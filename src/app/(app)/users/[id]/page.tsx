import {
  Badge,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/ui/BackLink";
import FormActions from "@/components/ui/Form/FormActions";
import { SubmitButton } from "@/components/ui/Form/FormButtons";
import { formatDateTime } from "@/lib/date";
import { getUserById } from "@/lib/users/queries";
import { USER_ROLE_LABEL } from "@/types/users";

const roleColor = (role: string) => (role === "admin" ? "blue" : "gray");

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let userId: bigint;
  try {
    userId = BigInt(id);
  } catch {
    notFound();
  }

  const user = await getUserById(userId);
  if (!user) notFound();

  return (
    <>
      <Group justify="space-between" align="flex-end" mb="md">
        <Title order={2}>ユーザー詳細</Title>
        <BackLink defaultHref="/users" label="一覧へ戻る" />
      </Group>

      <Paper p="md" withBorder radius="sm">
        <Stack gap="sm">
          <Group justify="space-between" align="center">
            <Stack gap={2}>
              <Text size="xs" c="dimmed">
                氏名
              </Text>
              <Text fw={700}>{user.name}</Text>
            </Stack>

            <Badge color={roleColor(user.role)} variant="light">
              {USER_ROLE_LABEL[user.role as "admin" | "user"]}
            </Badge>
          </Group>

          <Stack gap={2}>
            <Text size="xs" c="dimmed">
              メールアドレス
            </Text>
            <Text fw={600}>{user.email}</Text>
          </Stack>

          <Divider />

          <Group justify="space-between">
            <Stack gap={2}>
              <Text size="xs" c="dimmed">
                作成
              </Text>
              <Text size="sm">{formatDateTime(user.created_at)}</Text>
            </Stack>

            <Stack gap={2} style={{ textAlign: "right" }}>
              <Text size="xs" c="dimmed">
                更新
              </Text>
              <Text size="sm">{formatDateTime(user.updated_at)}</Text>
            </Stack>
          </Group>

          <FormActions>
            <Link
              href={`/users/${user.id}/edit`}
              style={{ textDecoration: "none" }}
            >
              <SubmitButton>編集</SubmitButton>
            </Link>
          </FormActions>
        </Stack>
      </Paper>
    </>
  );
}
