import "server-only";
import { prisma } from "@/lib/platform/prisma";
import type { CategoryRow } from "@/types/categories";

export type CategoryListItem = {
  id: string;
  name: string;
  expense_count: number;
};

export const getAllCategories = async (): Promise<CategoryListItem[]> => {
  const rows = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      _count: { select: { expenses: true } },
    },
    orderBy: [{ name: "asc" }, { id: "asc" }],
  });

  return rows.map((c) => ({
    id: c.id.toString(),
    name: c.name,
    expense_count: c._count.expenses,
  }));
};

export const getCategoryById = async (id: bigint) => {
  return prisma.category.findUnique({
    where: { id },
    select: { id: true, name: true, _count: { select: { expenses: true } } },
  });
};

const mapRow = (c: {
  id: bigint;
  name: string;
  sort: number | null;
  deleted_at: Date | null;
}): CategoryRow => ({
  id: c.id.toString(),
  name: c.name,
  sort: c.sort,
  deleted_at: c.deleted_at,
});

export const getActiveCategories = async (): Promise<CategoryRow[]> => {
  const rows = await prisma.category.findMany({
    where: { deleted_at: null },
    select: { id: true, name: true, sort: true, deleted_at: true },
    orderBy: [{ sort: "asc" }, { id: "asc" }],
  });
  return rows.map(mapRow);
};

export const getDeletedCategories = async (): Promise<CategoryRow[]> => {
  const rows = await prisma.category.findMany({
    where: { deleted_at: { not: null } },
    select: { id: true, name: true, sort: true, deleted_at: true },
    orderBy: [{ deleted_at: "desc" }, { id: "desc" }],
  });
  return rows.map(mapRow);
};

export const getActiveCategoriesForList = async () => {
  const rows = await prisma.category.findMany({
    where: { deleted_at: null },
    select: { id: true, name: true },
    orderBy: [{ sort: "asc" }, { name: "asc" }],
  });

  return rows.map((r) => ({
    id: r.id.toString(),
    name: r.name,
  }));
};
