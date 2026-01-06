import {
  Divider,
  Group,
  Paper,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/ui/BackLink";
import FormActions from "@/components/ui/Form/FormActions";
import { SubmitButton } from "@/components/ui/Form/FormButtons";
import { formatDate, formatDateRange } from "@/lib/date";
import {
  getExpenseProjectDetail,
  groupExpensesByCategory,
} from "@/lib/expenses/queries";

const formatJPY = (value: string) => {
  const n = Number(value);
  const safe = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
  }).format(safe);
};

export default async function ExpenseProjectDetailPage({
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

  const project = await getExpenseProjectDetail(projectId);
  if (!project) notFound();

  const { groups, total } = groupExpensesByCategory(project.expenses);

  return (
    <>
      <Group justify="space-between" align="flex-end" mb="md">
        <Title order={2}>経費詳細</Title>

        <BackLink defaultHref="/expenses" label="経費一覧へ戻る" />
      </Group>

      <Paper p="md" withBorder radius="sm">
        <Stack gap="md">
          <Stack gap={2}>
            <Text size="xs" c="dimmed">
              案件コード
            </Text>
            <Text fw={600}>{project.cd}</Text>
          </Stack>

          <Stack gap={2}>
            <Text size="xs" c="dimmed">
              案件名
            </Text>
            <Text fw={600}>{project.name}</Text>
          </Stack>

          <Stack gap={2}>
            <Text size="xs" c="dimmed">
              期間
            </Text>
            <Text>{formatDateRange(project.start_dt, project.end_dt)}</Text>
          </Stack>

          <Divider />

          {/* 明細 */}
          {groups.length === 0 ? (
            <Text size="sm" c="dimmed">
              この案件に経費が登録されていません
            </Text>
          ) : (
            <Stack gap="lg">
              {groups.map((g) => (
                <Stack key={g.categoryId} gap="xs">
                  <Group justify="space-between" align="flex-end">
                    <Text fw={700}>{g.categoryName}</Text>
                    <Text fw={700}>{formatJPY(g.subtotal)}</Text>
                  </Group>

                  <Table withTableBorder withColumnBorders highlightOnHover>
                    <thead>
                      <tr>
                        <th style={{ width: 140 }}>日付</th>
                        <th>備考</th>
                        <th style={{ width: 160, textAlign: "right" }}>金額</th>
                      </tr>
                    </thead>

                    <tbody>
                      {g.items.map((it) => (
                        <tr key={it.id}>
                          <td>{formatDate(it.receipt_date)}</td>
                          <td>
                            {it.remarks ? (
                              <Text style={{ whiteSpace: "pre-wrap" }}>
                                {it.remarks}
                              </Text>
                            ) : (
                              <Text c="dimmed" size="sm">
                                （なし）
                              </Text>
                            )}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {formatJPY(it.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Stack>
              ))}

              <Divider />

              <Group justify="flex-end">
                <Text fw={800} size="lg">
                  合計：{formatJPY(total)}
                </Text>
              </Group>
            </Stack>
          )}
          <FormActions>
            <Link
              href={`/expenses/${project.id}/edit`}
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
