import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/platform/prisma";
import { getProjectStatus } from "@/lib/projects/queries";
import type { ProjectListItem } from "@/types/projects";

export type ExpenseProjectListItem = ProjectListItem & {
  expense_total: string;
};

export const getAllExpenseProjects = async (): Promise<
  ExpenseProjectListItem[]
> => {
  const rows = await prisma.project.findMany({
    select: {
      id: true,
      cd: true,
      name: true,
      completed: true,
      start_dt: true,
      end_dt: true,
      completed_at: true,
    },
    orderBy: [{ start_dt: "asc" }, { cd: "asc" }],
  });

  const sums = await prisma.expense.groupBy({
    by: ["project_id"],
    _sum: { amount: true },
  });

  const sumMap = new Map<string, string>();
  for (const s of sums) {
    const total = (s._sum.amount ?? new Prisma.Decimal(0)).toString();
    sumMap.set(String(s.project_id), total);
  }

  return rows.map((p) => {
    const id = p.id.toString();
    return {
      id,
      cd: p.cd,
      name: p.name,
      completed: p.completed,
      start_dt: p.start_dt,
      end_dt: p.end_dt,
      completed_at: p.completed_at,
      status: getProjectStatus({
        start: p.start_dt,
        end: p.end_dt,
        completed: p.completed,
      }),
      expense_total: sumMap.get(id) ?? "0",
    };
  });
};

export const getExpenseProjectDetail = async (projectId: bigint) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      cd: true,
      name: true,
      start_dt: true,
      end_dt: true,
      expenses: {
        select: {
          id: true,
          amount: true,
          receipt_date: true,
          remarks: true,
          category: { select: { id: true, name: true } },
        },
        orderBy: [{ receipt_date: "asc" }, { id: "asc" }],
      },
    },
  });

  return project;
};

// 金額計算用のヘルパー（Decimal -> number 変換で合計）
const toNumber = (v: Prisma.Decimal) => Number(v.toString());

export type ExpenseCategoryGroup = {
  categoryId: string;
  categoryName: string;
  items: {
    id: string;
    receipt_date: Date;
    amount: string; // 表示・安全のため string
    remarks: string | null;
  }[];
  subtotal: string; // stringで返す
};

export const groupExpensesByCategory = (
  expenses: {
    id: bigint;
    amount: Prisma.Decimal;
    receipt_date: Date;
    remarks: string | null;
    category: { id: bigint; name: string };
  }[],
): { groups: ExpenseCategoryGroup[]; total: string } => {
  const map = new Map<string, ExpenseCategoryGroup>();

  let totalNum = 0;

  for (const e of expenses) {
    const key = e.category.id.toString();
    const amountNum = toNumber(e.amount);
    totalNum += amountNum;

    const g =
      map.get(key) ??
      ({
        categoryId: key,
        categoryName: e.category.name,
        items: [],
        subtotal: "0",
      } satisfies ExpenseCategoryGroup);

    g.items.push({
      id: e.id.toString(),
      receipt_date: e.receipt_date,
      amount: e.amount.toString(),
      remarks: e.remarks,
    });

    // 小計を number で積んで最後に string 化
    const currentSubtotal = g.items.reduce(
      (sum, it) => sum + Number(it.amount),
      0,
    );
    g.subtotal = String(currentSubtotal);

    map.set(key, g);
  }

  const groups = Array.from(map.values()).sort((a, b) =>
    a.categoryName.localeCompare(b.categoryName, "ja"),
  );

  return { groups, total: String(totalNum) };
};
