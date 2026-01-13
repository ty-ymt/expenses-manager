import {
  Alert,
  Badge,
  Button,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { prisma } from "@/lib/platform/prisma";

/* =====================
  util
===================== */

const yen = (n: number) =>
  new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(n);

const fmtDate = (d?: Date | null) => {
  if (!d) return "-";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

// JST基準で「今月」の範囲を作る
const getJstMonthRange = () => {
  const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
  const nowJst = new Date(Date.now() + JST_OFFSET_MS);

  const y = nowJst.getUTCFullYear();
  const m = nowJst.getUTCMonth();

  const start = new Date(Date.UTC(y, m, 1) - JST_OFFSET_MS);
  const next = new Date(Date.UTC(y, m + 1, 1) - JST_OFFSET_MS);

  return { start, next };
};

/* =====================
  page
===================== */

export default async function HomePage() {
  const { start: monthStart, next: monthNext } = getJstMonthRange();
  const now = new Date();

  const [
    completedProjects,
    activeProjects,
    overdueCount,
    overdueList,
    monthlyAgg,
    recentExpenses,
  ] = await Promise.all([
    prisma.project.count({ where: { completed: true } }),
    prisma.project.count({ where: { completed: false } }),

    prisma.project.count({
      where: { completed: false, end_dt: { lt: now } },
    }),

    prisma.project.findMany({
      where: { completed: false, end_dt: { lt: now } },
      orderBy: { end_dt: "asc" },
      take: 5,
      select: { id: true, cd: true, name: true, end_dt: true },
    }),

    prisma.expense.aggregate({
      where: {
        receipt_date: {
          gte: monthStart,
          lt: monthNext,
        },
      },
      _sum: { amount: true },
      _count: { _all: true },
    }),

    prisma.expense.findMany({
      orderBy: [{ receipt_date: "desc" }, { id: "desc" }],
      take: 10,
      select: {
        id: true,
        receipt_date: true,
        amount: true,
        remarks: true,
        project: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
      },
    }),
  ]);

  const monthlyTotal = Number(monthlyAgg._sum.amount ?? 0);
  const monthlyCount = monthlyAgg._count._all ?? 0;

  return (
    <Stack gap="md">
      {/* header */}
      <Group justify="space-between" align="flex-end">
        <Title order={2}>ダッシュボード</Title>
        <Link href="/projects/add" style={{ textDecoration: "none" }}>
          <Button>案件を登録</Button>
        </Link>
      </Group>

      {/* overdue alert */}
      {overdueCount > 0 && (
        <Alert
          color="yellow"
          title={`運用期間が終了した未完了案件があります（${overdueCount}件）`}
        >
          <Stack gap="xs">
            {overdueList.map((p) => (
              <Group key={String(p.id)} justify="space-between">
                <Group gap="sm">
                  <Badge color="yellow" variant="light">
                    {fmtDate(p.end_dt)}
                  </Badge>
                  <Text fw={600} size="sm">
                    {p.name}
                  </Text>
                  <Text size="sm" c="dimmed">
                    ({p.cd})
                  </Text>
                </Group>

                <Link
                  href={`/projects/${String(p.id)}`}
                  style={{ textDecoration: "none" }}
                >
                  <Button size="xs" variant="light">
                    開く
                  </Button>
                </Link>
              </Group>
            ))}

            <Group justify="flex-end">
              <Link href="/projects" style={{ textDecoration: "none" }}>
                <Button size="xs" variant="subtle">
                  案件一覧へ
                </Button>
              </Link>
            </Group>
          </Stack>
        </Alert>
      )}

      {/* summary */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        <Paper withBorder p="md" radius="sm">
          <Text c="dimmed" size="sm">
            今月の経費合計
          </Text>
          <Text fw={800} size="xl">
            {yen(monthlyTotal)}
          </Text>
        </Paper>

        <Paper withBorder p="md" radius="sm">
          <Text c="dimmed" size="sm">
            今月の経費件数
          </Text>
          <Text fw={800} size="xl">
            {monthlyCount} 件
          </Text>
        </Paper>

        <Paper withBorder p="md" radius="sm">
          <Text c="dimmed" size="sm">
            未完了の案件
          </Text>
          <Text fw={800} size="xl">
            {activeProjects} 件
          </Text>
          <Link href="/projects" style={{ textDecoration: "none" }}>
            <Button size="xs" variant="light" mt="xs">
              一覧へ
            </Button>
          </Link>
        </Paper>

        <Paper withBorder p="md" radius="sm">
          <Text c="dimmed" size="sm">
            完了済みの案件
          </Text>
          <Text fw={800} size="xl">
            {completedProjects} 件
          </Text>
          <Link href="/projects/completed" style={{ textDecoration: "none" }}>
            <Button size="xs" variant="light" mt="xs">
              一覧へ
            </Button>
          </Link>
        </Paper>
      </SimpleGrid>

      {/* recent expenses */}
      <Paper withBorder p="md" radius="sm">
        <Group justify="space-between" mb="sm">
          <Text fw={700}>直近の経費（最新10件）</Text>
          <Link href="/expenses" style={{ textDecoration: "none" }}>
            <Button size="xs" variant="subtle">
              経費一覧へ
            </Button>
          </Link>
        </Group>

        {recentExpenses.length === 0 ? (
          <Text c="dimmed" size="sm">
            経費はまだ登録されていません。
          </Text>
        ) : (
          <Table striped highlightOnHover withTableBorder>
            <thead>
              <tr>
                <th>日付</th>
                <th>案件</th>
                <th>カテゴリ</th>
                <th style={{ textAlign: "right" }}>金額</th>
                <th>備考</th>
              </tr>
            </thead>

            <tbody>
              {recentExpenses.map((e) => (
                <tr key={String(e.id)}>
                  <td>{fmtDate(e.receipt_date)}</td>
                  <td>
                    <Text fw={600} size="sm">
                      {e.project?.name ?? "-"}
                    </Text>
                  </td>
                  <td>
                    <Badge variant="light">{e.category?.name ?? "-"}</Badge>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <Text fw={700} size="sm">
                      {yen(Number(e.amount))}
                    </Text>
                  </td>
                  <td>
                    <Text size="sm" c="dimmed" lineClamp={1}>
                      {e.remarks ?? ""}
                    </Text>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Paper>
    </Stack>
  );
}
