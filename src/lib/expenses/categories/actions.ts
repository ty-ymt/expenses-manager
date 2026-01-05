"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/platform/prisma";
import type { CategoryEditRow } from "@/types/categories";

const normalizeName = (s: string) => s.trim();

// UI側の重複チェック
const findDuplicate = (arr: string[]) => {
  const seen = new Set<string>();
  for (const x of arr) {
    if (seen.has(x)) return x;
    seen.add(x);
  }
  return null;
};

export const saveActiveCategories = async (rows: CategoryEditRow[]) => {
  const normalized = rows.map((r) => ({
    ...r,
    name: normalizeName(r.name),
  }));

  // 空欄チェック（deleted=false のものだけ必須）
  if (normalized.some((r) => !r.deleted && r.name.length === 0)) {
    return { ok: false as const, message: "費目名が空欄の行があります" };
  }

  // UI内重複チェック（deleted=falseの行だけ）
  const activeNames = normalized.filter((r) => !r.deleted).map((r) => r.name);
  const dup = findDuplicate(activeNames);
  if (dup) {
    return {
      ok: false as const,
      message: `同名の費目が含まれています: ${dup}`,
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 削除（deleted_at付与 + sort=null）
      const toDelete = normalized.filter((r) => r.deleted && r.id);
      for (const r of toDelete) {
        if (!r.id) continue;
        await tx.category.update({
          where: { id: BigInt(r.id) },
          data: { deleted_at: new Date(), sort: null },
        });
      }

      // activeを画面順に採番
      const activeRows = normalized.filter((r) => !r.deleted);

      for (let i = 0; i < activeRows.length; i++) {
        const r = activeRows[i];
        const data = { name: r.name, deleted_at: null as Date | null, sort: i };

        if (r.id) {
          await tx.category.update({
            where: { id: BigInt(r.id) },
            data,
          });
        } else {
          await tx.category.create({ data });
        }
      }
    });

    return { ok: true as const };
  } catch (e) {
    // unique違反（name）
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return {
        ok: false as const,
        message:
          "同名の費目が既に存在します（削除済みも含む）。削除済み一覧から復活するか、名前を変更してください。",
      };
    }
    return { ok: false as const, message: "保存に失敗しました" };
  }
};

export const saveDeletedCategories = async (
  rows: { id: string; name: string; restore: boolean }[],
) => {
  const normalized = rows.map((r) => ({
    ...r,
    name: normalizeName(r.name),
  }));

  // 空欄チェック
  if (normalized.some((r) => r.name.length === 0)) {
    return { ok: false as const, message: "費目名が空欄の行があります" };
  }

  // UI内重複チェック（deleted一覧内）
  const dup = findDuplicate(normalized.map((r) => r.name));
  if (dup) {
    return {
      ok: false as const,
      message: `同名の費目が含まれています: ${dup}`,
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 末尾 sort を計算
      const max = await tx.category.aggregate({
        where: { deleted_at: null },
        _max: { sort: true },
      });
      let nextSort = (max._max.sort ?? -1) + 1;

      for (const r of normalized) {
        if (r.restore) {
          await tx.category.update({
            where: { id: BigInt(r.id) },
            data: { name: r.name, deleted_at: null, sort: nextSort++ },
          });
        } else {
          await tx.category.update({
            where: { id: BigInt(r.id) },
            data: { name: r.name },
          });
        }
      }
    });

    return { ok: true as const };
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return {
        ok: false as const,
        message:
          "同名の費目が既に存在します（削除済みも含む）。名前を変更するか、既存の費目を利用してください。",
      };
    }
    return { ok: false as const, message: "保存に失敗しました" };
  }
};
