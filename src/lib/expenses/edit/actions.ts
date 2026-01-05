"use server";

import { prisma } from "@/lib/platform/prisma";
import type { ExpenseEditRow, SaveExpensesResult } from "@/types/expenses";

const isValidYmd = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);

const normalizeAmount = (s: string) => {
  const t = s.trim();
  if (!t) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(t)) return null;
  return t;
};

export const saveProjectExpenses = async (
  projectId: string,
  rows: ExpenseEditRow[],
): Promise<SaveExpensesResult> => {
  let pid: bigint;
  try {
    pid = BigInt(projectId);
  } catch {
    return { ok: false, message: "案件IDが不正です" };
  }

  const activeRows = rows.filter((r) => !r._delete);

  for (const r of activeRows) {
    if (!r.receipt_date || !isValidYmd(r.receipt_date)) {
      return { ok: false, message: "日付が未入力、または形式が不正です" };
    }
    if (!r.category_id) {
      return { ok: false, message: "費目を選択してください" };
    }
    const amt = normalizeAmount(r.amount);
    if (!amt) {
      return {
        ok: false,
        message: "金額は数値（小数2桁まで）で入力してください",
      };
    }
  }

  const deleteIds: bigint[] = [];
  for (const r of rows) {
    if (r._delete && r.id) {
      deleteIds.push(BigInt(r.id));
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      if (deleteIds.length > 0) {
        await tx.expense.deleteMany({
          where: { id: { in: deleteIds }, project_id: pid },
        });
      }

      for (const r of activeRows) {
        if (!r.category_id) continue; // 念のため（上で弾いてる）
        const amt = normalizeAmount(r.amount);
        if (!amt) continue;

        const data = {
          project_id: pid,
          receipt_date: new Date(r.receipt_date), // "YYYY-MM-DD"
          category_id: BigInt(r.category_id),
          remarks: r.remarks?.trim() || null,
          amount: amt,
        };

        if (!r.id) {
          await tx.expense.create({ data });
        } else {
          await tx.expense.update({
            where: { id: BigInt(r.id) },
            data: {
              receipt_date: data.receipt_date,
              category_id: data.category_id,
              remarks: data.remarks,
              amount: data.amount,
            },
          });
        }
      }
    });

    return { ok: true };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "保存に失敗しました（DBエラー）" };
  }
};
