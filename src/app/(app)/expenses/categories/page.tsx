import { Button, Group, Paper, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";
import { getActiveCategoriesForList } from "@/lib/expenses/categories/queries";

export default async function ExpenseCategoriesPage() {
  // ここはあなたの queries 名に合わせてOK
  // 例：getActiveCategoriesForEdit を流用してもOK（deleted_at=null の一覧が取れればOK）
  const categories = await getActiveCategoriesForList();

  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-end">
        <Title order={2}>費目管理</Title>

        {/* Server Componentなので component={Link} を使わず Link で包む */}
        <Link
          href="/expenses/categories/edit"
          style={{ textDecoration: "none" }}
        >
          <Button>費目を編集</Button>
        </Link>
      </Group>

      {categories.length === 0 ? (
        <Text c="dimmed" size="sm">
          費目が登録されていません
        </Text>
      ) : (
        <Stack gap="xs">
          {categories.map((c) => (
            <Paper key={c.id} withBorder radius="sm" p="sm">
              <Text fw={600}>{c.name}</Text>
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
