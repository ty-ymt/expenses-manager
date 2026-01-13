import { prisma } from "@/lib/platform/prisma";
import createClient from "@/lib/platform/supabaseServer";
import HeaderClient from "./HeaderClient";

export const getHeaderUser = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;
  if (!userId) return null;

  return prisma.profile.findFirst({
    where: { auth_id: userId, deleted_at: null },
    select: { name: true, email: true },
  });
};

export const HeaderServer = async () => {
  const profile = await getHeaderUser();

  return (
    <HeaderClient
      displayName={(profile?.name ?? "").trim()}
      displayEmail={(profile?.email ?? "").trim()}
    />
  );
};

export default HeaderServer;
