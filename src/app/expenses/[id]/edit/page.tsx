import { Group, Stack, Title } from "@mantine/core";
import { notFound } from "next/navigation";
import ExpenseEditClient from "@/components/Expenses/ExpenseEditClient";
import { BackLink } from "@/components/ui/BackLink";
import {
  getExpenseCategoriesForSelect,
  getExpensesByProjectIdForEdit,
} from "@/lib/expenses/edit/queries";
import { getProjectById } from "@/lib/projects/queries";

export default async function ExpenseProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let projectId: bigint;
  try {
    projectId = BigInt(id);
  } catch {
    notFound();
  }

  const project = await getProjectById(projectId);
  if (!project) notFound();

  const [categories, initialRows] = await Promise.all([
    getExpenseCategoriesForSelect(),
    getExpensesByProjectIdForEdit(projectId),
  ]);

  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-end">
        <Stack gap="sm">
          <Title order={2}>経費編集</Title>
          <Title order={2}>
            【{project.cd}】{project.name}
          </Title>
        </Stack>

        <BackLink label="経費一覧へ戻る" defaultHref="/expenses" />
      </Group>

      <ExpenseEditClient
        projectId={id}
        categories={categories}
        initialRows={initialRows}
      />
    </Stack>
  );
}
