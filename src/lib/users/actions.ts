"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import type { ActionState } from "@/types/users";
import { prisma } from "../platform/prisma";
import { supabaseAdmin } from "../platform/supabaseAdmin";

const toBigInt = (id: string) => {
  try {
    return BigInt(id);
  } catch {
    return null;
  }
};

const normalizeEmail = (v: string) => v.trim().toLowerCase();

const generatePassword10 = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = crypto.randomBytes(10);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
};

export const upsertUserAction = async (
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const id = formData.get("id")?.toString() ?? "";
  const name = formData.get("name")?.toString() ?? "";
  const emailRow = formData.get("email")?.toString() ?? "";
  const email = normalizeEmail(emailRow);
  const role = formData.get("role")?.toString() ?? "";

  if (!name) return { ok: false, message: "名前を入力してください" };
  if (!email) return { ok: false, message: "メールアドレスを入力してください" };
  if (role !== "admin" && role !== "user")
    return { ok: false, message: "有効な権限を設定してください" };

  try {
    if (!id) {
      const password = generatePassword10();

      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name },
        app_metadata: { role },
      });

      if (error || !data.user) {
        return {
          ok: false,
          message: error?.message ?? "ユーザー作成に失敗しました",
        };
      }

      await prisma.profile.create({
        data: {
          auth_id: data.user.id,
          name,
          email,
          role,
          deleted_at: null,
        },
      });

      revalidatePath("/users");
      revalidatePath("/users/deleted");

      return {
        ok: true,
        message: "作成完了しました",
        data: { name, email, password },
      };
    }

    // update（既存）時は password 返さない
    // ...既存の update 処理...
    revalidatePath("/users");
    revalidatePath("/users/deleted");
    return { ok: true, message: "保存しました", data: { name, email } };
  } catch (e: unknown) {
    const msg =
      e instanceof Error ? e.message : "保存に失敗しました（不明なエラー）";
    if (msg.includes("Unique constraint") || msg.includes("P2002")) {
      return { ok: false, message: "メールアドレスが既に使用されています" };
    }
    return { ok: false, message: msg };
  }
};

export const deleteUserAction = async (id: string): Promise<ActionState> => {
  const userId = toBigInt(id);
  if (!userId) return { ok: false, message: "IDが不正です" };

  try {
    await prisma.profile.update({
      where: { id: userId },
      data: {
        deleted_at: new Date(),
        role: "user",
      },
    });

    revalidatePath("/users");
    revalidatePath("/users/deleted");
    revalidatePath(`/users/${id}`);
    return { ok: true };
  } catch (e: unknown) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "削除に失敗しました",
    };
  }
};

export const restoreUserAction = async (id: string): Promise<ActionState> => {
  const userId = toBigInt(id);
  if (!userId) return { ok: false, message: "IDが不正です" };

  try {
    await prisma.profile.update({
      where: { id: userId },
      data: {
        deleted_at: null,
        role: "user",
      },
    });

    revalidatePath("/users");
    revalidatePath("/users/deleted");
    revalidatePath(`/users/${id}`);
    return { ok: true };
  } catch (e: unknown) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "復活に失敗しました",
    };
  }
};

export const resetUserPasswordAction = async (
  id: string
): Promise<ActionState> => {
  const userId = toBigInt(id);
  if (!userId) return { ok: false, message: "IDが不正です" };

  try {
    const profile = await prisma.profile.findUnique({
      where: { id: userId },
      select: { auth_id: true, name: true, email: true, deleted_at: true },
    });
    if (!profile) return { ok: false, message: "ユーザーが見つかりません" };

    // 運用ルール：削除済みユーザーは再発行させない、など
    if (profile.deleted_at)
      return { ok: false, message: "削除済みユーザーです" };

    const newPassword = generatePassword10();

    const { error } = await supabaseAdmin.auth.admin.updateUserById(
      profile.auth_id,
      {
        password: newPassword,
      }
    );
    if (error) return { ok: false, message: error.message };

    // DBには保存しない
    return {
      ok: true,
      message: "パスワードを再発行しました",
      data: { name: profile.name, email: profile.email, password: newPassword },
    };
  } catch (e: unknown) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "再発行に失敗しました",
    };
  }
};
