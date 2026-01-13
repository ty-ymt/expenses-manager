import { redirect } from "next/navigation";
import type { Role } from "@/types/header";
import { prisma } from "../platform/prisma";
import createClient from "../platform/supabaseServer";

export const getCurrentProfile = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) redirect("/signin");

  const profile = await prisma.profile.findUnique({
    where: { auth_id: data.user.id },
    select: { name: true, email: true, role: true },
  });

  if (!profile) redirect("/signin");

  return {
    name: profile.name ?? "",
    email: profile.email ?? "",
    role: profile.role as Role,
  };
};
