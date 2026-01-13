import { Group, Stack, Title } from "@mantine/core";
import DeletedCategoryEditorClient from "@/components/Expenses/Categories/DeletedCategoryEditorClient";
import { BackLink } from "@/components/ui/BackLink";
import { getDeletedCategories } from "@/lib/expenses/categories/queries";

export default async function DeletedCategoryEditPage() {
  const categories = await getDeletedCategories();

  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-end">
        <Title order={2}>削除済み費目</Title>
        <BackLink
          defaultHref="/expenses/categories/edit"
          label="費目編集へ戻る"
        />
      </Group>

      <DeletedCategoryEditorClient initial={categories} />
    </Stack>
  );
}
