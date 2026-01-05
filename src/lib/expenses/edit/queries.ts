import "server-only";
import { prisma } from "@/lib/platform/prisma";
import type { ExpenseCategoryOption, ExpenseEditRow } from "@/types/expenses";

export const getExpenseCategoriesForSelect = async (): Promise<
  ExpenseCategoryOption[]
> => {
  const rows = await prisma.category.findMany({
    where: { deleted_at: null },
    select: { id: true, name: true },
    orderBy: [{ sort: "asc" }, { name: "asc" }],
  });

  return rows.map((r) => ({
    value: r.id.toString(),
    label: r.name,
  }));
};

export const getExpensesByProjectIdForEdit = async (
  projectId: bigint,
): Promise<ExpenseEditRow[]> => {
  const rows = await prisma.expense.findMany({
    where: { project_id: projectId },
    select: {
      id: true,
      receipt_date: true,
      category_id: true,
      remarks: true,
      amount: true,
    },
    orderBy: [{ receipt_date: "asc" }, { id: "asc" }],
  });

  return rows.map((r) => ({
    id: r.id.toString(),
    receipt_date: r.receipt_date.toISOString().slice(0, 10), // YYYY-MM-DD
    category_id: r.category_id.toString(),
    remarks: r.remarks ?? "",
    amount: r.amount.toString(),
  }));
};
