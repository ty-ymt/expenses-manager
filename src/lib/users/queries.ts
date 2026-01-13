import "server-only";
import { prisma } from "@/lib/platform/prisma";
import type { UserListItem, UserRole } from "@/types/users";

const toItem = (p: {
  id: bigint;
  auth_id: string;
  name: string;
  email: string;
  role: UserRole;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}): UserListItem => ({
  id: p.id.toString(),
  auth_id: p.auth_id,
  name: p.name,
  email: p.email,
  role: p.role,
  deleted_at: p.deleted_at,
  created_at: p.created_at,
  updated_at: p.updated_at,
});

export const getActiveUsers = async (): Promise<UserListItem[]> => {
  const rows = await prisma.profile.findMany({
    where: { deleted_at: null },
    select: {
      id: true,
      auth_id: true,
      name: true,
      email: true,
      role: true,
      deleted_at: true,
      created_at: true,
      updated_at: true,
    },
    orderBy: [{ role: "asc" }, { name: "asc" }, { email: "asc" }],
  });

  return rows.map(toItem);
};

export const getDeletedUsers = async (): Promise<UserListItem[]> => {
  const rows = await prisma.profile.findMany({
    where: { deleted_at: { not: null } },
    select: {
      id: true,
      auth_id: true,
      name: true,
      email: true,
      role: true,
      deleted_at: true,
      created_at: true,
      updated_at: true,
    },
    orderBy: [{ deleted_at: "desc" }],
  });

  return rows.map(toItem);
};

export const getUserById = async (id: bigint) => {
  return prisma.profile.findUnique({
    where: { id },
    select: {
      id: true,
      auth_id: true,
      name: true,
      email: true,
      role: true,
      deleted_at: true,
      created_at: true,
      updated_at: true,
    },
  });
};
