export type UserRole = "admin" | "user";

export const USER_ROLE_LABEL: Record<UserRole, string> = {
  admin: "管理者",
  user: "一般",
};

export type UserListItem = {
  id: string;
  auth_id: string;
  name: string;
  email: string;
  role: UserRole;

  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export type UserFormData = {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
};

export type ActionState =
  | {
      ok: true;
      message?: string;
      data?: { name: string; email: string; password?: string };
    }
  | { ok: false; message: string }
  | null;

export type UserEditInitial = {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
};
