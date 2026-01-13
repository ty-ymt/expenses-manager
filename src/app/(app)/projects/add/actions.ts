"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { toJstDay } from "@/lib/date";
import { prisma } from "@/lib/platform/prisma";
import type { ActionState } from "@/types/projects";

export const createProjectAction = async (
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const cd = String(formData.get("cd") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const remarks = String(formData.get("remarks") ?? "").trim();
  const startDtRaw = formData.get("start_dt");
  const endDtRaw = formData.get("end_dt");

  const startDt = toJstDay(startDtRaw ? String(startDtRaw) : null);
  const endDt = toJstDay(endDtRaw ? String(endDtRaw) : null);

  if (!cd) {
    return { ok: false, message: "案件コードを入力してください" };
  }
  if (!name) {
    return { ok: false, message: "案件名を入力してください" };
  }

  if (startDt && endDt && startDt > endDt) {
    return { ok: false, message: "開始日は終了日以前にしてください" };
  }

  try {
    console.log("createProjectAction called");
    await prisma.project.create({
      data: {
        cd,
        name,
        remarks,
        start_dt: startDt?.toJSDate() ?? null,
        end_dt: endDt?.toJSDate() ?? null,
      },
    });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error?.code === "P2002"
    ) {
      return { ok: false, message: "この案件コードは既に使われています" };
    }
    return { ok: false, message: "案件登録に失敗しました" };
  }
  redirect(`/projects`);
};
