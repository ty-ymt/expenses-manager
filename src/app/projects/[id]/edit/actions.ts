"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { toJstDay } from "@/lib/date";
import { prisma } from "@/lib/platform/prisma";
import type { ActionState } from "@/types/projects";

const invalidIdState: ActionState = { ok: false, message: "不正なIDです" };

const parseProjectId = (
  formData: FormData
):
  | { ok: true; id: bigint; idStr: string }
  | { ok: false; state: ActionState } => {
  const idStr = String(formData.get("id") ?? "");
  if (!/^\d+$/.test(idStr)) return { ok: false, state: invalidIdState };
  return { ok: true, id: BigInt(idStr), idStr };
};

export const updateProjectAction = async (
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const parsed = parseProjectId(formData);
  if (!parsed.ok) return parsed.state;
  const { id, idStr } = parsed;

  const cd = String(formData.get("cd") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const remarks = String(formData.get("remarks") ?? "").trim();
  const startRaw = String(formData.get("start_dt") ?? "").trim();
  const endRaw = String(formData.get("end_dt") ?? "").trim();

  const startDt = startRaw ? toJstDay(startRaw) : null;
  const endDt = endRaw ? toJstDay(endRaw) : null;

  if (!cd) return { ok: false, message: "案件コードを入力してください" };
  if (!name) return { ok: false, message: "案件名を入力してください" };
  if (startDt && endDt && startDt > endDt) {
    return { ok: false, message: "開始日は終了日以前にしてください" };
  }

  try {
    await prisma.project.update({
      where: { id },
      data: {
        cd,
        name,
        remarks: remarks ? remarks : null,
        start_dt: startDt?.toJSDate() ?? null,
        end_dt: endDt?.toJSDate() ?? null,
      },
    });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { ok: false, message: "この案件コードは既に使われています" };
    }
    return { ok: false, message: "更新に失敗しました" };
  }

  redirect(`/projects/${idStr}`);
};

export const deleteProjectAction = async (
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const parsed = parseProjectId(formData);
  if (!parsed.ok) return parsed.state;

  const { id } = parsed;

  try {
    await prisma.project.delete({ where: { id } });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { ok: false, message: "案件が見つかりません" };
    }
    return { ok: false, message: "削除に失敗しました" };
  }

  redirect("/projects");
};
