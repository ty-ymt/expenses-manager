import { Group, Stack, Title } from "@mantine/core";
import CategoryEditClient from "@/components/Expenses/Categories/CategoryEditClient";
import { BackLink } from "@/components/ui/BackLink";
import ForwardLink from "@/components/ui/ForwardLink";
import { getActiveCategories } from "@/lib/expenses/categories/queries";
import type { CategoryEditRow } from "@/types/categories";

export default async function ExpenseCategoryEditPage() {
  const rows = await getActiveCategories();

  // ★ ここで Client 用の型に整形（deleted を付与）
  const initialRows: CategoryEditRow[] = rows.map((r) => ({
    id: r.id, // r.id が string の想定
    name: r.name,
    deleted: false,
  }));

  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-end">
        <Title order={2}>費目編集</Title>

        <Group gap="sm">
          <BackLink label="費目一覧へ戻る" defaultHref="/expenses/categories" />
          <ForwardLink
            href="/expenses/categories/edit/deleted"
            label="削除済み費目"
          />
        </Group>
      </Group>

      <CategoryEditClient initialRows={initialRows} />
    </Stack>
  );
}
